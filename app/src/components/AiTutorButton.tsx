import { Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { buildTutorPrompt } from '../lib/lessonPrompt';
import type { Lesson } from '../types';

export default function AiTutorButton({ lesson }: { lesson: Lesson }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildTutorPrompt(lesson));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard недостъпен (напр. без HTTPS) — просто не показваме потвърждение
    }
  }

  return (
    <div className="ai-tutor">
      <div className="ai-tutor-info">
        <strong>Не ти е ясно нещо? Учи с AI помощник</strong>
        <span>
          Копирай готовия промпт и го пусни в Claude, ChatGPT или друг AI — той ще стане твой личен
          помощник точно по този урок и ще ти помогне с каквото е необходимо.
        </span>
      </div>
      <button
        type="button"
        className={`ai-btn ai-tutor-btn${copied ? ' is-copied' : ''}`}
        onClick={handleCopy}
      >
        {copied ? <Check size={18} strokeWidth={2.5} /> : <Sparkles size={18} strokeWidth={2} />}
        {copied ? 'Копирано — пусни го в AI чат' : 'Копирай промпта за AI помощник'}
      </button>
    </div>
  );
}
