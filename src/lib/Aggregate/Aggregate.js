import { useEffect, useState } from "react";
import { Message } from "semantic-ui-react";
import AggregateTable from "./AggragateTable";
import AggregateBarChart from "./AggregateBarChart";
import AggregateLineChart from "./AggregateLineChart";

/**
 *
 * @param {class}  amcat  An Amcat connection class, as obtained with amcat4auth
 * @param {string} index The name of an index
 * @param {object} query An object with query components (q, params, filter)
 */
export default function Aggregate({ amcat, index, filters, options }) {
  const [data, setData] = useState();

  console.log(filters);

  useEffect(() => {
    if (options?.axes === undefined || options?.axes.length === 0) {
      setData(null);
    } else {
      fetchAggregate(amcat, index, options.axes, filters, setData);
    }
  }, [amcat, index, options, filters, setData]);

  const handleClick = (i, j) => {
    console.log({ i, j });
  };

  if (!data) return <Message info header="Select aggregation options" />;
  if (options.display === "list") return <AggregateTable data={data} options={options} />;
  if (options.display === "barchart")
    return <AggregateBarChart data={data} onClick={handleClick} />;
  if (options.display === "linechart") return AggregateLineChart(data, options);

  console.error(options);
  return <Message warning header="Unknown display option: {options.display}" />;
}

async function fetchAggregate(amcat, index, axes, filters, setData) {
  if (filters.query_string)
    filters.queries = filters.query_string.split("\n").filter((s) => s !== "");
  const result = await amcat.postAggregate(index, {}, filters, axes);
  setData(result.data);
}
