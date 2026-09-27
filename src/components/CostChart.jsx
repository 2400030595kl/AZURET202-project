import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

const defaultData = [
  { month: 'Jan', currentCost: 4200, projectedSavings: 1200 },
  { month: 'Feb', currentCost: 3900, projectedSavings: 1500 },
  { month: 'Mar', currentCost: 3400, projectedSavings: 2100 },
  { month: 'Apr', currentCost: 2900, projectedSavings: 2800 },
  { month: 'May', currentCost: 2300, projectedSavings: 3400 },
  { month: 'Jun', currentCost: 1800, projectedSavings: 4100 },
];

export default function CostChart({ data = defaultData, title = "Azure Cost vs. Projected Decommission Savings ($)" }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#f8fafc' }}
              formatter={(value) => [`$${value.toLocaleString()}`, '']}
            />
            <Legend wrapperStyle={{ color: '#94a3b8' }} />
            <Bar dataKey="currentCost" name="Active Cost" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="projectedSavings" name="Decommission Savings" fill="#34d399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #334155',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#f8fafc',
    marginBottom: '16px',
  },
  chartContainer: {
    width: '100%',
    height: '320px',
  },
};