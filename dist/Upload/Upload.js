"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Upload;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _reactPapaparse = require("react-papaparse");

var _ImportTable = _interopRequireDefault(require("./ImportTable"));

var _SubmitButton = _interopRequireDefault(require("./SubmitButton"));

require("./uploadStyle.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Upload(_ref) {
  let {
    amcat,
    index
  } = _ref;
  const [data, setData] = (0, _react.useState)([]);
  const [columns, setColumns] = (0, _react.useState)(null);
  const [fields, setFields] = (0, _react.useState)(null);
  const fileRef = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    if (!data || data.length === 0) return;
    amcat.getFields(index).then(res => {
      setFields(res.data);
    }).catch(e => {
      setFields(null);
      console.log(e);
    });
  }, [amcat, index, data, setFields]);
  (0, _react.useEffect)(() => {
    if (!fields) return;
    if (data.length <= 1) return;
    const columns = data[0].data.map(name => {
      return {
        name,
        field: name,
        type: (fields === null || fields === void 0 ? void 0 : fields[name]) || "auto"
      };
    });
    setColumns(columns);
  }, [fields, data, setColumns, setFields]);
  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Container, null, /*#__PURE__*/_react.default.createElement(_reactPapaparse.CSVReader, {
    ref: fileRef,
    onFileLoad: data => setData(data),
    addRemoveButton: true,
    onRemoveFile: () => setData([])
  }, /*#__PURE__*/_react.default.createElement("span", null, "Click to upload")), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_ImportTable.default, {
    data: data,
    columns: columns,
    setColumns: setColumns,
    fields: fields
  }), /*#__PURE__*/_react.default.createElement(_SubmitButton.default, {
    amcat: amcat,
    index: index,
    data: data,
    columns: columns,
    fields: fields,
    fileRef: fileRef
  }));
}