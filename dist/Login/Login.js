"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Login;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.json.stringify.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.match.js");

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _reactCookie = require("react-cookie");

var _Amcat = _interopRequireWildcard(require("../apis/Amcat"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * An AmCAT login form.
 * @param {*} onLogin Returns an Amcat class instance on login, or null on logout
 * @returns
 */
function Login(_ref) {
  let {
    onLogin
  } = _ref;
  const [cookies, setCookies] = (0, _reactCookie.useCookies)(["amcat"]);
  const loggedIn = (0, _react.useRef)(false);
  const [pending, setPending] = (0, _react.useState)(true);
  const amcat = (0, _react.useMemo)(() => cookies.amcat || {
    host: "http://127.0.0.1:5000",
    email: "admin",
    token: null
  }, [cookies.amcat]);
  const setLogin = (0, _react.useCallback)(d => {
    loggedIn.current = true;
    setCookies("amcat", JSON.stringify(d), {
      path: "/"
    });
    if (onLogin) onLogin(new _Amcat.default(d.host, d.email, d.token));
    setPending(false);
  }, [onLogin, setCookies]);
  const setLogout = (0, _react.useCallback)(() => {
    loggedIn.current = false;
    setCookies("amcat", JSON.stringify(_objectSpread(_objectSpread({}, amcat), {}, {
      token: null
    })), {
      path: "/"
    });
    if (onLogin) onLogin(null);
    setPending(false);
  }, [amcat, onLogin, setCookies]);
  (0, _react.useEffect)(() => {
    if (!loggedIn.current && amcat.host && amcat.email && amcat.token) {
      const conn = new _Amcat.default(amcat.host, amcat.email, amcat.token);
      conn.getToken().then(res => {
        setLogin(_objectSpread(_objectSpread({}, amcat), {}, {
          token: res.data.token
        }));
      }).catch(e => {
        setLogout();
      });
      return null;
    }

    setPending(false);
  }, [amcat, setLogin, setLogout]); // if logged in, show log out

  if (pending) return null;
  if (loggedIn.current) return /*#__PURE__*/_react.default.createElement(SignOut, {
    amcat: amcat,
    setLogout: setLogout
  });
  return /*#__PURE__*/_react.default.createElement(SignIn, {
    amcat: amcat,
    setLogin: setLogin
  });
}

const SignOut = _ref2 => {
  let {
    amcat,
    setLogout
  } = _ref2;
  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    fluid: true,
    secondary: true,
    onClick: setLogout
  }, "Sign out from ", /*#__PURE__*/_react.default.createElement("span", {
    style: {
      color: "lightblue"
    }
  }, amcat.email));
};

const SignIn = _ref3 => {
  let {
    amcat,
    setLogin
  } = _ref3;
  const [host, setHost] = (0, _react.useState)("");
  const [email, setEmail] = (0, _react.useState)("");
  const [password, setPassword] = (0, _react.useState)("admin");
  const [invalidPassword, setInvalidPassword] = (0, _react.useState)(false);

  const tryPasswordLogin = async () => {
    setPassword("");

    try {
      const token = await (0, _Amcat.getToken)(host, email, password);
      setLogin({
        host,
        email,
        token
      });
    } catch (e) {
      setInvalidPassword(true);
      console.log(e);
    }
  };

  let emailError = !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (email === "admin") emailError = false;
  (0, _react.useEffect)(() => {
    if (amcat !== null && amcat !== void 0 && amcat.email) setEmail(amcat.email);
    if (amcat !== null && amcat !== void 0 && amcat.host) setHost(amcat.host);
  }, [amcat]);
  return /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form, {
    size: "large"
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Segment, {
    stacked: true
  }, /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Input, {
    fluid: true,
    placeholder: "Host",
    name: "host",
    label: "Host",
    value: host,
    onChange: (e, d) => {
      if (d.value.length < 100) setHost(d.value);
    },
    icon: "home",
    iconPosition: "left",
    autoFocus: true
  }), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Input, {
    fluid: true,
    placeholder: "email adress",
    error: emailError ? "Please enter a valid email adress" : false,
    name: "email",
    label: "Email",
    icon: "mail",
    iconPosition: "left",
    value: email,
    onChange: (e, d) => {
      if (d.value.length < 100) setEmail(d.value);
    }
  }), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Form.Input, {
    fluid: true,
    placeholder: "password",
    name: "password",
    error: invalidPassword ? "Invalid password for this host & email" : false,
    label: "Password",
    type: "password",
    icon: "lock",
    iconPosition: "left",
    value: password,
    onChange: (e, d) => {
      setInvalidPassword(false);
      setPassword(d.value);
    }
  }), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Button, {
    disabled: password.length === 0,
    primary: true,
    onClick: tryPasswordLogin,
    fluid: true,
    size: "large"
  }, "Sign in")), /*#__PURE__*/_react.default.createElement(_semanticUiReact.Message, null, "Don't have an account? pweh!"));
};