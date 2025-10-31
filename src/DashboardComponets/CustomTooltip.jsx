import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FiSettings } from 'react-icons/fi';

const data = [
  { name: 'Ja', value: 1000 },
  { name: 'Fe', value: 10000 },
  { name: 'Ma', value: 5000 },
  { name: 'Ap', value: 8000 },
  { name: 'My', value: 20000 },
  { name: 'Ju', value: 1000 },
  { name: 'Jl', value: 25000 },
  { name: 'Au', value: 5000 },
  { name: 'Se', value: 15000 },
  { name: 'Oc', value: 18000 },
  { name: 'No', value: 22000 },
  { name: 'De', value: 1000 },
];

// Custom tooltip for Area Chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-md p-2 text-xs text-black">
        <p className="font-medium">May 2025</p>
        <p className="font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const EarningsChart = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm w-full h-full">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-sm font-semibold text-gray-800">Earnings</h2>
      <FiSettings size={16} className="text-gray-400" />
    </div>
    <ResponsiveContainer width="100%" height="90%">
      <AreaChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#3366FF"
          fill="url(#colorUv)"
          strokeWidth={2}
          dot={{ fill: '#3366FF', r: 4 }}
          activeDot={{ r: 6, strokeWidth: 2, fill: '#3366FF', stroke: '#fff' }}
        />
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3366FF" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3366FF" stopOpacity={0.02} />
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default EarningsChart;
