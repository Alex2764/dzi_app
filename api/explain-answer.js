import { explainAnswer } from './_lib/anthropic.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { question, options, correctIndex, chosenIndex } = req.body ?? {};
  if (!question || !Array.isArray(options) || correctIndex == null || chosenIndex == null) {
    res.status(400).json({ error: 'question, options, correctIndex and chosenIndex are required' });
    return;
  }

  try {
    const result = await explainAnswer({ question, options, correctIndex, chosenIndex });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Failed to explain answer', detail: String(err?.message ?? err) });
  }
}
