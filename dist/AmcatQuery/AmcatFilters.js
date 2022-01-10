"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AmcatFilters;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _reactSemanticUiDatepickers = _interopRequireDefault(require("react-semantic-ui-datepickers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function AmcatFilters(_ref) {
  let {
    amcat,
    index
  } = _ref;
  const [fields, setFields] = (0, _react.useState)(null);
  const [fieldValues, setFieldValues] = (0, _react.useState)({});
  (0, _react.useEffect)(() => {
    if (index && amcat) {
      amcat.getFields(index).then(res => {
        console.log(res);
        setFields(res.data);
      }).catch(e => {
        setFields(null);
      });
    } else {
      setFields(null);
    }
  }, [amcat, index]);

  const onSubmit = (key, value) => {
    let newFieldValues = _objectSpread({}, fieldValues);

    newFieldValues[key] = value;

    if (value === "") {
      console.log("ommitting");
      delete newFieldValues[key];
    }

    setFieldValues(newFieldValues);
  };

  const dateFilter = (key, value) => {
    let newFieldValues = _objectSpread({}, fieldValues); // this is for the POST method


    if (!newFieldValues.date) {
      newFieldValues["date"] = {};
      newFieldValues.date[key] = extractDateFormat(value);
    } else if (value === null) {
      delete newFieldValues.date;
    } else {
      newFieldValues.date[key] = extractDateFormat(value);
    }

    setFieldValues(newFieldValues);
  };

  const extractDateFormat = date => {
    if (!date) return "";
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getUTCFullYear();
    return year + "-" + month + "-" + day;
  };

  const renderFields = () => {
    return Object.keys(fields).map(key => {
      if (fields[key] === "text") {
        return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.TextArea, {
          key: key,
          value: fieldValues[key] ? fieldValues[key] : "",
          onChange: (e, d) => onSubmit(key, d.value),
          label: key.charAt(0).toUpperCase() + key.slice(1)
        });
      }

      if (fields[key] === "date") {
        return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Container, {
          key: "date_filter"
        }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Field, {
          key: key + "_gte"
        }, /*#__PURE__*/_react.default.createElement(_reactSemanticUiDatepickers.default, {
          key: "gte",
          type: "basic",
          label: "Start Date",
          locale: navigator.locale,
          format: "YYYY-MM-DD",
          onChange: (e, d) => {
            e.stopPropagation();
            dateFilter("gte", d.value);
          }
        })), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Field, {
          key: key + "_lte"
        }, /*#__PURE__*/_react.default.createElement(_reactSemanticUiDatepickers.default, {
          key: "lte",
          type: "basic",
          label: "End Date",
          locale: navigator.locale,
          format: "YYYY-MM-DD",
          onChange: (e, d) => {
            e.stopPropagation();
            dateFilter("lte", d.value);
          }
        })));
      }

      if (fields[key] === "keyword") {
        return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Field, {
          key: key
        }, /*#__PURE__*/_react.default.createElement("label", null, key.charAt(0).toUpperCase() + key.slice(1)), /*#__PURE__*/_react.default.createElement("input", {
          value: fieldValues[key] ? fieldValues[key] : "",
          onChange: e => onSubmit(key, e.target.value)
        }));
      }

      return null;
    });
  };

  if (!fields) return null;else return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Container, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Container, null, renderFields()), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button.Group, {
    widths: 2
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    className: "ui red button",
    onClick: () => setFieldValues(null)
  }, "Reset Filters")));
}