"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PaginationTable;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _highlightElasticTags = require("../functions/highlightElasticTags");

require("./paginationTableStyle.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A nice table with pagination
 * @param {array} data an Array with data for a single page
 * @param {array} columns an Array with objects indicating which columns to show and how. Object should have key 'name', which by default
 *                        is both the column name in the table, and the value fetched from data. But can also have a key 'f', which is a function
 *                        taking a data row object as argument. Can also have key 'width' to specify width in SemanticUIs 16 parts system.
 * @param {int} pages the number of pages
 * @param {function} pageChange the function to perform on pagechange. Gets pageindex as an argument, and should update data
 * @param {function} onClick    Function to perform when clicking on a row. Gets data row object as argument
 * @returns
 */
function PaginationTable(_ref) {
  let {
    data,
    columns,
    pages,
    pageChange,
    onClick: _onClick
  } = _ref;

  const createHeaderRow = (data, columns) => {
    return columns.map((col, i) => {
      if (col.hide) return null;
      return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.HeaderCell, {
        key: i,
        width: col.width || null
      }, /*#__PURE__*/_react.default.createElement("span", {
        title: col.name
      }, col.name));
    });
  };

  const createBodyRows = (data, columns) => {
    return data.map((rowObj, i) => {
      return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Row, {
        key: i,
        style: {
          cursor: "pointer"
        },
        onClick: () => _onClick(rowObj)
      }, createRowCells(rowObj, columns));
    });
  };

  const createRowCells = (rowObj, columns) => {
    return columns.map((column, i) => {
      if (column.hide) return null;
      let content;

      if (column.f) {
        content = column.f(rowObj);
      } else {
        content = rowObj ? rowObj[column.name] : null;
      }

      return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Cell, {
        key: i,
        style: {
          minWidth: column.width || "50px",
          maxWidth: column.width || "200px",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }
      }, /*#__PURE__*/_react.default.createElement("span", {
        title: (0, _highlightElasticTags.removeElasticTags)(content)
      }, (0, _highlightElasticTags.highlightElasticTags)(content)));
    });
  };

  if (data.length < 1) return null;
  const columnSelection = columns || Object.keys(data[0]).map(name => ({
    name
  }));
  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Container, {
    style: {
      width: "100%",
      overflow: "auto"
    }
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table, {
    unstackable: true,
    selectable: true,
    compact: true,
    singleLine: true,
    size: "small",
    style: {
      fontSize: "10px"
    }
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Header, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Row, null, createHeaderRow(data, columnSelection))), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Body, null, createBodyRows(data, columnSelection)), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Footer, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.Row, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Table.HeaderCell, {
    colSpan: columnSelection.length
  }, pages > 1 ? /*#__PURE__*/_react.default.createElement(_semanticUiReact.Pagination, {
    fluid: true,
    size: "mini",
    boundaryRange: 1,
    siblingRange: 1,
    ellipsisItem: {
      content: /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
        name: "ellipsis horizontal"
      }),
      icon: true
    },
    firstItem: {
      content: /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
        name: "angle double left"
      }),
      icon: true
    },
    lastItem: {
      content: /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
        name: "angle double right"
      }),
      icon: true
    },
    prevItem: {
      content: /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
        name: "angle left"
      }),
      icon: true
    },
    nextItem: {
      content: /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
        name: "angle right"
      }),
      icon: true
    },
    pointing: true,
    secondary: true,
    defaultActivePage: 1,
    totalPages: pages,
    onPageChange: (e, d) => pageChange(d.activePage - 1)
  }) : null)))));
}