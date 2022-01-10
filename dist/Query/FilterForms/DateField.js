"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DateField;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _reactSemanticUiDatepickers = _interopRequireDefault(require("react-semantic-ui-datepickers"));

var _FilterButton = _interopRequireDefault(require("./FilterButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function DateField(_ref) {
  var _query$filters, _query$filters$field, _query$filters2, _query$filters2$field;

  let {
    field,
    query,
    setQuery
  } = _ref;
  const gte = (query === null || query === void 0 ? void 0 : (_query$filters = query.filters) === null || _query$filters === void 0 ? void 0 : (_query$filters$field = _query$filters[field]) === null || _query$filters$field === void 0 ? void 0 : _query$filters$field.gte) || "";
  const lte = (query === null || query === void 0 ? void 0 : (_query$filters2 = query.filters) === null || _query$filters2 === void 0 ? void 0 : (_query$filters2$field = _query$filters2[field]) === null || _query$filters2$field === void 0 ? void 0 : _query$filters2$field.lte) || "";

  const _onChange = (value, which) => {
    if (!value) {
      var _query$filters3, _query$filters3$field, _query$filters4;

      if ((query === null || query === void 0 ? void 0 : (_query$filters3 = query.filters) === null || _query$filters3 === void 0 ? void 0 : (_query$filters3$field = _query$filters3[field]) === null || _query$filters3$field === void 0 ? void 0 : _query$filters3$field[which]) != null) query === null || query === void 0 ? true : delete query.filters[field][which];
      if (query !== null && query !== void 0 && (_query$filters4 = query.filters) !== null && _query$filters4 !== void 0 && _query$filters4[field] && Object.keys(query.filters[field]).length === 0) delete query.filters[field];
    } else {
      var _query$filters5;

      if (!(query !== null && query !== void 0 && query.filters)) query.filters = {};
      if (!((_query$filters5 = query.filters) !== null && _query$filters5 !== void 0 && _query$filters5[field])) query.filters[field] = {};
      query.filters[field][which] = extractDateFormat(value);
    }

    setQuery(_objectSpread({}, query));
  };

  const buttontext = !gte && !lte ? "DATE FILTER" : "".concat(gte || "from start", "  -  ").concat(lte || "till end");
  return /*#__PURE__*/_react.default.createElement(_FilterButton.default, {
    field: field,
    content: buttontext,
    icon: "calendar alternate outline"
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Field, null, /*#__PURE__*/_react.default.createElement(DatePicker, {
    label: "from date",
    value: gte,
    onChange: value => _onChange(value, "gte")
  })), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Field, null, /*#__PURE__*/_react.default.createElement(DatePicker, {
    label: "to date",
    value: lte,
    onChange: value => _onChange(value, "lte")
  })));
}

const DatePicker = _ref2 => {
  let {
    label,
    value,
    onChange: _onChange2
  } = _ref2;
  return /*#__PURE__*/_react.default.createElement(_reactSemanticUiDatepickers.default, {
    label: /*#__PURE__*/_react.default.createElement("b", null, label),
    type: "basic",
    value: value ? new Date(value) : "",
    format: "YYYY-MM-DD",
    onChange: (e, d) => {
      _onChange2(d.value);
    },
    style: {
      height: "1em",
      padding: "0"
    }
  });
};

const extractDateFormat = function extractDateFormat(date) {
  let ifNone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  if (!date) return ifNone;
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const year = date.getUTCFullYear();
  return year + "-" + month + "-" + day;
};