const express = require('express');
const Interview = require('../models/Interview');
const User = require('../models/User');
const { generateText } = require('../config/gemini');
const { buildFirstQuestionPrompt, buildFollowUpPrompt } = require('../utils/InterviewPrompts');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/start', protect, async (req, res) => {
  try {
    const { type } = req.body;
    const validTypes = ['technical', 'hr', 'aptitude', 'coding'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid interview type' });
    }

    const user = await User.findById(req.user._id);

    const prompt = buildFirstQuestionPrompt({
      type,
      skills: user.skills,
      preferredJobRole: user.preferredJobRole,
      experience: user.experience,
    });

    const questionText = await generateText(prompt);

    const interview = await Interview.create({
      user: user._id,
      type,
      questions: [{ text: questionText.trim(), isFollowUp: false }],
    });

    res.status(201).json({
      interviewId: interview._id,
      question: interview.questions[0],
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Submit an answer, get the next question (or end the round)
router.post('/:interviewId/answer', protect, async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { answer } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({ message: 'Answer cannot be empty' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your interview' });
    }
    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'Interview already completed' });
    }

    const currentQuestion = interview.questions[interview.questions.length - 1];
    currentQuestion.answer = answer.trim();
    currentQuestion.answeredAt = new Date();

    const user = await User.findById(req.user._id);

    const prompt = buildFollowUpPrompt({
      type: interview.type,
      previousQuestion: currentQuestion.text,
      candidateAnswer: answer.trim(),
      skills: user.skills,
      preferredJobRole: user.preferredJobRole,
    });

    const rawResponse = await generateText(prompt);

    let decision;
    try {
      const cleaned = rawResponse.trim().replace(/^```json\s*|```$/g, '');
      decision = JSON.parse(cleaned);
    } catch {
      decision = { action: 'end_round', question: '' };
    }

    if (decision.action === 'end_round' || interview.questions.length >= 7) {
      interview.status = 'completed';
      interview.endedAt = new Date();
      await interview.save();
      return res.json({ status: 'completed', message: 'Interview round completed' });
    }

    const isFollowUp = decision.action === 'follow_up';
    interview.questions.push({ text: decision.question.trim(), isFollowUp });
    await interview.save();

    res.json({
      status: 'in-progress',
      question: interview.questions[interview.questions.length - 1],
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;