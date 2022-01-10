"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Query;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _TextField = _interopRequireDefault(require("./FilterForms/TextField"));

var _Filters = _interopRequireDefault(require("./Filters"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Query(_ref) {
  let {
    amcat,
    index,
    setQuery
  } = _ref;
  const [queryForm, setQueryForm] = (0, _react.useState)({});
  const [queryChanged, setQueryChanged] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    setQueryChanged(true);
  }, [queryForm, setQueryChanged]);

  const _onClick = () => {
    setQuery(queryForm);
    setQueryChanged(false);
  };

  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Grid, {
    style: {
      marginBottom: "1em"
    }
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Grid.Row, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Grid.Column, {
    floated: "left",
    width: 16
  }, /*#__PURE__*/_react.default.createElement(_TextField.default, {
    query: queryForm,
    setQuery: setQueryForm,
    rows: 5
  }), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button.Group, {
    stackable: true,
    style: {
      width: "100%",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/_react.default.createElement(_Filters.default, {
    amcat: amcat,
    index: index,
    query: queryForm,
    setQuery: setQueryForm
  })), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    disabled: !queryChanged,
    fluid: true,
    primary: true,
    type: "submit",
    onClick: () => _onClick()
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
    name: "search"
  }), "Execute Query"))));
}