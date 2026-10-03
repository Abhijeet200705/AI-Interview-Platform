const express = require('express');
const Interview = require('../models/Interview');
const User = require('../models/User');
const { generateText } = require('../config/gemini');
const { buildFirstQuestionPrompt } = require('../utils/InterviewPrompts');
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

module.exports = router;