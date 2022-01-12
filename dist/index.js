"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Articles", {
  enumerable: true,
  get: function get() {
    return _Articles.default;
  }
});
Object.defineProperty(exports, "Query", {
  enumerable: true,
  get: function get() {
    return _Query.default;
  }
});

var _Articles = _interopRequireDefault(require("./Articles/Articles"));

var _Query = _interopRequireDefault(require("./Query/Query"));

var _Upload = _interopRequireDefault(require("./Upload/Upload"));

var _Login = _interopRequireDefault(require("./Login/Login"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }