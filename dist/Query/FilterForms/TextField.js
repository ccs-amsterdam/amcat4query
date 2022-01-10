"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TextField;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Be sure to include styles at some point, probably during your bootstrapping
function TextField(_ref) {
  let {
    query,
    setQuery,
    rows
  } = _ref;
  const queryString = query.query_string || "";

  const _onChange = value => {
    if (value === "") {
      if (query.query_string) delete query.query_string;
    } else {
      query.query_string = value;
    }

    setQuery(_objectSpread({}, query));
  };

  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form, {
    fluid: true,
    style: {
      marginBottom: "2em",
      width: "100%"
    }
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.TextArea, {
    fluid: true,
    width: 16,
    value: queryString,
    placeholder: "Query...",
    onChange: (e, d) => _onChange(d.value),
    rows: rows || 7
  }), /*#__PURE__*/_react.default.createElement(QueryHelp, null));
}

const QueryHelp = () => {
  const [open, setOpen] = (0, _react.useState)(false);
  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal, {
    onClose: () => setOpen(false),
    onOpen: () => setOpen(true),
    open: open,
    trigger: /*#__PURE__*/_react.default.createElement("i", {
      style: {
        cursor: "pointer",
        color: "#1f61f9",
        float: "right"
      }
    }, "Query help")
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Header, null, "Query help"), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Content, null, /*#__PURE__*/_react.default.createElement("p", null, "If there is no boolean operator between two terms, the OR operator is used. Therefore, the query \"a b\" is parsed as \"a OR b\"."), /*#__PURE__*/_react.default.createElement("h4", null, "Search Identifier"), /*#__PURE__*/_react.default.createElement("p", null, "identifier#query = separate the identifier from the query with the # character, such as pvda#pvda OR \"wouter bos\" OR \"partij van de arbeid\" The query identifier can be used in further queries, marked with [brackets]. Example: partijen#[pvda] OR [cda] (where pvda and cda have been previously defined)"), /*#__PURE__*/_react.default.createElement("h4", null, "Wildcards"), /*#__PURE__*/_react.default.createElement("p", null, "? = Single character wildcard, like te?t will find both test and text * = Multiple character wildcard, like mosl* will find moslim, moslims, etc."), /*#__PURE__*/_react.default.createElement("p", null, "Note: You can not start a term with a wildcard"), /*#__PURE__*/_react.default.createElement("h4", null, "Proximity Search"), /*#__PURE__*/_react.default.createElement("p", null, "\"word1 word2\"~10 = Search with word distance 10 between word1 and word2"), /*#__PURE__*/_react.default.createElement("p", null, "\"(word1 OR word2 OR word*) word3\"~5 = Search with word distance 5 between word1 OR word2 OR word*, and word3"), /*#__PURE__*/_react.default.createElement("h4", null, "Fuzzy Search"), /*#__PURE__*/_react.default.createElement("p", null, "koe~ or koe~0.9 = fuzzy search where the value should be between 0 (low similarity) and 1 (high similarity)"), /*#__PURE__*/_react.default.createElement("h4", null, "NOT"), /*#__PURE__*/_react.default.createElement("p", null, "word1 NOT (word2 word3) = Search for documents containing word1 and not word2 and not word3"), /*#__PURE__*/_react.default.createElement("h4", null, "Headline only"), /*#__PURE__*/_react.default.createElement("p", null, "Use headline:keyword to only search the headline for \"keyword\""), /*#__PURE__*/_react.default.createElement("a", {
    href: "https://lucene.apache.org/core/3_4_0/queryparsersyntax.html"
  }, "More info about the Lucene query syntax")));
};