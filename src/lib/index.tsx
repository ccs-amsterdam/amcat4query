// here import and export all components for the npm module
import AggregateResult from "./Aggregate/AggregateResult";
import AggregateOptionsChooser from "./Aggregate/AggregateOptionsChooser";
import Articles from "./Articles/Articles";
import Login from "./Login/Login";
import IndexPicker from "./Index/IndexPicker";
import Query from "./Query/Query";
import Upload from "./Upload/Upload";
import LoginForm from "./Login/LoginForm";
import AggregatePane from "./Aggregate/AggregatePane";
import * as Amcat from "./apis/Amcat";

import {
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
} from "./interfaces";

export {
  AggregatePane,
  AggregateOptionsChooser,
  AggregateResult,
  Articles,
  Login,
  LoginForm,
  IndexPicker,
  Query,
  Upload,
  Amcat,
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
};
