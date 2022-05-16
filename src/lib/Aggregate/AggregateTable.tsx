import { Table } from "semantic-ui-react";
import { AggregateVisualizerProps } from "../interfaces";
import AggregateList from "./AggregateList";
import { DATEPARTS } from "./lib";

export default function AggregateTable({ data, onClick, limit }: AggregateVisualizerProps) {
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
  let rows = Array.from(rowset.values()).sort() as string[];
  if (data.meta.axes[0].interval === "dayofweek" || data.meta.axes[0].interval === "daypart") {
    rows = rows.sort((e1, e2) => DATEPARTS.get(e1)._sort - DATEPARTS.get(e2)._sort);
  }
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
        {rows.map((r) => {
          let label = r;
          if (
            data.meta.axes[0].interval === "dayofweek" ||
            data.meta.axes[0].interval === "daypart"
          ) {
            label = DATEPARTS.get(r).nl || r;
          }
          return (
            <Table.Row key={r}>
              <Table.Cell>{label}</Table.Cell>
              {cols.map((c) => (
                <Table.Cell key={c}>{d[r][c]}</Table.Cell>
              ))}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
