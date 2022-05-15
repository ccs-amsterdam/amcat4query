import { ReactNode } from "react";

export type DisplayOption = "list" | "table" | "linechart" | "barchart";
export type AggregationInterval =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "daypart"
  | "dayofweek";

export interface AggregationAxis {
  field: string;
  interval?: AggregationInterval;
}

export type MetricFunction = "avg" | "min" | "max" | "sum";

export interface AggregationMetric {
  field: string;
  function: MetricFunction;
  name?: string;
  type?: string;
}

//TODO: think about how visual and data options relate, e.g. limit.
export interface AggregationOptions {
  /* Aggregation axes, i.e. [{field: "publisher"}] */
  axes?: AggregationAxis[];
  /* Display option, i,e, "linechart" or "barchart" */
  display: DisplayOption;
  /* Use a specific metric rather than count -- only allow one metric for now */
  metrics?: AggregationMetric[];
  /* Limit the number of rows/lines/bars */
  limit?: number;
}

export interface DateFilter {
  lte?: string;
  gte?: string;
  lt?: string;
  gt?: string;
}

export interface AmcatFilter extends DateFilter {
  values?: (string | number)[];
  exists?: boolean;
}

export interface AmcatField {
  name: string;
  type:
    | "long"
    | "double"
    | "object"
    | "keyword"
    | "date"
    | "tag"
    | "text"
    | "url"
    | "geo_point"
    | "id";
}

export interface AmcatFilters {
  [field: string]: AmcatFilter;
}

export interface AmcatQuery {
  filters?: AmcatFilters;
  queries?: string[];
}

export type AggregateDataPoint = { [key: string]: any };

export type AggregateData = {
  data: AggregateDataPoint[];
  meta: { axes: AggregationAxis[]; aggregations: AggregationMetric[] };
};

export type AggregateVisualizer = (props: any) => ReactNode;
export interface AggregateVisualizerProps {
  /***
   * The data to visualize
   */
  data: AggregateData;
  /**
   * Callback when user clicks on a point,
   * should be an array of values of equal length to the # of axes
   * */
  onClick: (value: any[]) => void;
  /* Width of the component (default: 100%) */
  width?: string | number;
  /* Height of the component (default: 300) */
  height?: string | number;
  /* Limit the number of bars/lines/rows */
  limit?: number;
}

export interface AmcatUser {
  /** hostname (e.g. "https://vu.amcat.nl/api") */
  host: string;
  /** user login email */
  email: string;
  /** Authentication token */
  token: string;
}

export interface AmcatIndex extends AmcatUser {
  /** index name */
  index: string;
}

export interface AmcatDocument {
  /** We can see if a text has been processed by addAnnotations
      if it's an array. But there should be a more elegant solution (WvA nods) */
  text: string | any[];
  _id: number;
  _annotations?: any[];
  [key: string]: any;
}

export interface AmcatQueryResult {
  results?: AmcatDocument[];
  meta?: { page_count?: number };
}

export interface LocationOptions {
  /** Field name refering to a geo_point field in this index */
  field: string;
  /** Maximum number of documents to use (default: 100)*/
  numdocs?: number;
  /** Width of the map (default: '100%') */
  width?: number | string;
  /** Height of the map (default: 600) */
  height?: number | string;
}

export type SortSpec = string | string[] | { [field: string]: { order?: "asc" | "desc" } }[];
