import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { FiSettings } from 'react-icons/fi';

const data = [
  { name: 'Ja', value: 1000 },
  { name: 'Fe', value: 20000 },
  { name: 'Ma', value: 10000 },
  { name: 'Ap', value: 50000 },
  { name: 'My', value: 100000 },
  { name: 'Ju', value: 2000 },
  { name: 'Jl', value: 30000 },
  { name: 'Au', value: 15000 },
  { name: 'Se', value: 25000 },
  { name: 'Oc', value: 60000 },
  { name: 'No', value: 20000 },
  { name: 'De', value: 30000 },
];

// Custom tooltip for Bar Chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-md p-2 text-xs text-black">
        <p className="font-medium">May 2025</p>
        <p className="font-bold">{(payload[0].value / 1000).toFixed(0)}k</p>
      </div>
    );
  }
  return null;
};

const ChartComponent = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm w-full h-full">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-sm font-semibold text-gray-800">Referral Activity</h2>
      <FiSettings size={16} className="text-gray-400" />
    </div>
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={10}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.name === 'My' ? '#3366FF' : '#E0E0E0'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ChartComponent;
