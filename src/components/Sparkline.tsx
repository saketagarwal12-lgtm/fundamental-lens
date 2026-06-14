import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Props {
  data: number[];
  positive?: boolean;
  width?: number | string;   // default 80px; pass "100%" to span the container
  height?: number;
  strokeWidth?: number;
}

export const Sparkline: React.FC<Props> = ({ data, positive, width = 80, height = 32, strokeWidth = 1.5 }) => {
  const first = data[0];
  const last = data[data.length - 1];
  const color = positive !== undefined ? (positive ? '#34D399' : '#FB7185') :
    last >= first ? '#34D399' : '#FB7185';
  const pts = data.map((v, i) => ({ v, i }));
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={pts}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={strokeWidth} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
