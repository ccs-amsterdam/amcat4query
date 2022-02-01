import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { createChartData, qualitativeColors } from "./lib";

export default function AggregateBarChart({ data, onClick }) {
  const { d, columns } = createChartData(data);
  const colors = qualitativeColors(columns.length);
  const primary = data.meta.axes[0].field;

  const handleClick = (i, j) => {
    if (onClick == null) return;
    if (columns.length === 1) {
      onClick([d[j][primary]]);
    } else {
      //TODO: Handle click for multiple axes
      console.log(i, j);
    }
  };
  const height = Math.max(250, d.length * 30);
  const sorted = d.sort((e1, e2) => e2.n - e1.n);
  return (
    <BarChart width={730} height={height} data={sorted} layout="vertical">
      <CartesianGrid strokeDasharray="3 3" />
      <YAxis type="category" dataKey={primary} width={150} padding={{ left: 20 }} />
      <XAxis type="number" />
      <Tooltip />
      {columns.map((column, i) => (
        <Bar
          key={i}
          type="monotone"
          dataKey={column}
          fill={colors[i]}
          onClick={(e, j) => handleClick(i, j)}
        />
      ))}
    </BarChart>
  );
}
