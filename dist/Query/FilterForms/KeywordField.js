"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = KeywordField;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _FilterButton = _interopRequireDefault(require("./FilterButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function KeywordField(_ref) {
  var _query$filters;

  let {
    field,
    options,
    query,
    setQuery
  } = _ref;
  const keywords = (query === null || query === void 0 ? void 0 : (_query$filters = query.filters) === null || _query$filters === void 0 ? void 0 : _query$filters[field]) || [];

  const _onChange = value => {
    if (value.length === 0) {
      var _query$filters2;

      if (query !== null && query !== void 0 && (_query$filters2 = query.filters) !== null && _query$filters2 !== void 0 && _query$filters2[field]) delete query.filters[field];
    } else {
      if (!(query !== null && query !== void 0 && query.filters)) query.filters = {};
      query.filters[field] = value;
    }

    setQuery(_objectSpread({}, query));
  };

  const content = keywords.join(", ") || "KEYWORD FILTER";
  return /*#__PURE__*/_react.default.createElement(_FilterButton.default, {
    field: field,
    content: content,
    onlyContent: true,
    icon: "list"
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Dropdown, {
    open: true,
    clearable: true,
    value: keywords,
    fluid: true,
    multiple: true,
    selection: true,
    search: true,
    options: options,
    header: "Select keywords in \"".concat(field, "\"\" field"),
    style: {
      minWidth: "300px"
    },
    onChange: (e, d) => _onChange(d.value)
  }));
}