"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AmcatAggregate", {
  enumerable: true,
  get: function get() {
    return _Aggregate.default;
  }
});
Object.defineProperty(exports, "AmcatArticles", {
  enumerable: true,
  get: function get() {
    return _Articles.default;
  }
});

var _Aggregate = _interopRequireDefault(require("./Aggregate/Aggregate"));

var _Articles = _interopRequireDefault(require("./Articles/Articles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }