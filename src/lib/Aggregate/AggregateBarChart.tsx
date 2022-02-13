import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from "recharts";
import { AggregateVisualizerProps } from "../interfaces";
import { qualitativeColors } from "./colors";
import { createChartData } from "./lib";

export default function AggregateBarChart({
  data,
  onClick,
  width,
  height,
}: AggregateVisualizerProps) {
  const { d, columns } = createChartData(data);
  const colors = qualitativeColors(columns.length);
  const primary = data.meta.axes[0].field;

  const handleClick = (column: string, j: number) => {
    if (onClick == null) return;

    // First value is always the value for primary axis on the clicked "row"
    const values = [d[j][primary]];
    if (data.meta.axes.length !== 1) {
      // Second value is the column clicked on
      values.push(column);
    }
    onClick(values);
  };
  if (height == null) height = Math.max(250, d.length * 30);
  const sorted = d.sort((e1, e2) => e2.n - e1.n);
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={sorted} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis type="category" dataKey={primary} width={150} />
        <XAxis type="number" />
        <Tooltip />
        {columns.map((column, i) => (
          <Bar
            key={i}
            type="monotone"
            dataKey={column}
            fill={colors[i]}
            onClick={(e, j) => handleClick(column, j)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
