import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Area, AreaChart,
} from 'recharts';
import { expensesByCategory, monthlyFlow, formatCurrency } from '../utils/helpers';
import { PieChartIcon, BarChart2 } from 'lucide-react';

const CustomTooltipBar = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a2235', border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '10px', padding: '12px 16px', fontSize: '13px',
      }}>
        <div style={{ fontWeight: 700, marginBottom: '6px', color: '#e2e8f0' }}>{label}</div>
        {payload.map(p => (
          <div key={p.dataKey} style={{ color: p.color }}>
            {p.dataKey === 'income' ? 'Receita' : 'Despesa'}: {formatCurrency(p.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomTooltipPie = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div style={{
        background: '#1a2235', border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '10px', padding: '10px 14px', fontSize: '13px',
      }}>
        <span style={{ color: payload[0].payload.color, fontWeight: 700 }}>{name}</span>
        <div style={{ color: '#e2e8f0', marginTop: '2px' }}>{formatCurrency(value)}</div>
      </div>
    );
  }
  return null;
};

export default function Charts({ transactions }) {
  const pieData = expensesByCategory(transactions);
  const barData = monthlyFlow(transactions);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Row containing both charts */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

        {/* Donut chart */}
        <div className="glass-card" style={{ flex: '1', minWidth: '280px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <PieChartIcon size={17} color="#6366f1" />
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#e2e8f0' }}>Despesas por Categoria</div>
          </div>
          {pieData.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#475569', padding: '40px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
              <div>Sem despesas registradas</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltipPie />} />
                <Legend
                  formatter={(value) => (
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar/Area chart */}
        <div className="glass-card" style={{ flex: '2', minWidth: '320px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart2 size={17} color="#6366f1" />
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#e2e8f0' }}>Fluxo de Caixa Mensal</div>
          </div>
          {barData.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#475569', padding: '40px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
              <div>Sem dados suficientes</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(99,102,241,0.15)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltipBar />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                <Bar dataKey="income" name="Receita" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Despesa" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
