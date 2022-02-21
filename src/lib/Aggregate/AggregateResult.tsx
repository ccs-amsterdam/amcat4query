import { useEffect, useState } from "react";
import { Message, Modal } from "semantic-ui-react";
import Articles from "../Articles/Articles";
import {
  AggregateData,
  AggregationInterval,
  AggregationOptions,
  AmcatFilter,
  AmcatIndex,
  AmcatQuery,
  DateFilter,
} from "../interfaces";
import AggregateTable from "./AggregateTable";
import AggregateBarChart from "./AggregateBarChart";
import AggregateLineChart from "./AggregateLineChart";
import { describeError, postAggregate } from "../Amcat";

//TODO: This file is becoming too complex - move some business logic to a lib and add unit tests?

interface AggregateResultProps {
  index: AmcatIndex;
  /** The query for the results to show */
  query: AmcatQuery;
  /** Aggregation options (display and axes information) */
  options: AggregationOptions;
  /* Width of the component */
  width?: string | number;
  /* Height of the component */
  height?: string | number;
}

/**
 * Display the results of an aggregate search
 */
export default function AggregateResult({
  index,
  query,
  options,
  width,
  height,
}: AggregateResultProps) {
  const [data, setData] = useState<AggregateData>();
  const [error, setError] = useState<string>();
  const [zoom, setZoom] = useState();

  // Fetch data and return an error message if it fails
  useEffect(() => {
    // Prevent data/error being set after component is unmounted
    let cancel = false;
    // TODO: don't query if index changed but options hasn't been reset (yet)
    if (index == null || !options?.axes || options.axes.length === 0) {
      setData(undefined);
      setError(undefined);
    } else {
      postAggregate(index, query, options)
        .then((d) => {
          if (!cancel) {
            console.log(d.data);
            setData(d.data);
            setError(undefined);
          }
        })
        .catch((error) => {
          if (!cancel) {
            setData(undefined);
            setError(describeError(error));
          }
        });
    }
    return () => {
      cancel = true;
    };
  }, [index, options, query, setData, setError]);
  if (error) return <Message error header={error} />;
  if (!data || !options || !options.display)
    return <Message info header="Select aggregation options" />;

  // Handle a click on the aggregate result
  // values should be an array of the same length as the axes and identify the value for each axis
  const handleClick = (values: []) => {
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
      {getArticleList(index, zoom, () => setZoom(undefined))}
      <Element
        data={data}
        onClick={handleClick}
        width={width}
        height={height}
        limit={options.limit}
      />
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
function getZoomFilter(value: any, interval: AggregationInterval, existing: AmcatFilter) {
  // For regular values, we can directly filter
  // Existing filter can also never be stricter than the value
  if (!interval) return { values: [value] };
  // For intervals/dates, we need to compute a start/end date
  // and then combine it with possible existing filters
  let start = new Date(value);
  let end = getEndDate(start, interval);
  // I tried a fancy list filter max expression but that just complicates stuff
  // for reference: new Date(Math.max(...[start, gte, gt].filter((x) => x != null).map((x) => new Date(x))))
  if (existing?.gte) start = new Date(Math.max(start.getTime(), new Date(existing.gte).getTime()));
  if (existing?.gt) start = new Date(Math.max(start.getTime(), new Date(existing.gt).getTime()));
  if (existing?.lt) end = new Date(Math.min(end.getTime(), new Date(existing.lt).getTime()));
  // Now it becomes interesting. We normally set end of the interval to LT
  // However, if existing.lte "wins", we should also set our end to be LTE.
  let end_op = "lt";
  if (existing?.lte && new Date(existing?.lte) < end) {
    end = new Date(existing.lte);
    end_op = "lte";
  }
  return { gte: isodate(start), [end_op]: isodate(end) };
}

function getEndDate(start: Date, interval: AggregationInterval) {
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
      result.setFullYear(result.getFullYear() + 1);
      break;
    default:
      throw new Error(`Unknown interval: ${interval}`);
  }
  return new Date(result);
}

function isodate(date: Date) {
  return date.toISOString().split("T")[0];
}

function describe_filter(field: string, filter: AmcatFilter) {
  if (filter.values) return `${field} '${filter.values}'`;
  const descriptions: { [key: string]: string } = {
    lte: "≤",
    lt: "<",
    gte: "≥",
    gt: ">",
  };
  return (Object.keys(filter) as (keyof DateFilter)[])
    .map((f) => `${field} ${descriptions[f]} ${filter[f]}`)
    .join(" and ");
}

export function getArticleList(index: AmcatIndex, query: AmcatQuery, onClose: () => void) {
  if (!query) return null;
  const header = Object.keys(query.filters || {})
    .map((f) => describe_filter(f, query.filters[f]))
    .join(" and ");

  return (
    <Modal open onClose={onClose}>
      <Modal.Header>{`Articles for ${header}`}</Modal.Header>
      <Articles index={index} query={query} />
    </Modal>
  );
}
