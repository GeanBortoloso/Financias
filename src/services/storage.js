// ============================================================
// Storage Service — localStorage implementation
// Swap these functions for Firebase/Supabase calls when ready
// ============================================================

const getToken = () => localStorage.getItem('token');
const getBaseUrl = () => '/api/transactions';

export async function fetchTransactions() {
  const token = getToken();
  if (!token) throw new Error('Sem token de acesso');
  
  const res = await fetch(getBaseUrl(), {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) throw new Error('Falha ao obter transações');
  return await res.json();
}

export async function addTransaction(tx) {
  const token = getToken();
  const res = await fetch(getBaseUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(tx)
  });
  
  if (!res.ok) throw new Error('Falha ao salvar transação');
  return await res.json();
}

export async function deleteTransaction(id) {
  const token = getToken();
  const res = await fetch(`${getBaseUrl()}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) throw new Error('Falha ao deletar transação');
}
