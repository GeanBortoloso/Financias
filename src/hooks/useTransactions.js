// ============================================================
// useTransactions hook
// Atualizado para usar REST API com Firebase/NoSQL
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { fetchTransactions, addTransaction, deleteTransaction } from '../services/storage';

export function useTransactions(token, onUnauthorized) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetchTransactions();
      setTransactions(data);
    } catch(err) {
      console.error(err);
      if (err.message === 'Sem token de acesso') {
        if (onUnauthorized) onUnauthorized();
      }
    } finally {
      setLoading(false);
    }
  }, [token, onUnauthorized]);

  useEffect(() => { load(); }, [load]);

  const add = useCallback(async (tx) => {
    const saved = await addTransaction(tx);
    setTransactions(prev => [...prev, saved]);
    return saved;
  }, []);

  const remove = useCallback(async (id) => {
    await deleteTransaction(id);
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  }, []);

  return { transactions, loading, add, remove };
}
