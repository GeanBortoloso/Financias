import { formatCurrency, summarize } from '../utils/helpers';
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react';

function StatCard({ title, value, icon: Icon, type, subtitle }) {
  const isPositive = type === 'income' || (type === 'balance' && value >= 0);
  const isNegative = type === 'expense' || (type === 'balance' && value < 0);

  const colors = {
    income: { text: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', icon: '#34d399' },
    expense: { text: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', icon: '#f87171' },
    balance: value >= 0
      ? { text: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', icon: '#818cf8' }
      : { text: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', icon: '#f87171' },
  };

  const c = colors[type] || colors.balance;

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '24px', flex: 1, minWidth: '200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
            {title}
          </div>
          <div className="stat-card-value" style={{ color: c.text }}>
            {formatCurrency(value)}
          </div>
        </div>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: c.bg, border: `1px solid ${c.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={c.icon} />
        </div>
      </div>
      {subtitle && (
        <div style={{ fontSize: '12px', color: '#475569' }}>{subtitle}</div>
      )}
    </div>
  );
}

export default function Dashboard({ transactions }) {
  const now = new Date();
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date + 'T12:00:00');
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const { income, expense, balance } = summarize(thisMonth);
  const allBalance = summarize(transactions).balance;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#e2e8f0', marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Visão geral do mês atual</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
        <StatCard
          title="Saldo Total"
          value={allBalance}
          icon={Wallet}
          type="balance"
          subtitle="Todas as transações"
        />
        <StatCard
          title="Receitas do Mês"
          value={income}
          icon={TrendingUp}
          type="income"
          subtitle={`${thisMonth.filter(t => t.type === 'income').length} lançamentos`}
        />
        <StatCard
          title="Despesas do Mês"
          value={expense}
          icon={TrendingDown}
          type="expense"
          subtitle={`${thisMonth.filter(t => t.type === 'expense').length} lançamentos`}
        />
        <StatCard
          title="Resultado do Mês"
          value={income - expense}
          icon={Activity}
          type="balance"
          subtitle="Receitas − Despesas"
        />
      </div>
    </div>
  );
}
