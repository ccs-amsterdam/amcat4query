"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FilterButton;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function FilterButton(_ref) {
  let {
    field,
    content,
    icon,
    style,
    disabled,
    onlyContent,
    children
  } = _ref;
  const [open, setOpen] = (0, _react.useState)(false);

  const onClick = (e, d) => {
    e.preventDefault(); // for some obscure reason, everything goes to shit if this button is pressed

    setOpen(!open);
  };

  const popupStyle = {};

  if (onlyContent) {
    popupStyle.margin = "0";
    popupStyle.padding = "0";
  }

  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Popup, {
    open: open,
    onClose: () => setOpen(false),
    mouseLeaveDelay: 99999,
    style: popupStyle,
    trigger: /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
      fluid: true,
      disabled: disabled,
      onClick: onClick,
      style: _objectSpread(_objectSpread({}, style), {}, {
        textAlign: "center",
        padding: "10px 20px"
      })
    }, field ? /*#__PURE__*/_react.default.createElement("span", {
      style: {
        display: "inline-block",
        float: "left",
        color: "black",
        borderRadius: "0px",
        padding: "0px",
        margin: "0px 10px 0px -10px"
      }
    }, field) : null, icon ? /*#__PURE__*/_react.default.createElement(_semanticUiReact.Icon, {
      name: icon
    }) : null, content)
  }, children);
}