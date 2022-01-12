"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Filters;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.array.reduce.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _FilterForms = _interopRequireDefault(require("./FilterForms/FilterForms"));

var _FilterButton = _interopRequireDefault(require("./FilterForms/FilterButton"));

var _useFields = _interopRequireDefault(require("../components/useFields"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Filters(_ref) {
  let {
    amcat,
    index,
    query,
    setQuery
  } = _ref;
  const fields = (0, _useFields.default)(amcat, index);
  const [filters, setFilters] = (0, _react.useState)([]);
  (0, _react.useEffect)(() => {
    // make sure only selected filters are used in the query
    setQuery(query => {
      if (!(query !== null && query !== void 0 && query.filters)) return query;

      for (let key of Object.keys(query.filters)) {
        if (!filters.includes(key)) delete query.filters[key];
      }

      return _objectSpread({}, query);
    });
  }, [filters, setQuery]);
  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button.Group, {
    vertical: true,
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/_react.default.createElement(SelectFields, {
    fields: fields,
    filters: filters,
    setFilters: setFilters
  }), /*#__PURE__*/_react.default.createElement(_FilterForms.default, {
    amcat: amcat,
    index: index,
    filters: filters,
    query: query,
    setQuery: setQuery
  }));
}

const SelectFields = _ref2 => {
  let {
    fields,
    filters,
    setFilters
  } = _ref2;
  const options = Object.keys(fields).reduce((options, name) => {
    if (fields[name] === "text") return options;
    if (name === "url") return options;
    options.push({
      key: name,
      value: name,
      text: name
    });
    return options;
  }, []);
  const content = filters.join(", ") || "Select filters";
  return /*#__PURE__*/_react.default.createElement(_FilterButton.default, {
    content: content,
    icon: "filter",
    onlyContent: true,
    disabled: options.length === 0,
    style: {
      background: "blue",
      color: "white"
    }
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Dropdown, {
    open: true,
    clearable: true,
    value: filters,
    fluid: true,
    multiple: true,
    selection: true,
    search: true,
    header: "Select fields to filter on",
    options: options,
    style: {
      width: "300px"
    },
    noResultsMessage: "",
    onChange: (e, d) => setFilters(d.value)
  }));
};