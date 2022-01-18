import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { createChartData, qualitativeColors } from "./lib";

export default function AggregateBarChart({ data, onClick }) {
  const { d, columns } = createChartData(data);
  const colors = qualitativeColors(columns.length);
  const primary = data.meta.axes[0].field;
  return (
    <BarChart width={730} height={250} data={d}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={primary} />
      <YAxis />
      <Tooltip />
      {columns.map((column, i) => (
        <Bar
          key={i}
          type="monotone"
          dataKey={column}
          fill={colors[i]}
          onClick={(e, j) => onClick && onClick(columns[i], d[j][primary])}
        />
      ))}
    </BarChart>
  );
}
