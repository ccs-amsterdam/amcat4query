"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Filters;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.reduce.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _FilterForms = _interopRequireDefault(require("./FilterForms"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Filters(_ref) {
  let {
    amcat,
    index,
    query,
    setQuery
  } = _ref;
  const [fields, setFields] = (0, _react.useState)({});
  const [filters, setFilters] = (0, _react.useState)([]);
  (0, _react.useEffect)(() => {
    if (index && amcat) {
      amcat.getFields(index).then(res => {
        setFields(res.data);
      }).catch(e => {
        setFields({});
      });
    } else {
      setFields({});
    }
  }, [amcat, index]);
  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Container, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Group, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Field, {
    width: 4
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Header, null, "Filters")), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Field, {
    width: 14
  }, /*#__PURE__*/_react.default.createElement(SelectFields, {
    fields: fields,
    filters: filters,
    setFilters: setFilters
  }))), /*#__PURE__*/_react.default.createElement(_FilterForms.default, {
    amcat: amcat,
    index: index,
    filters: filters,
    query: query,
    setQuery: setQuery
  })));
}

const SelectFields = _ref2 => {
  let {
    fields,
    filters,
    setFilters
  } = _ref2;
  const options = Object.keys(fields).reduce((options, name) => {
    if (fields[name] === "text") return options;
    if (name === "date" || name === "url") return options;
    options.push({
      key: name,
      value: name,
      text: name
    });
    return options;
  }, []);
  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Dropdown, {
    clearable: true,
    value: filters,
    fluid: true,
    multiple: true,
    selection: true,
    search: true,
    options: options,
    onChange: (e, d) => setFilters(d.value)
  });
};