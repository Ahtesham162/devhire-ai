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