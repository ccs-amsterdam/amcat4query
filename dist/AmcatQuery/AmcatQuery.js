"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AmcatQuery;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _TextQuery = _interopRequireDefault(require("./TextQuery"));

var _AmcatFilters = _interopRequireDefault(require("./AmcatFilters"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function AmcatQuery(_ref) {
  let {
    amcat,
    index,
    setQueryForm
  } = _ref;
  const [queryString, setQueryString] = (0, _react.useState)("");
  const [filters, setFilters] = (0, _react.useState)({});

  const onSubmit = () => {
    setQueryForm({
      query: queryString,
      filters: filters
    });
  };

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_TextQuery.default, {
    queryString: queryString,
    setQueryString: setQueryString
  }), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form, {
    style: {
      marginBottom: "2em"
    }
  }, /*#__PURE__*/_react.default.createElement(_AmcatFilters.default, {
    amcat: amcat,
    index: index
  })), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button.Group, {
    widths: "2"
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    primary: true,
    type: "submit",
    onClick: () => onSubmit()
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
    name: "search"
  }), "Execute Query"))));
} // const AmcatFilters = () => {
//   return <div>nee</div>;
// };
// const FilterIntField = () => {
//   <FilterNumField integer={true} />;
// };
// const FilterNumField = ({ integer = false }) => {
//   <Input
//     size="mini"
//     value={contextWindow[1]}
//     type="number"
//     labelPosition="right"
//     style={{ width: "6em" }}
//     label={"after"}
//     onChange={(e, d) => setContextWindow([contextWindow[0], Number(d.value)])}
//   />;
// };