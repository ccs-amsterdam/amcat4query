"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FilterForms;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.reduce.js");

require("core-js/modules/es.promise.js");

var _react = _interopRequireWildcard(require("react"));

var _KeywordField = _interopRequireDefault(require("./KeywordField"));

var _DateField = _interopRequireDefault(require("./DateField"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function FilterForms(_ref) {
  let {
    amcat,
    index,
    filters,
    query,
    setQuery
  } = _ref;
  const [fieldValues, setFieldValues] = (0, _react.useState)({});
  const [forms, setForms] = (0, _react.useState)([]);
  (0, _react.useEffect)(() => {
    if (!amcat || !index || !filters) {
      setForms([]);
      return;
    }

    getFieldValues(amcat, index, filters, fieldValues, setFieldValues);
  }, [amcat, index, filters, fieldValues, setFieldValues]);
  (0, _react.useEffect)(() => {
    if (!fieldValues || Object.keys(fieldValues).length === 0) {
      setForms([]);
    } else {
      const currentFieldValues = filters.reduce((cfv, f) => {
        if (fieldValues[f]) cfv[f] = fieldValues[f];
        return cfv;
      }, {});
      setForms(renderForms(currentFieldValues, query, setQuery));
    }
  }, [filters, fieldValues, query, setQuery]);
  return forms;
}

const renderForms = (fieldValues, query, setQuery) => {
  return Object.keys(fieldValues).map(field => {
    const fv = fieldValues[field];
    return renderForm(field, fv.type, fv.data, query, setQuery);
  });
};

const renderForm = (field, type, data, query, setQuery) => {
  switch (type) {
    case "date":
      return /*#__PURE__*/_react.default.createElement(_DateField.default, {
        field: "date",
        query: query,
        setQuery: setQuery
      });

    case "keyword":
      return /*#__PURE__*/_react.default.createElement(_KeywordField.default, {
        field: field,
        options: data.map(d => ({
          value: d,
          text: d
        })),
        query: query,
        setQuery: setQuery
      });

    default:
      return null;
  }
};

const getFieldValues = async (amcat, index, filters, fieldValues, setFieldValues) => {
  let hasUpdated = false;

  try {
    const res = await amcat.getFields(index);
    const fields = res.data;

    for (let filter of filters) {
      if (fieldValues[filter]) continue;
      const res = await amcat.getFieldValues(index, filter);
      fieldValues[filter] = {
        type: fields[filter],
        data: res.data
      };
      hasUpdated = true;
    }
  } catch (e) {
    console.log(e);
  }

  if (hasUpdated) setFieldValues(_objectSpread({}, fieldValues));
};