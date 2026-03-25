import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import Auth from './components/Auth';
import { useTransactions } from './hooks/useTransactions';
import './index.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (!token) {
    return (
      <Auth 
        onLogin={(newToken, userData) => {
          setToken(newToken);
          setUser(userData);
          localStorage.setItem('token', newToken);
          localStorage.setItem('user', JSON.stringify(userData));
        }} 
      />
    );
  }

  return <MainApp token={token} user={user} onLogout={handleLogout} />;
}

function MainApp({ token, user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');
  const handleUnauthorized = () => onLogout();
  const { transactions, add, remove } = useTransactions(token, handleUnauthorized);

  const handleAdd = (tx) => {
    add(tx);
    setActivePage('transactions');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} user={user} />

      <main style={{ flex: 1, padding: '36px', overflowY: 'auto', maxWidth: '1200px' }}>
        {activePage === 'dashboard' && (
          <>
            <Dashboard transactions={transactions} />
            <Charts transactions={transactions} />
          </>
        )}
        {activePage === 'add' && (
          <TransactionForm onAdd={handleAdd} />
        )}
        {activePage === 'transactions' && (
          <TransactionList transactions={transactions} onDelete={remove} />
        )}
      </main>
    </div>
  );
}
