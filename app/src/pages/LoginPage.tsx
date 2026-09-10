import { GraduationCap, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const err = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    if (mode === 'signup') {
      setInfo('Профилът е създаден. Провери имейла си за потвърждение, после влез.');
      setMode('signin');
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand">
          <GraduationCap size={28} strokeWidth={2} />
          ДЗИ по ИТ
        </div>
        <p className="subtitle">{mode === 'signin' ? 'Влез в акаунта си' : 'Създай акаунт'}</p>

        <input
          type="email"
          placeholder="Имейл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Парола"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          minLength={6}
          required
        />

        {error && <p className="ai-error">{error}</p>}
        {info && <p className="subtitle subtitle-icon">{info}</p>}

        <button type="submit" className="ai-btn" disabled={loading}>
          {mode === 'signin' ? <LogIn size={16} strokeWidth={2} /> : <UserPlus size={16} strokeWidth={2} />}
          {loading ? 'Момент…' : mode === 'signin' ? 'Влез' : 'Регистрирай се'}
        </button>

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
            setError(null);
            setInfo(null);
          }}
        >
          {mode === 'signin' ? 'Нямаш акаунт? Регистрирай се' : 'Вече имаш акаунт? Влез'}
        </button>
      </form>
    </div>
  );
}
