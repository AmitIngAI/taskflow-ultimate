import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VelocityChart = () => {
  const data = [
    { sprint: 'Sprint 1', planned: 45, completed: 42, velocity: 42 },
    { sprint: 'Sprint 2', planned: 50, completed: 48, velocity: 48 },
    { sprint: 'Sprint 3', planned: 48, completed: 45, velocity: 45 },
    { sprint: 'Sprint 4', planned: 55, completed: 52, velocity: 52 },
    { sprint: 'Sprint 5', planned: 60, completed: 58, velocity: 58 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sprint" />
        <YAxis label={{ value: 'Story Points', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="planned" fill="#94a3b8" name="Planned" />
        <Bar dataKey="completed" fill="#6366f1" name="Completed" />
        <Bar dataKey="velocity" fill="#10b981" name="Velocity" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VelocityChart;