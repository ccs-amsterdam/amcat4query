import { AggregateData, AggregateDataPoint } from "../interfaces";

/*
 * Useful functions in dealing with aggregate data
 */
function longToWide(
  data: AggregateDataPoint[],
  primary: string,
  secondary: string,
  target: string
): LongData {
  // convert results from amcat to wide format
  const d: { [key: string]: LongDataPoint } = {};
  const columns = new Set<string>();
  data.forEach((row) => {
    const key = row[primary];
    if (!(key in d)) d[key] = { [primary]: key };
    d[key][row[secondary]] = row[target];
    columns.add(row[secondary]);
  });
  return { d: Object.values(d), columns: Array.from(columns.values()) };
}

interface LongDataPoint {
  [key: string]: any;
}
interface LongData {
  d: LongDataPoint[];
  columns: string[];
}

// Convert amcat aggregate results ('long' format data plus axes) into data for recharts ('wide' data and series names)
// Specifically, from [{ row_id, col_id, value }, ...] to [{ row_id, col1: value1, col2: value2, ...}, ...]
export function createChartData(data: AggregateData): LongData {
  const fields = data.meta.axes.map((axis) => axis.field);
  const target = data.meta.aggregations.length > 0 ? data.meta.aggregations[0].name : "n";

  if (fields.length === 1) {
    // No need to convert
    return { d: data.data, columns: [target] };
  }
  return longToWide(data.data, fields[0], fields[1], target);
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
