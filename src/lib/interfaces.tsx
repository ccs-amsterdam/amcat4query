import { ReactNode } from "react";

export type DisplayOption = "list" | "linechart" | "barchart";
export type AggregationInterval = "day" | "week" | "month" | "quarter" | "year";

export interface AggregationAxis {
  field: string;
  interval?: AggregationInterval;
}

export interface AggregationOptions {
  axes: AggregationAxis[];
  display: DisplayOption;
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
  type: "keyword" | "date" | "tag" | "text" | "url" | "geo_point";
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
  meta: { axes: AggregationAxis[] };
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
  width?: string | number;
  height?: string | number;
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
