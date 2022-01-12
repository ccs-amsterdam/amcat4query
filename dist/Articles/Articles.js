"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Articles;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.split.js");

var _PaginationTable = _interopRequireDefault(require("../components/PaginationTable"));

var _react = _interopRequireWildcard(require("react"));

var _Article = _interopRequireDefault(require("../Article/Article"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const per_page = 15;
const COLUMNS = [{
  name: "_id",
  hide: true
}, {
  name: "date",
  f: row => row.date.replace("T", " "),
  width: "8em"
}, {
  name: "publisher",
  width: "6em"
}, // optional
{
  name: "title"
}, {
  name: "text"
}];
/**
 *
 * @param {class}  amcat  An Amcat connection class, as obtained with amcat4auth
 * @param {string} index The name of an index
 * @param {object} query An object with query components (q, params, filter)
 * @param {array}  columns an Array with objects indicating which columns to show and how. Object should have key 'name', which by default
 *                        is both the column name in the table, and the value fetched from data. But can also have a key 'f', which is a function
 *                        taking a data row object as argument. Can also have key 'width' to specify width in SemanticUIs 16 parts system. 
 * @param {bool}   allColumns If true, include all columns AFTER the columns specified in the columns argument
 * @returns
 */

function Articles(_ref) {
  var _data$meta;

  let {
    amcat,
    index,
    query,
    columns = COLUMNS,
    allColumns = true
  } = _ref;
  const [data, setPage] = useArticles(amcat, index, query);
  const [articleId, setArticleId] = (0, _react.useState)(null);
  const columnList = (0, _react.useMemo)(() => {
    if (!(data !== null && data !== void 0 && data.results) || data.results.length === 0) return [];
    const dataColumns = Object.keys(data.results[0]); // first use the columns as specified in COLUMNS

    const columnList = columns.filter(c => dataColumns.includes(c.name)); // then add all other columns AFTER

    if (allColumns) {
      for (let name of dataColumns) {
        if (columnList.find(c => c.name === name)) continue;
        columnList.push({
          name
        });
      }
    }

    return columnList;
  }, [data, allColumns, columns]);

  const onClick = row => {
    setArticleId(row._id);
  };

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_PaginationTable.default, {
    data: (data === null || data === void 0 ? void 0 : data.results) || [],
    columns: columnList,
    pages: (data === null || data === void 0 ? void 0 : (_data$meta = data.meta) === null || _data$meta === void 0 ? void 0 : _data$meta.page_count) || 0,
    pageChange: setPage,
    onClick: onClick
  }), /*#__PURE__*/_react.default.createElement(_Article.default, {
    amcat: amcat,
    index: index,
    id: articleId,
    query: query
  }));
}

const useArticles = (amcat, index, query) => {
  const [data, setData] = (0, _react.useState)([]);
  const [page, setPage] = (0, _react.useState)(0);
  (0, _react.useEffect)(() => {
    fetchArticles(amcat, index, query, page, true, setData);
  }, [amcat, index, query, page, setData]);
  return [data, setPage];
};

const fetchArticles = async (amcat, index, query, page, highlight, setData) => {
  let params = {
    page,
    per_page,
    highlight
  };
  if (query.query_string) params.queries = query.query_string.split("\n");
  if (query !== null && query !== void 0 && query.params) params = _objectSpread(_objectSpread({}, query.params), params);
  const filters = query.filters || {};

  try {
    const res = await amcat.postQuery(index, params, filters);
    setData(res.data);
  } catch (e) {
    console.log(e);
    setData([]);
  }
};