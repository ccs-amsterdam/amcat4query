"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useFields;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = require("react");

function useFields(amcat, index) {
  const [fields, setFields] = (0, _react.useState)({});
  (0, _react.useEffect)(() => {
    if (index && amcat) {
      amcat.getFields(index).then(res => {
        setFields(res.data);
      }).catch(e => {
        setFields({});
      });
    } else {
      setFields({});
    }
  }, [amcat, index]);
  return fields;
}