import { Wallet, TrendingUp, TrendingDown, BarChart2, List, PlusCircle, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
  { id: 'add', label: 'Nova Transação', icon: PlusCircle },
  { id: 'transactions', label: 'Transações', icon: List },
];

export default function Sidebar({ activePage, setActivePage, onLogout, user }) {
  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: '#0f1623',
      borderRight: '1px solid rgba(99,102,241,0.15)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', paddingLeft: '8px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Wallet size={18} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '15px', color: '#e2e8f0' }}>FinanceApp</div>
          <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 500 }}>Personal Finance</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-link${activePage === id ? ' active' : ''}`}
            onClick={() => setActivePage(id)}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ padding: '12px', background: 'rgba(99,102,241,0.08)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 600 }}>{user?.name || 'Visitante'}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email || 'Nenhum email'}
          </div>
        </div>
        
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
            background: 'transparent', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px',
            color: '#f87171', cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s',
            justifyContent: 'center', width: '100%'
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={15} />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}
