import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend } from "recharts";
import { AggregateVisualizerProps } from "../interfaces";
import { qualitativeColors } from "./colors";
import { createChartData } from "./lib";

export default function AggregateLineChart({ data, onClick }: AggregateVisualizerProps) {
  const { d, columns } = createChartData(data);
  const colors = qualitativeColors(columns.length);

  const handleClick = (line: number, point: any) => {
    // First value is always the payload for primary aggregation axis
    const values = [point.payload[data.meta.axes[0].field]];
    if (data.meta.axes.length !== 1) {
      // Second value is the name of the line clicked on
      values.push(columns[line]);
    }
    onClick(values);
  };

  return (
    <LineChart width={730} height={250} data={d}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={data.meta.axes[0].field} />
      <YAxis />
      <Tooltip />
      {columns.length > 1 ? <Legend /> : null}
      {columns.map((column, i) => (
        <Line
          key={i}
          type="monotone"
          dataKey={column}
          stroke={colors[i]}
          activeDot={{ onClick: (e, j) => handleClick(i, j) }}
        />
      ))}
    </LineChart>
  );
}
