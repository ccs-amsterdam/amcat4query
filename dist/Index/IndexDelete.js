"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IndexDelete;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function IndexDelete(_ref) {
  let {
    amcat,
    index,
    button,
    onDelete
  } = _ref;
  const [status, setStatus] = (0, _react.useState)("inactive");

  const onSubmit = event => {
    setStatus("pending");
    amcat.deleteIndex(index).then(res => {
      // maybe check for 201 before celebrating
      setStatus("inactive");
      onDelete(index);
    }).catch(e => {
      console.log(e);
      setStatus("error");
    });
  };

  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal, {
    closeIcon: true,
    open: status !== "inactive",
    trigger: button || /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
      disabled: !index,
      name: "delete index"
    }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
      name: "minus"
    }), " Delete Index"),
    onClose: () => {
      setStatus("inactive");
    },
    onOpen: () => {
      setStatus("awaiting input");
    }
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Header, {
    icon: "trash",
    content: "Delete Index ".concat(index)
  }), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Content, null, /*#__PURE__*/_react.default.createElement("p", null, "Do you really want to delete this Index?")), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Actions, null, status === "error" ? /*#__PURE__*/_react.default.createElement("div", null, "Could not delete index for a reason not yet covered in the error handling...") : null, status === "pending" ? /*#__PURE__*/_react.default.createElement(_semanticUiReact.Dimmer, {
    active: true,
    inverted: true
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Loader, {
    content: "Creating Index"
  })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    color: "red",
    onClick: onSubmit
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
    name: "remove"
  }), " No"), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    color: "green",
    onClick: onSubmit
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
    name: "checkmark"
  }), " Yes"))));
}