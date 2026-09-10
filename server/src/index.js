import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { explainAnswer } from '../../api/_lib/anthropic.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/explain-answer', async (req, res) => {
  const { question, options, correctIndex, chosenIndex } = req.body ?? {};
  if (!question || !Array.isArray(options) || correctIndex == null || chosenIndex == null) {
    return res.status(400).json({ error: 'question, options, correctIndex and chosenIndex are required' });
  }
  try {
    const result = await explainAnswer({ question, options, correctIndex, chosenIndex });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Failed to explain answer', detail: String(err.message ?? err) });
  }
});

const PORT = process.env.PORT || 8788;
app.listen(PORT, () => {
  console.log(`dzi-app server listening on http://localhost:${PORT}`);
});
