"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Article;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

var _react = _interopRequireWildcard(require("react"));

var _useFields = _interopRequireDefault(require("../components/useFields"));

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Article(_ref) {
  let {
    amcat,
    index,
    id,
    query
  } = _ref;
  const fields = (0, _useFields.default)(amcat, index);
  const [article, setArticle] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    if (!id || !fields) return;
    fetchArticle(amcat, index, id, query, fields, setArticle);
  }, [id, fields, amcat, index, query]);
  console.log(article);
  if (!article) return null;
  console.log("what");
  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal, {
    open: true
  }, article);
}

const fetchArticle = async (amcat, index, _id, query, fields, setArticle) => {
  let params = {
    annotations: true
  };
  if (query.query_string) params.queries = query.query_string.split("\n");

  try {
    const res = await amcat.postQuery(index, params, {
      _id
    });
    setArticle(formatArticle(res.data.results[0], fields));
  } catch (e) {
    console.log(e);
    setArticle(null);
  }
};

const formatArticle = (article, fields) => {
  const texts = [];

  for (const key of Object.keys(fields)) {
    if (fields[key] !== "text") continue;
    if (!article[key]) continue;
    const paragraphs = article[key].split("\n");

    const field = /*#__PURE__*/_react.default.createElement("div", {
      key: key,
      style: {
        paddingBottom: "1em"
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      key: key + "_label",
      style: {
        color: "grey",
        fontWeight: "bold",
        textAlign: "center"
      }
    }, key), paragraphs.map((p, i) => /*#__PURE__*/_react.default.createElement("p", {
      key: key + "_" + i
    }, p)));

    texts.push(field);
  }

  return texts;
};