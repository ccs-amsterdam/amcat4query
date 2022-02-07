export type DisplayOption = "default" | "list" | "linechart" | "barchart";

export interface AggregationAxis {
  field: string;
  interval: string;
}

export interface AggregationOptions {
  axes: AggregationAxis[];
  display: DisplayOption;
}

export interface AmcatQuery {
  filters: [];
  queries: [];
}
