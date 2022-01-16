import { Table } from "semantic-ui-react";

export default function AggregateTable(data) {
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
        {data.data.map((row, i) => {
          return (
            <Table.Row key={i}>
              {data.meta.axes.map((axis, j) => (
                <Table.Cell key={j}>{row[axis.field]}</Table.Cell>
              ))}
              <Table.Cell>{row.n}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
