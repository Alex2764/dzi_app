import { Check, Copy } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import { useState } from 'react';

export default function CodeBlock({ text, lang = 'markup' }: { text: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard недостъпен (напр. без HTTPS) — просто не показваме потвърждение
    }
  }

  return (
    <div className="theory-code-wrap">
      <button type="button" className="theory-code-copy" onClick={handleCopy}>
        {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2} />}
        {copied ? 'Копирано' : 'Копирай'}
      </button>
      <Highlight theme={themes.vsDark} code={text.trimEnd()} language={lang}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre className="theory-code" style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
