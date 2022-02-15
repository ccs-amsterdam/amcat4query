import { Table } from "semantic-ui-react";
import { AggregateDataPoint, AggregateVisualizerProps } from "../interfaces";

export default function AggregateTable({ data, onClick, limit }: AggregateVisualizerProps) {
  const handleClick = (row: AggregateDataPoint) => {
    const values = data.meta.axes.map((axis) => row[axis.field]);
    onClick(values);
  };
  let d = data.data;
  if (limit && d.length > limit) d = d.slice(0, limit);
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          {data.meta.axes.map((axis, i) => (
            <Table.HeaderCell key={i}>{axis.field}</Table.HeaderCell>
          ))}
          <Table.HeaderCell>N</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {d.map((row, i) => {
          return (
            <Table.Row key={i}>
              {data.meta.axes.map((axis, j) => (
                <Table.Cell key={j} onClick={() => handleClick(row)}>
                  {row[axis.field]}
                </Table.Cell>
              ))}
              <Table.Cell>{row.n}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
