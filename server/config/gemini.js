const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateText(prompt) {
  const interaction = await ai.interactions.create({
    model: 'gemini-3.8-flash',
    input: prompt,
  });
  return interaction.output_text;
}

module.exports = { generateText };