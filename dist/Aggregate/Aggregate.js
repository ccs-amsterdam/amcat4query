"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Aggregate;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Aggregate(_ref) {
  let {
    amcat,
    index,
    query
  } = _ref;
  console.log(amcat);
  console.log(index);
  console.log(query);
  return /*#__PURE__*/_react.default.createElement("div", null, "Amcat aggregate");
}