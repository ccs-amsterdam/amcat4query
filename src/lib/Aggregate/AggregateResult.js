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
      throw new Error(
        `Axis [${JSON.stringify(options.axes)}] incompatible with values [${values}]`
      );
    // Create a new query to filter articles based on intersection of current and new query
    const newQuery = query == null ? {} : JSON.parse(JSON.stringify(query));
    if (!newQuery.filters) newQuery.filters = {};
    options.axes.forEach((axis, i) => {
      newQuery.filters[axis.field] = getZoomFilter(
        values[i],
        axis.interval,
        newQuery.filters?.[axis.field]
      );
    });
    console.log(JSON.stringify(newQuery));
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

/**
 * Compute the right filter for 'zooming in' to a clicked cell/bar/point.
 * Should always yield exactly the same (number of) articles as visible in the cell.
 *
 * @param {*} value the clicked value, e.g. a date or keyword value
 * @param {str} interval the selected interval, e.g. null or week/month etc
 * @param {object} existing the existing filters for this field, e.g. null or lte and/or gte filters
 * @returns the filter object with either a values filter or a (possibly merged) date filter
 */
function getZoomFilter(value, interval, existing) {
  // For regular values, we can directly filter
  // Existing filter can also never be stricter than the value
  if (!interval) return { values: [value] };
  // For intervals/dates, we need to compute a start/end date
  // and then combine it with possible existing filters
  let start = new Date(value);
  let end = getEndDate(start, interval);
  // I tried a fancy list filter max expression but that just complicates stuff
  // for reference: new Date(Math.max(...[start, gte, gt].filter((x) => x != null).map((x) => new Date(x))))
  if (existing?.gte) start = new Date(Math.max(start, new Date(existing.gte)));
  if (existing?.gt) start = new Date(Math.max(start, new Date(existing.gt)));
  if (existing?.lt) end = new Date(Math.min(end, new Date(existing.lt)));
  // Now it becomes interesting. We normally set end of the interval to LT
  // However, if existing.lte "wins", we should also set our end to be LTE.
  let end_op = "lt";
  if (existing?.lte && new Date(existing?.lte) < end) {
    end = new Date(existing.lte);
    end_op = "lte";
  }
  return { gte: isodate(start), [end_op]: isodate(end) };
}

function getEndDate(start, interval) {
  const result = new Date(start);
  switch (interval) {
    case "day":
      result.setDate(result.getDate() + 1);
      break;
    case "week":
      result.setDate(result.getDate() + 7);
      break;
    case "month":
      result.setMonth(result.getMonth() + 1);
      break;
    case "quarter":
      result.setMonth(result.getMonth() + 3);
      break;
    case "year":
      result.setYear(result.getFullYear() + 1);
      break;
    default:
      throw new Error(`Unknown interval: ${interval}`);
  }
  return new Date(result);
}

function isodate(date) {
  return date.toISOString().split("T")[0];
}

function describe_filter(field, filter) {
  if (filter.values) return `${field} '${filter.values}'`;
  const descriptions = {
    lte: "≤",
    lt: "<",
    gte: "≥",
    gt: ">",
  };
  return Object.keys(filter)
    .map((f) => `${field} ${descriptions[f]} ${filter[f]}`)
    .join(" and ");
}

function getArticleList(amcat, index, query, setQuery) {
  if (!query) return null;
  const header = Object.keys(query.filters || {})
    .map((f) => describe_filter(f, query.filters[f]))
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
