"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IndexCreate;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.match.js");

require("core-js/modules/es.string.trim.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// default roles
const guestRoles = [{
  key: 0,
  value: "NONE",
  text: "No access"
}, {
  key: 10,
  value: "METAREADER",
  text: "Meta-reader"
}, {
  key: 20,
  value: "READER",
  text: "Reader"
}, {
  key: 30,
  value: "WRITER",
  text: "Writer"
}, {
  key: 40,
  value: "ADMIN",
  text: "Admin"
}];
/**
 *
 * @param {*}        amcat    An Amcat connection, optained with the amcat4auth module
 * @param {*}        button   Optionally, JSX for a custom button (or anything clickable) that opens the modal
 * @param {function} onCreate Function called when new index is created. Argument is the name of the new index
 * @returns
 */

function IndexCreate(_ref) {
  let {
    amcat,
    button,
    onCreate
  } = _ref;
  const [modalStatus, setModalStatus] = (0, _react.useState)("inactive");
  const [newIndexName, setNewIndexName] = (0, _react.useState)("");
  const [guestRole, setGuestRole] = (0, _react.useState)("None");
  const [nameError, setNameError] = (0, _react.useState)("");

  const _onSubmit = async event => {
    event.preventDefault();

    try {
      await amcat.getIndex(newIndexName);
      setNameError("This index name already exists");
    } catch (e) {
      console.log("name doensnt yet exist, which is cool");
      console.log(e);
    }

    setModalStatus("pending");
    amcat.createIndex(newIndexName, guestRole).then(res => {
      // maybe check for 201 before celebrating
      setModalStatus("inactive");
      onCreate(newIndexName);
    }).catch(e => {
      console.log(e.message);
      console.log(e);
      setModalStatus("error");
    });
  };

  const validateName = name => {
    if (name.match(/[ "*|<>/?,A-Z]/)) {
      const invalid = name.match(/[ "*|<>/?]/gi);
      let uniqueInvalid = [...new Set(invalid)].map(c => c === " " ? "space" : c);
      if (name.match(/[A-Z]/)) uniqueInvalid.push("UPPERCASE");
      setNameError("Illegal symbols: ".concat(uniqueInvalid.join(" ")));
    } else {
      setNameError(null);
    }
  }; //if (!this.props.amcatIndices) return null;


  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal, {
    as: _semanticUiReact.Form,
    trigger: button || /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
      primary: true
    }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
      name: "plus"
    }), "Create new index"),
    onSubmit: e => _onSubmit(e),
    open: modalStatus !== "inactive",
    onClose: () => setModalStatus("inactive"),
    onOpen: () => {
      setNewIndexName("");
      setGuestRole("NONE");
      setModalStatus("awaiting input");
    },
    size: "tiny"
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Header, {
    icon: "pencil",
    content: "Create new index",
    as: "h2"
  }), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Content, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Group, null, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Input, {
    width: 12,
    label: "Name",
    required: true,
    type: "text",
    error: nameError ? nameError : null,
    value: newIndexName,
    onChange: (e, d) => {
      validateName(d.value);
      setNewIndexName(d.value.trim());
      setModalStatus("awaiting input");
    },
    placeholder: "Enter name"
  }), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("b", null, "Guest role"), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Input, {
    width: 4,
    label: "Name",
    as: _semanticUiReact.Dropdown,
    selection: true,
    value: guestRole,
    onChange: (e, d) => setGuestRole(d.value),
    options: guestRoles
  })))), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Modal.Actions, null, modalStatus === "error" ? /*#__PURE__*/_react.default.createElement("div", null, "Could not create index for a reason not yet covered in the error handling...") : null, modalStatus === "pending" ? /*#__PURE__*/_react.default.createElement(_semanticUiReact.Dimmer, {
    active: true,
    inverted: true
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Loader, {
    content: "Creating Index"
  })) : /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    type: "submit",
    color: "green",
    icon: "save",
    content: "Create"
  })));
}