const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeResumeWithAI = async (resumeText, jobDescription) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `
You are an expert ATS (Applicant Tracking System) and resume reviewer.

Analyze the following resume against the job description. Return ONLY a valid JSON object with this exact structure, no extra text, no markdown formatting, no code fences:

{
  "ats_score": <number between 0-100>,
  "matched_keywords": [<array of strings - skills/keywords from the job description found in the resume>],
  "missing_keywords": [<array of strings - important skills/keywords from the job description NOT found in the resume>],
  "skill_gaps": [<array of strings - 2-4 specific skills the candidate should develop>],
  "suggestions": [<array of strings - 2-4 actionable suggestions to improve the resume for this job>]
}

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    return JSON.parse(cleanedText);
  } catch (err) {
    throw new Error('Failed to parse AI response as JSON: ' + err.message);
  }
};


exports.generateCoverLetter = async (resumeText, jobDescription) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `
You are an expert career coach writing a tailored, professional cover letter.

Write a compelling cover letter based on the resume and job description below. Requirements:
- Keep it concise: 3-4 short paragraphs, under 300 words total
- Open with genuine enthusiasm for the specific role, not generic phrases
- Highlight 2-3 concrete skills/experiences from the resume that match the job description
- Close with a confident, professional call to action
- Do NOT invent experience not present in the resume
- Do NOT include a header, date, or address block — just the letter body starting with "Dear Hiring Manager,"
- Return ONLY the letter text, no markdown, no extra commentary

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};