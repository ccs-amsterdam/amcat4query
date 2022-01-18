import colorbrewer from "colorbrewer";

/*
 * Useful functions in dealing with aggregate data
 */

function longToWide(data, primary, secondary) {
  // convert results from amcat to wide format
  const d = {};
  const columns = new Set();
  data.forEach((row) => {
    const key = row[primary];
    if (!(key in d)) d[key] = { [primary]: key };
    d[key][row[secondary]] = row["n"];
    columns.add(row[secondary]);
  });
  return { d: Object.values(d), columns: [...columns] };
}

// Convert amcat aggregate results ('long' format data plus axes) into data for recharts ('wide' data and series names)
// Specifically, from [{ row_id, col_id, value }, ...] to [{ row_id, col1: value1, col2: value2, ...}, ...]
export function createChartData(data) {
  const fields = data.meta.axes.map((axis) => axis.field);
  if (fields.length === 1) {
    // No need to convert
    return { d: data.data, columns: ["n"] };
  }
  return longToWide(data.data, fields[0], fields[1]);
}

// Get (at least) n qualitative colors in a specific brewer palette
// If the pallette doesn't have that many colors, add colors from other palettes
export function qualitativeColors(n, palette = "Set1") {
  if (n < 3) n = 3; // (I think) all palettes start with 3 colors
  if (n in colorbrewer[palette]) return colorbrewer[palette][n];
  // the chosen palette has insufficient colors, so let's join a couple palettes together
  // Helper function to get colors with highest N in a palette
  const getpal = (pal) =>
    colorbrewer[pal][Math.max(...Object.keys(colorbrewer[pal]).map((n) => parseInt(n)))];
  const result = getpal(palette);
  for (const p of colorbrewer.schemeGroups.qualitative.filter((e) => e !== palette).reverse()) {
    result.push(...getpal(p));
    if (result.length >= n) return result;
  }
  return result;
}
