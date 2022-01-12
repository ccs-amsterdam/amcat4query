"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Index;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _IndexCreate = _interopRequireDefault(require("./IndexCreate"));

var _IndexDelete = _interopRequireDefault(require("./IndexDelete"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Index(_ref) {
  let {
    amcat,
    index,
    setIndex,
    canCreate,
    canDelete
  } = _ref;
  const [options, setOptions] = (0, _react.useState)([]);
  (0, _react.useEffect)(() => {
    if (!amcat) {
      setIndex(null);
      setOptions([]);
    } else prepareOptions(amcat, setOptions);
  }, [amcat, setIndex]);
  if (!amcat) return null;
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      flex: "1 1 auto"
    }
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Dropdown, {
    placeholder: "select index",
    fluid: true,
    search: true,
    selection: true,
    value: index,
    options: options,
    onChange: (e, d) => setIndex(d.value)
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      flex: "0 1 auto"
    }
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button.Group, {
    style: {
      marginLeft: canDelete || canCreate ? "5px" : "0"
    }
  }, /*#__PURE__*/_react.default.createElement(IndexCreateButton, {
    amcat: amcat,
    canCreate: canCreate,
    setIndex: setIndex,
    setOptions: setOptions
  }), /*#__PURE__*/_react.default.createElement(IndexDeleteButton, {
    amcat: amcat,
    index: index,
    canDelete: canDelete,
    setIndex: setIndex,
    setOptions: setOptions
  }))));
}

const buttonStyle = {
  paddingLeft: "5px",
  paddingRight: "5px"
};

const IndexCreateButton = _ref2 => {
  let {
    amcat,
    canCreate,
    setIndex,
    setOptions
  } = _ref2;
  if (!canCreate) return null;

  const onCreate = name => {
    // when a new index is created, select it, and re-create options
    // (we could also directly change the options instead of calling API, but this seems safer)
    setIndex(name);
    prepareOptions(amcat, setOptions);
  };

  const CreateButton = /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    icon: "plus",
    style: buttonStyle
  });

  return /*#__PURE__*/_react.default.createElement(_IndexCreate.default, {
    amcat: amcat,
    button: CreateButton,
    onCreate: onCreate
  });
};

const IndexDeleteButton = _ref3 => {
  let {
    amcat,
    index,
    canDelete,
    setIndex,
    setOptions
  } = _ref3;
  if (!canDelete) return null;

  const onDelete = name => {
    // when a new index is delete, unselect it, and re-create options
    setIndex(null);
    prepareOptions(amcat, setOptions);
  };

  const DeleteButton = /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    disabled: !index,
    icon: "minus",
    style: buttonStyle
  });

  return /*#__PURE__*/_react.default.createElement(_IndexDelete.default, {
    amcat: amcat,
    index: index,
    button: DeleteButton,
    onDelete: onDelete
  });
};

const prepareOptions = async (amcat, setOptions) => {
  try {
    const res = await amcat.getIndices();
    const options = res.data.map(index => {
      console.log(index);
      return {
        key: index.name,
        value: index.name,
        text: index.name,
        description: index.role
      };
    });
    setOptions(options);
  } catch (e) {
    console.log(e);
    setOptions([]);
  }
};