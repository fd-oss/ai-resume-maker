const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/ai/generate-summary
// Body: { name, role, experience, skills }
router.post('/generate-summary', async (req, res) => {
  try {
    const { name, role, yearsExp, skills } = req.body;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Write a professional resume summary for:
Name: ${name}
Role: ${role}
Years of experience: ${yearsExp}
Skills: ${skills}

Write 3-4 compelling sentences. Be specific, action-oriented, and ATS-friendly. Return only the summary text, no extra formatting.`
      }]
    });

    res.json({ summary: message.content[0].text });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/ai/improve-description
// Body: { role, company, description }
router.post('/improve-description', async (req, res) => {
  try {
    const { role, company, description } = req.body;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Improve this work experience description for the role "${role}" at "${company}":

"${description}"

Rules:
- Start each bullet with a strong action verb
- Add quantified achievements where reasonable (use placeholders like [X%] if unknown)
- Make it ATS-friendly
- Return 3-5 bullet points, each starting with "•"
- No extra commentary, just the bullets.`
      }]
    });

    res.json({ improved: message.content[0].text });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/ai/suggest-skills
// Body: { role, currentSkills }
router.post('/suggest-skills', async (req, res) => {
  try {
    const { role, currentSkills } = req.body;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Suggest 10 in-demand skills for a "${role}" that are NOT already in this list: ${currentSkills.join(', ')}.
Return only a JSON array of strings, no other text. Example: ["Skill1", "Skill2"]`
      }]
    });

    const text = message.content[0].text.trim();
    const skills = JSON.parse(text);
    res.json({ skills });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/ai/generate-full-resume
// Body: { jobDescription, userInfo }
router.post('/generate-full-resume', async (req, res) => {
  try {
    const { jobDescription, userInfo } = req.body;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Based on this job description and user info, generate tailored resume content.

Job Description:
${jobDescription}

User Info:
${JSON.stringify(userInfo, null, 2)}

Return ONLY a valid JSON object with this structure (no markdown, no backticks):
{
  "summary": "professional summary string",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "role": "...",
      "company": "...",
      "description": "• bullet1\\n• bullet2\\n• bullet3"
    }
  ]
}`
      }]
    });

    const text = message.content[0].text.trim();
    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
