// here import and export all components for the npm module
import AggregateResult from "./Aggregate/AggregateResult";
import AggregateOptionsChooser from "./Aggregate/AggregateOptionsChooser";
import Articles from "./Articles/Articles";
import Login from "./Login/Login";
import IndexLogin from "./Login/IndexLogin";
import IndexPicker from "./Index/IndexPicker";
import Query from "./Query/Query";
import Filter from "./Query/Filter";
import Upload from "./Upload/Upload";
import LoginForm from "./Login/LoginForm";
import AggregatePane from "./Aggregate/AggregatePane";
import LocationHeatmap from "./Location/LocationHeatmap";
import LocationPane from "./Location/LocationPane";
import LocationOptionChooser from "./Location/LocationOptionChooser";

import * as Amcat from "./Amcat";

import type {
  AmcatQuery,
  AmcatQueryResult,
  AggregationOptions,
  AggregationAxis,
  AggregationInterval,
  AmcatField,
  AmcatFilter,
  AmcatFilters,
  AmcatDocument,
  AmcatUser,
  AmcatIndex,
  LocationOptions,
} from "./interfaces";

export {
  AggregatePane,
  AggregateOptionsChooser,
  AggregateResult,
  Articles,
  Login,
  LoginForm,
  IndexLogin,
  IndexPicker,
  Query,
  Upload,
  LocationPane,
  LocationHeatmap,
  LocationOptionChooser,
  Filter,
  Amcat,
};

export type {
  AmcatQuery,
  AmcatQueryResult,
  AggregationOptions,
  AggregationAxis,
  AggregationInterval,
  AmcatField,
  AmcatFilter,
  AmcatFilters,
  AmcatDocument,
  AmcatUser,
  AmcatIndex,
  LocationOptions,
};
