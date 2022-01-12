"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ImportTable;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ES_MAPPINGS = {
  int: {
    type: "long"
  },
  date: {
    type: "date"
  },
  num: {
    type: "double"
  },
  keyword: {
    type: "keyword"
  },
  text: {
    type: "text"
  },
  object: {
    type: "object"
  }
};
const REQUIRED_FIELDS = ["title", "date", "text"];

function ImportTable(_ref) {
  let {
    data,
    columns,
    setColumns,
    fields
  } = _ref;
  const n = 6;
  const headerCellStyle = {
    width: "10em",
    paddingTop: "2px",
    paddingBottom: "0",
    textAlign: "center",
    background: "lightgrey",
    overflow: "visible"
  };

  const headerName = data => {
    return columns.map(column => {
      return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.HeaderCell, {
        style: _objectSpread(_objectSpread({}, headerCellStyle), {}, {
          background: "grey",
          color: "white"
        })
      }, /*#__PURE__*/_react.default.createElement("span", {
        title: column.name
      }, column.name));
    });
  };

  const headerField = data => {
    const fieldOptions = Object.keys(fields).map(field => {
      let description = fields[field] ? "exists" : null;
      let text = field;

      if (REQUIRED_FIELDS.includes(field)) {
        description = "required";
        text = text + "*";
      }

      return {
        key: field,
        value: field,
        text,
        description,
        color: "blue"
      };
    });

    const onChangeField = (i, newField) => {
      for (let column of columns) {
        if (column.field === newField) column.field = null;
      }

      columns[i].field = newField;
      if (fields[newField]) columns[i].type = fields[newField];
      setColumns([...columns]);
    };

    return columns.map((column, i) => {
      const options = [...fieldOptions];
      const exists = fields[column.field];
      if (!exists) options.push({
        key: column.field,
        value: column.field,
        text: column.field
      });
      return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.HeaderCell, {
        style: headerCellStyle
      }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Dropdown, {
        fluid: true,
        search: true,
        header: "Select field or type to create new",
        value: column.field,
        style: {
          height: "2em",
          textAlign: "center",
          color: exists ? "blue" : "black"
        },
        placeholder: "assign field",
        allowAdditions: true,
        additionLabel: "New Field ",
        onAddItem: (e, d) => onChangeField(i, d.value),
        onChange: (e, d) => onChangeField(i, d.value),
        options: options
      }));
    });
  };

  const headerType = data => {
    let options = Object.keys(ES_MAPPINGS).map(em => {
      return {
        key: em,
        value: em,
        text: em.toUpperCase(),
        description: ES_MAPPINGS[em]
      };
    });
    options = [{
      key: "auto",
      value: "auto",
      text: "AUTO"
    }, ...options];

    const onChangeType = (i, newType) => {
      var _fields$columns$i$fie;

      const fixedType = (_fields$columns$i$fie = fields[columns[i].field]) === null || _fields$columns$i$fie === void 0 ? void 0 : _fields$columns$i$fie.type;

      if (fixedType) {
        columns[i].type = fixedType;
      } else {
        columns[i].type = newType;
      }

      setColumns([...columns]);
    };

    return columns.map((column, i) => {
      const exists = fields[column.field];
      let color = exists ? "blue" : "black";
      if (!column.field) color = "grey";
      return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.HeaderCell, {
        style: _objectSpread(_objectSpread({}, headerCellStyle), {}, {
          paddingBottom: "5px"
        })
      }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Dropdown, {
        fluid: true,
        search: true,
        header: "Select intended field type",
        style: {
          height: "2em",
          textAlign: "center",
          color
        },
        placeholder: "type",
        value: column.type,
        disabled: exists,
        onChange: (e, d) => onChangeType(i, d.value),
        options: options
      }));
    });
  };

  const headerRowLabel = label => {
    return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.HeaderCell, {
      style: _objectSpread(_objectSpread({}, headerCellStyle), {}, {
        textAlign: "right",
        background: "grey",
        color: "white",
        width: "6em"
      })
    }, label);
  };

  const createRows = (data, n) => {
    const previewdata = data.slice(0, n + 1);
    return previewdata.slice(1).map((row, i) => {
      return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Row, null, createRowCells(row.data, i));
    });
  };

  const createRowCells = (row, i) => {
    const rowCells = row.map(cell => {
      return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Cell, {
        style: {
          textAlign: "right"
        }
      }, /*#__PURE__*/_react.default.createElement("span", {
        title: cell
      }, cell));
    });
    return [/*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Cell, {
      style: {
        background: "grey",
        borderTop: "0",
        color: "white",
        textAlign: "right"
      }
    }, /*#__PURE__*/_react.default.createElement("b", null, i === 2 ? "CSV content" : null)), ...rowCells];
  };

  if (data.length <= 1) return null;
  if (!columns || columns.length !== data[0].data.length) return null;
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginTop: "3em",
      overflowX: "auto",
      minHeight: "350px",
      width: "100%"
    }
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table, {
    celled: true,
    unstackable: true,
    singleLine: true,
    fixed: true,
    size: "small",
    compact: true
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Header, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Row, null, headerRowLabel("CSV column"), headerName(data)), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Row, null, headerRowLabel("Index field"), headerField(data)), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Row, null, headerRowLabel("field type"), headerType(data))), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Body, null, createRows(data, n))), data.length > n ? /*#__PURE__*/_react.default.createElement(_semanticUiReact.Header, {
    align: "center"
  }, data.length - 1 - n, " more rows") : null);
}