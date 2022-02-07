export type DisplayOption = "list" | "linechart" | "barchart";
export type AggregationInterval = "day" | "week" | "month" | "quarter" | "year";

export interface AggregationAxis {
  field: string;
  interval: AggregationInterval;
}

export interface AggregationOptions {
  axes: AggregationAxis[];
  display: DisplayOption;
}

export interface AmcatFilter {
  values?: string[];
  lte?: string;
  gte?: string;
  lt?: string;
  gt?: string;
}

export interface AmcatQuery {
  filters: { [field: string]: AmcatFilter };
  queries: [];
}
