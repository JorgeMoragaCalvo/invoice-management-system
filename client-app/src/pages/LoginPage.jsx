import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch {
      setError('Credenciales invalidas');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Iniciar Sesion</h2>
        <p className="text-sm text-slate-500 mb-6">Sistema de Gestion de Facturas</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contrasena</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
            border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.5 : 1,
            width: '100%',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => !submitting && (e.target.style.backgroundColor = '#111827')}
          onMouseLeave={(e) => !submitting && (e.target.style.backgroundColor = '#1f2937')}
        >
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
