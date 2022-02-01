import { useEffect, useState } from "react";
import { Message, Modal } from "semantic-ui-react";
import Articles from "../Articles/Articles";
import AggregateTable from "./AggragateTable";
import AggregateBarChart from "./AggregateBarChart";
import AggregateLineChart from "./AggregateLineChart";

//TODO: This file is becoming too complex - move some business logic to a lib and add unit tests?

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
    let cancel = false;
    // Prevent data/error being set from an earlier request
    // TODO: don't query if index changed but options hasn't been reset (yet)
    const setResults = (data, error) => {
      if (!cancel) {
        console.log(data);
        setError(error);
        setData(data);
      }
    };
    if (amcat == null || index == null || !options?.axes || options.axes.length === 0) {
      setData();
      setError();
    } else {
      fetchAggregate(amcat, index, options.axes, query, setResults);
    }
    return () => (cancel = true);
  }, [amcat, index, options, query, setData, setError]);
  if (error) return <Message error header={error} />;
  if (!data || !options || !options.display)
    return <Message info header="Select aggregation options" />;

  // Handle a click on the aggregate result
  // values should be an array of the same length as the axes and identify the value for each axis
  const handleClick = (values) => {
    if (options.axes.length !== values.length)
      throw new Error(`Axis [$(options.axes)] incompatible with values [$(values)]`);
    if (options.axes.length !== 1) throw new Error("Not implemented, sorry");

    // Create a new query to filter articles based on intersection of current and new query
    const newQuery = query == null ? {} : JSON.parse(JSON.stringify(query));
    if (!newQuery.filters) newQuery.filters = {};
    const axis = options.axes[0].field;
    if (newQuery.filters?.[axis]) {
      // This filter already exists, so take the intersection of current and new query
      throw new Error("Not implemented, sorry");
    } else {
      newQuery.filters[axis] = { values: [values[0]] };
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
      {getArticleList(amcat, index, zoom, setZoom)}
      <Element data={data} options={options} onClick={handleClick} />
    </div>
  );
}

function getArticleList(amcat, index, query, setQuery) {
  if (!query) return null;
  const header = Object.keys(query.filters || {})
    .map((f) => `${f} '${query.filters[f].values}'`)
    .join(" and ");

  return (
    <Modal open onClose={() => setQuery(undefined)}>
      <Modal.Header>{`Articles for ${header}`}</Modal.Header>
      <Articles amcat={amcat} index={index} query={query} />
    </Modal>
  );
}

async function fetchAggregate(amcat, index, axes, query, setResult) {
  let error;
  try {
    const result = await amcat.postAggregate(index, query, axes);
    setResult(result.data);
  } catch (e) {
    console.log({ index, query, axes });
    if (e.response) {
      error = `HTTP error ${e.response.status}`;
    } else if (e.request) {
      error = "Error: No reply from server";
    } else error = "Something went wrong trying to run the query";
  }
  if (error) setResult(undefined, error);
}
