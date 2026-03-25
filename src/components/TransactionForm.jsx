import { useState } from 'react';
import { CATEGORIES } from '../utils/helpers';
import { PlusCircle, CheckCircle } from 'lucide-react';

const today = new Date().toISOString().split('T')[0];

const DEFAULT_FORM = {
  name: '',
  value: '',
  category: 'alimentacao',
  date: today,
  type: 'expense',
};

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Informe um nome para a transação.');
    if (!form.value || Number(form.value) <= 0) return setError('Informe um valor válido.');
    if (!form.date) return setError('Informe uma data.');

    onAdd({ ...form, value: Number(form.value) });
    setForm(DEFAULT_FORM);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#e2e8f0', marginBottom: '4px' }}>Nova Transação</h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Adicione uma receita ou despesa</p>
      </div>

      <div className="glass-card" style={{ padding: '32px', maxWidth: '560px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Type toggle */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
              Tipo
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[['income', 'Receita', '#34d399'], ['expense', 'Despesa', '#f87171']].map(([val, label, color]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, type: val }))}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px',
                    border: `2px solid ${form.type === val ? color : 'rgba(99,102,241,0.2)'}`,
                    background: form.type === val ? `${color}18` : 'transparent',
                    color: form.type === val ? color : '#64748b',
                    fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                    transition: 'all 0.2s ease', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
              Nome / Descrição
            </label>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Almoço, Salário, Netflix..."
            />
          </div>

          {/* Value + Date in one row */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
                Valor (R$)
              </label>
              <input
                className="form-input"
                name="value"
                type="number"
                min="0.01"
                step="0.01"
                value={form.value}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
                Data
              </label>
              <input
                className="form-input"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
              Categoria
            </label>
            <select
              className="form-input"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: '8px',
              background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)',
              color: '#f87171', fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', borderRadius: '8px',
              background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)',
              color: '#34d399', fontSize: '13px',
            }}>
              <CheckCircle size={16} /> Transação adicionada com sucesso!
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="glow-btn"
            style={{ padding: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <PlusCircle size={17} /> Adicionar Transação
          </button>
        </form>
      </div>
    </div>
  );
}
