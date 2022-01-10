"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DateField;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _reactSemanticUiDatepickers = _interopRequireDefault(require("react-semantic-ui-datepickers"));

require("react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function DateField(_ref) {
  var _query$field, _query$field2;

  let {
    field,
    query,
    setQuery
  } = _ref;
  const [open, setOpen] = (0, _react.useState)(false);
  const gte = (query === null || query === void 0 ? void 0 : (_query$field = query[field]) === null || _query$field === void 0 ? void 0 : _query$field.gte) || "";
  const lte = (query === null || query === void 0 ? void 0 : (_query$field2 = query[field]) === null || _query$field2 === void 0 ? void 0 : _query$field2.lte) || "";

  const _onChange = (value, which) => {
    if (value === "") {
      var _query$filters, _query$filters$field, _query$filters2;

      if (query !== null && query !== void 0 && (_query$filters = query.filters) !== null && _query$filters !== void 0 && (_query$filters$field = _query$filters[field]) !== null && _query$filters$field !== void 0 && _query$filters$field[which]) query === null || query === void 0 ? true : delete query.filters[field][which];
      if (query !== null && query !== void 0 && (_query$filters2 = query.filters) !== null && _query$filters2 !== void 0 && _query$filters2[field] && Object.keys(query.filters[field]).length === 0) delete query.filters[field];
    } else {
      var _query$filters3;

      if (!(query !== null && query !== void 0 && query.filters)) query.filters = {};
      if (!((_query$filters3 = query.filters) !== null && _query$filters3 !== void 0 && _query$filters3[field])) query.filters[field] = {};
      query.filters[field][which] = extractDateFormat(value);
    }

    setQuery(_objectSpread({}, query));
  };

  const buttontext = !gte && !lte ? "DATE FILTER" : "".concat(gte || "from start", "  -  ").concat(lte || "till end");
  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Popup, {
    open: open,
    hoverable: true,
    onClose: () => setOpen(false),
    position: "top left",
    mouseLeaveDelay: 99999,
    trigger: /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
      fluid: true,
      onClick: () => setOpen(!open)
    }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
      name: "calendar"
    }), " ", buttontext)
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
    label: label,
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