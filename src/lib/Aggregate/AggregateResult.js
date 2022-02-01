import { useEffect, useState } from "react";
import { Message, Modal } from "semantic-ui-react";
import Articles from "../Articles/Articles";
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
  const [zoom, setZoom] = useState();

  // Fetch data and return an error message if it fails
  useEffect(() => {
    if (amcat == null || index == null || !options?.axes || options.axes.length === 0) {
      setData(null);
    } else {
      fetchAggregate(amcat, index, options.axes, query, setData, setError);
    }
  }, [amcat, index, options, query, setData, setError]);
  if (error) return <Message error header={error} />;
  if (!data) return <Message info header="Select aggregation options" />;

  // Handle a click on the aggregate result
  // values should be an array of the same length as the axes and identify the value for each axis
  const handleClick = (values) => {
    if (options.axes.length !== values.length)
      throw new Error(`Axis [$(options.axes)] incompatible with values [$(values)]`);
    if (options.axes.length !== 1) throw new Error("Not implemented, sorry");

    // Create a new query to filter articles based on intersection of current and new query
    const newQuery = { ...query };
    const axis = options.axes[0].field;
    if (query.filters?.[axis]) {
      // This filter already exists, so take the intersection of current and new query
      throw new Error("Not implemented, sorry");
    } else {
      newQuery.filters = { ...query.filters, [axis]: { values } };
    }
    setZoom(newQuery);
  };

  // Choose and render result element
  const Element = {
    list: AggregateTable,
    barchart: AggregateBarChart,
    linechart: AggregateLineChart,
  }[options.display];
  if (Element === undefined) {
    console.error({ Element, data, options });
    return <Message warning header={`Unknown display option: ${options.display}`} />;
  }

  return (
    <div>
      {zoom && (
        <Modal open onClose={() => setZoom(undefined)}>
          <Modal.Header>{`Articles for ${JSON.stringify(zoom)}`}</Modal.Header>
          <Articles amcat={amcat} index={index} query={zoom} />
        </Modal>
      )}
      <Element data={data} options={options} onClick={handleClick} />
    </div>
  );
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
