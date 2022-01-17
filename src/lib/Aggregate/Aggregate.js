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

  useEffect(() => {
    console.log(options);
    if (options?.axes === undefined || options?.axes.length === 0) {
      setData(null);
    } else {
      fetchAggregate(amcat, index, options.axes, setData);
    }
  }, [amcat, index, options, setData]);

  if (!data) return <Message info header="Select aggregation options" />;
  console.log(data);
  if (options.display === "list") return AggregateTable(data, options);
  if (options.display === "barchart") return AggregateBarChart(data, options);
  if (options.display === "linechart") return AggregateLineChart(data, options);

  console.error(options);
  return <Message warning header="Unknown display option: {options.display}" />;
}

async function fetchAggregate(amcat, index, axes, setData) {
  const result = await amcat.postAggregate(index, {}, {}, axes);
  console.log(result);
  setData(result.data);
}
