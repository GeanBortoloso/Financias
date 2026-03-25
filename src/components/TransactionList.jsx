import { useState, useMemo } from 'react';
import { CATEGORIES, getCategoryMeta, formatCurrency, formatDate } from '../utils/helpers';
import { Trash2, Search, Filter } from 'lucide-react';

export default function TransactionList({ transactions, onDelete }) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = !filterCategory || t.category === filterCategory;
      const matchType = !filterType || t.type === filterType;
      const matchMonth = !filterMonth || t.date.startsWith(filterMonth);
      return matchSearch && matchCat && matchType && matchMonth;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, search, filterCategory, filterType, filterMonth]);

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
    padding: '8px 12px',
    outline: 'none',
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#e2e8f0', marginBottom: '4px' }}>Transações</h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>{transactions.length} transação(ões) registrada(s)</p>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={15} color="#6366f1" />

          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '160px' }}>
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              style={{ ...inputStyle, paddingLeft: '30px', width: '100%' }}
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Month */}
          <input
            style={{ ...inputStyle, minWidth: '140px' }}
            type="month"
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
          />

          {/* Type */}
          <select style={inputStyle} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">Tipo: Todos</option>
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>

          {/* Category */}
          <select style={inputStyle} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="">Categoria: Todas</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>

          {(search || filterCategory || filterType || filterMonth) && (
            <button
              onClick={() => { setSearch(''); setFilterCategory(''); setFilterType(''); setFilterMonth(''); }}
              style={{ ...inputStyle, cursor: 'pointer', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>💸</div>
            <div style={{ fontWeight: 600 }}>Nenhuma transação encontrada</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
                  {['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', ''].map(h => (
                    <th key={h} style={{
                      padding: '14px 16px', textAlign: 'left',
                      fontSize: '11px', fontWeight: 700, color: '#64748b',
                      textTransform: 'uppercase', letterSpacing: '0.6px',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const cat = getCategoryMeta(t.category);
                  const isIncome = t.type === 'income';
                  return (
                    <tr
                      key={t.id}
                      className="animate-fade-in"
                      style={{
                        borderBottom: i < filtered.length - 1 ? '1px solid rgba(99,102,241,0.08)' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#94a3b8' }}>
                        {formatDate(t.date)}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>
                        {t.name}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge" style={{ background: `${cat.color}20`, color: cat.color }}>
                          {cat.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge" style={{
                          background: isIncome ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
                          color: isIncome ? '#34d399' : '#f87171',
                        }}>
                          {isIncome ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '14px' }}>
                        <span className={isIncome ? 'income-text' : 'expense-text'}>
                          {isIncome ? '+' : '-'}{formatCurrency(t.value)}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => onDelete(t.id)}
                          style={{
                            background: 'rgba(248,113,113,0.1)',
                            border: '1px solid rgba(248,113,113,0.2)',
                            borderRadius: '8px', padding: '6px 8px',
                            cursor: 'pointer', color: '#f87171', transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
