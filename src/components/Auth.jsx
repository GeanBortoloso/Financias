import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // URL relativa — funciona tanto em dev local quanto em produção na nuvem
  const API_URL = '/api/auth';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/login' : '/register';
    
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Erro na requisição');
      
      if (isLogin) {
        onLogin(data.token, data.user);
      } else {
        setIsLogin(true); // Volta pro login após criar a conta
        setFormData({ ...formData, password: '' });
        alert('Cadastro realizado com sucesso! Faça login agora.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-slate-950 text-gray-200 overflow-hidden font-sans">
      
      {/* Background Animated Blobs para visual Premium */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate' }} />

      <div className="w-full max-w-md p-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.5)] relative z-10 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]">
        
        {/* Ícone Redondo */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            {isLogin ? <LogIn size={28} className="text-white" /> : <UserPlus size={28} className="text-white" />}
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-2 text-center text-white tracking-tight">
          {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className="text-center text-slate-400 mb-8 text-sm">
          {isLogin ? 'Entre para gerenciar suas finanças de forma simples.' : 'Junte-se a nós para dominar suas finanças.'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium text-center backdrop-blur-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300 ml-1">Como devemos te chamar?</label>
              <input 
                type="text" 
                required 
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300 ml-1">Seu E-mail</label>
            <input 
              type="email" 
              required 
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="voce@exemplo.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300 ml-1">Senha Segura</label>
            <input 
              type="password" 
              required 
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 tracking-wider"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-[15px]"
          >
            {loading ? 'Processando...' : isLogin ? 'Acessar Plataforma' : 'Criar minha conta'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          {isLogin ? "Ainda não tem acesso?" : "Já faz parte do time?"}{' '}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors ml-1"
          >
            {isLogin ? 'Cadastre-se agora' : 'Faça login aqui'}
          </button>
        </p>
      </div>
    </div>
  );
}
