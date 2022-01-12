"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.getToken = getToken;

require("core-js/modules/es.promise.js");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Class for doing all stuff AmCAT
 */
class Amcat {
  constructor(host, email, token) {
    this.host = host;
    this.email = email;
    this.token = token;
    this.api = _axios.default.create({
      baseURL: host,
      headers: {
        Authorization: "Bearer ".concat(token)
      }
    });
  }

  serialize() {
    return {
      host: this.host,
      email: this.email,
      token: this.token
    };
  }

  static deserialize(obj) {
    return new Amcat(obj.host, obj.email, obj.token);
  } // GET


  getToken() {
    return this.api.get("/auth/token/");
  }

  getIndices() {
    return this.api.get("/index/");
  }

  getIndex(index) {
    return this.api.get("/index/".concat(index));
  }

  getFields(index) {
    return this.api.get("/index/".concat(index, "/fields"));
  }

  getFieldValues(index, field) {
    return this.api.get("/index/".concat(index, "/fields/").concat(field, "/values"));
  }

  getDocument(index, doc_id) {
    return this.api.get("/index/".concat(index, "/documents/").concat(doc_id));
  } // POST


  postQuery(index) {
    let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (filters) params["filters"] = filters;
    return this.api.post("/index/".concat(index, "/query"), _objectSpread({}, params));
  }

  createIndex(name) {
    let guestRole = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "NONE";
    const body = {
      name: name
    };
    if (guestRole !== "NONE") body.guest_role = guestRole;
    return this.api.post("/index/", body);
  }

  createDocuments(name, documents) {
    let columns = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    // documentList should be an array of objects with at least the fields title, date and text
    return this.api.post("/index/".concat(name, "/documents"), {
      documents,
      columns
    });
  } // DELETE


  deleteIndex(index) {
    return this.api.delete("/index/".concat(index));
  }

}
/**
 * Get AmCAT token
 * @param {*} host      The amcat Host adress
 * @param {*} email     User email
 * @param {*} password  User password
 * @returns
 */


exports.default = Amcat;

async function getToken(host, email, password) {
  const response = await _axios.default.get("".concat(host, "/auth/token/"), {
    auth: {
      username: email,
      password: password
    }
  });
  return response.data.token;
}