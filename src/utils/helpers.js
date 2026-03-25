export const CATEGORIES = [
  { value: 'alimentacao', label: 'Alimentação', color: '#f59e0b' },
  { value: 'transporte', label: 'Transporte', color: '#3b82f6' },
  { value: 'saude', label: 'Saúde', color: '#10b981' },
  { value: 'lazer', label: 'Lazer', color: '#8b5cf6' },
  { value: 'moradia', label: 'Moradia', color: '#ef4444' },
  { value: 'educacao', label: 'Educação', color: '#06b6d4' },
  { value: 'vestuario', label: 'Vestuário', color: '#f97316' },
  { value: 'salario', label: 'Salário', color: '#34d399' },
  { value: 'freelance', label: 'Freelance', color: '#a3e635' },
  { value: 'investimentos', label: 'Investimentos', color: '#818cf8' },
  { value: 'outros', label: 'Outros', color: '#94a3b8' },
];

export function getCategoryMeta(value) {
  return CATEGORIES.find(c => c.value === value) || { label: value, color: '#94a3b8' };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function getMonthName(monthIndex) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return months[monthIndex];
}

export function summarize(transactions) {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.value), 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.value), 0);
  return { income, expense, balance: income - expense };
}

export function expensesByCategory(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const map = {};
  expenses.forEach(t => {
    map[t.category] = (map[t.category] || 0) + Number(t.value);
  });
  return Object.entries(map).map(([key, value]) => {
    const meta = getCategoryMeta(key);
    return { name: meta.label, value, color: meta.color };
  });
}

export function monthlyFlow(transactions) {
  const map = {};
  transactions.forEach(t => {
    const d = new Date(t.date + 'T12:00:00');
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
    if (t.type === 'income') map[key].income += Number(t.value);
    else map[key].expense += Number(t.value);
  });
  return Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)
    .map(m => {
      const [year, mo] = m.month.split('-');
      return { ...m, label: `${getMonthName(Number(mo) - 1)}/${year.slice(2)}` };
    });
}
