import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CumulativeFlowDiagram = () => {
  const data = [
    { date: 'Week 1', todo: 20, inProgress: 5, inReview: 2, done: 3 },
    { date: 'Week 2', todo: 18, inProgress: 8, inReview: 4, done: 8 },
    { date: 'Week 3', todo: 15, inProgress: 10, inReview: 5, done: 15 },
    { date: 'Week 4', todo: 12, inProgress: 8, inReview: 6, done: 22 },
    { date: 'Week 5', todo: 8, inProgress: 6, inReview: 4, done: 30 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="done" stackId="1" stroke="#10b981" fill="#10b981" />
        <Area type="monotone" dataKey="inReview" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
        <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
        <Area type="monotone" dataKey="todo" stackId="1" stroke="#94a3b8" fill="#94a3b8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CumulativeFlowDiagram;