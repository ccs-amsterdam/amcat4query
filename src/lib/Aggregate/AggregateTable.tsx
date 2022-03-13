import { Table } from "semantic-ui-react";
import { AggregateDataPoint, AggregateVisualizerProps } from "../interfaces";
import AggregateList from "./AggregateList";

export default function AggregateTable({ data, onClick, limit }: AggregateVisualizerProps) {
  const handleClick = (row: AggregateDataPoint) => {};

  // A table without columns is the same as a list (not trying to get metaphysical here)
  if (data.meta.axes.length === 1) return AggregateList({ data, onClick, limit });

  if (data.meta.axes.length !== 2) throw new Error(`Cannot handle axes ${data.meta.axes}`);

  // Convert data into set of rows, columns, and [row][col] -> n
  // It feels like this will not win me javascript golf. But it seems to work?
  const rowfield = data.meta.axes[0].field;
  const colfield = data.meta.axes[1].field;
  let rowset = new Set();
  let colset = new Set();
  const d: { [key: string]: { [key: string]: number } } = {};
  data.data.forEach((x) => {
    const row = x[rowfield];
    const col = x[colfield];
    rowset.add(row);
    colset.add(col);
    d[row] = { ...d[row], [col]: x["n"] };
  });
  const rows = Array.from(rowset.values()).sort() as string[];
  const cols = Array.from(colset.values()).sort() as string[];

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.Cell></Table.Cell>
          {cols.map((c) => (
            <Table.Cell key={c}>{c}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r}>
            <Table.Cell>{r}</Table.Cell>
            {cols.map((c) => (
              <Table.Cell key={c}>{d[r][c]}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
