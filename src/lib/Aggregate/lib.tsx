import { AggregateData, AggregateDataPoint, AggregationInterval } from "../interfaces";

interface LongData {
  d: AggregateDataPoint[];
  columns: string[];
}

function should_add_zeroes(interval: AggregationInterval) {
  return ["year", "quarter", "month", "week", "day"].includes(interval);
}

// Convert amcat aggregate results ('long' format data plus axes) into data for recharts ('wide' data and series names)
// Specifically, from [{ row_id, col_id, value }, ...] to [{ row_id, col1: value1, col2: value2, ...}, ...]
export function createChartData(data: AggregateData): LongData {
  const fields = data.meta.axes.map((axis) => axis.field);
  const target = data.meta.aggregations.length > 0 ? data.meta.aggregations[0].name : "n";
  const interval = data.meta.axes[0].interval;
  if (fields.length === 1) {
    const d = add_zeroes(data.data, fields[0], interval, target);
    return { d, columns: [target] };
  } else return longToWide(data.data, fields[0], fields[1], target, interval);
}

/*
 * Useful functions in dealing with aggregate data
 */
function longToWide(
  data: AggregateDataPoint[],
  primary: string,
  secondary: string,
  target: string,
  interval?: AggregationInterval
): LongData {
  // convert results from amcat to wide format
  const columns = Array.from(new Set(data.map((row) => row[secondary])));
  const dmap = new Map(data.map((p) => [JSON.stringify([p[primary], p[secondary]]), p[target]]));
  let rows = Array.from(new Set(data.map((row) => row[primary])));
  if (interval === "year") rows = daterange(rows, interval);
  const d = rows.map((row) => {
    const p = { [primary]: row };
    columns.forEach((col) => {
      const key = JSON.stringify([row, col]);
      p[col] = dmap.has(key) ? dmap.get(key) : 0;
    });
    return p;
  });
  return { d, columns };
}

function ymd(d: Date): string {
  // We use a custom function becuase toIsoDate (1) includes time, and
  // (2) changes the date to what it would be in UTC time zone, potentially changing the day
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function add_zeroes(
  d: AggregateDataPoint[],
  field: string,
  interval: AggregationInterval,
  target: string
): AggregateDataPoint[] {
  if (!should_add_zeroes(interval)) return d;
  const dmap = new Map(d.map((p) => [ymd(new Date(p[field])), p]));
  const dates = daterange(
    d.map((p) => p[field]),
    interval
  );
  console.log({ dmap, dates });
  const result = dates.map((date) =>
    dmap.has(date) ? dmap.get(date) : { [field]: date, [target]: 0 }
  );
  return result;
}

function incrementDate(date: Date, interval: AggregationInterval) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  switch (interval) {
    case "year":
      return new Date(y + 1, m, d);
    case "quarter":
      return new Date(y, m + 3, d);
    case "month":
      return new Date(y, m + 1, d);
    case "week":
      return new Date(y, m, d + 7);
    case "day":
      return new Date(y, m, d + 1);
    default:
      throw new Error(`Can't handle interval ${interval}, sorry!`);
  }
}

function daterange(values: string[], interval: AggregationInterval): string[] {
  const result: string[] = [];
  const dates = values.map((d) => new Date(d));
  let d = dates.reduce((a, b) => (a < b ? a : b));
  const enddate = dates.reduce((a, b) => (a > b ? a : b));
  while (d <= enddate) {
    result.push(ymd(d));
    d = incrementDate(d, interval);
  }
  return result;
}

export const DATEPARTS = new Map([
  ["Monday", { nl: "Maandag", _sort: 1 }],
  ["Tuesday", { nl: "Dinsdag", _sort: 2 }],
  ["Wednesday", { nl: "Woensdag", _sort: 3 }],
  ["Thursday", { nl: "Donderdag", _sort: 4 }],
  ["Friday", { nl: "Vrijdag", _sort: 5 }],
  ["Saturday", { nl: "Zaterdag", _sort: 6 }],
  ["Sunday", { nl: "Zondag", _sort: 7 }],
  ["Morning", { nl: "Ochtend", _sort: 1 }],
  ["Afternoon", { nl: "Middag", _sort: 2 }],
  ["Evening", { nl: "Avond", _sort: 3 }],
  ["Night", { nl: "Nacht", _sort: 4 }],
]);

export function transform_dateparts(x: AggregateDataPoint, field: string) {
  const dp = DATEPARTS.get(x[field]);

  return dp ? { ...x, [field]: dp.nl, _sort: dp._sort } : x;
}
