"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SubmitButton;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.reduce.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const REQUIRED_FIELDS = ["title", "date", "text"];

function SubmitButton(_ref) {
  let {
    amcat,
    index,
    data,
    columns,
    fields,
    fileRef
  } = _ref;
  const [loading, setLoading] = (0, _react.useState)(false);
  const [submittedMessage, setSubmittedMessage] = (0, _react.useState)(null);
  const notReady = !index || !columns || data.length <= 1 || columns.length !== data[0].data.length;
  if (notReady) return null;
  let newfields = new Set(); //let hasDuplicates = false;

  for (let column of columns) {
    //if (field.has(column.field)) hasDuplicates = true
    newfields.add(column.field);
  }

  const missingRequired = [];

  for (let required of REQUIRED_FIELDS) {
    if (!newfields.has(required)) missingRequired.push(required);
  }

  const onSubmit = async () => {
    const [documents, missing] = prepareData(data, columns);
    setLoading(true);

    try {
      const columnMapping = columns.reduce((mapping, column) => {
        if (column.type === "auto") return mapping;
        if (fields[column.name]) return mapping;
        mapping[column.name] = column.type;
        return mapping;
      }, {});
      const res = await amcat.createDocuments(index, documents, columnMapping);
      setLoading(false);
      setSubmittedMessage({
        missing,
        n: res.data.length
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const missingRequiredMessage = () => {
    if (missingRequired.length === 0) return null;
    return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Message, null, "Some required fields are not used: ", /*#__PURE__*/_react.default.createElement("b", null, missingRequired.join(", ")));
  };

  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Container, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Dimmer, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Loader, {
    active: loading
  })), missingRequiredMessage(), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    disabled: notReady || missingRequired.length > 0,
    fluid: true,
    onClick: onSubmit
  }, "Upload Articles"), /*#__PURE__*/_react.default.createElement(SubmittedMessage, {
    submittedMessage: submittedMessage,
    setSubmittedMessage: setSubmittedMessage,
    fileRef: fileRef
  }));
}

const SubmittedMessage = _ref2 => {
  let {
    submittedMessage,
    setSubmittedMessage,
    fileRef
  } = _ref2;
  if (!submittedMessage) return null;

  const ifMissingDate = () => {
    const n = submittedMessage.missing.date;
    if (n === 0) return;
    return /*#__PURE__*/_react.default.createElement("p", null, "Skipped ", /*#__PURE__*/_react.default.createElement("b", null, n), " article", n === 1 ? "" : "s", " because ", /*#__PURE__*/_react.default.createElement("i", null, "date"), " was missing");
  };

  const ifMissingTitle = () => {
    const n = submittedMessage.missing.title;
    if (n === 0) return null;
    return /*#__PURE__*/_react.default.createElement("p", null, "Replaced ", /*#__PURE__*/_react.default.createElement("b", null, n), " missing title", n === 1 ? "" : "s", " with \"NA\"");
  };

  const ifMissingText = () => {
    const n = submittedMessage.missing.text;
    if (n === 0) return null;
    return /*#__PURE__*/_react.default.createElement("p", null, "Replaced ", /*#__PURE__*/_react.default.createElement("b", null, n), " missing text", n === 1 ? "" : "s", " with \"NA\"");
  };

  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal, {
    open: true,
    onClose: () => {
      fileRef.current.removeFile();
      setSubmittedMessage(null);
    }
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Header, null, "Uploaded articles"), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Content, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Description, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Header, null, "Created ", /*#__PURE__*/_react.default.createElement("b", null, submittedMessage.n), " new articles"), ifMissingDate(), ifMissingTitle(), ifMissingText())), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Actions, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    content: "Cool, thanks",
    labelPosition: "right",
    icon: "checkmark",
    positive: true,
    onClick: () => {
      fileRef.current.removeFile();
      setSubmittedMessage(null);
    }
  })));
};

const prepareData = (data, columns) => {
  const fieldIndex = columns.reduce((obj, column, i) => {
    if (column.field) obj[column.field] = i;
    return obj;
  }, {});
  let missing = {
    date: 0,
    title: 0,
    text: 0
  };
  const rows = data.slice(1).reduce((rows, row, i) => {
    const datarow = Object.keys(fieldIndex).reduce((obj, field) => {
      obj[field] = row.data[fieldIndex[field]];
      return obj;
    }, {});

    if (!datarow["date"]) {
      missing.date += 1;
      return rows;
    }

    if (!datarow["title"]) {
      datarow["title"] = "NA";
      missing.title += 1;
    }

    if (!datarow["text"]) {
      datarow["text"] = "NA";
      missing.text += 1;
    }

    rows.push(datarow);
    return rows;
  }, []);
  return [rows, missing];
};