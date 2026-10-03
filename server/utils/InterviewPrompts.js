function buildFirstQuestionPrompt({ type, skills, preferredJobRole, experience }) {
  return `You are conducting a ${type} interview for a candidate applying for the role of "${preferredJobRole || 'Software Engineer'}".
Candidate's skills: ${skills?.length ? skills.join(', ') : 'not specified'}.
Candidate's experience: ${experience || 'not specified'}.

Ask exactly ONE opening interview question appropriate for a ${type} round.
Rules:
- Return ONLY the question text, no preamble, no numbering, no quotes.
- Keep it to 1-2 sentences.
- Make it relevant to the candidate's skills and the interview type.`;
}

function buildFollowUpPrompt({ type, previousQuestion, candidateAnswer, skills, preferredJobRole }) {
  return `You are conducting a ${type} interview for a candidate applying for "${preferredJobRole || 'Software Engineer'}".
Candidate's skills: ${skills?.length ? skills.join(', ') : 'not specified'}.

Previous question: "${previousQuestion}"
Candidate's answer: "${candidateAnswer}"

Decide what to do next. Respond with ONLY a valid JSON object, no markdown, no code fences, in exactly this shape:
{
  "action": "follow_up" | "next_topic" | "end_round",
  "question": "the next question text, or empty string if action is end_round"
}

Rules for deciding:
- If the answer was vague, incomplete, or you want to probe deeper on the SAME topic, use "follow_up".
- If the answer was sufficient and it's time for a NEW topic within the ${type} round, use "next_topic".
- If this feels like a natural point to end the round (around 5-6 questions total have been asked, use your judgement based on conversation depth), use "end_round" with an empty question.`;
}

module.exports = { buildFirstQuestionPrompt, buildFollowUpPrompt };