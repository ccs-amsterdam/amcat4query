import { useEffect, useState } from "react";
import { Table } from "semantic-ui-react";

/**
 *
 * @param {class}  amcat  An Amcat connection class, as obtained with amcat4auth
 * @param {string} index The name of an index
 * @param {object} query An object with query components (q, params, filter)
 */
export default function Aggregate({ amcat, index, filters, axes }) {
  const [data, setData] = useState();
  useEffect(() => {
    fetchAggregate(amcat, index, setData);
  }, [amcat, index, setData]);
  if (!data) return <pre>...</pre>;
  console.log(data);
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Party</Table.HeaderCell>
          <Table.HeaderCell>N</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map(({ party, n }) => {
          return (
            <Table.Row>
              <Table.Cell>{party}</Table.Cell>
              <Table.Cell>{n}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

async function fetchAggregate(amcat, index, setData) {
  const result = await amcat.postAggregate(index, {}, {}, { party: null });
  console.log(result);
  setData(result.data);
}
