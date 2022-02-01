import { useEffect, useState } from "react";
import { Message } from "semantic-ui-react";
import AggregateTable from "./AggragateTable";
import AggregateBarChart from "./AggregateBarChart";
import AggregateLineChart from "./AggregateLineChart";

/**
 * Display the results of an aggregate search
 * props:
 * - amcat
 * - index
 * - query: an AmCAT query object {query, filters}
 * - options: aggregation options {display, axes}
 */
export default function AggregateResult({ amcat, index, query, options }) {
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (amcat == null || index == null || !options?.axes || options.axes.length === 0) {
      setData(null);
    } else {
      fetchAggregate(amcat, index, options.axes, query, setData, setError);
    }
  }, [amcat, index, options, query, setData, setError]);

  const handleClick = (i, j) => {
    console.log({ i, j });
  };
  if (error) return <Message error header={error} />;

  if (!data) return <Message info header="Select aggregation options" />;
  const Element = {
    list: AggregateTable,
    barchart: AggregateBarChart,
    linechart: AggregateLineChart,
  }[options.display];
  if (Element === undefined) {
    console.error({ Element, data, options });
    return <Message warning header={`Unknown display option: ${options.display}`} />;
  }
  return <Element data={data} options={options} onClick={handleClick} />;
}

async function fetchAggregate(amcat, index, axes, query, setData, setError) {
  try {
    const result = await amcat.postAggregate(index, query, axes);
    setData(result.data);
  } catch (e) {
    console.log({ index, query, axes });
    if (e.response) {
      setError("Server is boos");
    } else if (e.request) {
      setError("No reply from server");
    } else setError("Something went wrong trying to run the query");
  }
}
