import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BurndownChart = ({ sprintData }) => {
  // Mock data - replace with real sprint data
  const data = [
    { day: 'Day 1', ideal: 100, actual: 100 },
    { day: 'Day 2', ideal: 90, actual: 95 },
    { day: 'Day 3', ideal: 80, actual: 85 },
    { day: 'Day 4', ideal: 70, actual: 80 },
    { day: 'Day 5', ideal: 60, actual: 70 },
    { day: 'Day 6', ideal: 50, actual: 55 },
    { day: 'Day 7', ideal: 40, actual: 45 },
    { day: 'Day 8', ideal: 30, actual: 30 },
    { day: 'Day 9', ideal: 20, actual: 20 },
    { day: 'Day 10', ideal: 10, actual: 10 },
    { day: 'Day 11', ideal: 0, actual: 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis label={{ value: 'Tasks Remaining', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ideal" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Ideal" />
        <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} name="Actual Progress" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BurndownChart;