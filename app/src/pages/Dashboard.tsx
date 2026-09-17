import { Link } from 'react-router-dom';
import { modules } from '../data';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>ДЗИ по Информационни технологии</h1>
      <p className="subtitle">Избери модул, за да започнеш подготовката си.</p>

      <div className="topic-grid">
        {modules.map((m) => {
          const ready = m.status === 'ready';
          return (
            <Link
              key={m.id}
              to={ready ? `/module/${m.id}` : '#'}
              className={`topic-card todo ${!ready ? 'disabled' : ''}`}
              aria-disabled={!ready}
              onClick={(e) => {
                if (!ready) e.preventDefault();
              }}
            >
              <span className="topic-title">
                {m.title}
                <br />
                <small>{m.grade}</small>
              </span>
              {!ready && <span className="soon">предстои</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
