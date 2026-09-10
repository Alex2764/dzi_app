// В продукция API-то върви като same-origin Vercel serverless функции под
// /api. В dev режим удряме локалния Express сървър. Виж english-app/app/src/lib/api.ts
// за оригиналния модел.
const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:8788');

export interface ExplainAnswerResult {
  explanation: string;
}

export async function explainAnswer(params: {
  question: string;
  options: string[];
  correctIndex: number;
  chosenIndex: number;
}): Promise<ExplainAnswerResult> {
  const res = await fetch(`${API_URL}/api/explain-answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { error?: string });
    throw new Error(body.error ?? `Заявката към AI не успя (${res.status})`);
  }

  return res.json();
}
