import { LineChart, Line, ResponsiveContainer } from 'recharts';

export const Sparkline: React.FC<{ data: number[]; positive?: boolean }> = ({ data, positive }) => {
  const first = data[0];
  const last = data[data.length - 1];
  const color = positive !== undefined ? (positive ? '#2F8A5F' : '#B5524A') :
    last >= first ? '#2F8A5F' : '#B5524A';
  const pts = data.map((v, i) => ({ v, i }));
  return (
    <div style={{ width: 80, height: 32 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={pts}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
