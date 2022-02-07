import { AggregateData, AggregateDataPoint } from "../interfaces";

/*
 * Useful functions in dealing with aggregate data
 */
function longToWide(data: AggregateDataPoint[], primary: string, secondary: string): LongData {
  // convert results from amcat to wide format
  const d: { [key: string]: LongDataPoint } = {};
  const columns = new Set<string>();
  data.forEach((row) => {
    const key = row[primary];
    if (!(key in d)) d[key] = { [primary]: key };
    d[key][row[secondary]] = row["n"];
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
  if (fields.length === 1) {
    // No need to convert
    return { d: data.data, columns: ["n"] };
  }
  return longToWide(data.data, fields[0], fields[1]);
}
