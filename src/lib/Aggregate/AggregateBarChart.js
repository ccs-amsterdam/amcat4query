import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function AggregateBarChart(data) {
  console.log(data);
  return (
    <BarChart width={730} height={250} data={data.data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="party" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="n" fill="#8884d8" />
    </BarChart>
  );
}
