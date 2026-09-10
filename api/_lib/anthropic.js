// Споделена Claude логика — ползва се както от локалния Express dev сървър
// (server/), така и от Vercel serverless функциите в /api. Един източник на истина.
// Модел на файла: english-app/api/_lib/anthropic.js
import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5';

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('[claude] ANTHROPIC_API_KEY is not set — /api/explain-answer will fail.');
}

const client = new Anthropic();

const explanationSchema = {
  type: 'object',
  properties: {
    explanation: {
      type: 'string',
      description:
        'Обяснение на български (2-4 изречения) защо верният отговор е верен и — ако ученикът е сгрешил — защо избраният от него отговор е грешен/типична заблуда.',
    },
  },
  required: ['explanation'],
  additionalProperties: false,
};

// ВАЖНО (CLAUDE.md §6/§7): AI тук НЕ решава кой отговор е верен и не съчинява
// въпроса — верният отговор идва вече готов от валидираната банка. AI само
// обяснява защо, върху вече известен факт.
export async function explainAnswer({ question, options, correctIndex, chosenIndex }) {
  const correctAnswer = options[correctIndex];
  const chosenAnswer = options[chosenIndex];
  const isCorrect = chosenIndex === correctIndex;

  const prompt = `Ти си учител по Информационни технологии, подготвящ ученик за българската матура (ДЗИ).

Въпрос: "${question}"
Верен отговор: "${correctAnswer}"
Ученикът избра: "${chosenAnswer}" (${isCorrect ? 'ВЕРЕН отговор' : 'ГРЕШЕН отговор'})

Напиши кратко обяснение на български защо "${correctAnswer}" е верният отговор${
    isCorrect ? '' : `, и защо "${chosenAnswer}" е грешен избор (каква е типичната заблуда зад него)`
  }. Не измисляй нови факти извън темата на въпроса — обясни само логиката на вече дадения верен отговор.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    output_config: {
      format: { type: 'json_schema', schema: explanationSchema },
    },
    messages: [{ role: 'user', content: prompt }],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('Claude declined to explain this answer');
  }

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('Claude API returned no content');

  return JSON.parse(textBlock.text);
}
