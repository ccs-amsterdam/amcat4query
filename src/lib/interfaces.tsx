import { ReactNode } from "react";
import Amcat from "./apis/Amcat";

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

export interface DateFilter {
  lte?: string;
  gte?: string;
  lt?: string;
  gt?: string;
}
export interface AmcatFilter extends DateFilter {
  values?: string[];
}

export interface AmcatField {
  name: string;
  type: "keyword" | "date" | "tag" | "text" | "url";
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
}

export interface IndexProps {
  /** Amcat instance */
  amcat: Amcat;
  /** index name */
  index: string;
}

export interface AmcatDocument {
  /** We can see if a text has been processed by addAnnotations
      if it's an array. But there should be a more elegant solution (WvA nods) */
  text: string | any[];
  _annotations?: any[];
  [key: string]: any;
}

export interface AmcatQueryResult {
  results?: any[];
  meta?: { page_count?: number };
}
