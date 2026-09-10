import CodeBlock from './CodeBlock';
import SheetBlock from './SheetBlock';
import Model3DBlock from './Model3DBlock';
import type { TheoryBlock } from '../types';

export default function TheoryBlocks({ blocks }: { blocks: TheoryBlock[] }) {
  return (
    <div className="theory">
      {blocks.map((block, i) => {
        if (block.kind === 'definitions') {
          return (
            <dl key={i} className="theory-definitions">
              {block.items.map((item) => (
                <div key={item.term} className="theory-definition">
                  <dt>{item.term}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          );
        }
        if (block.kind === 'table') {
          return (
            <div key={i} className="theory-table-wrap">
              {block.title && <h3>{block.title}</h3>}
              <table className="theory-table">
                <thead>
                  <tr>
                    {block.headers.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.kind === 'note') {
          return (
            <div key={i} className="theory-note">
              <span className="theory-note-label">{block.label}</span>
              <p>{block.text}</p>
            </div>
          );
        }
        if (block.kind === 'text') {
          return (
            <p key={i} className="theory-text">
              {block.text}
            </p>
          );
        }
        if (block.kind === 'code') {
          return <CodeBlock key={i} text={block.text} lang={block.lang} />;
        }
        if (block.kind === 'sheet') {
          return (
            <SheetBlock
              key={i}
              title={block.title}
              caption={block.caption}
              columnLabels={block.columnLabels}
              data={block.data}
            />
          );
        }
        if (block.kind === 'model3d') {
          return (
            <Model3DBlock
              key={i}
              title={block.title}
              src={block.src}
              caption={block.caption}
              attributionText={block.attributionText}
              attributionUrl={block.attributionUrl}
            />
          );
        }
        return (
          <div key={i} className="theory-list">
            <h3>{block.title}</h3>
            <ul>
              {block.items.map((item, ii) => (
                <li key={ii}>{item}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
