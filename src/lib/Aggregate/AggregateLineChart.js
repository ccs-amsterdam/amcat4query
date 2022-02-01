import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend } from "recharts";
import { createChartData, qualitativeColors } from "./lib";

export default function AggregateLineChart({ data, onClick }) {
  const { d, columns } = createChartData(data);
  const colors = qualitativeColors(columns.length);

  const handleClick = (line, point) => {
    console.log({ line, point });
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
