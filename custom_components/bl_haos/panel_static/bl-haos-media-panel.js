var $a = { exports: {} }, di = {}, Ba = { exports: {} }, te = {};
var rc;
function Fd() {
  if (rc) return te;
  rc = 1;
  var w = /* @__PURE__ */ Symbol.for("react.element"), V = /* @__PURE__ */ Symbol.for("react.portal"), y = /* @__PURE__ */ Symbol.for("react.fragment"), pe = /* @__PURE__ */ Symbol.for("react.strict_mode"), ae = /* @__PURE__ */ Symbol.for("react.profiler"), me = /* @__PURE__ */ Symbol.for("react.provider"), he = /* @__PURE__ */ Symbol.for("react.context"), I = /* @__PURE__ */ Symbol.for("react.forward_ref"), U = /* @__PURE__ */ Symbol.for("react.suspense"), X = /* @__PURE__ */ Symbol.for("react.memo"), ve = /* @__PURE__ */ Symbol.for("react.lazy"), Z = Symbol.iterator;
  function J(c) {
    return c === null || typeof c != "object" ? null : (c = Z && c[Z] || c["@@iterator"], typeof c == "function" ? c : null);
  }
  var De = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, K = Object.assign, B = {};
  function ie(c, x, M) {
    this.props = c, this.context = x, this.refs = B, this.updater = M || De;
  }
  ie.prototype.isReactComponent = {}, ie.prototype.setState = function(c, x) {
    if (typeof c != "object" && typeof c != "function" && c != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, c, x, "setState");
  }, ie.prototype.forceUpdate = function(c) {
    this.updater.enqueueForceUpdate(this, c, "forceUpdate");
  };
  function ke() {
  }
  ke.prototype = ie.prototype;
  function $e(c, x, M) {
    this.props = c, this.context = x, this.refs = B, this.updater = M || De;
  }
  var Ie = $e.prototype = new ke();
  Ie.constructor = $e, K(Ie, ie.prototype), Ie.isPureReactComponent = !0;
  var de = Array.isArray, xe = Object.prototype.hasOwnProperty, Se = { current: null }, N = { key: !0, ref: !0, __self: !0, __source: !0 };
  function b(c, x, M) {
    var Q, Y = {}, G = null, re = null;
    if (x != null) for (Q in x.ref !== void 0 && (re = x.ref), x.key !== void 0 && (G = "" + x.key), x) xe.call(x, Q) && !N.hasOwnProperty(Q) && (Y[Q] = x[Q]);
    var oe = arguments.length - 2;
    if (oe === 1) Y.children = M;
    else if (1 < oe) {
      for (var ne = Array(oe), Ge = 0; Ge < oe; Ge++) ne[Ge] = arguments[Ge + 2];
      Y.children = ne;
    }
    if (c && c.defaultProps) for (Q in oe = c.defaultProps, oe) Y[Q] === void 0 && (Y[Q] = oe[Q]);
    return { $$typeof: w, type: c, key: G, ref: re, props: Y, _owner: Se.current };
  }
  function ye(c, x) {
    return { $$typeof: w, type: c.type, key: x, ref: c.ref, props: c.props, _owner: c._owner };
  }
  function se(c) {
    return typeof c == "object" && c !== null && c.$$typeof === w;
  }
  function Be(c) {
    var x = { "=": "=0", ":": "=2" };
    return "$" + c.replace(/[=:]/g, function(M) {
      return x[M];
    });
  }
  var dt = /\/+/g;
  function ot(c, x) {
    return typeof c == "object" && c !== null && c.key != null ? Be("" + c.key) : x.toString(36);
  }
  function qe(c, x, M, Q, Y) {
    var G = typeof c;
    (G === "undefined" || G === "boolean") && (c = null);
    var re = !1;
    if (c === null) re = !0;
    else switch (G) {
      case "string":
      case "number":
        re = !0;
        break;
      case "object":
        switch (c.$$typeof) {
          case w:
          case V:
            re = !0;
        }
    }
    if (re) return re = c, Y = Y(re), c = Q === "" ? "." + ot(re, 0) : Q, de(Y) ? (M = "", c != null && (M = c.replace(dt, "$&/") + "/"), qe(Y, x, M, "", function(Ge) {
      return Ge;
    })) : Y != null && (se(Y) && (Y = ye(Y, M + (!Y.key || re && re.key === Y.key ? "" : ("" + Y.key).replace(dt, "$&/") + "/") + c)), x.push(Y)), 1;
    if (re = 0, Q = Q === "" ? "." : Q + ":", de(c)) for (var oe = 0; oe < c.length; oe++) {
      G = c[oe];
      var ne = Q + ot(G, oe);
      re += qe(G, x, M, ne, Y);
    }
    else if (ne = J(c), typeof ne == "function") for (c = ne.call(c), oe = 0; !(G = c.next()).done; ) G = G.value, ne = Q + ot(G, oe++), re += qe(G, x, M, ne, Y);
    else if (G === "object") throw x = String(c), Error("Objects are not valid as a React child (found: " + (x === "[object Object]" ? "object with keys {" + Object.keys(c).join(", ") + "}" : x) + "). If you meant to render a collection of children, use an array instead.");
    return re;
  }
  function Xe(c, x, M) {
    if (c == null) return c;
    var Q = [], Y = 0;
    return qe(c, Q, "", "", function(G) {
      return x.call(M, G, Y++);
    }), Q;
  }
  function Pe(c) {
    if (c._status === -1) {
      var x = c._result;
      x = x(), x.then(function(M) {
        (c._status === 0 || c._status === -1) && (c._status = 1, c._result = M);
      }, function(M) {
        (c._status === 0 || c._status === -1) && (c._status = 2, c._result = M);
      }), c._status === -1 && (c._status = 0, c._result = x);
    }
    if (c._status === 1) return c._result.default;
    throw c._result;
  }
  var ue = { current: null }, P = { transition: null }, A = { ReactCurrentDispatcher: ue, ReactCurrentBatchConfig: P, ReactCurrentOwner: Se };
  return te.Children = { map: Xe, forEach: function(c, x, M) {
    Xe(c, function() {
      x.apply(this, arguments);
    }, M);
  }, count: function(c) {
    var x = 0;
    return Xe(c, function() {
      x++;
    }), x;
  }, toArray: function(c) {
    return Xe(c, function(x) {
      return x;
    }) || [];
  }, only: function(c) {
    if (!se(c)) throw Error("React.Children.only expected to receive a single React element child.");
    return c;
  } }, te.Component = ie, te.Fragment = y, te.Profiler = ae, te.PureComponent = $e, te.StrictMode = pe, te.Suspense = U, te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = A, te.cloneElement = function(c, x, M) {
    if (c == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + c + ".");
    var Q = K({}, c.props), Y = c.key, G = c.ref, re = c._owner;
    if (x != null) {
      if (x.ref !== void 0 && (G = x.ref, re = Se.current), x.key !== void 0 && (Y = "" + x.key), c.type && c.type.defaultProps) var oe = c.type.defaultProps;
      for (ne in x) xe.call(x, ne) && !N.hasOwnProperty(ne) && (Q[ne] = x[ne] === void 0 && oe !== void 0 ? oe[ne] : x[ne]);
    }
    var ne = arguments.length - 2;
    if (ne === 1) Q.children = M;
    else if (1 < ne) {
      oe = Array(ne);
      for (var Ge = 0; Ge < ne; Ge++) oe[Ge] = arguments[Ge + 2];
      Q.children = oe;
    }
    return { $$typeof: w, type: c.type, key: Y, ref: G, props: Q, _owner: re };
  }, te.createContext = function(c) {
    return c = { $$typeof: he, _currentValue: c, _currentValue2: c, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, c.Provider = { $$typeof: me, _context: c }, c.Consumer = c;
  }, te.createElement = b, te.createFactory = function(c) {
    var x = b.bind(null, c);
    return x.type = c, x;
  }, te.createRef = function() {
    return { current: null };
  }, te.forwardRef = function(c) {
    return { $$typeof: I, render: c };
  }, te.isValidElement = se, te.lazy = function(c) {
    return { $$typeof: ve, _payload: { _status: -1, _result: c }, _init: Pe };
  }, te.memo = function(c, x) {
    return { $$typeof: X, type: c, compare: x === void 0 ? null : x };
  }, te.startTransition = function(c) {
    var x = P.transition;
    P.transition = {};
    try {
      c();
    } finally {
      P.transition = x;
    }
  }, te.unstable_act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, te.useCallback = function(c, x) {
    return ue.current.useCallback(c, x);
  }, te.useContext = function(c) {
    return ue.current.useContext(c);
  }, te.useDebugValue = function() {
  }, te.useDeferredValue = function(c) {
    return ue.current.useDeferredValue(c);
  }, te.useEffect = function(c, x) {
    return ue.current.useEffect(c, x);
  }, te.useId = function() {
    return ue.current.useId();
  }, te.useImperativeHandle = function(c, x, M) {
    return ue.current.useImperativeHandle(c, x, M);
  }, te.useInsertionEffect = function(c, x) {
    return ue.current.useInsertionEffect(c, x);
  }, te.useLayoutEffect = function(c, x) {
    return ue.current.useLayoutEffect(c, x);
  }, te.useMemo = function(c, x) {
    return ue.current.useMemo(c, x);
  }, te.useReducer = function(c, x, M) {
    return ue.current.useReducer(c, x, M);
  }, te.useRef = function(c) {
    return ue.current.useRef(c);
  }, te.useState = function(c) {
    return ue.current.useState(c);
  }, te.useSyncExternalStore = function(c, x, M) {
    return ue.current.useSyncExternalStore(c, x, M);
  }, te.useTransition = function() {
    return ue.current.useTransition();
  }, te.version = "18.2.0", te;
}
var lc;
function Qa() {
  return lc || (lc = 1, Ba.exports = Fd()), Ba.exports;
}
var ic;
function $d() {
  if (ic) return di;
  ic = 1;
  var w = Qa(), V = /* @__PURE__ */ Symbol.for("react.element"), y = /* @__PURE__ */ Symbol.for("react.fragment"), pe = Object.prototype.hasOwnProperty, ae = w.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, me = { key: !0, ref: !0, __self: !0, __source: !0 };
  function he(I, U, X) {
    var ve, Z = {}, J = null, De = null;
    X !== void 0 && (J = "" + X), U.key !== void 0 && (J = "" + U.key), U.ref !== void 0 && (De = U.ref);
    for (ve in U) pe.call(U, ve) && !me.hasOwnProperty(ve) && (Z[ve] = U[ve]);
    if (I && I.defaultProps) for (ve in U = I.defaultProps, U) Z[ve] === void 0 && (Z[ve] = U[ve]);
    return { $$typeof: V, type: I, key: J, ref: De, props: Z, _owner: ae.current };
  }
  return di.Fragment = y, di.jsx = he, di.jsxs = he, di;
}
var oc;
function Bd() {
  return oc || (oc = 1, $a.exports = $d()), $a.exports;
}
var s = Bd(), g = Qa(), mo = {}, Ua = { exports: {} }, gt = {}, Wa = { exports: {} }, Ha = {};
var ac;
function Ud() {
  return ac || (ac = 1, (function(w) {
    function V(P, A) {
      var c = P.length;
      P.push(A);
      e: for (; 0 < c; ) {
        var x = c - 1 >>> 1, M = P[x];
        if (0 < ae(M, A)) P[x] = A, P[c] = M, c = x;
        else break e;
      }
    }
    function y(P) {
      return P.length === 0 ? null : P[0];
    }
    function pe(P) {
      if (P.length === 0) return null;
      var A = P[0], c = P.pop();
      if (c !== A) {
        P[0] = c;
        e: for (var x = 0, M = P.length, Q = M >>> 1; x < Q; ) {
          var Y = 2 * (x + 1) - 1, G = P[Y], re = Y + 1, oe = P[re];
          if (0 > ae(G, c)) re < M && 0 > ae(oe, G) ? (P[x] = oe, P[re] = c, x = re) : (P[x] = G, P[Y] = c, x = Y);
          else if (re < M && 0 > ae(oe, c)) P[x] = oe, P[re] = c, x = re;
          else break e;
        }
      }
      return A;
    }
    function ae(P, A) {
      var c = P.sortIndex - A.sortIndex;
      return c !== 0 ? c : P.id - A.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var me = performance;
      w.unstable_now = function() {
        return me.now();
      };
    } else {
      var he = Date, I = he.now();
      w.unstable_now = function() {
        return he.now() - I;
      };
    }
    var U = [], X = [], ve = 1, Z = null, J = 3, De = !1, K = !1, B = !1, ie = typeof setTimeout == "function" ? setTimeout : null, ke = typeof clearTimeout == "function" ? clearTimeout : null, $e = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Ie(P) {
      for (var A = y(X); A !== null; ) {
        if (A.callback === null) pe(X);
        else if (A.startTime <= P) pe(X), A.sortIndex = A.expirationTime, V(U, A);
        else break;
        A = y(X);
      }
    }
    function de(P) {
      if (B = !1, Ie(P), !K) if (y(U) !== null) K = !0, Pe(xe);
      else {
        var A = y(X);
        A !== null && ue(de, A.startTime - P);
      }
    }
    function xe(P, A) {
      K = !1, B && (B = !1, ke(b), b = -1), De = !0;
      var c = J;
      try {
        for (Ie(A), Z = y(U); Z !== null && (!(Z.expirationTime > A) || P && !Be()); ) {
          var x = Z.callback;
          if (typeof x == "function") {
            Z.callback = null, J = Z.priorityLevel;
            var M = x(Z.expirationTime <= A);
            A = w.unstable_now(), typeof M == "function" ? Z.callback = M : Z === y(U) && pe(U), Ie(A);
          } else pe(U);
          Z = y(U);
        }
        if (Z !== null) var Q = !0;
        else {
          var Y = y(X);
          Y !== null && ue(de, Y.startTime - A), Q = !1;
        }
        return Q;
      } finally {
        Z = null, J = c, De = !1;
      }
    }
    var Se = !1, N = null, b = -1, ye = 5, se = -1;
    function Be() {
      return !(w.unstable_now() - se < ye);
    }
    function dt() {
      if (N !== null) {
        var P = w.unstable_now();
        se = P;
        var A = !0;
        try {
          A = N(!0, P);
        } finally {
          A ? ot() : (Se = !1, N = null);
        }
      } else Se = !1;
    }
    var ot;
    if (typeof $e == "function") ot = function() {
      $e(dt);
    };
    else if (typeof MessageChannel < "u") {
      var qe = new MessageChannel(), Xe = qe.port2;
      qe.port1.onmessage = dt, ot = function() {
        Xe.postMessage(null);
      };
    } else ot = function() {
      ie(dt, 0);
    };
    function Pe(P) {
      N = P, Se || (Se = !0, ot());
    }
    function ue(P, A) {
      b = ie(function() {
        P(w.unstable_now());
      }, A);
    }
    w.unstable_IdlePriority = 5, w.unstable_ImmediatePriority = 1, w.unstable_LowPriority = 4, w.unstable_NormalPriority = 3, w.unstable_Profiling = null, w.unstable_UserBlockingPriority = 2, w.unstable_cancelCallback = function(P) {
      P.callback = null;
    }, w.unstable_continueExecution = function() {
      K || De || (K = !0, Pe(xe));
    }, w.unstable_forceFrameRate = function(P) {
      0 > P || 125 < P ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ye = 0 < P ? Math.floor(1e3 / P) : 5;
    }, w.unstable_getCurrentPriorityLevel = function() {
      return J;
    }, w.unstable_getFirstCallbackNode = function() {
      return y(U);
    }, w.unstable_next = function(P) {
      switch (J) {
        case 1:
        case 2:
        case 3:
          var A = 3;
          break;
        default:
          A = J;
      }
      var c = J;
      J = A;
      try {
        return P();
      } finally {
        J = c;
      }
    }, w.unstable_pauseExecution = function() {
    }, w.unstable_requestPaint = function() {
    }, w.unstable_runWithPriority = function(P, A) {
      switch (P) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          P = 3;
      }
      var c = J;
      J = P;
      try {
        return A();
      } finally {
        J = c;
      }
    }, w.unstable_scheduleCallback = function(P, A, c) {
      var x = w.unstable_now();
      switch (typeof c == "object" && c !== null ? (c = c.delay, c = typeof c == "number" && 0 < c ? x + c : x) : c = x, P) {
        case 1:
          var M = -1;
          break;
        case 2:
          M = 250;
          break;
        case 5:
          M = 1073741823;
          break;
        case 4:
          M = 1e4;
          break;
        default:
          M = 5e3;
      }
      return M = c + M, P = { id: ve++, callback: A, priorityLevel: P, startTime: c, expirationTime: M, sortIndex: -1 }, c > x ? (P.sortIndex = c, V(X, P), y(U) === null && P === y(X) && (B ? (ke(b), b = -1) : B = !0, ue(de, c - x))) : (P.sortIndex = M, V(U, P), K || De || (K = !0, Pe(xe))), P;
    }, w.unstable_shouldYield = Be, w.unstable_wrapCallback = function(P) {
      var A = J;
      return function() {
        var c = J;
        J = A;
        try {
          return P.apply(this, arguments);
        } finally {
          J = c;
        }
      };
    };
  })(Ha)), Ha;
}
var sc;
function Wd() {
  return sc || (sc = 1, Wa.exports = Ud()), Wa.exports;
}
var uc;
function Hd() {
  if (uc) return gt;
  uc = 1;
  var w = Qa(), V = Wd();
  function y(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var pe = /* @__PURE__ */ new Set(), ae = {};
  function me(e, t) {
    he(e, t), he(e + "Capture", t);
  }
  function he(e, t) {
    for (ae[e] = t, e = 0; e < t.length; e++) pe.add(t[e]);
  }
  var I = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), U = Object.prototype.hasOwnProperty, X = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, ve = {}, Z = {};
  function J(e) {
    return U.call(Z, e) ? !0 : U.call(ve, e) ? !1 : X.test(e) ? Z[e] = !0 : (ve[e] = !0, !1);
  }
  function De(e, t, n, r) {
    if (n !== null && n.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function K(e, t, n, r) {
    if (t === null || typeof t > "u" || De(e, t, n, r)) return !0;
    if (r) return !1;
    if (n !== null) switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
    return !1;
  }
  function B(e, t, n, r, l, i, o) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = o;
  }
  var ie = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    ie[e] = new B(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    ie[t] = new B(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    ie[e] = new B(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    ie[e] = new B(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    ie[e] = new B(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    ie[e] = new B(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    ie[e] = new B(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    ie[e] = new B(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    ie[e] = new B(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var ke = /[\-:]([a-z])/g;
  function $e(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      ke,
      $e
    );
    ie[t] = new B(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(ke, $e);
    ie[t] = new B(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(ke, $e);
    ie[t] = new B(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    ie[e] = new B(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), ie.xlinkHref = new B("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    ie[e] = new B(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Ie(e, t, n, r) {
    var l = ie.hasOwnProperty(t) ? ie[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (K(t, n, l, r) && (n = null), r || l === null ? J(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var de = w.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, xe = /* @__PURE__ */ Symbol.for("react.element"), Se = /* @__PURE__ */ Symbol.for("react.portal"), N = /* @__PURE__ */ Symbol.for("react.fragment"), b = /* @__PURE__ */ Symbol.for("react.strict_mode"), ye = /* @__PURE__ */ Symbol.for("react.profiler"), se = /* @__PURE__ */ Symbol.for("react.provider"), Be = /* @__PURE__ */ Symbol.for("react.context"), dt = /* @__PURE__ */ Symbol.for("react.forward_ref"), ot = /* @__PURE__ */ Symbol.for("react.suspense"), qe = /* @__PURE__ */ Symbol.for("react.suspense_list"), Xe = /* @__PURE__ */ Symbol.for("react.memo"), Pe = /* @__PURE__ */ Symbol.for("react.lazy"), ue = /* @__PURE__ */ Symbol.for("react.offscreen"), P = Symbol.iterator;
  function A(e) {
    return e === null || typeof e != "object" ? null : (e = P && e[P] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var c = Object.assign, x;
  function M(e) {
    if (x === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      x = t && t[1] || "";
    }
    return `
` + x + e;
  }
  var Q = !1;
  function Y(e, t) {
    if (!e || Q) return "";
    Q = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t) if (t = function() {
        throw Error();
      }, Object.defineProperty(t.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(t, []);
        } catch (h) {
          var r = h;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (h) {
          r = h;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (h) {
          r = h;
        }
        e();
      }
    } catch (h) {
      if (h && r && typeof h.stack == "string") {
        for (var l = h.stack.split(`
`), i = r.stack.split(`
`), o = l.length - 1, u = i.length - 1; 1 <= o && 0 <= u && l[o] !== i[u]; ) u--;
        for (; 1 <= o && 0 <= u; o--, u--) if (l[o] !== i[u]) {
          if (o !== 1 || u !== 1)
            do
              if (o--, u--, 0 > u || l[o] !== i[u]) {
                var d = `
` + l[o].replace(" at new ", " at ");
                return e.displayName && d.includes("<anonymous>") && (d = d.replace("<anonymous>", e.displayName)), d;
              }
            while (1 <= o && 0 <= u);
          break;
        }
      }
    } finally {
      Q = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? M(e) : "";
  }
  function G(e) {
    switch (e.tag) {
      case 5:
        return M(e.type);
      case 16:
        return M("Lazy");
      case 13:
        return M("Suspense");
      case 19:
        return M("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = Y(e.type, !1), e;
      case 11:
        return e = Y(e.type.render, !1), e;
      case 1:
        return e = Y(e.type, !0), e;
      default:
        return "";
    }
  }
  function re(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case N:
        return "Fragment";
      case Se:
        return "Portal";
      case ye:
        return "Profiler";
      case b:
        return "StrictMode";
      case ot:
        return "Suspense";
      case qe:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Be:
        return (e.displayName || "Context") + ".Consumer";
      case se:
        return (e._context.displayName || "Context") + ".Provider";
      case dt:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Xe:
        return t = e.displayName || null, t !== null ? t : re(e.type) || "Memo";
      case Pe:
        t = e._payload, e = e._init;
        try {
          return re(e(t));
        } catch {
        }
    }
    return null;
  }
  function oe(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (t.displayName || "Context") + ".Consumer";
      case 10:
        return (t._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return t;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return re(t);
      case 8:
        return t === b ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == "function") return t.displayName || t.name || null;
        if (typeof t == "string") return t;
    }
    return null;
  }
  function ne(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function Ge(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function _n(e) {
    var t = Ge(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var l = n.get, i = n.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return l.call(this);
      }, set: function(o) {
        r = "" + o, i.call(this, o);
      } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
        return r;
      }, setValue: function(o) {
        r = "" + o;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function wt(e) {
    e._valueTracker || (e._valueTracker = _n(e));
  }
  function Mr(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = Ge(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function ir(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function rn(e, t) {
    var n = t.checked;
    return c({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Mt(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = ne(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Ir(e, t) {
    t = t.checked, t != null && Ie(e, "checked", t, !1);
  }
  function It(e, t) {
    Ir(e, t);
    var n = ne(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Ar(e, t.type, n) : t.hasOwnProperty("defaultValue") && Ar(e, t.type, ne(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Or(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Ar(e, t, n) {
    (t !== "number" || ir(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var ft = Array.isArray;
  function bt(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + ne(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Cn(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(y(91));
    return c({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function xl(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(y(92));
        if (ft(n)) {
          if (1 < n.length) throw Error(y(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: ne(n) };
  }
  function En(e, t) {
    var n = ne(t.value), r = ne(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function Sl(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Nn(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function jn(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Nn(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var or, Pn = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (or = or || document.createElement("div"), or.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = or.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Ot(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var ln = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, pi = ["Webkit", "ms", "Moz", "O"];
  Object.keys(ln).forEach(function(e) {
    pi.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), ln[t] = ln[e];
    });
  });
  function Kt(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || ln.hasOwnProperty(e) && ln[e] ? ("" + t).trim() : t + "px";
  }
  function kl(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = Kt(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var _l = c({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function on(e, t) {
    if (t) {
      if (_l[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(y(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(y(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(y(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(y(62));
    }
  }
  function ar(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var sr = null;
  function an(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Oe = null, Yt = null, tt = null;
  function Fr(e) {
    if (e = Xl(e)) {
      if (typeof Oe != "function") throw Error(y(280));
      var t = e.stateNode;
      t && (t = Pi(t), Oe(e.stateNode, e.type, t));
    }
  }
  function at(e) {
    Yt ? tt ? tt.push(e) : tt = [e] : Yt = e;
  }
  function Cl() {
    if (Yt) {
      var e = Yt, t = tt;
      if (tt = Yt = null, Fr(e), t) for (e = 0; e < t.length; e++) Fr(t[e]);
    }
  }
  function qt(e, t) {
    return e(t);
  }
  function El() {
  }
  var Ae = !1;
  function Rn(e, t, n) {
    if (Ae) return e(t, n);
    Ae = !0;
    try {
      return qt(e, t, n);
    } finally {
      Ae = !1, (Yt !== null || tt !== null) && (El(), Cl());
    }
  }
  function ze(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = Pi(n);
    if (r === null) return null;
    n = r[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(y(231, t, typeof n));
    return n;
  }
  var ur = !1;
  if (I) try {
    var Ln = {};
    Object.defineProperty(Ln, "passive", { get: function() {
      ur = !0;
    } }), window.addEventListener("test", Ln, Ln), window.removeEventListener("test", Ln, Ln);
  } catch {
    ur = !1;
  }
  function $r(e, t, n, r, l, i, o, u, d) {
    var h = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, h);
    } catch (k) {
      this.onError(k);
    }
  }
  var zn = !1, jt = null, Br = !1, sn = null, Ur = { onError: function(e) {
    zn = !0, jt = e;
  } };
  function Wr(e, t, n, r, l, i, o, u, d) {
    zn = !1, jt = null, $r.apply(Ur, arguments);
  }
  function ho(e, t, n, r, l, i, o, u, d) {
    if (Wr.apply(this, arguments), zn) {
      if (zn) {
        var h = jt;
        zn = !1, jt = null;
      } else throw Error(y(198));
      Br || (Br = !0, sn = h);
    }
  }
  function At(e) {
    var t = e, n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (n = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function Tn(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function cr(e) {
    if (At(e) !== e) throw Error(y(188));
  }
  function dr(e) {
    var t = e.alternate;
    if (!t) {
      if (t = At(e), t === null) throw Error(y(188));
      return t !== e ? null : e;
    }
    for (var n = e, r = t; ; ) {
      var l = n.return;
      if (l === null) break;
      var i = l.alternate;
      if (i === null) {
        if (r = l.return, r !== null) {
          n = r;
          continue;
        }
        break;
      }
      if (l.child === i.child) {
        for (i = l.child; i; ) {
          if (i === n) return cr(l), e;
          if (i === r) return cr(l), t;
          i = i.sibling;
        }
        throw Error(y(188));
      }
      if (n.return !== r.return) n = l, r = i;
      else {
        for (var o = !1, u = l.child; u; ) {
          if (u === n) {
            o = !0, n = l, r = i;
            break;
          }
          if (u === r) {
            o = !0, r = l, n = i;
            break;
          }
          u = u.sibling;
        }
        if (!o) {
          for (u = i.child; u; ) {
            if (u === n) {
              o = !0, n = i, r = l;
              break;
            }
            if (u === r) {
              o = !0, r = i, n = l;
              break;
            }
            u = u.sibling;
          }
          if (!o) throw Error(y(189));
        }
      }
      if (n.alternate !== r) throw Error(y(190));
    }
    if (n.tag !== 3) throw Error(y(188));
    return n.stateNode.current === n ? e : t;
  }
  function Dn(e) {
    return e = dr(e), e !== null ? mi(e) : null;
  }
  function mi(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = mi(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Nl = V.unstable_scheduleCallback, fr = V.unstable_cancelCallback, jl = V.unstable_shouldYield, hi = V.unstable_requestPaint, Ce = V.unstable_now, Pl = V.unstable_getCurrentPriorityLevel, pr = V.unstable_ImmediatePriority, Rl = V.unstable_UserBlockingPriority, un = V.unstable_NormalPriority, Ll = V.unstable_LowPriority, mr = V.unstable_IdlePriority, cn = null, xt = null;
  function vo(e) {
    if (xt && typeof xt.onCommitFiberRoot == "function") try {
      xt.onCommitFiberRoot(cn, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var st = Math.clz32 ? Math.clz32 : Dl, zl = Math.log, Tl = Math.LN2;
  function Dl(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (zl(e) / Tl | 0) | 0;
  }
  var hr = 64, vr = 4194304;
  function Mn(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function yr(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, i = e.pingedLanes, o = n & 268435455;
    if (o !== 0) {
      var u = o & ~l;
      u !== 0 ? r = Mn(u) : (i &= o, i !== 0 && (r = Mn(i)));
    } else o = n & ~l, o !== 0 ? r = Mn(o) : i !== 0 && (r = Mn(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, i = t & -t, l >= i || l === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - st(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function vi(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function St(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var o = 31 - st(i), u = 1 << o, d = l[o];
      d === -1 ? ((u & n) === 0 || (u & r) !== 0) && (l[o] = vi(u, t)) : d <= t && (e.expiredLanes |= u), i &= ~u;
    }
  }
  function In(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function On() {
    var e = hr;
    return hr <<= 1, (hr & 4194240) === 0 && (hr = 64), e;
  }
  function Hr(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function kt(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - st(t), e[t] = n;
  }
  function An(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - st(n), i = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~i;
    }
  }
  function q(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - st(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var le = 0;
  function Ml(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Vr, Fn, gr, dn, wr, Ve = !1, xr = [], Ft = null, ee = null, $t = null, _t = /* @__PURE__ */ new Map(), Ue = /* @__PURE__ */ new Map(), ge = [], Il = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ol(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Ft = null;
        break;
      case "dragenter":
      case "dragleave":
        ee = null;
        break;
      case "mouseover":
      case "mouseout":
        $t = null;
        break;
      case "pointerover":
      case "pointerout":
        _t.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Ue.delete(t.pointerId);
    }
  }
  function $n(e, t, n, r, l, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = Xl(t), t !== null && Fn(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function fn(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Ft = $n(Ft, e, t, n, r, l), !0;
      case "dragenter":
        return ee = $n(ee, e, t, n, r, l), !0;
      case "mouseover":
        return $t = $n($t, e, t, n, r, l), !0;
      case "pointerover":
        var i = l.pointerId;
        return _t.set(i, $n(_t.get(i) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return i = l.pointerId, Ue.set(i, $n(Ue.get(i) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function Al(e) {
    var t = kr(e.target);
    if (t !== null) {
      var n = At(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = Tn(n), t !== null) {
            e.blockedOn = t, wr(e.priority, function() {
              gr(n);
            });
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Qr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = $l(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        sr = r, n.target.dispatchEvent(r), sr = null;
      } else return t = Xl(n), t !== null && Fn(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function yi(e, t, n) {
    Qr(e) && n.delete(t);
  }
  function br() {
    Ve = !1, Ft !== null && Qr(Ft) && (Ft = null), ee !== null && Qr(ee) && (ee = null), $t !== null && Qr($t) && ($t = null), _t.forEach(yi), Ue.forEach(yi);
  }
  function Bn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Ve || (Ve = !0, V.unstable_scheduleCallback(V.unstable_NormalPriority, br)));
  }
  function Un(e) {
    function t(l) {
      return Bn(l, e);
    }
    if (0 < xr.length) {
      Bn(xr[0], e);
      for (var n = 1; n < xr.length; n++) {
        var r = xr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Ft !== null && Bn(Ft, e), ee !== null && Bn(ee, e), $t !== null && Bn($t, e), _t.forEach(t), Ue.forEach(t), n = 0; n < ge.length; n++) r = ge[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < ge.length && (n = ge[0], n.blockedOn === null); ) Al(n), n.blockedOn === null && ge.shift();
  }
  var Wn = de.ReactCurrentBatchConfig, Kr = !0;
  function Xt(e, t, n, r) {
    var l = le, i = Wn.transition;
    Wn.transition = null;
    try {
      le = 1, Fl(e, t, n, r);
    } finally {
      le = l, Wn.transition = i;
    }
  }
  function Yr(e, t, n, r) {
    var l = le, i = Wn.transition;
    Wn.transition = null;
    try {
      le = 4, Fl(e, t, n, r);
    } finally {
      le = l, Wn.transition = i;
    }
  }
  function Fl(e, t, n, r) {
    if (Kr) {
      var l = $l(e, t, n, r);
      if (l === null) Ro(e, t, r, qr, n), Ol(e, r);
      else if (fn(l, e, t, n, r)) r.stopPropagation();
      else if (Ol(e, r), t & 4 && -1 < Il.indexOf(e)) {
        for (; l !== null; ) {
          var i = Xl(l);
          if (i !== null && Vr(i), i = $l(e, t, n, r), i === null && Ro(e, t, r, qr, n), i === l) break;
          l = i;
        }
        l !== null && r.stopPropagation();
      } else Ro(e, t, r, null, n);
    }
  }
  var qr = null;
  function $l(e, t, n, r) {
    if (qr = null, e = an(r), e = kr(e), e !== null) if (t = At(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = Tn(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return qr = e, null;
  }
  function gi(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Pl()) {
          case pr:
            return 1;
          case Rl:
            return 4;
          case un:
          case Ll:
            return 16;
          case mr:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Gt = null, Bl = null, Xr = null;
  function wi() {
    if (Xr) return Xr;
    var e, t = Bl, n = t.length, r, l = "value" in Gt ? Gt.value : Gt.textContent, i = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var o = n - e;
    for (r = 1; r <= o && t[n - r] === l[i - r]; r++) ;
    return Xr = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Sr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Gr() {
    return !0;
  }
  function xi() {
    return !1;
  }
  function Ze(e) {
    function t(n, r, l, i, o) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
      for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(i) : i[u]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Gr : xi, this.isPropagationStopped = xi, this;
    }
    return c(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Gr);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Gr);
    }, persist: function() {
    }, isPersistent: Gr }), t;
  }
  var pn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Zr = Ze(pn), Hn = c({}, pn, { view: 0, detail: 0 }), a = Ze(Hn), v, j, C, T = c({}, Hn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: go, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== C && (C && e.type === "mousemove" ? (v = e.screenX - C.screenX, j = e.screenY - C.screenY) : j = v = 0, C = e), v);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : j;
  } }), W = Ze(T), we = c({}, T, { dataTransfer: 0 }), Qe = Ze(we), yo = c({}, Hn, { relatedTarget: 0 }), mn = Ze(yo), hc = c({}, pn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), vc = Ze(hc), yc = c({}, pn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), gc = Ze(yc), wc = c({}, pn, { data: 0 }), ba = Ze(wc), xc = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Sc = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, kc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function _c(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = kc[e]) ? !!t[e] : !1;
  }
  function go() {
    return _c;
  }
  var Cc = c({}, Hn, { key: function(e) {
    if (e.key) {
      var t = xc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Sr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Sc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: go, charCode: function(e) {
    return e.type === "keypress" ? Sr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Sr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Ec = Ze(Cc), Nc = c({}, T, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Ka = Ze(Nc), jc = c({}, Hn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: go }), Pc = Ze(jc), Rc = c({}, pn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Lc = Ze(Rc), zc = c({}, T, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Tc = Ze(zc), Dc = [9, 13, 27, 32], wo = I && "CompositionEvent" in window, Ul = null;
  I && "documentMode" in document && (Ul = document.documentMode);
  var Mc = I && "TextEvent" in window && !Ul, Ya = I && (!wo || Ul && 8 < Ul && 11 >= Ul), qa = " ", Xa = !1;
  function Ga(e, t) {
    switch (e) {
      case "keyup":
        return Dc.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Za(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Jr = !1;
  function Ic(e, t) {
    switch (e) {
      case "compositionend":
        return Za(t);
      case "keypress":
        return t.which !== 32 ? null : (Xa = !0, qa);
      case "textInput":
        return e = t.data, e === qa && Xa ? null : e;
      default:
        return null;
    }
  }
  function Oc(e, t) {
    if (Jr) return e === "compositionend" || !wo && Ga(e, t) ? (e = wi(), Xr = Bl = Gt = null, Jr = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Ya && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Ac = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Ja(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Ac[e.type] : t === "textarea";
  }
  function es(e, t, n, r) {
    at(r), t = Ei(t, "onChange"), 0 < t.length && (n = new Zr("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var Wl = null, Hl = null;
  function Fc(e) {
    gs(e, 0);
  }
  function Si(e) {
    var t = ll(e);
    if (Mr(t)) return e;
  }
  function $c(e, t) {
    if (e === "change") return t;
  }
  var ts = !1;
  if (I) {
    var xo;
    if (I) {
      var So = "oninput" in document;
      if (!So) {
        var ns = document.createElement("div");
        ns.setAttribute("oninput", "return;"), So = typeof ns.oninput == "function";
      }
      xo = So;
    } else xo = !1;
    ts = xo && (!document.documentMode || 9 < document.documentMode);
  }
  function rs() {
    Wl && (Wl.detachEvent("onpropertychange", ls), Hl = Wl = null);
  }
  function ls(e) {
    if (e.propertyName === "value" && Si(Hl)) {
      var t = [];
      es(t, Hl, e, an(e)), Rn(Fc, t);
    }
  }
  function Bc(e, t, n) {
    e === "focusin" ? (rs(), Wl = t, Hl = n, Wl.attachEvent("onpropertychange", ls)) : e === "focusout" && rs();
  }
  function Uc(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Si(Hl);
  }
  function Wc(e, t) {
    if (e === "click") return Si(t);
  }
  function Hc(e, t) {
    if (e === "input" || e === "change") return Si(t);
  }
  function Vc(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Bt = typeof Object.is == "function" ? Object.is : Vc;
  function Vl(e, t) {
    if (Bt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!U.call(t, l) || !Bt(e[l], t[l])) return !1;
    }
    return !0;
  }
  function is(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function os(e, t) {
    var n = is(e);
    e = 0;
    for (var r; n; ) {
      if (n.nodeType === 3) {
        if (r = e + n.textContent.length, e <= t && r >= t) return { node: n, offset: t - e };
        e = r;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = is(n);
    }
  }
  function as(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? as(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ss() {
    for (var e = window, t = ir(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = ir(e.document);
    }
    return t;
  }
  function ko(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Qc(e) {
    var t = ss(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && as(n.ownerDocument.documentElement, n)) {
      if (r !== null && ko(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, i = Math.min(r.start, l);
          r = r.end === void 0 ? i : Math.min(r.end, l), !e.extend && i > r && (l = r, r = i, i = l), l = os(n, i);
          var o = os(
            n,
            r
          );
          l && o && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== o.node || e.focusOffset !== o.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), i > r ? (e.addRange(t), e.extend(o.node, o.offset)) : (t.setEnd(o.node, o.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var bc = I && "documentMode" in document && 11 >= document.documentMode, el = null, _o = null, Ql = null, Co = !1;
  function us(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Co || el == null || el !== ir(r) || (r = el, "selectionStart" in r && ko(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), Ql && Vl(Ql, r) || (Ql = r, r = Ei(_o, "onSelect"), 0 < r.length && (t = new Zr("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = el)));
  }
  function ki(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var tl = { animationend: ki("Animation", "AnimationEnd"), animationiteration: ki("Animation", "AnimationIteration"), animationstart: ki("Animation", "AnimationStart"), transitionend: ki("Transition", "TransitionEnd") }, Eo = {}, cs = {};
  I && (cs = document.createElement("div").style, "AnimationEvent" in window || (delete tl.animationend.animation, delete tl.animationiteration.animation, delete tl.animationstart.animation), "TransitionEvent" in window || delete tl.transitionend.transition);
  function _i(e) {
    if (Eo[e]) return Eo[e];
    if (!tl[e]) return e;
    var t = tl[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in cs) return Eo[e] = t[n];
    return e;
  }
  var ds = _i("animationend"), fs = _i("animationiteration"), ps = _i("animationstart"), ms = _i("transitionend"), hs = /* @__PURE__ */ new Map(), vs = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Vn(e, t) {
    hs.set(e, t), me(t, [e]);
  }
  for (var No = 0; No < vs.length; No++) {
    var jo = vs[No], Kc = jo.toLowerCase(), Yc = jo[0].toUpperCase() + jo.slice(1);
    Vn(Kc, "on" + Yc);
  }
  Vn(ds, "onAnimationEnd"), Vn(fs, "onAnimationIteration"), Vn(ps, "onAnimationStart"), Vn("dblclick", "onDoubleClick"), Vn("focusin", "onFocus"), Vn("focusout", "onBlur"), Vn(ms, "onTransitionEnd"), he("onMouseEnter", ["mouseout", "mouseover"]), he("onMouseLeave", ["mouseout", "mouseover"]), he("onPointerEnter", ["pointerout", "pointerover"]), he("onPointerLeave", ["pointerout", "pointerover"]), me("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), me("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), me("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), me("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), me("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), me("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var bl = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), qc = new Set("cancel close invalid load scroll toggle".split(" ").concat(bl));
  function ys(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, ho(r, t, void 0, e), e.currentTarget = null;
  }
  function gs(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var o = r.length - 1; 0 <= o; o--) {
          var u = r[o], d = u.instance, h = u.currentTarget;
          if (u = u.listener, d !== i && l.isPropagationStopped()) break e;
          ys(l, u, h), i = d;
        }
        else for (o = 0; o < r.length; o++) {
          if (u = r[o], d = u.instance, h = u.currentTarget, u = u.listener, d !== i && l.isPropagationStopped()) break e;
          ys(l, u, h), i = d;
        }
      }
    }
    if (Br) throw e = sn, Br = !1, sn = null, e;
  }
  function Ee(e, t) {
    var n = t[Io];
    n === void 0 && (n = t[Io] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (ws(t, e, 2, !1), n.add(r));
  }
  function Po(e, t, n) {
    var r = 0;
    t && (r |= 4), ws(n, e, r, t);
  }
  var Ci = "_reactListening" + Math.random().toString(36).slice(2);
  function Kl(e) {
    if (!e[Ci]) {
      e[Ci] = !0, pe.forEach(function(n) {
        n !== "selectionchange" && (qc.has(n) || Po(n, !1, e), Po(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Ci] || (t[Ci] = !0, Po("selectionchange", !1, t));
    }
  }
  function ws(e, t, n, r) {
    switch (gi(t)) {
      case 1:
        var l = Xt;
        break;
      case 4:
        l = Yr;
        break;
      default:
        l = Fl;
    }
    n = l.bind(null, t, n, e), l = void 0, !ur || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function Ro(e, t, n, r, l) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var u = r.stateNode.containerInfo;
        if (u === l || u.nodeType === 8 && u.parentNode === l) break;
        if (o === 4) for (o = r.return; o !== null; ) {
          var d = o.tag;
          if ((d === 3 || d === 4) && (d = o.stateNode.containerInfo, d === l || d.nodeType === 8 && d.parentNode === l)) return;
          o = o.return;
        }
        for (; u !== null; ) {
          if (o = kr(u), o === null) return;
          if (d = o.tag, d === 5 || d === 6) {
            r = i = o;
            continue e;
          }
          u = u.parentNode;
        }
      }
      r = r.return;
    }
    Rn(function() {
      var h = i, k = an(n), _ = [];
      e: {
        var S = hs.get(e);
        if (S !== void 0) {
          var R = Zr, z = e;
          switch (e) {
            case "keypress":
              if (Sr(n) === 0) break e;
            case "keydown":
            case "keyup":
              R = Ec;
              break;
            case "focusin":
              z = "focus", R = mn;
              break;
            case "focusout":
              z = "blur", R = mn;
              break;
            case "beforeblur":
            case "afterblur":
              R = mn;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              R = W;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              R = Qe;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              R = Pc;
              break;
            case ds:
            case fs:
            case ps:
              R = vc;
              break;
            case ms:
              R = Lc;
              break;
            case "scroll":
              R = a;
              break;
            case "wheel":
              R = Tc;
              break;
            case "copy":
            case "cut":
            case "paste":
              R = gc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              R = Ka;
          }
          var D = (t & 4) !== 0, Me = !D && e === "scroll", p = D ? S !== null ? S + "Capture" : null : S;
          D = [];
          for (var f = h, m; f !== null; ) {
            m = f;
            var E = m.stateNode;
            if (m.tag === 5 && E !== null && (m = E, p !== null && (E = ze(f, p), E != null && D.push(Yl(f, E, m)))), Me) break;
            f = f.return;
          }
          0 < D.length && (S = new R(S, z, null, n, k), _.push({ event: S, listeners: D }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (S = e === "mouseover" || e === "pointerover", R = e === "mouseout" || e === "pointerout", S && n !== sr && (z = n.relatedTarget || n.fromElement) && (kr(z) || z[hn])) break e;
          if ((R || S) && (S = k.window === k ? k : (S = k.ownerDocument) ? S.defaultView || S.parentWindow : window, R ? (z = n.relatedTarget || n.toElement, R = h, z = z ? kr(z) : null, z !== null && (Me = At(z), z !== Me || z.tag !== 5 && z.tag !== 6) && (z = null)) : (R = null, z = h), R !== z)) {
            if (D = W, E = "onMouseLeave", p = "onMouseEnter", f = "mouse", (e === "pointerout" || e === "pointerover") && (D = Ka, E = "onPointerLeave", p = "onPointerEnter", f = "pointer"), Me = R == null ? S : ll(R), m = z == null ? S : ll(z), S = new D(E, f + "leave", R, n, k), S.target = Me, S.relatedTarget = m, E = null, kr(k) === h && (D = new D(p, f + "enter", z, n, k), D.target = m, D.relatedTarget = Me, E = D), Me = E, R && z) t: {
              for (D = R, p = z, f = 0, m = D; m; m = nl(m)) f++;
              for (m = 0, E = p; E; E = nl(E)) m++;
              for (; 0 < f - m; ) D = nl(D), f--;
              for (; 0 < m - f; ) p = nl(p), m--;
              for (; f--; ) {
                if (D === p || p !== null && D === p.alternate) break t;
                D = nl(D), p = nl(p);
              }
              D = null;
            }
            else D = null;
            R !== null && xs(_, S, R, D, !1), z !== null && Me !== null && xs(_, Me, z, D, !0);
          }
        }
        e: {
          if (S = h ? ll(h) : window, R = S.nodeName && S.nodeName.toLowerCase(), R === "select" || R === "input" && S.type === "file") var O = $c;
          else if (Ja(S)) if (ts) O = Hc;
          else {
            O = Uc;
            var F = Bc;
          }
          else (R = S.nodeName) && R.toLowerCase() === "input" && (S.type === "checkbox" || S.type === "radio") && (O = Wc);
          if (O && (O = O(e, h))) {
            es(_, O, n, k);
            break e;
          }
          F && F(e, S, h), e === "focusout" && (F = S._wrapperState) && F.controlled && S.type === "number" && Ar(S, "number", S.value);
        }
        switch (F = h ? ll(h) : window, e) {
          case "focusin":
            (Ja(F) || F.contentEditable === "true") && (el = F, _o = h, Ql = null);
            break;
          case "focusout":
            Ql = _o = el = null;
            break;
          case "mousedown":
            Co = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Co = !1, us(_, n, k);
            break;
          case "selectionchange":
            if (bc) break;
          case "keydown":
          case "keyup":
            us(_, n, k);
        }
        var $;
        if (wo) e: {
          switch (e) {
            case "compositionstart":
              var H = "onCompositionStart";
              break e;
            case "compositionend":
              H = "onCompositionEnd";
              break e;
            case "compositionupdate":
              H = "onCompositionUpdate";
              break e;
          }
          H = void 0;
        }
        else Jr ? Ga(e, n) && (H = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (H = "onCompositionStart");
        H && (Ya && n.locale !== "ko" && (Jr || H !== "onCompositionStart" ? H === "onCompositionEnd" && Jr && ($ = wi()) : (Gt = k, Bl = "value" in Gt ? Gt.value : Gt.textContent, Jr = !0)), F = Ei(h, H), 0 < F.length && (H = new ba(H, e, null, n, k), _.push({ event: H, listeners: F }), $ ? H.data = $ : ($ = Za(n), $ !== null && (H.data = $)))), ($ = Mc ? Ic(e, n) : Oc(e, n)) && (h = Ei(h, "onBeforeInput"), 0 < h.length && (k = new ba("onBeforeInput", "beforeinput", null, n, k), _.push({ event: k, listeners: h }), k.data = $));
      }
      gs(_, t);
    });
  }
  function Yl(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function Ei(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, i = l.stateNode;
      l.tag === 5 && i !== null && (l = i, i = ze(e, n), i != null && r.unshift(Yl(e, i, l)), i = ze(e, t), i != null && r.push(Yl(e, i, l))), e = e.return;
    }
    return r;
  }
  function nl(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function xs(e, t, n, r, l) {
    for (var i = t._reactName, o = []; n !== null && n !== r; ) {
      var u = n, d = u.alternate, h = u.stateNode;
      if (d !== null && d === r) break;
      u.tag === 5 && h !== null && (u = h, l ? (d = ze(n, i), d != null && o.unshift(Yl(n, d, u))) : l || (d = ze(n, i), d != null && o.push(Yl(n, d, u)))), n = n.return;
    }
    o.length !== 0 && e.push({ event: t, listeners: o });
  }
  var Xc = /\r\n?/g, Gc = /\u0000|\uFFFD/g;
  function Ss(e) {
    return (typeof e == "string" ? e : "" + e).replace(Xc, `
`).replace(Gc, "");
  }
  function Ni(e, t, n) {
    if (t = Ss(t), Ss(e) !== t && n) throw Error(y(425));
  }
  function ji() {
  }
  var Lo = null, zo = null;
  function To(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Do = typeof setTimeout == "function" ? setTimeout : void 0, Zc = typeof clearTimeout == "function" ? clearTimeout : void 0, ks = typeof Promise == "function" ? Promise : void 0, Jc = typeof queueMicrotask == "function" ? queueMicrotask : typeof ks < "u" ? function(e) {
    return ks.resolve(null).then(e).catch(ed);
  } : Do;
  function ed(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Mo(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), Un(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    Un(t);
  }
  function Qn(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  function _s(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?") {
          if (t === 0) return e;
          t--;
        } else n === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var rl = Math.random().toString(36).slice(2), Zt = "__reactFiber$" + rl, ql = "__reactProps$" + rl, hn = "__reactContainer$" + rl, Io = "__reactEvents$" + rl, td = "__reactListeners$" + rl, nd = "__reactHandles$" + rl;
  function kr(e) {
    var t = e[Zt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[hn] || n[Zt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = _s(e); e !== null; ) {
          if (n = e[Zt]) return n;
          e = _s(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function Xl(e) {
    return e = e[Zt] || e[hn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function ll(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(y(33));
  }
  function Pi(e) {
    return e[ql] || null;
  }
  var Oo = [], il = -1;
  function bn(e) {
    return { current: e };
  }
  function Ne(e) {
    0 > il || (e.current = Oo[il], Oo[il] = null, il--);
  }
  function _e(e, t) {
    il++, Oo[il] = e.current, e.current = t;
  }
  var Kn = {}, nt = bn(Kn), pt = bn(!1), _r = Kn;
  function ol(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Kn;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, i;
    for (i in n) l[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function mt(e) {
    return e = e.childContextTypes, e != null;
  }
  function Ri() {
    Ne(pt), Ne(nt);
  }
  function Cs(e, t, n) {
    if (nt.current !== Kn) throw Error(y(168));
    _e(nt, t), _e(pt, n);
  }
  function Es(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(y(108, oe(e) || "Unknown", l));
    return c({}, n, r);
  }
  function Li(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Kn, _r = nt.current, _e(nt, e), _e(pt, pt.current), !0;
  }
  function Ns(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(y(169));
    n ? (e = Es(e, t, _r), r.__reactInternalMemoizedMergedChildContext = e, Ne(pt), Ne(nt), _e(nt, e)) : Ne(pt), _e(pt, n);
  }
  var vn = null, zi = !1, Ao = !1;
  function js(e) {
    vn === null ? vn = [e] : vn.push(e);
  }
  function rd(e) {
    zi = !0, js(e);
  }
  function Yn() {
    if (!Ao && vn !== null) {
      Ao = !0;
      var e = 0, t = le;
      try {
        var n = vn;
        for (le = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        vn = null, zi = !1;
      } catch (l) {
        throw vn !== null && (vn = vn.slice(e + 1)), Nl(pr, Yn), l;
      } finally {
        le = t, Ao = !1;
      }
    }
    return null;
  }
  var al = [], sl = 0, Ti = null, Di = 0, Pt = [], Rt = 0, Cr = null, yn = 1, gn = "";
  function Er(e, t) {
    al[sl++] = Di, al[sl++] = Ti, Ti = e, Di = t;
  }
  function Ps(e, t, n) {
    Pt[Rt++] = yn, Pt[Rt++] = gn, Pt[Rt++] = Cr, Cr = e;
    var r = yn;
    e = gn;
    var l = 32 - st(r) - 1;
    r &= ~(1 << l), n += 1;
    var i = 32 - st(t) + l;
    if (30 < i) {
      var o = l - l % 5;
      i = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, yn = 1 << 32 - st(t) + l | n << l | r, gn = i + e;
    } else yn = 1 << i | n << l | r, gn = e;
  }
  function Fo(e) {
    e.return !== null && (Er(e, 1), Ps(e, 1, 0));
  }
  function $o(e) {
    for (; e === Ti; ) Ti = al[--sl], al[sl] = null, Di = al[--sl], al[sl] = null;
    for (; e === Cr; ) Cr = Pt[--Rt], Pt[Rt] = null, gn = Pt[--Rt], Pt[Rt] = null, yn = Pt[--Rt], Pt[Rt] = null;
  }
  var Ct = null, Et = null, je = !1, Ut = null;
  function Rs(e, t) {
    var n = Dt(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function Ls(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, Ct = e, Et = Qn(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, Ct = e, Et = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = Cr !== null ? { id: yn, overflow: gn } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = Dt(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, Ct = e, Et = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Bo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Uo(e) {
    if (je) {
      var t = Et;
      if (t) {
        var n = t;
        if (!Ls(e, t)) {
          if (Bo(e)) throw Error(y(418));
          t = Qn(n.nextSibling);
          var r = Ct;
          t && Ls(e, t) ? Rs(r, n) : (e.flags = e.flags & -4097 | 2, je = !1, Ct = e);
        }
      } else {
        if (Bo(e)) throw Error(y(418));
        e.flags = e.flags & -4097 | 2, je = !1, Ct = e;
      }
    }
  }
  function zs(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    Ct = e;
  }
  function Mi(e) {
    if (e !== Ct) return !1;
    if (!je) return zs(e), je = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !To(e.type, e.memoizedProps)), t && (t = Et)) {
      if (Bo(e)) throw Ts(), Error(y(418));
      for (; t; ) Rs(e, t), t = Qn(t.nextSibling);
    }
    if (zs(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(y(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                Et = Qn(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        Et = null;
      }
    } else Et = Ct ? Qn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Ts() {
    for (var e = Et; e; ) e = Qn(e.nextSibling);
  }
  function ul() {
    Et = Ct = null, je = !1;
  }
  function Wo(e) {
    Ut === null ? Ut = [e] : Ut.push(e);
  }
  var ld = de.ReactCurrentBatchConfig;
  function Wt(e, t) {
    if (e && e.defaultProps) {
      t = c({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  var Ii = bn(null), Oi = null, cl = null, Ho = null;
  function Vo() {
    Ho = cl = Oi = null;
  }
  function Qo(e) {
    var t = Ii.current;
    Ne(Ii), e._currentValue = t;
  }
  function bo(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function dl(e, t) {
    Oi = e, Ho = cl = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (ht = !0), e.firstContext = null);
  }
  function Lt(e) {
    var t = e._currentValue;
    if (Ho !== e) if (e = { context: e, memoizedValue: t, next: null }, cl === null) {
      if (Oi === null) throw Error(y(308));
      cl = e, Oi.dependencies = { lanes: 0, firstContext: e };
    } else cl = cl.next = e;
    return t;
  }
  var Nr = null;
  function Ko(e) {
    Nr === null ? Nr = [e] : Nr.push(e);
  }
  function Ds(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Ko(t)) : (n.next = l.next, l.next = n), t.interleaved = n, wn(e, r);
  }
  function wn(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var qn = !1;
  function Yo(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Ms(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function xn(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Xn(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (ce & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, wn(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Ko(r)) : (t.next = l.next, l.next = t), r.interleaved = t, wn(e, n);
  }
  function Ai(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, q(e, n);
    }
  }
  function Is(e, t) {
    var n = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, n === r)) {
      var l = null, i = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var o = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
          i === null ? l = i = o : i = i.next = o, n = n.next;
        } while (n !== null);
        i === null ? l = i = t : i = i.next = t;
      } else l = i = t;
      n = { baseState: r.baseState, firstBaseUpdate: l, lastBaseUpdate: i, shared: r.shared, effects: r.effects }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  function Fi(e, t, n, r) {
    var l = e.updateQueue;
    qn = !1;
    var i = l.firstBaseUpdate, o = l.lastBaseUpdate, u = l.shared.pending;
    if (u !== null) {
      l.shared.pending = null;
      var d = u, h = d.next;
      d.next = null, o === null ? i = h : o.next = h, o = d;
      var k = e.alternate;
      k !== null && (k = k.updateQueue, u = k.lastBaseUpdate, u !== o && (u === null ? k.firstBaseUpdate = h : u.next = h, k.lastBaseUpdate = d));
    }
    if (i !== null) {
      var _ = l.baseState;
      o = 0, k = h = d = null, u = i;
      do {
        var S = u.lane, R = u.eventTime;
        if ((r & S) === S) {
          k !== null && (k = k.next = {
            eventTime: R,
            lane: 0,
            tag: u.tag,
            payload: u.payload,
            callback: u.callback,
            next: null
          });
          e: {
            var z = e, D = u;
            switch (S = t, R = n, D.tag) {
              case 1:
                if (z = D.payload, typeof z == "function") {
                  _ = z.call(R, _, S);
                  break e;
                }
                _ = z;
                break e;
              case 3:
                z.flags = z.flags & -65537 | 128;
              case 0:
                if (z = D.payload, S = typeof z == "function" ? z.call(R, _, S) : z, S == null) break e;
                _ = c({}, _, S);
                break e;
              case 2:
                qn = !0;
            }
          }
          u.callback !== null && u.lane !== 0 && (e.flags |= 64, S = l.effects, S === null ? l.effects = [u] : S.push(u));
        } else R = { eventTime: R, lane: S, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, k === null ? (h = k = R, d = _) : k = k.next = R, o |= S;
        if (u = u.next, u === null) {
          if (u = l.shared.pending, u === null) break;
          S = u, u = S.next, S.next = null, l.lastBaseUpdate = S, l.shared.pending = null;
        }
      } while (!0);
      if (k === null && (d = _), l.baseState = d, l.firstBaseUpdate = h, l.lastBaseUpdate = k, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          o |= l.lane, l = l.next;
        while (l !== t);
      } else i === null && (l.shared.lanes = 0);
      Rr |= o, e.lanes = o, e.memoizedState = _;
    }
  }
  function Os(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(y(191, l));
        l.call(r);
      }
    }
  }
  var As = new w.Component().refs;
  function qo(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : c({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var $i = { isMounted: function(e) {
    return (e = e._reactInternals) ? At(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = ct(), l = er(e), i = xn(r, l);
    i.payload = t, n != null && (i.callback = n), t = Xn(e, i, l), t !== null && (Qt(t, e, l, r), Ai(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = ct(), l = er(e), i = xn(r, l);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Xn(e, i, l), t !== null && (Qt(t, e, l, r), Ai(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = ct(), r = er(e), l = xn(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Xn(e, l, r), t !== null && (Qt(t, e, r, n), Ai(t, e, r));
  } };
  function Fs(e, t, n, r, l, i, o) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !Vl(n, r) || !Vl(l, i) : !0;
  }
  function $s(e, t, n) {
    var r = !1, l = Kn, i = t.contextType;
    return typeof i == "object" && i !== null ? i = Lt(i) : (l = mt(t) ? _r : nt.current, r = t.contextTypes, i = (r = r != null) ? ol(e, l) : Kn), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = $i, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function Bs(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && $i.enqueueReplaceState(t, t.state, null);
  }
  function Xo(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = As, Yo(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? l.context = Lt(i) : (i = mt(t) ? _r : nt.current, l.context = ol(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (qo(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && $i.enqueueReplaceState(l, l.state, null), Fi(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Gl(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(y(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(y(147, e));
        var l = r, i = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(o) {
          var u = l.refs;
          u === As && (u = l.refs = {}), o === null ? delete u[i] : u[i] = o;
        }, t._stringRef = i, t);
      }
      if (typeof e != "string") throw Error(y(284));
      if (!n._owner) throw Error(y(290, e));
    }
    return e;
  }
  function Bi(e, t) {
    throw e = Object.prototype.toString.call(t), Error(y(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Us(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Ws(e) {
    function t(p, f) {
      if (e) {
        var m = p.deletions;
        m === null ? (p.deletions = [f], p.flags |= 16) : m.push(f);
      }
    }
    function n(p, f) {
      if (!e) return null;
      for (; f !== null; ) t(p, f), f = f.sibling;
      return null;
    }
    function r(p, f) {
      for (p = /* @__PURE__ */ new Map(); f !== null; ) f.key !== null ? p.set(f.key, f) : p.set(f.index, f), f = f.sibling;
      return p;
    }
    function l(p, f) {
      return p = nr(p, f), p.index = 0, p.sibling = null, p;
    }
    function i(p, f, m) {
      return p.index = m, e ? (m = p.alternate, m !== null ? (m = m.index, m < f ? (p.flags |= 2, f) : m) : (p.flags |= 2, f)) : (p.flags |= 1048576, f);
    }
    function o(p) {
      return e && p.alternate === null && (p.flags |= 2), p;
    }
    function u(p, f, m, E) {
      return f === null || f.tag !== 6 ? (f = Da(m, p.mode, E), f.return = p, f) : (f = l(f, m), f.return = p, f);
    }
    function d(p, f, m, E) {
      var O = m.type;
      return O === N ? k(p, f, m.props.children, E, m.key) : f !== null && (f.elementType === O || typeof O == "object" && O !== null && O.$$typeof === Pe && Us(O) === f.type) ? (E = l(f, m.props), E.ref = Gl(p, f, m), E.return = p, E) : (E = io(m.type, m.key, m.props, null, p.mode, E), E.ref = Gl(p, f, m), E.return = p, E);
    }
    function h(p, f, m, E) {
      return f === null || f.tag !== 4 || f.stateNode.containerInfo !== m.containerInfo || f.stateNode.implementation !== m.implementation ? (f = Ma(m, p.mode, E), f.return = p, f) : (f = l(f, m.children || []), f.return = p, f);
    }
    function k(p, f, m, E, O) {
      return f === null || f.tag !== 7 ? (f = Dr(m, p.mode, E, O), f.return = p, f) : (f = l(f, m), f.return = p, f);
    }
    function _(p, f, m) {
      if (typeof f == "string" && f !== "" || typeof f == "number") return f = Da("" + f, p.mode, m), f.return = p, f;
      if (typeof f == "object" && f !== null) {
        switch (f.$$typeof) {
          case xe:
            return m = io(f.type, f.key, f.props, null, p.mode, m), m.ref = Gl(p, null, f), m.return = p, m;
          case Se:
            return f = Ma(f, p.mode, m), f.return = p, f;
          case Pe:
            var E = f._init;
            return _(p, E(f._payload), m);
        }
        if (ft(f) || A(f)) return f = Dr(f, p.mode, m, null), f.return = p, f;
        Bi(p, f);
      }
      return null;
    }
    function S(p, f, m, E) {
      var O = f !== null ? f.key : null;
      if (typeof m == "string" && m !== "" || typeof m == "number") return O !== null ? null : u(p, f, "" + m, E);
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case xe:
            return m.key === O ? d(p, f, m, E) : null;
          case Se:
            return m.key === O ? h(p, f, m, E) : null;
          case Pe:
            return O = m._init, S(
              p,
              f,
              O(m._payload),
              E
            );
        }
        if (ft(m) || A(m)) return O !== null ? null : k(p, f, m, E, null);
        Bi(p, m);
      }
      return null;
    }
    function R(p, f, m, E, O) {
      if (typeof E == "string" && E !== "" || typeof E == "number") return p = p.get(m) || null, u(f, p, "" + E, O);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case xe:
            return p = p.get(E.key === null ? m : E.key) || null, d(f, p, E, O);
          case Se:
            return p = p.get(E.key === null ? m : E.key) || null, h(f, p, E, O);
          case Pe:
            var F = E._init;
            return R(p, f, m, F(E._payload), O);
        }
        if (ft(E) || A(E)) return p = p.get(m) || null, k(f, p, E, O, null);
        Bi(f, E);
      }
      return null;
    }
    function z(p, f, m, E) {
      for (var O = null, F = null, $ = f, H = f = 0, Ye = null; $ !== null && H < m.length; H++) {
        $.index > H ? (Ye = $, $ = null) : Ye = $.sibling;
        var fe = S(p, $, m[H], E);
        if (fe === null) {
          $ === null && ($ = Ye);
          break;
        }
        e && $ && fe.alternate === null && t(p, $), f = i(fe, f, H), F === null ? O = fe : F.sibling = fe, F = fe, $ = Ye;
      }
      if (H === m.length) return n(p, $), je && Er(p, H), O;
      if ($ === null) {
        for (; H < m.length; H++) $ = _(p, m[H], E), $ !== null && (f = i($, f, H), F === null ? O = $ : F.sibling = $, F = $);
        return je && Er(p, H), O;
      }
      for ($ = r(p, $); H < m.length; H++) Ye = R($, p, H, m[H], E), Ye !== null && (e && Ye.alternate !== null && $.delete(Ye.key === null ? H : Ye.key), f = i(Ye, f, H), F === null ? O = Ye : F.sibling = Ye, F = Ye);
      return e && $.forEach(function(rr) {
        return t(p, rr);
      }), je && Er(p, H), O;
    }
    function D(p, f, m, E) {
      var O = A(m);
      if (typeof O != "function") throw Error(y(150));
      if (m = O.call(m), m == null) throw Error(y(151));
      for (var F = O = null, $ = f, H = f = 0, Ye = null, fe = m.next(); $ !== null && !fe.done; H++, fe = m.next()) {
        $.index > H ? (Ye = $, $ = null) : Ye = $.sibling;
        var rr = S(p, $, fe.value, E);
        if (rr === null) {
          $ === null && ($ = Ye);
          break;
        }
        e && $ && rr.alternate === null && t(p, $), f = i(rr, f, H), F === null ? O = rr : F.sibling = rr, F = rr, $ = Ye;
      }
      if (fe.done) return n(
        p,
        $
      ), je && Er(p, H), O;
      if ($ === null) {
        for (; !fe.done; H++, fe = m.next()) fe = _(p, fe.value, E), fe !== null && (f = i(fe, f, H), F === null ? O = fe : F.sibling = fe, F = fe);
        return je && Er(p, H), O;
      }
      for ($ = r(p, $); !fe.done; H++, fe = m.next()) fe = R($, p, H, fe.value, E), fe !== null && (e && fe.alternate !== null && $.delete(fe.key === null ? H : fe.key), f = i(fe, f, H), F === null ? O = fe : F.sibling = fe, F = fe);
      return e && $.forEach(function(Ad) {
        return t(p, Ad);
      }), je && Er(p, H), O;
    }
    function Me(p, f, m, E) {
      if (typeof m == "object" && m !== null && m.type === N && m.key === null && (m = m.props.children), typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case xe:
            e: {
              for (var O = m.key, F = f; F !== null; ) {
                if (F.key === O) {
                  if (O = m.type, O === N) {
                    if (F.tag === 7) {
                      n(p, F.sibling), f = l(F, m.props.children), f.return = p, p = f;
                      break e;
                    }
                  } else if (F.elementType === O || typeof O == "object" && O !== null && O.$$typeof === Pe && Us(O) === F.type) {
                    n(p, F.sibling), f = l(F, m.props), f.ref = Gl(p, F, m), f.return = p, p = f;
                    break e;
                  }
                  n(p, F);
                  break;
                } else t(p, F);
                F = F.sibling;
              }
              m.type === N ? (f = Dr(m.props.children, p.mode, E, m.key), f.return = p, p = f) : (E = io(m.type, m.key, m.props, null, p.mode, E), E.ref = Gl(p, f, m), E.return = p, p = E);
            }
            return o(p);
          case Se:
            e: {
              for (F = m.key; f !== null; ) {
                if (f.key === F) if (f.tag === 4 && f.stateNode.containerInfo === m.containerInfo && f.stateNode.implementation === m.implementation) {
                  n(p, f.sibling), f = l(f, m.children || []), f.return = p, p = f;
                  break e;
                } else {
                  n(p, f);
                  break;
                }
                else t(p, f);
                f = f.sibling;
              }
              f = Ma(m, p.mode, E), f.return = p, p = f;
            }
            return o(p);
          case Pe:
            return F = m._init, Me(p, f, F(m._payload), E);
        }
        if (ft(m)) return z(p, f, m, E);
        if (A(m)) return D(p, f, m, E);
        Bi(p, m);
      }
      return typeof m == "string" && m !== "" || typeof m == "number" ? (m = "" + m, f !== null && f.tag === 6 ? (n(p, f.sibling), f = l(f, m), f.return = p, p = f) : (n(p, f), f = Da(m, p.mode, E), f.return = p, p = f), o(p)) : n(p, f);
    }
    return Me;
  }
  var fl = Ws(!0), Hs = Ws(!1), Zl = {}, Jt = bn(Zl), Jl = bn(Zl), ei = bn(Zl);
  function jr(e) {
    if (e === Zl) throw Error(y(174));
    return e;
  }
  function Go(e, t) {
    switch (_e(ei, t), _e(Jl, e), _e(Jt, Zl), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : jn(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = jn(t, e);
    }
    Ne(Jt), _e(Jt, t);
  }
  function pl() {
    Ne(Jt), Ne(Jl), Ne(ei);
  }
  function Vs(e) {
    jr(ei.current);
    var t = jr(Jt.current), n = jn(t, e.type);
    t !== n && (_e(Jl, e), _e(Jt, n));
  }
  function Zo(e) {
    Jl.current === e && (Ne(Jt), Ne(Jl));
  }
  var Re = bn(0);
  function Ui(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Jo = [];
  function ea() {
    for (var e = 0; e < Jo.length; e++) Jo[e]._workInProgressVersionPrimary = null;
    Jo.length = 0;
  }
  var Wi = de.ReactCurrentDispatcher, ta = de.ReactCurrentBatchConfig, Pr = 0, Le = null, We = null, be = null, Hi = !1, ti = !1, ni = 0, id = 0;
  function rt() {
    throw Error(y(321));
  }
  function na(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!Bt(e[n], t[n])) return !1;
    return !0;
  }
  function ra(e, t, n, r, l, i) {
    if (Pr = i, Le = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Wi.current = e === null || e.memoizedState === null ? ud : cd, e = n(r, l), ti) {
      i = 0;
      do {
        if (ti = !1, ni = 0, 25 <= i) throw Error(y(301));
        i += 1, be = We = null, t.updateQueue = null, Wi.current = dd, e = n(r, l);
      } while (ti);
    }
    if (Wi.current = bi, t = We !== null && We.next !== null, Pr = 0, be = We = Le = null, Hi = !1, t) throw Error(y(300));
    return e;
  }
  function la() {
    var e = ni !== 0;
    return ni = 0, e;
  }
  function en() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return be === null ? Le.memoizedState = be = e : be = be.next = e, be;
  }
  function zt() {
    if (We === null) {
      var e = Le.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = We.next;
    var t = be === null ? Le.memoizedState : be.next;
    if (t !== null) be = t, We = e;
    else {
      if (e === null) throw Error(y(310));
      We = e, e = { memoizedState: We.memoizedState, baseState: We.baseState, baseQueue: We.baseQueue, queue: We.queue, next: null }, be === null ? Le.memoizedState = be = e : be = be.next = e;
    }
    return be;
  }
  function ri(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ia(e) {
    var t = zt(), n = t.queue;
    if (n === null) throw Error(y(311));
    n.lastRenderedReducer = e;
    var r = We, l = r.baseQueue, i = n.pending;
    if (i !== null) {
      if (l !== null) {
        var o = l.next;
        l.next = i.next, i.next = o;
      }
      r.baseQueue = l = i, n.pending = null;
    }
    if (l !== null) {
      i = l.next, r = r.baseState;
      var u = o = null, d = null, h = i;
      do {
        var k = h.lane;
        if ((Pr & k) === k) d !== null && (d = d.next = { lane: 0, action: h.action, hasEagerState: h.hasEagerState, eagerState: h.eagerState, next: null }), r = h.hasEagerState ? h.eagerState : e(r, h.action);
        else {
          var _ = {
            lane: k,
            action: h.action,
            hasEagerState: h.hasEagerState,
            eagerState: h.eagerState,
            next: null
          };
          d === null ? (u = d = _, o = r) : d = d.next = _, Le.lanes |= k, Rr |= k;
        }
        h = h.next;
      } while (h !== null && h !== i);
      d === null ? o = r : d.next = u, Bt(r, t.memoizedState) || (ht = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = d, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        i = l.lane, Le.lanes |= i, Rr |= i, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function oa(e) {
    var t = zt(), n = t.queue;
    if (n === null) throw Error(y(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, i = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var o = l = l.next;
      do
        i = e(i, o.action), o = o.next;
      while (o !== l);
      Bt(i, t.memoizedState) || (ht = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
    }
    return [i, r];
  }
  function Qs() {
  }
  function bs(e, t) {
    var n = Le, r = zt(), l = t(), i = !Bt(r.memoizedState, l);
    if (i && (r.memoizedState = l, ht = !0), r = r.queue, aa(qs.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || be !== null && be.memoizedState.tag & 1) {
      if (n.flags |= 2048, li(9, Ys.bind(null, n, r, l, t), void 0, null), Ke === null) throw Error(y(349));
      (Pr & 30) !== 0 || Ks(n, t, l);
    }
    return l;
  }
  function Ks(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Le.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Le.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Ys(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Xs(t) && Gs(e);
  }
  function qs(e, t, n) {
    return n(function() {
      Xs(t) && Gs(e);
    });
  }
  function Xs(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Bt(e, n);
    } catch {
      return !0;
    }
  }
  function Gs(e) {
    var t = wn(e, 1);
    t !== null && Qt(t, e, 1, -1);
  }
  function Zs(e) {
    var t = en();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: ri, lastRenderedState: e }, t.queue = e, e = e.dispatch = sd.bind(null, Le, e), [t.memoizedState, e];
  }
  function li(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Le.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Le.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Js() {
    return zt().memoizedState;
  }
  function Vi(e, t, n, r) {
    var l = en();
    Le.flags |= e, l.memoizedState = li(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function Qi(e, t, n, r) {
    var l = zt();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (We !== null) {
      var o = We.memoizedState;
      if (i = o.destroy, r !== null && na(r, o.deps)) {
        l.memoizedState = li(t, n, i, r);
        return;
      }
    }
    Le.flags |= e, l.memoizedState = li(1 | t, n, i, r);
  }
  function eu(e, t) {
    return Vi(8390656, 8, e, t);
  }
  function aa(e, t) {
    return Qi(2048, 8, e, t);
  }
  function tu(e, t) {
    return Qi(4, 2, e, t);
  }
  function nu(e, t) {
    return Qi(4, 4, e, t);
  }
  function ru(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function lu(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Qi(4, 4, ru.bind(null, t, e), n);
  }
  function sa() {
  }
  function iu(e, t) {
    var n = zt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && na(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function ou(e, t) {
    var n = zt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && na(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function au(e, t, n) {
    return (Pr & 21) === 0 ? (e.baseState && (e.baseState = !1, ht = !0), e.memoizedState = n) : (Bt(n, t) || (n = On(), Le.lanes |= n, Rr |= n, e.baseState = !0), t);
  }
  function od(e, t) {
    var n = le;
    le = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = ta.transition;
    ta.transition = {};
    try {
      e(!1), t();
    } finally {
      le = n, ta.transition = r;
    }
  }
  function su() {
    return zt().memoizedState;
  }
  function ad(e, t, n) {
    var r = er(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, uu(e)) cu(t, n);
    else if (n = Ds(e, t, n, r), n !== null) {
      var l = ct();
      Qt(n, e, r, l), du(n, t, r);
    }
  }
  function sd(e, t, n) {
    var r = er(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (uu(e)) cu(t, l);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var o = t.lastRenderedState, u = i(o, n);
        if (l.hasEagerState = !0, l.eagerState = u, Bt(u, o)) {
          var d = t.interleaved;
          d === null ? (l.next = l, Ko(t)) : (l.next = d.next, d.next = l), t.interleaved = l;
          return;
        }
      } catch {
      }
      n = Ds(e, t, l, r), n !== null && (l = ct(), Qt(n, e, r, l), du(n, t, r));
    }
  }
  function uu(e) {
    var t = e.alternate;
    return e === Le || t !== null && t === Le;
  }
  function cu(e, t) {
    ti = Hi = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function du(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, q(e, n);
    }
  }
  var bi = { readContext: Lt, useCallback: rt, useContext: rt, useEffect: rt, useImperativeHandle: rt, useInsertionEffect: rt, useLayoutEffect: rt, useMemo: rt, useReducer: rt, useRef: rt, useState: rt, useDebugValue: rt, useDeferredValue: rt, useTransition: rt, useMutableSource: rt, useSyncExternalStore: rt, useId: rt, unstable_isNewReconciler: !1 }, ud = { readContext: Lt, useCallback: function(e, t) {
    return en().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: Lt, useEffect: eu, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Vi(
      4194308,
      4,
      ru.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return Vi(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return Vi(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = en();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = en();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = ad.bind(null, Le, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = en();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Zs, useDebugValue: sa, useDeferredValue: function(e) {
    return en().memoizedState = e;
  }, useTransition: function() {
    var e = Zs(!1), t = e[0];
    return e = od.bind(null, e[1]), en().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = Le, l = en();
    if (je) {
      if (n === void 0) throw Error(y(407));
      n = n();
    } else {
      if (n = t(), Ke === null) throw Error(y(349));
      (Pr & 30) !== 0 || Ks(r, t, n);
    }
    l.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return l.queue = i, eu(qs.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, li(9, Ys.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = en(), t = Ke.identifierPrefix;
    if (je) {
      var n = gn, r = yn;
      n = (r & ~(1 << 32 - st(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = ni++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = id++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, cd = {
    readContext: Lt,
    useCallback: iu,
    useContext: Lt,
    useEffect: aa,
    useImperativeHandle: lu,
    useInsertionEffect: tu,
    useLayoutEffect: nu,
    useMemo: ou,
    useReducer: ia,
    useRef: Js,
    useState: function() {
      return ia(ri);
    },
    useDebugValue: sa,
    useDeferredValue: function(e) {
      var t = zt();
      return au(t, We.memoizedState, e);
    },
    useTransition: function() {
      var e = ia(ri)[0], t = zt().memoizedState;
      return [e, t];
    },
    useMutableSource: Qs,
    useSyncExternalStore: bs,
    useId: su,
    unstable_isNewReconciler: !1
  }, dd = { readContext: Lt, useCallback: iu, useContext: Lt, useEffect: aa, useImperativeHandle: lu, useInsertionEffect: tu, useLayoutEffect: nu, useMemo: ou, useReducer: oa, useRef: Js, useState: function() {
    return oa(ri);
  }, useDebugValue: sa, useDeferredValue: function(e) {
    var t = zt();
    return We === null ? t.memoizedState = e : au(t, We.memoizedState, e);
  }, useTransition: function() {
    var e = oa(ri)[0], t = zt().memoizedState;
    return [e, t];
  }, useMutableSource: Qs, useSyncExternalStore: bs, useId: su, unstable_isNewReconciler: !1 };
  function ml(e, t) {
    try {
      var n = "", r = t;
      do
        n += G(r), r = r.return;
      while (r);
      var l = n;
    } catch (i) {
      l = `
Error generating stack: ` + i.message + `
` + i.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function ua(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function ca(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var fd = typeof WeakMap == "function" ? WeakMap : Map;
  function fu(e, t, n) {
    n = xn(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Ji || (Ji = !0, Ea = r), ca(e, t);
    }, n;
  }
  function pu(e, t, n) {
    n = xn(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        ca(e, t);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
      ca(e, t), typeof r != "function" && (Zn === null ? Zn = /* @__PURE__ */ new Set([this]) : Zn.add(this));
      var o = t.stack;
      this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
    }), n;
  }
  function mu(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new fd();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = Nd.bind(null, e, t, n), t.then(e, e));
  }
  function hu(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function vu(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = xn(-1, 1), t.tag = 2, Xn(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var pd = de.ReactCurrentOwner, ht = !1;
  function ut(e, t, n, r) {
    t.child = e === null ? Hs(t, null, n, r) : fl(t, e.child, n, r);
  }
  function yu(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return dl(t, l), r = ra(e, t, n, r, i, l), n = la(), e !== null && !ht ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Sn(e, t, l)) : (je && n && Fo(t), t.flags |= 1, ut(e, t, r, l), t.child);
  }
  function gu(e, t, n, r, l) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !Ta(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, wu(e, t, i, r, l)) : (e = io(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & l) === 0) {
      var o = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : Vl, n(o, r) && e.ref === t.ref) return Sn(e, t, l);
    }
    return t.flags |= 1, e = nr(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function wu(e, t, n, r, l) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (Vl(i, r) && e.ref === t.ref) if (ht = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (ht = !0);
      else return t.lanes = e.lanes, Sn(e, t, l);
    }
    return da(e, t, n, r, l);
  }
  function xu(e, t, n) {
    var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, _e(vl, Nt), Nt |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, _e(vl, Nt), Nt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, _e(vl, Nt), Nt |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, _e(vl, Nt), Nt |= r;
    return ut(e, t, l, n), t.child;
  }
  function Su(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function da(e, t, n, r, l) {
    var i = mt(n) ? _r : nt.current;
    return i = ol(t, i), dl(t, l), n = ra(e, t, n, r, i, l), r = la(), e !== null && !ht ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Sn(e, t, l)) : (je && r && Fo(t), t.flags |= 1, ut(e, t, n, l), t.child);
  }
  function ku(e, t, n, r, l) {
    if (mt(n)) {
      var i = !0;
      Li(t);
    } else i = !1;
    if (dl(t, l), t.stateNode === null) Yi(e, t), $s(t, n, r), Xo(t, n, r, l), r = !0;
    else if (e === null) {
      var o = t.stateNode, u = t.memoizedProps;
      o.props = u;
      var d = o.context, h = n.contextType;
      typeof h == "object" && h !== null ? h = Lt(h) : (h = mt(n) ? _r : nt.current, h = ol(t, h));
      var k = n.getDerivedStateFromProps, _ = typeof k == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      _ || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== r || d !== h) && Bs(t, o, r, h), qn = !1;
      var S = t.memoizedState;
      o.state = S, Fi(t, r, o, l), d = t.memoizedState, u !== r || S !== d || pt.current || qn ? (typeof k == "function" && (qo(t, n, k, r), d = t.memoizedState), (u = qn || Fs(t, n, u, r, S, d, h)) ? (_ || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = d), o.props = r, o.state = d, o.context = h, r = u) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      o = t.stateNode, Ms(e, t), u = t.memoizedProps, h = t.type === t.elementType ? u : Wt(t.type, u), o.props = h, _ = t.pendingProps, S = o.context, d = n.contextType, typeof d == "object" && d !== null ? d = Lt(d) : (d = mt(n) ? _r : nt.current, d = ol(t, d));
      var R = n.getDerivedStateFromProps;
      (k = typeof R == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== _ || S !== d) && Bs(t, o, r, d), qn = !1, S = t.memoizedState, o.state = S, Fi(t, r, o, l);
      var z = t.memoizedState;
      u !== _ || S !== z || pt.current || qn ? (typeof R == "function" && (qo(t, n, R, r), z = t.memoizedState), (h = qn || Fs(t, n, h, r, S, z, d) || !1) ? (k || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, z, d), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, z, d)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && S === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && S === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = z), o.props = r, o.state = z, o.context = d, r = h) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && S === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && S === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return fa(e, t, n, r, i, l);
  }
  function fa(e, t, n, r, l, i) {
    Su(e, t);
    var o = (t.flags & 128) !== 0;
    if (!r && !o) return l && Ns(t, n, !1), Sn(e, t, i);
    r = t.stateNode, pd.current = t;
    var u = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && o ? (t.child = fl(t, e.child, null, i), t.child = fl(t, null, u, i)) : ut(e, t, u, i), t.memoizedState = r.state, l && Ns(t, n, !0), t.child;
  }
  function _u(e) {
    var t = e.stateNode;
    t.pendingContext ? Cs(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Cs(e, t.context, !1), Go(e, t.containerInfo);
  }
  function Cu(e, t, n, r, l) {
    return ul(), Wo(l), t.flags |= 256, ut(e, t, n, r), t.child;
  }
  var pa = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ma(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Eu(e, t, n) {
    var r = t.pendingProps, l = Re.current, i = !1, o = (t.flags & 128) !== 0, u;
    if ((u = o) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), _e(Re, l & 1), e === null)
      return Uo(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = oo(o, r, 0, null), e = Dr(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = ma(n), t.memoizedState = pa, e) : ha(t, o));
    if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return md(e, t, o, r, u, l, n);
    if (i) {
      i = r.fallback, o = t.mode, l = e.child, u = l.sibling;
      var d = { mode: "hidden", children: r.children };
      return (o & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = d, t.deletions = null) : (r = nr(l, d), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? i = nr(u, i) : (i = Dr(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? ma(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = pa, r;
    }
    return i = e.child, e = i.sibling, r = nr(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ha(e, t) {
    return t = oo({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Ki(e, t, n, r) {
    return r !== null && Wo(r), fl(t, e.child, null, n), e = ha(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function md(e, t, n, r, l, i, o) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = ua(Error(y(422))), Ki(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = oo({ mode: "visible", children: r.children }, l, 0, null), i = Dr(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && fl(t, e.child, null, o), t.child.memoizedState = ma(o), t.memoizedState = pa, i);
    if ((t.mode & 1) === 0) return Ki(e, t, o, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
      return r = u, i = Error(y(419)), r = ua(i, r, void 0), Ki(e, t, o, r);
    }
    if (u = (o & e.childLanes) !== 0, ht || u) {
      if (r = Ke, r !== null) {
        switch (o & -o) {
          case 4:
            l = 2;
            break;
          case 16:
            l = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            l = 32;
            break;
          case 536870912:
            l = 268435456;
            break;
          default:
            l = 0;
        }
        l = (l & (r.suspendedLanes | o)) !== 0 ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, wn(e, l), Qt(r, e, l, -1));
      }
      return za(), r = ua(Error(y(421))), Ki(e, t, o, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = jd.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, Et = Qn(l.nextSibling), Ct = t, je = !0, Ut = null, e !== null && (Pt[Rt++] = yn, Pt[Rt++] = gn, Pt[Rt++] = Cr, yn = e.id, gn = e.overflow, Cr = t), t = ha(t, r.children), t.flags |= 4096, t);
  }
  function Nu(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), bo(e.return, t, n);
  }
  function va(e, t, n, r, l) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = l);
  }
  function ju(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, i = r.tail;
    if (ut(e, t, r.children, n), r = Re.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Nu(e, n, t);
        else if (e.tag === 19) Nu(e, n, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      r &= 1;
    }
    if (_e(Re, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && Ui(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), va(t, !1, l, n, i);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && Ui(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        va(t, !0, n, null, i);
        break;
      case "together":
        va(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Yi(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Sn(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), Rr |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(y(153));
    if (t.child !== null) {
      for (e = t.child, n = nr(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = nr(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function hd(e, t, n) {
    switch (t.tag) {
      case 3:
        _u(t), ul();
        break;
      case 5:
        Vs(t);
        break;
      case 1:
        mt(t.type) && Li(t);
        break;
      case 4:
        Go(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        _e(Ii, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (_e(Re, Re.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Eu(e, t, n) : (_e(Re, Re.current & 1), e = Sn(e, t, n), e !== null ? e.sibling : null);
        _e(Re, Re.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return ju(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), _e(Re, Re.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, xu(e, t, n);
    }
    return Sn(e, t, n);
  }
  var Pu, ya, Ru, Lu;
  Pu = function(e, t) {
    for (var n = t.child; n !== null; ) {
      if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
      else if (n.tag !== 4 && n.child !== null) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === t) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === t) return;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
  }, ya = function() {
  }, Ru = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, jr(Jt.current);
      var i = null;
      switch (n) {
        case "input":
          l = rn(e, l), r = rn(e, r), i = [];
          break;
        case "select":
          l = c({}, l, { value: void 0 }), r = c({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          l = Cn(e, l), r = Cn(e, r), i = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = ji);
      }
      on(n, r);
      var o;
      n = null;
      for (h in l) if (!r.hasOwnProperty(h) && l.hasOwnProperty(h) && l[h] != null) if (h === "style") {
        var u = l[h];
        for (o in u) u.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
      } else h !== "dangerouslySetInnerHTML" && h !== "children" && h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && h !== "autoFocus" && (ae.hasOwnProperty(h) ? i || (i = []) : (i = i || []).push(h, null));
      for (h in r) {
        var d = r[h];
        if (u = l?.[h], r.hasOwnProperty(h) && d !== u && (d != null || u != null)) if (h === "style") if (u) {
          for (o in u) !u.hasOwnProperty(o) || d && d.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
          for (o in d) d.hasOwnProperty(o) && u[o] !== d[o] && (n || (n = {}), n[o] = d[o]);
        } else n || (i || (i = []), i.push(
          h,
          n
        )), n = d;
        else h === "dangerouslySetInnerHTML" ? (d = d ? d.__html : void 0, u = u ? u.__html : void 0, d != null && u !== d && (i = i || []).push(h, d)) : h === "children" ? typeof d != "string" && typeof d != "number" || (i = i || []).push(h, "" + d) : h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && (ae.hasOwnProperty(h) ? (d != null && h === "onScroll" && Ee("scroll", e), i || u === d || (i = [])) : (i = i || []).push(h, d));
      }
      n && (i = i || []).push("style", n);
      var h = i;
      (t.updateQueue = h) && (t.flags |= 4);
    }
  }, Lu = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function ii(e, t) {
    if (!je) switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; ) t.alternate !== null && (n = t), t = t.sibling;
        n === null ? e.tail = null : n.sibling = null;
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
        r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
    }
  }
  function lt(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function vd(e, t, n) {
    var r = t.pendingProps;
    switch ($o(t), t.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return lt(t), null;
      case 1:
        return mt(t.type) && Ri(), lt(t), null;
      case 3:
        return r = t.stateNode, pl(), Ne(pt), Ne(nt), ea(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (Mi(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ut !== null && (Pa(Ut), Ut = null))), ya(e, t), lt(t), null;
      case 5:
        Zo(t);
        var l = jr(ei.current);
        if (n = t.type, e !== null && t.stateNode != null) Ru(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(y(166));
            return lt(t), null;
          }
          if (e = jr(Jt.current), Mi(t)) {
            r = t.stateNode, n = t.type;
            var i = t.memoizedProps;
            switch (r[Zt] = t, r[ql] = i, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                Ee("cancel", r), Ee("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ee("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < bl.length; l++) Ee(bl[l], r);
                break;
              case "source":
                Ee("error", r);
                break;
              case "img":
              case "image":
              case "link":
                Ee(
                  "error",
                  r
                ), Ee("load", r);
                break;
              case "details":
                Ee("toggle", r);
                break;
              case "input":
                Mt(r, i), Ee("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, Ee("invalid", r);
                break;
              case "textarea":
                xl(r, i), Ee("invalid", r);
            }
            on(n, i), l = null;
            for (var o in i) if (i.hasOwnProperty(o)) {
              var u = i[o];
              o === "children" ? typeof u == "string" ? r.textContent !== u && (i.suppressHydrationWarning !== !0 && Ni(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (i.suppressHydrationWarning !== !0 && Ni(
                r.textContent,
                u,
                e
              ), l = ["children", "" + u]) : ae.hasOwnProperty(o) && u != null && o === "onScroll" && Ee("scroll", r);
            }
            switch (n) {
              case "input":
                wt(r), Or(r, i, !0);
                break;
              case "textarea":
                wt(r), Sl(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = ji);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Nn(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[Zt] = t, e[ql] = r, Pu(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (o = ar(n, r), n) {
                case "dialog":
                  Ee("cancel", e), Ee("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ee("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < bl.length; l++) Ee(bl[l], e);
                  l = r;
                  break;
                case "source":
                  Ee("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  Ee(
                    "error",
                    e
                  ), Ee("load", e), l = r;
                  break;
                case "details":
                  Ee("toggle", e), l = r;
                  break;
                case "input":
                  Mt(e, r), l = rn(e, r), Ee("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = c({}, r, { value: void 0 }), Ee("invalid", e);
                  break;
                case "textarea":
                  xl(e, r), l = Cn(e, r), Ee("invalid", e);
                  break;
                default:
                  l = r;
              }
              on(n, l), u = l;
              for (i in u) if (u.hasOwnProperty(i)) {
                var d = u[i];
                i === "style" ? kl(e, d) : i === "dangerouslySetInnerHTML" ? (d = d ? d.__html : void 0, d != null && Pn(e, d)) : i === "children" ? typeof d == "string" ? (n !== "textarea" || d !== "") && Ot(e, d) : typeof d == "number" && Ot(e, "" + d) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (ae.hasOwnProperty(i) ? d != null && i === "onScroll" && Ee("scroll", e) : d != null && Ie(e, i, d, o));
              }
              switch (n) {
                case "input":
                  wt(e), Or(e, r, !1);
                  break;
                case "textarea":
                  wt(e), Sl(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + ne(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? bt(e, !!r.multiple, i, !1) : r.defaultValue != null && bt(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = ji);
              }
              switch (n) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  r = !!r.autoFocus;
                  break e;
                case "img":
                  r = !0;
                  break e;
                default:
                  r = !1;
              }
            }
            r && (t.flags |= 4);
          }
          t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
        }
        return lt(t), null;
      case 6:
        if (e && t.stateNode != null) Lu(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(y(166));
          if (n = jr(ei.current), jr(Jt.current), Mi(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[Zt] = t, (i = r.nodeValue !== n) && (e = Ct, e !== null)) switch (e.tag) {
              case 3:
                Ni(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && Ni(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            i && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Zt] = t, t.stateNode = r;
        }
        return lt(t), null;
      case 13:
        if (Ne(Re), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (je && Et !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Ts(), ul(), t.flags |= 98560, i = !1;
          else if (i = Mi(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(y(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(y(317));
              i[Zt] = t;
            } else ul(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            lt(t), i = !1;
          } else Ut !== null && (Pa(Ut), Ut = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Re.current & 1) !== 0 ? He === 0 && (He = 3) : za())), t.updateQueue !== null && (t.flags |= 4), lt(t), null);
      case 4:
        return pl(), ya(e, t), e === null && Kl(t.stateNode.containerInfo), lt(t), null;
      case 10:
        return Qo(t.type._context), lt(t), null;
      case 17:
        return mt(t.type) && Ri(), lt(t), null;
      case 19:
        if (Ne(Re), i = t.memoizedState, i === null) return lt(t), null;
        if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) ii(i, !1);
        else {
          if (He !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (o = Ui(e), o !== null) {
              for (t.flags |= 128, ii(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return _e(Re, Re.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && Ce() > yl && (t.flags |= 128, r = !0, ii(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = Ui(o), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), ii(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !je) return lt(t), null;
          } else 2 * Ce() - i.renderingStartTime > yl && n !== 1073741824 && (t.flags |= 128, r = !0, ii(i, !1), t.lanes = 4194304);
          i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = Ce(), t.sibling = null, n = Re.current, _e(Re, r ? n & 1 | 2 : n & 1), t) : (lt(t), null);
      case 22:
      case 23:
        return La(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (Nt & 1073741824) !== 0 && (lt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : lt(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(y(156, t.tag));
  }
  function yd(e, t) {
    switch ($o(t), t.tag) {
      case 1:
        return mt(t.type) && Ri(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return pl(), Ne(pt), Ne(nt), ea(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Zo(t), null;
      case 13:
        if (Ne(Re), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(y(340));
          ul();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return Ne(Re), null;
      case 4:
        return pl(), null;
      case 10:
        return Qo(t.type._context), null;
      case 22:
      case 23:
        return La(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var qi = !1, it = !1, gd = typeof WeakSet == "function" ? WeakSet : Set, L = null;
  function hl(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      Te(e, t, r);
    }
    else n.current = null;
  }
  function ga(e, t, n) {
    try {
      n();
    } catch (r) {
      Te(e, t, r);
    }
  }
  var zu = !1;
  function wd(e, t) {
    if (Lo = Kr, e = ss(), ko(e)) {
      if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        n = (n = e.ownerDocument) && n.defaultView || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var l = r.anchorOffset, i = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, i.nodeType;
          } catch {
            n = null;
            break e;
          }
          var o = 0, u = -1, d = -1, h = 0, k = 0, _ = e, S = null;
          t: for (; ; ) {
            for (var R; _ !== n || l !== 0 && _.nodeType !== 3 || (u = o + l), _ !== i || r !== 0 && _.nodeType !== 3 || (d = o + r), _.nodeType === 3 && (o += _.nodeValue.length), (R = _.firstChild) !== null; )
              S = _, _ = R;
            for (; ; ) {
              if (_ === e) break t;
              if (S === n && ++h === l && (u = o), S === i && ++k === r && (d = o), (R = _.nextSibling) !== null) break;
              _ = S, S = _.parentNode;
            }
            _ = R;
          }
          n = u === -1 || d === -1 ? null : { start: u, end: d };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (zo = { focusedElem: e, selectionRange: n }, Kr = !1, L = t; L !== null; ) if (t = L, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, L = e;
    else for (; L !== null; ) {
      t = L;
      try {
        var z = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (z !== null) {
              var D = z.memoizedProps, Me = z.memoizedState, p = t.stateNode, f = p.getSnapshotBeforeUpdate(t.elementType === t.type ? D : Wt(t.type, D), Me);
              p.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          case 3:
            var m = t.stateNode.containerInfo;
            m.nodeType === 1 ? m.textContent = "" : m.nodeType === 9 && m.documentElement && m.removeChild(m.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(y(163));
        }
      } catch (E) {
        Te(t, t.return, E);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, L = e;
        break;
      }
      L = t.return;
    }
    return z = zu, zu = !1, z;
  }
  function oi(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var i = l.destroy;
          l.destroy = void 0, i !== void 0 && ga(t, n, i);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Xi(e, t) {
    if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
      var n = t = t.next;
      do {
        if ((n.tag & e) === e) {
          var r = n.create;
          n.destroy = r();
        }
        n = n.next;
      } while (n !== t);
    }
  }
  function wa(e) {
    var t = e.ref;
    if (t !== null) {
      var n = e.stateNode;
      e.tag, e = n, typeof t == "function" ? t(e) : t.current = e;
    }
  }
  function Tu(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Tu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Zt], delete t[ql], delete t[Io], delete t[td], delete t[nd])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Du(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Mu(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Du(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function xa(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = ji));
    else if (r !== 4 && (e = e.child, e !== null)) for (xa(e, t, n), e = e.sibling; e !== null; ) xa(e, t, n), e = e.sibling;
  }
  function Sa(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (Sa(e, t, n), e = e.sibling; e !== null; ) Sa(e, t, n), e = e.sibling;
  }
  var Je = null, Ht = !1;
  function Gn(e, t, n) {
    for (n = n.child; n !== null; ) Iu(e, t, n), n = n.sibling;
  }
  function Iu(e, t, n) {
    if (xt && typeof xt.onCommitFiberUnmount == "function") try {
      xt.onCommitFiberUnmount(cn, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        it || hl(n, t);
      case 6:
        var r = Je, l = Ht;
        Je = null, Gn(e, t, n), Je = r, Ht = l, Je !== null && (Ht ? (e = Je, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Je.removeChild(n.stateNode));
        break;
      case 18:
        Je !== null && (Ht ? (e = Je, n = n.stateNode, e.nodeType === 8 ? Mo(e.parentNode, n) : e.nodeType === 1 && Mo(e, n), Un(e)) : Mo(Je, n.stateNode));
        break;
      case 4:
        r = Je, l = Ht, Je = n.stateNode.containerInfo, Ht = !0, Gn(e, t, n), Je = r, Ht = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!it && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var i = l, o = i.destroy;
            i = i.tag, o !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && ga(n, t, o), l = l.next;
          } while (l !== r);
        }
        Gn(e, t, n);
        break;
      case 1:
        if (!it && (hl(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (u) {
          Te(n, t, u);
        }
        Gn(e, t, n);
        break;
      case 21:
        Gn(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (it = (r = it) || n.memoizedState !== null, Gn(e, t, n), it = r) : Gn(e, t, n);
        break;
      default:
        Gn(e, t, n);
    }
  }
  function Ou(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new gd()), t.forEach(function(r) {
        var l = Pd.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function Vt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e, o = t, u = o;
        e: for (; u !== null; ) {
          switch (u.tag) {
            case 5:
              Je = u.stateNode, Ht = !1;
              break e;
            case 3:
              Je = u.stateNode.containerInfo, Ht = !0;
              break e;
            case 4:
              Je = u.stateNode.containerInfo, Ht = !0;
              break e;
          }
          u = u.return;
        }
        if (Je === null) throw Error(y(160));
        Iu(i, o, l), Je = null, Ht = !1;
        var d = l.alternate;
        d !== null && (d.return = null), l.return = null;
      } catch (h) {
        Te(l, t, h);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Au(t, e), t = t.sibling;
  }
  function Au(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Vt(t, e), tn(e), r & 4) {
          try {
            oi(3, e, e.return), Xi(3, e);
          } catch (D) {
            Te(e, e.return, D);
          }
          try {
            oi(5, e, e.return);
          } catch (D) {
            Te(e, e.return, D);
          }
        }
        break;
      case 1:
        Vt(t, e), tn(e), r & 512 && n !== null && hl(n, n.return);
        break;
      case 5:
        if (Vt(t, e), tn(e), r & 512 && n !== null && hl(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Ot(l, "");
          } catch (D) {
            Te(e, e.return, D);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, u = e.type, d = e.updateQueue;
          if (e.updateQueue = null, d !== null) try {
            u === "input" && i.type === "radio" && i.name != null && Ir(l, i), ar(u, o);
            var h = ar(u, i);
            for (o = 0; o < d.length; o += 2) {
              var k = d[o], _ = d[o + 1];
              k === "style" ? kl(l, _) : k === "dangerouslySetInnerHTML" ? Pn(l, _) : k === "children" ? Ot(l, _) : Ie(l, k, _, h);
            }
            switch (u) {
              case "input":
                It(l, i);
                break;
              case "textarea":
                En(l, i);
                break;
              case "select":
                var S = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var R = i.value;
                R != null ? bt(l, !!i.multiple, R, !1) : S !== !!i.multiple && (i.defaultValue != null ? bt(
                  l,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : bt(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[ql] = i;
          } catch (D) {
            Te(e, e.return, D);
          }
        }
        break;
      case 6:
        if (Vt(t, e), tn(e), r & 4) {
          if (e.stateNode === null) throw Error(y(162));
          l = e.stateNode, i = e.memoizedProps;
          try {
            l.nodeValue = i;
          } catch (D) {
            Te(e, e.return, D);
          }
        }
        break;
      case 3:
        if (Vt(t, e), tn(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          Un(t.containerInfo);
        } catch (D) {
          Te(e, e.return, D);
        }
        break;
      case 4:
        Vt(t, e), tn(e);
        break;
      case 13:
        Vt(t, e), tn(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (Ca = Ce())), r & 4 && Ou(e);
        break;
      case 22:
        if (k = n !== null && n.memoizedState !== null, e.mode & 1 ? (it = (h = it) || k, Vt(t, e), it = h) : Vt(t, e), tn(e), r & 8192) {
          if (h = e.memoizedState !== null, (e.stateNode.isHidden = h) && !k && (e.mode & 1) !== 0) for (L = e, k = e.child; k !== null; ) {
            for (_ = L = k; L !== null; ) {
              switch (S = L, R = S.child, S.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  oi(4, S, S.return);
                  break;
                case 1:
                  hl(S, S.return);
                  var z = S.stateNode;
                  if (typeof z.componentWillUnmount == "function") {
                    r = S, n = S.return;
                    try {
                      t = r, z.props = t.memoizedProps, z.state = t.memoizedState, z.componentWillUnmount();
                    } catch (D) {
                      Te(r, n, D);
                    }
                  }
                  break;
                case 5:
                  hl(S, S.return);
                  break;
                case 22:
                  if (S.memoizedState !== null) {
                    Bu(_);
                    continue;
                  }
              }
              R !== null ? (R.return = S, L = R) : Bu(_);
            }
            k = k.sibling;
          }
          e: for (k = null, _ = e; ; ) {
            if (_.tag === 5) {
              if (k === null) {
                k = _;
                try {
                  l = _.stateNode, h ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (u = _.stateNode, d = _.memoizedProps.style, o = d != null && d.hasOwnProperty("display") ? d.display : null, u.style.display = Kt("display", o));
                } catch (D) {
                  Te(e, e.return, D);
                }
              }
            } else if (_.tag === 6) {
              if (k === null) try {
                _.stateNode.nodeValue = h ? "" : _.memoizedProps;
              } catch (D) {
                Te(e, e.return, D);
              }
            } else if ((_.tag !== 22 && _.tag !== 23 || _.memoizedState === null || _ === e) && _.child !== null) {
              _.child.return = _, _ = _.child;
              continue;
            }
            if (_ === e) break e;
            for (; _.sibling === null; ) {
              if (_.return === null || _.return === e) break e;
              k === _ && (k = null), _ = _.return;
            }
            k === _ && (k = null), _.sibling.return = _.return, _ = _.sibling;
          }
        }
        break;
      case 19:
        Vt(t, e), tn(e), r & 4 && Ou(e);
        break;
      case 21:
        break;
      default:
        Vt(
          t,
          e
        ), tn(e);
    }
  }
  function tn(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (Du(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(y(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (Ot(l, ""), r.flags &= -33);
            var i = Mu(e);
            Sa(e, i, l);
            break;
          case 3:
          case 4:
            var o = r.stateNode.containerInfo, u = Mu(e);
            xa(e, u, o);
            break;
          default:
            throw Error(y(161));
        }
      } catch (d) {
        Te(e, e.return, d);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function xd(e, t, n) {
    L = e, Fu(e);
  }
  function Fu(e, t, n) {
    for (var r = (e.mode & 1) !== 0; L !== null; ) {
      var l = L, i = l.child;
      if (l.tag === 22 && r) {
        var o = l.memoizedState !== null || qi;
        if (!o) {
          var u = l.alternate, d = u !== null && u.memoizedState !== null || it;
          u = qi;
          var h = it;
          if (qi = o, (it = d) && !h) for (L = l; L !== null; ) o = L, d = o.child, o.tag === 22 && o.memoizedState !== null ? Uu(l) : d !== null ? (d.return = o, L = d) : Uu(l);
          for (; i !== null; ) L = i, Fu(i), i = i.sibling;
          L = l, qi = u, it = h;
        }
        $u(e);
      } else (l.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = l, L = i) : $u(e);
    }
  }
  function $u(e) {
    for (; L !== null; ) {
      var t = L;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              it || Xi(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !it) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : Wt(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var i = t.updateQueue;
              i !== null && Os(t, i, r);
              break;
            case 3:
              var o = t.updateQueue;
              if (o !== null) {
                if (n = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    n = t.child.stateNode;
                    break;
                  case 1:
                    n = t.child.stateNode;
                }
                Os(t, o, n);
              }
              break;
            case 5:
              var u = t.stateNode;
              if (n === null && t.flags & 4) {
                n = u;
                var d = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    d.autoFocus && n.focus();
                    break;
                  case "img":
                    d.src && (n.src = d.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var h = t.alternate;
                if (h !== null) {
                  var k = h.memoizedState;
                  if (k !== null) {
                    var _ = k.dehydrated;
                    _ !== null && Un(_);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(y(163));
          }
          it || t.flags & 512 && wa(t);
        } catch (S) {
          Te(t, t.return, S);
        }
      }
      if (t === e) {
        L = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, L = n;
        break;
      }
      L = t.return;
    }
  }
  function Bu(e) {
    for (; L !== null; ) {
      var t = L;
      if (t === e) {
        L = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, L = n;
        break;
      }
      L = t.return;
    }
  }
  function Uu(e) {
    for (; L !== null; ) {
      var t = L;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Xi(4, t);
            } catch (d) {
              Te(t, n, d);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (d) {
                Te(t, l, d);
              }
            }
            var i = t.return;
            try {
              wa(t);
            } catch (d) {
              Te(t, i, d);
            }
            break;
          case 5:
            var o = t.return;
            try {
              wa(t);
            } catch (d) {
              Te(t, o, d);
            }
        }
      } catch (d) {
        Te(t, t.return, d);
      }
      if (t === e) {
        L = null;
        break;
      }
      var u = t.sibling;
      if (u !== null) {
        u.return = t.return, L = u;
        break;
      }
      L = t.return;
    }
  }
  var Sd = Math.ceil, Gi = de.ReactCurrentDispatcher, ka = de.ReactCurrentOwner, Tt = de.ReactCurrentBatchConfig, ce = 0, Ke = null, Fe = null, et = 0, Nt = 0, vl = bn(0), He = 0, ai = null, Rr = 0, Zi = 0, _a = 0, si = null, vt = null, Ca = 0, yl = 1 / 0, kn = null, Ji = !1, Ea = null, Zn = null, eo = !1, Jn = null, to = 0, ui = 0, Na = null, no = -1, ro = 0;
  function ct() {
    return (ce & 6) !== 0 ? Ce() : no !== -1 ? no : no = Ce();
  }
  function er(e) {
    return (e.mode & 1) === 0 ? 1 : (ce & 2) !== 0 && et !== 0 ? et & -et : ld.transition !== null ? (ro === 0 && (ro = On()), ro) : (e = le, e !== 0 || (e = window.event, e = e === void 0 ? 16 : gi(e.type)), e);
  }
  function Qt(e, t, n, r) {
    if (50 < ui) throw ui = 0, Na = null, Error(y(185));
    kt(e, n, r), ((ce & 2) === 0 || e !== Ke) && (e === Ke && ((ce & 2) === 0 && (Zi |= n), He === 4 && tr(e, et)), yt(e, r), n === 1 && ce === 0 && (t.mode & 1) === 0 && (yl = Ce() + 500, zi && Yn()));
  }
  function yt(e, t) {
    var n = e.callbackNode;
    St(e, t);
    var r = yr(e, e === Ke ? et : 0);
    if (r === 0) n !== null && fr(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && fr(n), t === 1) e.tag === 0 ? rd(Hu.bind(null, e)) : js(Hu.bind(null, e)), Jc(function() {
        (ce & 6) === 0 && Yn();
      }), n = null;
      else {
        switch (Ml(r)) {
          case 1:
            n = pr;
            break;
          case 4:
            n = Rl;
            break;
          case 16:
            n = un;
            break;
          case 536870912:
            n = mr;
            break;
          default:
            n = un;
        }
        n = Gu(n, Wu.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Wu(e, t) {
    if (no = -1, ro = 0, (ce & 6) !== 0) throw Error(y(327));
    var n = e.callbackNode;
    if (gl() && e.callbackNode !== n) return null;
    var r = yr(e, e === Ke ? et : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = lo(e, r);
    else {
      t = r;
      var l = ce;
      ce |= 2;
      var i = Qu();
      (Ke !== e || et !== t) && (kn = null, yl = Ce() + 500, zr(e, t));
      do
        try {
          Cd();
          break;
        } catch (u) {
          Vu(e, u);
        }
      while (!0);
      Vo(), Gi.current = i, ce = l, Fe !== null ? t = 0 : (Ke = null, et = 0, t = He);
    }
    if (t !== 0) {
      if (t === 2 && (l = In(e), l !== 0 && (r = l, t = ja(e, l))), t === 1) throw n = ai, zr(e, 0), tr(e, r), yt(e, Ce()), n;
      if (t === 6) tr(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !kd(l) && (t = lo(e, r), t === 2 && (i = In(e), i !== 0 && (r = i, t = ja(e, i))), t === 1)) throw n = ai, zr(e, 0), tr(e, r), yt(e, Ce()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(y(345));
          case 2:
            Tr(e, vt, kn);
            break;
          case 3:
            if (tr(e, r), (r & 130023424) === r && (t = Ca + 500 - Ce(), 10 < t)) {
              if (yr(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                ct(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Do(Tr.bind(null, e, vt, kn), t);
              break;
            }
            Tr(e, vt, kn);
            break;
          case 4:
            if (tr(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var o = 31 - st(r);
              i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
            }
            if (r = l, r = Ce() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Sd(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Do(Tr.bind(null, e, vt, kn), r);
              break;
            }
            Tr(e, vt, kn);
            break;
          case 5:
            Tr(e, vt, kn);
            break;
          default:
            throw Error(y(329));
        }
      }
    }
    return yt(e, Ce()), e.callbackNode === n ? Wu.bind(null, e) : null;
  }
  function ja(e, t) {
    var n = si;
    return e.current.memoizedState.isDehydrated && (zr(e, t).flags |= 256), e = lo(e, t), e !== 2 && (t = vt, vt = n, t !== null && Pa(t)), e;
  }
  function Pa(e) {
    vt === null ? vt = e : vt.push.apply(vt, e);
  }
  function kd(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var l = n[r], i = l.getSnapshot;
          l = l.value;
          try {
            if (!Bt(i(), l)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function tr(e, t) {
    for (t &= ~_a, t &= ~Zi, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - st(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Hu(e) {
    if ((ce & 6) !== 0) throw Error(y(327));
    gl();
    var t = yr(e, 0);
    if ((t & 1) === 0) return yt(e, Ce()), null;
    var n = lo(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = In(e);
      r !== 0 && (t = r, n = ja(e, r));
    }
    if (n === 1) throw n = ai, zr(e, 0), tr(e, t), yt(e, Ce()), n;
    if (n === 6) throw Error(y(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, Tr(e, vt, kn), yt(e, Ce()), null;
  }
  function Ra(e, t) {
    var n = ce;
    ce |= 1;
    try {
      return e(t);
    } finally {
      ce = n, ce === 0 && (yl = Ce() + 500, zi && Yn());
    }
  }
  function Lr(e) {
    Jn !== null && Jn.tag === 0 && (ce & 6) === 0 && gl();
    var t = ce;
    ce |= 1;
    var n = Tt.transition, r = le;
    try {
      if (Tt.transition = null, le = 1, e) return e();
    } finally {
      le = r, Tt.transition = n, ce = t, (ce & 6) === 0 && Yn();
    }
  }
  function La() {
    Nt = vl.current, Ne(vl);
  }
  function zr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Zc(n)), Fe !== null) for (n = Fe.return; n !== null; ) {
      var r = n;
      switch ($o(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && Ri();
          break;
        case 3:
          pl(), Ne(pt), Ne(nt), ea();
          break;
        case 5:
          Zo(r);
          break;
        case 4:
          pl();
          break;
        case 13:
          Ne(Re);
          break;
        case 19:
          Ne(Re);
          break;
        case 10:
          Qo(r.type._context);
          break;
        case 22:
        case 23:
          La();
      }
      n = n.return;
    }
    if (Ke = e, Fe = e = nr(e.current, null), et = Nt = t, He = 0, ai = null, _a = Zi = Rr = 0, vt = si = null, Nr !== null) {
      for (t = 0; t < Nr.length; t++) if (n = Nr[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, i = n.pending;
        if (i !== null) {
          var o = i.next;
          i.next = l, r.next = o;
        }
        n.pending = r;
      }
      Nr = null;
    }
    return e;
  }
  function Vu(e, t) {
    do {
      var n = Fe;
      try {
        if (Vo(), Wi.current = bi, Hi) {
          for (var r = Le.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          Hi = !1;
        }
        if (Pr = 0, be = We = Le = null, ti = !1, ni = 0, ka.current = null, n === null || n.return === null) {
          He = 1, ai = t, Fe = null;
          break;
        }
        e: {
          var i = e, o = n.return, u = n, d = t;
          if (t = et, u.flags |= 32768, d !== null && typeof d == "object" && typeof d.then == "function") {
            var h = d, k = u, _ = k.tag;
            if ((k.mode & 1) === 0 && (_ === 0 || _ === 11 || _ === 15)) {
              var S = k.alternate;
              S ? (k.updateQueue = S.updateQueue, k.memoizedState = S.memoizedState, k.lanes = S.lanes) : (k.updateQueue = null, k.memoizedState = null);
            }
            var R = hu(o);
            if (R !== null) {
              R.flags &= -257, vu(R, o, u, i, t), R.mode & 1 && mu(i, h, t), t = R, d = h;
              var z = t.updateQueue;
              if (z === null) {
                var D = /* @__PURE__ */ new Set();
                D.add(d), t.updateQueue = D;
              } else z.add(d);
              break e;
            } else {
              if ((t & 1) === 0) {
                mu(i, h, t), za();
                break e;
              }
              d = Error(y(426));
            }
          } else if (je && u.mode & 1) {
            var Me = hu(o);
            if (Me !== null) {
              (Me.flags & 65536) === 0 && (Me.flags |= 256), vu(Me, o, u, i, t), Wo(ml(d, u));
              break e;
            }
          }
          i = d = ml(d, u), He !== 4 && (He = 2), si === null ? si = [i] : si.push(i), i = o;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var p = fu(i, d, t);
                Is(i, p);
                break e;
              case 1:
                u = d;
                var f = i.type, m = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof f.getDerivedStateFromError == "function" || m !== null && typeof m.componentDidCatch == "function" && (Zn === null || !Zn.has(m)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var E = pu(i, u, t);
                  Is(i, E);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        Ku(n);
      } catch (O) {
        t = O, Fe === n && n !== null && (Fe = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Qu() {
    var e = Gi.current;
    return Gi.current = bi, e === null ? bi : e;
  }
  function za() {
    (He === 0 || He === 3 || He === 2) && (He = 4), Ke === null || (Rr & 268435455) === 0 && (Zi & 268435455) === 0 || tr(Ke, et);
  }
  function lo(e, t) {
    var n = ce;
    ce |= 2;
    var r = Qu();
    (Ke !== e || et !== t) && (kn = null, zr(e, t));
    do
      try {
        _d();
        break;
      } catch (l) {
        Vu(e, l);
      }
    while (!0);
    if (Vo(), ce = n, Gi.current = r, Fe !== null) throw Error(y(261));
    return Ke = null, et = 0, He;
  }
  function _d() {
    for (; Fe !== null; ) bu(Fe);
  }
  function Cd() {
    for (; Fe !== null && !jl(); ) bu(Fe);
  }
  function bu(e) {
    var t = Xu(e.alternate, e, Nt);
    e.memoizedProps = e.pendingProps, t === null ? Ku(e) : Fe = t, ka.current = null;
  }
  function Ku(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = vd(n, t, Nt), n !== null) {
          Fe = n;
          return;
        }
      } else {
        if (n = yd(n, t), n !== null) {
          n.flags &= 32767, Fe = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          He = 6, Fe = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Fe = t;
        return;
      }
      Fe = t = e;
    } while (t !== null);
    He === 0 && (He = 5);
  }
  function Tr(e, t, n) {
    var r = le, l = Tt.transition;
    try {
      Tt.transition = null, le = 1, Ed(e, t, n, r);
    } finally {
      Tt.transition = l, le = r;
    }
    return null;
  }
  function Ed(e, t, n, r) {
    do
      gl();
    while (Jn !== null);
    if ((ce & 6) !== 0) throw Error(y(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(y(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = n.lanes | n.childLanes;
    if (An(e, i), e === Ke && (Fe = Ke = null, et = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || eo || (eo = !0, Gu(un, function() {
      return gl(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = Tt.transition, Tt.transition = null;
      var o = le;
      le = 1;
      var u = ce;
      ce |= 4, ka.current = null, wd(e, n), Au(n, e), Qc(zo), Kr = !!Lo, zo = Lo = null, e.current = n, xd(n), hi(), ce = u, le = o, Tt.transition = i;
    } else e.current = n;
    if (eo && (eo = !1, Jn = e, to = l), i = e.pendingLanes, i === 0 && (Zn = null), vo(n.stateNode), yt(e, Ce()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Ji) throw Ji = !1, e = Ea, Ea = null, e;
    return (to & 1) !== 0 && e.tag !== 0 && gl(), i = e.pendingLanes, (i & 1) !== 0 ? e === Na ? ui++ : (ui = 0, Na = e) : ui = 0, Yn(), null;
  }
  function gl() {
    if (Jn !== null) {
      var e = Ml(to), t = Tt.transition, n = le;
      try {
        if (Tt.transition = null, le = 16 > e ? 16 : e, Jn === null) var r = !1;
        else {
          if (e = Jn, Jn = null, to = 0, (ce & 6) !== 0) throw Error(y(331));
          var l = ce;
          for (ce |= 4, L = e.current; L !== null; ) {
            var i = L, o = i.child;
            if ((L.flags & 16) !== 0) {
              var u = i.deletions;
              if (u !== null) {
                for (var d = 0; d < u.length; d++) {
                  var h = u[d];
                  for (L = h; L !== null; ) {
                    var k = L;
                    switch (k.tag) {
                      case 0:
                      case 11:
                      case 15:
                        oi(8, k, i);
                    }
                    var _ = k.child;
                    if (_ !== null) _.return = k, L = _;
                    else for (; L !== null; ) {
                      k = L;
                      var S = k.sibling, R = k.return;
                      if (Tu(k), k === h) {
                        L = null;
                        break;
                      }
                      if (S !== null) {
                        S.return = R, L = S;
                        break;
                      }
                      L = R;
                    }
                  }
                }
                var z = i.alternate;
                if (z !== null) {
                  var D = z.child;
                  if (D !== null) {
                    z.child = null;
                    do {
                      var Me = D.sibling;
                      D.sibling = null, D = Me;
                    } while (D !== null);
                  }
                }
                L = i;
              }
            }
            if ((i.subtreeFlags & 2064) !== 0 && o !== null) o.return = i, L = o;
            else e: for (; L !== null; ) {
              if (i = L, (i.flags & 2048) !== 0) switch (i.tag) {
                case 0:
                case 11:
                case 15:
                  oi(9, i, i.return);
              }
              var p = i.sibling;
              if (p !== null) {
                p.return = i.return, L = p;
                break e;
              }
              L = i.return;
            }
          }
          var f = e.current;
          for (L = f; L !== null; ) {
            o = L;
            var m = o.child;
            if ((o.subtreeFlags & 2064) !== 0 && m !== null) m.return = o, L = m;
            else e: for (o = f; L !== null; ) {
              if (u = L, (u.flags & 2048) !== 0) try {
                switch (u.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Xi(9, u);
                }
              } catch (O) {
                Te(u, u.return, O);
              }
              if (u === o) {
                L = null;
                break e;
              }
              var E = u.sibling;
              if (E !== null) {
                E.return = u.return, L = E;
                break e;
              }
              L = u.return;
            }
          }
          if (ce = l, Yn(), xt && typeof xt.onPostCommitFiberRoot == "function") try {
            xt.onPostCommitFiberRoot(cn, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        le = n, Tt.transition = t;
      }
    }
    return !1;
  }
  function Yu(e, t, n) {
    t = ml(n, t), t = fu(e, t, 1), e = Xn(e, t, 1), t = ct(), e !== null && (kt(e, 1, t), yt(e, t));
  }
  function Te(e, t, n) {
    if (e.tag === 3) Yu(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Yu(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Zn === null || !Zn.has(r))) {
          e = ml(n, e), e = pu(t, e, 1), t = Xn(t, e, 1), e = ct(), t !== null && (kt(t, 1, e), yt(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Nd(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = ct(), e.pingedLanes |= e.suspendedLanes & n, Ke === e && (et & n) === n && (He === 4 || He === 3 && (et & 130023424) === et && 500 > Ce() - Ca ? zr(e, 0) : _a |= n), yt(e, t);
  }
  function qu(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = vr, vr <<= 1, (vr & 130023424) === 0 && (vr = 4194304)));
    var n = ct();
    e = wn(e, t), e !== null && (kt(e, t, n), yt(e, n));
  }
  function jd(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), qu(e, n);
  }
  function Pd(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode, l = e.memoizedState;
        l !== null && (n = l.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(y(314));
    }
    r !== null && r.delete(t), qu(e, n);
  }
  var Xu;
  Xu = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || pt.current) ht = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return ht = !1, hd(e, t, n);
      ht = (e.flags & 131072) !== 0;
    }
    else ht = !1, je && (t.flags & 1048576) !== 0 && Ps(t, Di, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Yi(e, t), e = t.pendingProps;
        var l = ol(t, nt.current);
        dl(t, n), l = ra(null, t, r, e, l, n);
        var i = la();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, mt(r) ? (i = !0, Li(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Yo(t), l.updater = $i, t.stateNode = l, l._reactInternals = t, Xo(t, r, e, n), t = fa(null, t, r, !0, i, n)) : (t.tag = 0, je && i && Fo(t), ut(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Yi(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Ld(r), e = Wt(r, e), l) {
            case 0:
              t = da(null, t, r, e, n);
              break e;
            case 1:
              t = ku(null, t, r, e, n);
              break e;
            case 11:
              t = yu(null, t, r, e, n);
              break e;
            case 14:
              t = gu(null, t, r, Wt(r.type, e), n);
              break e;
          }
          throw Error(y(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Wt(r, l), da(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Wt(r, l), ku(e, t, r, l, n);
      case 3:
        e: {
          if (_u(t), e === null) throw Error(y(387));
          r = t.pendingProps, i = t.memoizedState, l = i.element, Ms(e, t), Fi(t, r, null, n);
          var o = t.memoizedState;
          if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            l = ml(Error(y(423)), t), t = Cu(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = ml(Error(y(424)), t), t = Cu(e, t, r, n, l);
            break e;
          } else for (Et = Qn(t.stateNode.containerInfo.firstChild), Ct = t, je = !0, Ut = null, n = Hs(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (ul(), r === l) {
              t = Sn(e, t, n);
              break e;
            }
            ut(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Vs(t), e === null && Uo(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, To(r, l) ? o = null : i !== null && To(r, i) && (t.flags |= 32), Su(e, t), ut(e, t, o, n), t.child;
      case 6:
        return e === null && Uo(t), null;
      case 13:
        return Eu(e, t, n);
      case 4:
        return Go(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = fl(t, null, r, n) : ut(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Wt(r, l), yu(e, t, r, l, n);
      case 7:
        return ut(e, t, t.pendingProps, n), t.child;
      case 8:
        return ut(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return ut(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, _e(Ii, r._currentValue), r._currentValue = o, i !== null) if (Bt(i.value, o)) {
            if (i.children === l.children && !pt.current) {
              t = Sn(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var u = i.dependencies;
            if (u !== null) {
              o = i.child;
              for (var d = u.firstContext; d !== null; ) {
                if (d.context === r) {
                  if (i.tag === 1) {
                    d = xn(-1, n & -n), d.tag = 2;
                    var h = i.updateQueue;
                    if (h !== null) {
                      h = h.shared;
                      var k = h.pending;
                      k === null ? d.next = d : (d.next = k.next, k.next = d), h.pending = d;
                    }
                  }
                  i.lanes |= n, d = i.alternate, d !== null && (d.lanes |= n), bo(
                    i.return,
                    n,
                    t
                  ), u.lanes |= n;
                  break;
                }
                d = d.next;
              }
            } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (o = i.return, o === null) throw Error(y(341));
              o.lanes |= n, u = o.alternate, u !== null && (u.lanes |= n), bo(o, n, t), o = i.sibling;
            } else o = i.child;
            if (o !== null) o.return = i;
            else for (o = i; o !== null; ) {
              if (o === t) {
                o = null;
                break;
              }
              if (i = o.sibling, i !== null) {
                i.return = o.return, o = i;
                break;
              }
              o = o.return;
            }
            i = o;
          }
          ut(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, dl(t, n), l = Lt(l), r = r(l), t.flags |= 1, ut(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = Wt(r, t.pendingProps), l = Wt(r.type, l), gu(e, t, r, l, n);
      case 15:
        return wu(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Wt(r, l), Yi(e, t), t.tag = 1, mt(r) ? (e = !0, Li(t)) : e = !1, dl(t, n), $s(t, r, l), Xo(t, r, l, n), fa(null, t, r, !0, e, n);
      case 19:
        return ju(e, t, n);
      case 22:
        return xu(e, t, n);
    }
    throw Error(y(156, t.tag));
  };
  function Gu(e, t) {
    return Nl(e, t);
  }
  function Rd(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Dt(e, t, n, r) {
    return new Rd(e, t, n, r);
  }
  function Ta(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Ld(e) {
    if (typeof e == "function") return Ta(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === dt) return 11;
      if (e === Xe) return 14;
    }
    return 2;
  }
  function nr(e, t) {
    var n = e.alternate;
    return n === null ? (n = Dt(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function io(e, t, n, r, l, i) {
    var o = 2;
    if (r = e, typeof e == "function") Ta(e) && (o = 1);
    else if (typeof e == "string") o = 5;
    else e: switch (e) {
      case N:
        return Dr(n.children, l, i, t);
      case b:
        o = 8, l |= 8;
        break;
      case ye:
        return e = Dt(12, n, t, l | 2), e.elementType = ye, e.lanes = i, e;
      case ot:
        return e = Dt(13, n, t, l), e.elementType = ot, e.lanes = i, e;
      case qe:
        return e = Dt(19, n, t, l), e.elementType = qe, e.lanes = i, e;
      case ue:
        return oo(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case se:
            o = 10;
            break e;
          case Be:
            o = 9;
            break e;
          case dt:
            o = 11;
            break e;
          case Xe:
            o = 14;
            break e;
          case Pe:
            o = 16, r = null;
            break e;
        }
        throw Error(y(130, e == null ? e : typeof e, ""));
    }
    return t = Dt(o, n, t, l), t.elementType = e, t.type = r, t.lanes = i, t;
  }
  function Dr(e, t, n, r) {
    return e = Dt(7, e, r, t), e.lanes = n, e;
  }
  function oo(e, t, n, r) {
    return e = Dt(22, e, r, t), e.elementType = ue, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Da(e, t, n) {
    return e = Dt(6, e, null, t), e.lanes = n, e;
  }
  function Ma(e, t, n) {
    return t = Dt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function zd(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Hr(0), this.expirationTimes = Hr(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Hr(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Ia(e, t, n, r, l, i, o, u, d) {
    return e = new zd(e, t, n, u, d), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = Dt(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Yo(i), e;
  }
  function Td(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Se, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Zu(e) {
    if (!e) return Kn;
    e = e._reactInternals;
    e: {
      if (At(e) !== e || e.tag !== 1) throw Error(y(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (mt(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(y(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (mt(n)) return Es(e, n, t);
    }
    return t;
  }
  function Ju(e, t, n, r, l, i, o, u, d) {
    return e = Ia(n, r, !0, e, l, i, o, u, d), e.context = Zu(null), n = e.current, r = ct(), l = er(n), i = xn(r, l), i.callback = t ?? null, Xn(n, i, l), e.current.lanes = l, kt(e, l, r), yt(e, r), e;
  }
  function ao(e, t, n, r) {
    var l = t.current, i = ct(), o = er(l);
    return n = Zu(n), t.context === null ? t.context = n : t.pendingContext = n, t = xn(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Xn(l, t, o), e !== null && (Qt(e, l, o, i), Ai(e, l, o)), o;
  }
  function so(e) {
    return e = e.current, e.child ? (e.child.tag === 5, e.child.stateNode) : null;
  }
  function ec(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Oa(e, t) {
    ec(e, t), (e = e.alternate) && ec(e, t);
  }
  function Dd() {
    return null;
  }
  var tc = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Aa(e) {
    this._internalRoot = e;
  }
  uo.prototype.render = Aa.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(y(409));
    ao(e, t, null, null);
  }, uo.prototype.unmount = Aa.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Lr(function() {
        ao(null, e, null, null);
      }), t[hn] = null;
    }
  };
  function uo(e) {
    this._internalRoot = e;
  }
  uo.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = dn();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < ge.length && t !== 0 && t < ge[n].priority; n++) ;
      ge.splice(n, 0, e), n === 0 && Al(e);
    }
  };
  function Fa(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function co(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function nc() {
  }
  function Md(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var h = so(o);
          i.call(h);
        };
      }
      var o = Ju(t, r, e, 0, null, !1, !1, "", nc);
      return e._reactRootContainer = o, e[hn] = o.current, Kl(e.nodeType === 8 ? e.parentNode : e), Lr(), o;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var u = r;
      r = function() {
        var h = so(d);
        u.call(h);
      };
    }
    var d = Ia(e, 0, !1, null, null, !1, !1, "", nc);
    return e._reactRootContainer = d, e[hn] = d.current, Kl(e.nodeType === 8 ? e.parentNode : e), Lr(function() {
      ao(t, d, n, r);
    }), d;
  }
  function fo(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
      var o = i;
      if (typeof l == "function") {
        var u = l;
        l = function() {
          var d = so(o);
          u.call(d);
        };
      }
      ao(t, o, e, l);
    } else o = Md(n, t, e, l, r);
    return so(o);
  }
  Vr = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Mn(t.pendingLanes);
          n !== 0 && (q(t, n | 1), yt(t, Ce()), (ce & 6) === 0 && (yl = Ce() + 500, Yn()));
        }
        break;
      case 13:
        Lr(function() {
          var r = wn(e, 1);
          if (r !== null) {
            var l = ct();
            Qt(r, e, 1, l);
          }
        }), Oa(e, 1);
    }
  }, Fn = function(e) {
    if (e.tag === 13) {
      var t = wn(e, 134217728);
      if (t !== null) {
        var n = ct();
        Qt(t, e, 134217728, n);
      }
      Oa(e, 134217728);
    }
  }, gr = function(e) {
    if (e.tag === 13) {
      var t = er(e), n = wn(e, t);
      if (n !== null) {
        var r = ct();
        Qt(n, e, t, r);
      }
      Oa(e, t);
    }
  }, dn = function() {
    return le;
  }, wr = function(e, t) {
    var n = le;
    try {
      return le = e, t();
    } finally {
      le = n;
    }
  }, Oe = function(e, t, n) {
    switch (t) {
      case "input":
        if (It(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = Pi(r);
              if (!l) throw Error(y(90));
              Mr(r), It(r, l);
            }
          }
        }
        break;
      case "textarea":
        En(e, n);
        break;
      case "select":
        t = n.value, t != null && bt(e, !!n.multiple, t, !1);
    }
  }, qt = Ra, El = Lr;
  var Id = { usingClientEntryPoint: !1, Events: [Xl, ll, Pi, at, Cl, Ra] }, ci = { findFiberByHostInstance: kr, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" }, Od = { bundleType: ci.bundleType, version: ci.version, rendererPackageName: ci.rendererPackageName, rendererConfig: ci.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: de.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Dn(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: ci.findFiberByHostInstance || Dd, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var po = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!po.isDisabled && po.supportsFiber) try {
      cn = po.inject(Od), xt = po;
    } catch {
    }
  }
  return gt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Id, gt.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Fa(t)) throw Error(y(200));
    return Td(e, t, null, n);
  }, gt.createRoot = function(e, t) {
    if (!Fa(e)) throw Error(y(299));
    var n = !1, r = "", l = tc;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Ia(e, 1, !1, null, null, n, !1, r, l), e[hn] = t.current, Kl(e.nodeType === 8 ? e.parentNode : e), new Aa(t);
  }, gt.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(y(188)) : (e = Object.keys(e).join(","), Error(y(268, e)));
    return e = Dn(t), e = e === null ? null : e.stateNode, e;
  }, gt.flushSync = function(e) {
    return Lr(e);
  }, gt.hydrate = function(e, t, n) {
    if (!co(t)) throw Error(y(200));
    return fo(null, e, t, !0, n);
  }, gt.hydrateRoot = function(e, t, n) {
    if (!Fa(e)) throw Error(y(405));
    var r = n != null && n.hydratedSources || null, l = !1, i = "", o = tc;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = Ju(t, null, e, 1, n ?? null, l, !1, i, o), e[hn] = t.current, Kl(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new uo(t);
  }, gt.render = function(e, t, n) {
    if (!co(t)) throw Error(y(200));
    return fo(null, e, t, !1, n);
  }, gt.unmountComponentAtNode = function(e) {
    if (!co(e)) throw Error(y(40));
    return e._reactRootContainer ? (Lr(function() {
      fo(null, null, e, !1, function() {
        e._reactRootContainer = null, e[hn] = null;
      });
    }), !0) : !1;
  }, gt.unstable_batchedUpdates = Ra, gt.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!co(n)) throw Error(y(200));
    if (e == null || e._reactInternals === void 0) throw Error(y(38));
    return fo(e, t, n, !1, r);
  }, gt.version = "18.2.0-next-9e3b772b8-20220608", gt;
}
var cc;
function Vd() {
  if (cc) return Ua.exports;
  cc = 1;
  function w() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(w);
      } catch (V) {
        console.error(V);
      }
  }
  return w(), Ua.exports = Hd(), Ua.exports;
}
var dc;
function Qd() {
  if (dc) return mo;
  dc = 1;
  var w = Vd();
  return mo.createRoot = w.createRoot, mo.hydrateRoot = w.hydrateRoot, mo;
}
var bd = Qd();
var Kd = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const Yd = (w) => w.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().trim(), lr = (w, V) => {
  const y = g.forwardRef(
    ({
      color: pe = "currentColor",
      size: ae = 24,
      strokeWidth: me = 2,
      absoluteStrokeWidth: he,
      className: I = "",
      children: U,
      ...X
    }, ve) => g.createElement(
      "svg",
      {
        ref: ve,
        ...Kd,
        width: ae,
        height: ae,
        stroke: pe,
        strokeWidth: he ? Number(me) * 24 / Number(ae) : me,
        className: ["lucide", `lucide-${Yd(w)}`, I].join(" "),
        ...X
      },
      [
        ...V.map(([Z, J]) => g.createElement(Z, J)),
        ...Array.isArray(U) ? U : [U]
      ]
    )
  );
  return y.displayName = `${w}`, y;
};
const qd = lr("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Xd = lr("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
const Gd = lr("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
const Zd = lr("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
const fi = lr("Music2", [
  ["circle", { cx: "8", cy: "18", r: "4", key: "1fc0mg" }],
  ["path", { d: "M12 18V2l7 4", key: "g04rme" }]
]);
const Jd = lr("Play", [
  ["polygon", { points: "5 3 19 12 5 21 5 3", key: "191637" }]
]);
const ef = lr("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
const tf = lr("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), fc = ["auto", "sbc", "sbc_xq", "aac", "aptx", "aptx_hd", "ldac"], nf = ["trace", "debug", "info", "notice", "warning", "error", "fatal"];
function rf({ hass: w }) {
  const [V, y] = g.useState([]), [pe, ae] = g.useState([]), [me, he] = g.useState({}), [I, U] = g.useState(!1), [X, ve] = g.useState(""), [Z, J] = g.useState(""), [De, K] = g.useState("0000"), [B, ie] = g.useState({}), [ke, $e] = g.useState(""), Ie = g.useCallback(async () => {
    if (w)
      try {
        const [N, b, ye] = await Promise.all([
          w.callWS({ type: "bl_haos/speakers/devices" }),
          w.callWS({ type: "bl_haos/speakers/settings/get" }),
          w.callWS({ type: "bl_haos/speakers/adapters/list" })
        ]);
        y(Array.isArray(N) ? N : []), he(b && typeof b == "object" ? b : {}), ae(Array.isArray(ye) ? ye : []);
      } catch {
        ve("Bluetooth action failed");
      }
  }, [w]);
  g.useEffect(() => {
    Ie();
  }, [Ie]);
  const de = async (N, b) => {
    if (w) {
      U(!0), ve(""), J("");
      try {
        await b(), J(N), await Ie();
      } catch {
        ve("Bluetooth action failed");
      } finally {
        U(!1);
      }
    }
  }, xe = (N, b) => de("Speaker settings saved.", () => w.callWS({ type: "bl_haos/speakers/settings/update", address: N, ...b })), Se = (N) => de("System settings saved.", () => w.callWS({ type: "bl_haos/speakers/system-settings/update", ...N }));
  return w ? /* @__PURE__ */ s.jsxs("section", { className: "speaker-management", "aria-label": "Speaker management", "aria-busy": I, children: [
    /* @__PURE__ */ s.jsxs("header", { children: [
      /* @__PURE__ */ s.jsx("h2", { children: "Speakers" }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          className: "neu-button",
          type: "button",
          disabled: I,
          onClick: () => {
            de("Scan started.", () => w.callWS({ type: "bl_haos/speakers/scan", start: !0 }));
          },
          children: "Scan"
        }
      ),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          className: "neu-button",
          type: "button",
          disabled: I,
          onClick: () => {
            de("Scan stopped.", () => w.callWS({ type: "bl_haos/speakers/scan", start: !1 }));
          },
          children: "Stop scan"
        }
      )
    ] }),
    X && /* @__PURE__ */ s.jsx("p", { className: "error", role: "alert", children: X }),
    /* @__PURE__ */ s.jsx("p", { role: "status", "aria-live": "polite", children: Z }),
    /* @__PURE__ */ s.jsxs("label", { children: [
      "Pairing PIN ",
      /* @__PURE__ */ s.jsx("input", { "aria-label": "Pairing PIN", value: De, onChange: (N) => K(N.target.value) })
    ] }),
    /* @__PURE__ */ s.jsx("ul", { "aria-label": "Bluetooth devices", children: V.map((N) => {
      const b = me.speakers?.[N.address] ?? {};
      return /* @__PURE__ */ s.jsxs("li", { className: "neu-surface", children: [
        /* @__PURE__ */ s.jsx("h3", { children: N.name || N.address }),
        /* @__PURE__ */ s.jsxs("p", { children: [
          N.address,
          " · ",
          N.connected ? "Connected" : N.paired ? "Paired" : "Discovered"
        ] }),
        !N.paired && /* @__PURE__ */ s.jsx(
          "button",
          {
            className: "neu-button",
            type: "button",
            disabled: I,
            onClick: () => {
              de("Pairing requested.", () => w.callWS({ type: "bl_haos/speakers/pair", address: N.address, pin: De }));
            },
            children: "Pair"
          }
        ),
        N.paired && (N.connected ? /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", disabled: I, onClick: () => {
          de("Speaker disconnected.", () => w.callWS({ type: "bl_haos/speakers/disconnect", address: N.address }));
        }, children: "Disconnect" }) : /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", disabled: I, onClick: () => {
          de("Speaker connected.", () => w.callWS({ type: "bl_haos/speakers/connect", address: N.address }));
        }, children: "Connect" })),
        N.paired && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Rename ",
            /* @__PURE__ */ s.jsx(
              "input",
              {
                "aria-label": `Rename ${N.name || N.address}`,
                value: B[N.address] ?? b.custom_alias ?? "",
                onChange: (ye) => ie((se) => ({ ...se, [N.address]: ye.target.value }))
              }
            )
          ] }),
          /* @__PURE__ */ s.jsx(
            "button",
            {
              className: "neu-button",
              type: "button",
              disabled: I,
              onClick: () => {
                xe(N.address, { custom_alias: B[N.address] ?? b.custom_alias ?? "" });
              },
              children: "Save name"
            }
          ),
          /* @__PURE__ */ s.jsxs("label", { children: [
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "checkbox",
                "aria-label": `Auto-reconnect ${N.name || N.address}`,
                checked: b.auto_reconnect ?? !0,
                onChange: (ye) => {
                  xe(N.address, { auto_reconnect: ye.target.checked });
                }
              }
            ),
            " Auto-reconnect"
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Preferred adapter ",
            /* @__PURE__ */ s.jsx(
              "input",
              {
                "aria-label": `Preferred adapter ${N.name || N.address}`,
                value: b.preferred_adapter ?? "",
                onChange: (ye) => he((se) => ({ ...se, speakers: { ...se.speakers, [N.address]: { ...b, preferred_adapter: ye.target.value } } }))
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Default volume ",
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "number",
                min: "0",
                max: "100",
                "aria-label": `Default volume ${N.name || N.address}`,
                value: b.default_volume ?? 50,
                onChange: (ye) => he((se) => ({ ...se, speakers: { ...se.speakers, [N.address]: { ...b, default_volume: Number(ye.target.value) } } }))
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Codec override ",
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                "aria-label": `Codec override ${N.name || N.address}`,
                value: b.codec_override ?? "",
                onChange: (ye) => {
                  xe(N.address, { codec_override: ye.target.value || null });
                },
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "", children: "Default" }),
                  fc.map((ye) => /* @__PURE__ */ s.jsx("option", { value: ye, children: ye }, ye))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", disabled: I, onClick: () => {
            xe(N.address, {
              custom_alias: B[N.address] ?? b.custom_alias ?? "",
              auto_reconnect: b.auto_reconnect ?? !0,
              preferred_adapter: b.preferred_adapter ?? null,
              default_volume: b.default_volume ?? 50,
              codec_override: b.codec_override ?? null
            });
          }, children: "Save speaker settings" }),
          /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", disabled: I, onClick: () => $e(N.address), children: "Remove" })
        ] })
      ] }, N.address);
    }) }),
    /* @__PURE__ */ s.jsxs("section", { className: "neu-surface", "aria-label": "Bluetooth adapters", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Adapters" }),
      pe.map((N) => /* @__PURE__ */ s.jsxs("label", { children: [
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "checkbox",
            "aria-label": `Adapter power ${N.interface}`,
            checked: N.powered,
            disabled: I,
            onChange: (b) => {
              de("Adapter updated.", () => w.callWS({ type: "bl_haos/speakers/adapters/power", adapter_name: N.interface, powered: b.target.checked }));
            }
          }
        ),
        N.interface,
        " powered"
      ] }, N.interface))
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "neu-surface", "aria-label": "System settings", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "System settings" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Log level ",
        /* @__PURE__ */ s.jsx(
          "select",
          {
            "aria-label": "Log level",
            value: me.log_level ?? "info",
            disabled: I,
            onChange: (N) => {
              Se({ log_level: N.target.value });
            },
            children: nf.map((N) => /* @__PURE__ */ s.jsx("option", { children: N }, N))
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Default codec ",
        /* @__PURE__ */ s.jsx(
          "select",
          {
            "aria-label": "Default codec",
            value: me.default_codec ?? "auto",
            disabled: I,
            onChange: (N) => {
              Se({ default_codec: N.target.value });
            },
            children: fc.map((N) => /* @__PURE__ */ s.jsx("option", { children: N }, N))
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "checkbox",
            "aria-label": "Global auto-reconnect",
            checked: me.auto_reconnect_enabled ?? !0,
            disabled: I,
            onChange: (N) => {
              Se({ auto_reconnect_enabled: N.target.checked });
            }
          }
        ),
        " Global auto-reconnect"
      ] })
    ] }),
    ke && /* @__PURE__ */ s.jsxs("dialog", { open: !0, "aria-modal": "true", "aria-label": "Confirm speaker removal", children: [
      /* @__PURE__ */ s.jsx("p", { children: "Remove this speaker?" }),
      /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", onClick: () => $e(""), children: "Cancel" }),
      /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", disabled: I, onClick: () => {
        const N = ke;
        $e(""), de("Speaker removed.", () => w.callWS({ type: "bl_haos/speakers/remove", address: N }));
      }, children: "Confirm remove" })
    ] })
  ] }) : /* @__PURE__ */ s.jsx("section", { className: "neu-surface", children: /* @__PURE__ */ s.jsx("p", { role: "alert", children: "Home Assistant is unavailable." }) });
}
function lf(w) {
  const V = w?.attributes.queue;
  return V && typeof V == "object" ? V : void 0;
}
function of(w) {
  return w?.status === "playing" || w?.status === "paused" || w?.status === "failed";
}
function pc(w) {
  if (typeof w != "number" || !Number.isFinite(w) || w < 0) return "Time unavailable";
  const V = Math.floor(w);
  return `${Math.floor(V / 60)}:${String(V % 60).padStart(2, "0")}`;
}
function wl(w) {
  return w.entity_id.startsWith("media_player.") && typeof w.attributes.bluetooth_address == "string" && /^(?:[0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(w.attributes.bluetooth_address) && typeof w.attributes.adapter == "string" && w.attributes.adapter.trim().length > 0 && ["idle", "playing", "paused"].includes(w.state);
}
function nn(w) {
  return typeof w.attributes.friendly_name == "string" ? w.attributes.friendly_name : w.entity_id;
}
function af(w) {
  return w.kind === "custom";
}
function Va(w) {
  return w.kind === "provider";
}
function mc(w) {
  return w.media_class?.toLowerCase() === "playlist" || w.media_content_type.toLowerCase().includes("playlist");
}
function sf(w) {
  if (!(!w?.startsWith("/") || w.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(w)))
    try {
      const V = "https://ha.invalid", y = new URL(w, V);
      if (y.origin !== V || y.protocol !== "https:" || y.username || y.password) return;
      const pe = `${y.pathname}${y.search}${y.hash}`;
      return pe.startsWith("//") ? void 0 : pe;
    } catch {
      return;
    }
}
function uf({ hass: w, thumbnail: V }) {
  const y = sf(V), pe = w?.connection, ae = pe?.connected, me = w?.user.id, he = w?.fetchWithAuth, [I, U] = g.useState();
  g.useEffect(() => {
    if (!y || !pe || !ae || !me || !he) return;
    const ve = new AbortController();
    let Z = !0, J;
    const De = { path: y, connection: pe, userId: me, fetchWithAuth: he };
    return (async () => {
      try {
        const K = await he(y, { signal: ve.signal, redirect: "error" });
        if (!K.ok) throw new Error("Artwork request failed");
        const B = await K.blob();
        if (!B.type.startsWith("image/") || !B.size) throw new Error("Invalid artwork response");
        if (!Z) return;
        J = URL.createObjectURL(B), U({ ...De, url: J, failed: !1 });
      } catch {
        Z && !ve.signal.aborted && U({ ...De, failed: !0 });
      }
    })(), () => {
      Z = !1, ve.abort(), J && URL.revokeObjectURL(J);
    };
  }, [y, pe, ae, me, he]);
  const X = ae && I?.path === y && I?.connection === pe && I?.userId === me && I?.fetchWithAuth === he ? I : void 0;
  return X?.url && !X.failed ? /* @__PURE__ */ s.jsx(
    "img",
    {
      className: "thumbnail",
      src: X.url,
      alt: "",
      loading: "lazy",
      referrerPolicy: "no-referrer",
      onError: () => U({ ...X, failed: !0 })
    }
  ) : y && (!he || X?.failed) ? /* @__PURE__ */ s.jsx("span", { className: "media-icon", role: "img", "aria-label": "Artwork unavailable", title: "Artwork unavailable", children: /* @__PURE__ */ s.jsx(fi, { size: 24, "aria-hidden": "true" }) }) : /* @__PURE__ */ s.jsx(fi, { className: "media-icon", size: 24, "aria-hidden": "true" });
}
const cf = "Your Home Assistant session cannot access this media source. Reconnect or ask an administrator for access, then try again.", df = "This source cannot play audio on a BL-HAOS speaker. Choose an audio item or provider playlist.";
function ff({ hass: w, initialView: V = "library" }) {
  const y = g.useRef(V), [pe, ae] = g.useState(V), [me, he] = g.useState("media"), [I, U] = g.useState(), [X, ve] = g.useState(!1), [Z, J] = g.useState(""), [De, K] = g.useState(""), [B, ie] = g.useState(!1), [ke, $e] = g.useState(), [Ie, de] = g.useState(""), [xe, Se] = g.useState([]), [N, b] = g.useState([]), [ye, se] = g.useState(""), [Be, dt] = g.useState(!1), [ot, qe] = g.useState(!1), [Xe, Pe] = g.useState(!1), [ue, P] = g.useState(), [A, c] = g.useState(), [x, M] = g.useState(!1), [Q, Y] = g.useState(), [G, re] = g.useState(""), [oe, ne] = g.useState({}), [Ge, _n] = g.useState(""), [wt, Mr] = g.useState(""), [ir, rn] = g.useState(""), [Mt, Ir] = g.useState(""), [It, Or] = g.useState(() => /* @__PURE__ */ new Set()), [Ar, ft] = g.useState({}), [bt, Cn] = g.useState(""), [xl, En] = g.useState(""), Sl = g.useRef(null), [Nn, jn] = g.useState(""), [or, Pn] = g.useState(""), [Ot, ln] = g.useState(!1), [pi, Kt] = g.useState(""), [kl, _l] = g.useState({}), [on, ar] = g.useState(() => /* @__PURE__ */ new Set()), sr = g.useRef(null), an = g.useRef(""), [Oe, Yt] = g.useState(), [tt, Fr] = g.useState([]), [at, Cl] = g.useState(""), [qt, El] = g.useState(""), [Ae, Rn] = g.useState(!1), [ze, ur] = g.useState(!1), [Ln, $r] = g.useState(""), [zn, jt] = g.useState(""), [Br, sn] = g.useState(""), [Ur, Wr] = g.useState(""), [ho, At] = g.useState(!1), [Tn, cr] = g.useState(), [dr, Dn] = g.useState(), [mi, Nl] = g.useState(), fr = g.useRef(""), jl = g.useRef(!1), hi = g.useRef(null), Ce = g.useRef(/* @__PURE__ */ new Map()), Pl = g.useRef(/* @__PURE__ */ new Map()), pr = g.useRef(/* @__PURE__ */ new Map()), Rl = g.useRef(/* @__PURE__ */ new Map()), un = g.useRef(/* @__PURE__ */ new Map()), Ll = g.useRef(/* @__PURE__ */ new Map()), mr = g.useRef(), cn = g.useRef(), xt = g.useRef(null), vo = g.useRef(null), st = g.useRef(null), zl = g.useRef(null), Tl = g.useRef(null), Dl = g.useRef(null), hr = g.useRef(null), vr = g.useRef(null), Mn = g.useRef(null), yr = g.useRef(null), vi = g.useRef(null), St = g.useRef(null), In = g.useRef(!1), On = g.useRef({ name: "", entries: [] }), Hr = g.useRef(null), kt = g.useRef(0), An = g.useRef(0), q = g.useRef(0), le = g.useRef(""), Ml = g.useRef(0), Vr = g.useRef(!1), Fn = g.useRef(/* @__PURE__ */ new Set()), gr = g.useRef(/* @__PURE__ */ new Set()), dn = g.useRef(0), wr = g.useRef(!1), Ve = g.useRef(w);
  Ve.current = w;
  const xr = w?.connection, Ft = w?.user?.id, ee = !!(xr?.connected && Ft), $t = Object.values(w?.states ?? {}).filter(wl), _t = w?.states[at], Ue = ee && _t !== void 0 && wl(_t), ge = lf(_t);
  async function Il() {
    const a = Ve.current;
    if (!a?.connection.connected || !a.user?.id) {
      ve(!1);
      return;
    }
    const v = ++An.current;
    ve(!0), J("");
    try {
      const j = await a.callWS({ type: "bl_haos/playlist_library/list" });
      An.current === v && U(j);
    } catch {
      An.current === v && J("Couldn't load your library. Reconnect Home Assistant, then select Retry loading.");
    } finally {
      An.current === v && ve(!1);
    }
  }
  function Ol(a) {
    return on.has(a) ? "Checking availability..." : kl[a] === "available" ? "Available in Home Assistant" : kl[a] === "unavailable" ? "Unavailable in Home Assistant." : "Not checked";
  }
  async function $n(a, v) {
    const j = Ve.current;
    if (!j?.connection.connected || !j.user?.id || !v.startsWith("media-source://") || gr.current.has(a)) return;
    const C = q.current;
    gr.current.add(a), ar((T) => new Set(T).add(a)), K("Checking availability...");
    try {
      if (await j.callWS({ type: "media_source/browse_media", media_content_id: v }), q.current !== C) return;
      _l((T) => ({ ...T, [a]: "available" })), K("Available in Home Assistant.");
    } catch {
      if (q.current !== C) return;
      _l((T) => ({ ...T, [a]: "unavailable" })), K("Unavailable in Home Assistant.");
    } finally {
      q.current === C && (gr.current.delete(a), ar((T) => {
        const W = new Set(T);
        return W.delete(a), W;
      }));
    }
  }
  g.useLayoutEffect(() => {
    const a = Ve.current;
    if (q.current++, ++kt.current, An.current++, dn.current++, wr.current = !1, Yt(void 0), Fr([]), ae(y.current), U(void 0), J(""), K(""), ie(!1), $e(void 0), de(""), Se([]), b([]), se(""), dt(!1), qe(!1), Pe(!1), P(void 0), c(void 0), M(!1), Y(void 0), re(""), ne({}), _n(""), Mr(""), rn(""), Ir(""), Or(/* @__PURE__ */ new Set()), Fn.current.clear(), ft({}), jn(""), Pn(""), ln(!1), Kt(""), _l({}), ar(/* @__PURE__ */ new Set()), gr.current.clear(), Cn(""), En(""), an.current = "", le.current = "", Cl(""), El(""), ur(!1), sn(""), cr(void 0), Dn(void 0), Nl(void 0), Wr(""), At(!1), Rn(ee), $r(""), jt(""), !(!a || !ee))
      return Rn(!1), y.current === "browse" ? fn({ path: [] }, !0) : Il(), () => {
        q.current++, kt.current++, An.current++, dn.current++;
      };
  }, [xr, Ft, ee]), g.useLayoutEffect(() => {
    fr.current ? (Ce.current.get(fr.current)?.focus(), fr.current = "") : jl.current && (hi.current?.focus(), jl.current = !1);
  }, [Oe]), g.useLayoutEffect(() => {
    const a = mr.current;
    if (!a) return;
    mr.current = void 0;
    const v = Ll.current.get(a.key);
    a.action === "down" && v?.down && !v.down.disabled ? v.down.focus() : a.action === "up" && v?.up && !v.up.disabled ? v.up.focus() : v?.remove ? v.remove.focus() : Hr.current?.focus();
  }, [N]), g.useLayoutEffect(() => {
    const a = Q ? Dl.current : ue ? st.current : A ? zl.current : x ? Tl.current : void 0, v = [st.current, zl.current, Tl.current, Dl.current];
    a && !a.open && (typeof a.showModal == "function" ? a.showModal() : a.setAttribute("open", ""));
    for (const j of v)
      !j?.open || j === a || (typeof j.close == "function" ? j.close() : j.removeAttribute("open"));
  }, [ue, A, x, Q]), g.useLayoutEffect(() => {
    !Vr.current || x || B || ke || (Vr.current = !1, St.current?.isConnected && St.current.click());
  }, [x, B, ke]), g.useLayoutEffect(() => {
    Q ? yr.current?.focus() : ue ? hr.current?.focus() : A ? vr.current?.focus() : x ? Mn.current?.focus() : St.current?.isConnected && St.current.focus(), !ue && !A && !x && !Q && (St.current = null);
  }, [ue, A, x, Q]), g.useLayoutEffect(() => {
    const a = cn.current;
    a && (cn.current = void 0, a === "create" ? xt.current?.focus() : Pl.current.get(a)?.focus());
  }, [I, B, ke, ue, x]), g.useLayoutEffect(() => {
    if (bt && Sl.current?.focus(), Nn) {
      sr.current?.focus();
      return;
    }
    const a = an.current;
    a && (an.current = "", pr.current.get(a)?.focus());
  }, [bt, Nn, I]);
  async function fn(a, v = !1) {
    const j = Ve.current, { item: C, path: T, query: W } = a;
    if (!j?.connection.connected || !j.user?.id || ze && !v || C && (!C.media_content_id.startsWith("media-source://") || (W === void 0 ? !C.can_expand : !C.can_search))) return;
    const we = ++kt.current;
    Rn(!0), $r(""), jt(""), sn(""), cr(void 0), Dn(void 0);
    try {
      const Qe = await j.callWS(W !== void 0 && C ? { type: "media_source/search_media", media_content_id: C.media_content_id, search_query: W } : { type: "media_source/browse_media", ...C ? { media_content_id: C.media_content_id } : {} });
      if (kt.current !== we) return;
      C && W === void 0 && (jl.current = !0), Fr(T), Yt("result" in Qe && C ? { ...C, children: Qe.result } : Qe), At(W !== void 0), W === void 0 && Wr("");
    } catch {
      kt.current === we && ($r(cf), cr(a));
    } finally {
      kt.current === we && Rn(!1);
    }
  }
  function Al() {
    ae("browse"), (B || ke) && Pe(!0), !Oe && !Ae && fn({ path: [] });
  }
  function Qr() {
    le.current = crypto.randomUUID(), de(""), Se([]), b([]), On.current = { name: "", entries: [] }, se(""), qe(!1), $e(void 0), ie(!0), Pe(!1), ae("library");
  }
  function yi(a) {
    $e(a), ie(!1), de(a.name), Se(a.entries.map((v) => ({ ...v }))), b(a.entries.map(() => `entry-${Ml.current++}`)), On.current = { name: a.name, entries: a.entries.map((v) => ({ ...v })) }, se(""), qe(!1), Pe(!1), ae("library");
  }
  function br() {
    const a = ke?.record_id ?? (B ? "create" : "");
    a && (cn.current = a), ie(!1), $e(void 0), de(""), Se([]), b([]), se(""), qe(!1), Pe(!1), On.current = { name: "", entries: [] }, le.current = "", ae("library");
  }
  function Bn() {
    return Ie !== On.current.name || JSON.stringify(xe) !== JSON.stringify(On.current.entries);
  }
  function Un(a, v = !1) {
    if (St.current = a, In.current = v, Bn()) {
      M(!0);
      return;
    }
    br();
  }
  function Wn(a, v) {
    St.current = v, _n(""), P(a);
  }
  function Kr(a, v) {
    St.current = v, rn(""), c(a);
  }
  function Xt() {
    P(void 0), c(void 0), M(!1), Y(void 0), _n(""), rn("");
  }
  function Yr(a) {
    if (a.key === "Escape" && !wt && !Mt && !G) {
      a.preventDefault(), Xt();
      return;
    }
    if (a.key !== "Tab") return;
    const v = Array.from(a.currentTarget.querySelectorAll("button:not(:disabled)"));
    if (!v.length) return;
    const j = v[0], C = v[v.length - 1];
    a.shiftKey && document.activeElement === j ? (a.preventDefault(), C.focus()) : !a.shiftKey && document.activeElement === C && (a.preventDefault(), j.focus());
  }
  async function Fl() {
    const a = Ve.current, v = ue;
    if (!v || !a?.connection.connected || !a.user?.id || wt) return;
    const j = q.current;
    Mr(v.record_id), _n(""), K("Deleting playlist...");
    try {
      const C = await a.callWS({
        type: "bl_haos/playlist_library/delete_custom",
        record_id: v.record_id,
        revision: I?.revision ?? 0
      });
      if (q.current !== j) return;
      const T = C, we = (I?.records ?? []).filter((mn) => mn.kind === "custom").findIndex((mn) => mn.record_id === v.record_id), Qe = T.records.filter((mn) => mn.kind === "custom"), yo = Qe[Math.min(Math.max(we, 0), Qe.length - 1)];
      cn.current = yo?.record_id ?? "create", St.current = null, U(T), P(void 0), K("Playlist deleted.");
    } catch (C) {
      if (q.current !== j) return;
      const T = C instanceof Error ? C.message : "";
      if (/Playlist library changed/i.test(T)) {
        _n(`Couldn't delete “${v.name}” right now. It remains in your library. Select Delete playlist to try again, or Keep playlist.`);
        try {
          const W = await a.callWS({ type: "bl_haos/playlist_library/list" });
          q.current === j && U(W);
        } catch {
        }
      } else
        _n(`Couldn't delete “${v.name}” right now. It remains in your library. Select Delete playlist to try again, or Keep playlist.`);
      q.current === j && K("");
    } finally {
      q.current === j && Mr("");
    }
  }
  function qr(a) {
    Cn(a.media_content_id), En(a.title), ft((v) => {
      const j = { ...v };
      return delete j[a.media_content_id], j;
    });
  }
  async function $l(a, v) {
    const j = Ve.current, C = a.media_content_id, T = v.trim();
    if (!T) {
      ft((we) => ({ ...we, [C]: "Enter a shortcut name before saving." }));
      return;
    }
    if (new TextEncoder().encode(T).length > 128) {
      ft((we) => ({
        ...we,
        [C]: "Shortcut names must be at most 128 UTF-8 bytes. Enter a shorter name."
      }));
      return;
    }
    if (!j?.connection.connected || !j.user?.id || !mc(a) || It.has(C) || Fn.current.has(C) || !C.startsWith("media-source://")) return;
    const W = q.current;
    Fn.current.add(C), Or((we) => new Set(we).add(C)), ft((we) => {
      const Qe = { ...we };
      return delete Qe[C], Qe;
    }), K(`Saving “${T}” to your library...`);
    try {
      const we = await j.callWS({
        type: "bl_haos/playlist_library/save_provider",
        media_content_id: C,
        name: T,
        ...a.title ? { title: a.title } : {},
        ...a.media_class ? { media_class: a.media_class } : {},
        ...a.media_content_type ? { media_content_type: a.media_content_type } : {}
      });
      if (q.current !== W) return;
      U(we), Cn(""), En(""), K("Playlist saved to your library.");
    } catch {
      q.current === W && (ft((we) => ({
        ...we,
        [C]: `Couldn't save “${T}” to your library right now. Nothing was added. Select Save shortcut to try again, or cancel to return to Browse media.`
      })), K(""));
    } finally {
      q.current === W && (Fn.current.delete(C), Or((we) => {
        const Qe = new Set(we);
        return Qe.delete(C), Qe;
      }));
    }
  }
  function gi(a) {
    jn(a.record_id), Pn(a.name), Kt("");
  }
  function Gt(a) {
    an.current = a, jn(""), Pn(""), Kt("");
  }
  async function Bl(a) {
    const v = Ve.current, j = or.trim();
    if (!j) {
      Kt("Enter a shortcut name before saving.");
      return;
    }
    if (!v?.connection.connected || !v.user?.id || Ot) return;
    const C = q.current;
    ln(!0), Kt(""), K("Saving shortcut name...");
    try {
      const T = await v.callWS({
        type: "bl_haos/playlist_library/rename_provider",
        record_id: a.record_id,
        name: j,
        revision: I?.revision ?? 0
      });
      if (q.current !== C) return;
      U(T), an.current = a.record_id, jn(""), Pn(""), K("Shortcut name saved.");
    } catch (T) {
      if (q.current !== C) return;
      if (Kt(T instanceof Error && /invalid_format|Invalid playlist record/i.test(T.message) ? "Shortcut names must be non-empty and at most 128 UTF-8 bytes. Enter a shorter name, then save again." : `Couldn't rename “${a.name}” right now. Your local name is still here. Select Save shortcut name to try again.`), sr.current?.focus(), T instanceof Error && /Playlist library changed/i.test(T.message))
        try {
          const W = await v.callWS({ type: "bl_haos/playlist_library/list" });
          q.current === C && U(W);
        } catch {
        }
      q.current === C && K("");
    } finally {
      q.current === C && ln(!1);
    }
  }
  async function Xr() {
    const a = Ve.current, v = A;
    if (!v || !a?.connection.connected || !a.user?.id || Mt) return;
    const j = q.current;
    Ir(v.record_id), rn(""), K("Removing shortcut...");
    try {
      const C = await a.callWS({
        type: "bl_haos/playlist_library/delete_provider",
        record_id: v.record_id,
        revision: I?.revision ?? 0
      });
      if (q.current !== j) return;
      U(C), St.current = vi.current, c(void 0), K("Shortcut removed. The Home Assistant playlist is unchanged.");
    } catch (C) {
      if (q.current !== j) return;
      if (rn(`Couldn't remove “${v.name}” right now. The shortcut remains in your library, and the Home Assistant playlist is unchanged. Select Remove shortcut to try again, or Keep shortcut.`), C instanceof Error && /Playlist library changed/i.test(C.message))
        try {
          const T = await a.callWS({ type: "bl_haos/playlist_library/list" });
          q.current === j && U(T);
        } catch {
        }
      q.current === j && K("");
    } finally {
      q.current === j && Ir("");
    }
  }
  function wi(a) {
    if (!a.can_play || !a.media_content_id.startsWith("media-source://")) return;
    const v = a.media_class?.toLowerCase();
    if (!(a.media_content_type.toLowerCase().startsWith("audio/") || ["music", "track", "episode"].includes(v ?? ""))) return;
    const C = {
      media_content_id: a.media_content_id,
      title: a.title,
      ...a.media_class ? { media_class: a.media_class } : {},
      media_content_type: a.media_content_type
    };
    Se((T) => [...T, C]), b((T) => [...T, `entry-${Ml.current++}`]), se(""), Pe(!1), ae("library");
  }
  function Sr(a, v) {
    const j = a + v;
    if (j < 0 || j >= xe.length) return;
    const C = [...xe], T = [...N];
    [C[a], C[j]] = [C[j], C[a]], [T[a], T[j]] = [T[j], T[a]], mr.current = { key: N[a], action: v === 1 ? "down" : "up" }, Se(C), b(T), se("");
    const W = xe[a].title || "Media item";
    K(`Moved ${W} to position ${j + 1} of ${xe.length}.`);
  }
  function Gr(a) {
    const v = xe.filter((T, W) => W !== a), j = N.filter((T, W) => W !== a), C = Math.min(a, j.length - 1);
    mr.current = C >= 0 ? { key: j[C], action: "remove" } : { key: "", action: "remove" }, Se(v), b(j), se("");
  }
  async function xi(a) {
    a.preventDefault();
    const v = Ve.current, j = Ie.trim();
    if (!j) {
      se("Enter a playlist name before saving.");
      return;
    }
    if (!v?.connection.connected || !v.user?.id || Be) return;
    const C = q.current;
    B && (le.current ||= crypto.randomUUID()), dt(!0), se(""), K(B ? "Saving playlist..." : "Saving changes...");
    try {
      const T = await v.callWS({
        type: B ? "bl_haos/playlist_library/save_custom" : "bl_haos/playlist_library/update_custom",
        record_id: B ? le.current : ke.record_id,
        name: j,
        entries: xe,
        revision: I?.revision ?? 0
      });
      if (q.current !== C) return;
      U(T), br(), K(B ? "Playlist saved." : "Changes saved.");
    } catch (T) {
      if (q.current !== C) return;
      const W = T instanceof Error ? T.message : "";
      if (/Playlist library changed/i.test(W)) {
        qe(!0), se("This playlist changed in Home Assistant. Your edits are still here. The newer saved version was kept; stop editing and reopen the playlist to review it.");
        try {
          const we = await v.callWS({ type: "bl_haos/playlist_library/list" });
          q.current === C && U(we);
        } catch {
        }
      } else /not found/i.test(W) ? se("The selected playlist or a media item couldn't be matched. Return to Your playlists and select Edit playlist on the intended row; for an affected media item, remove it or add it again from Browse media. Your valid draft data is still here.") : /invalid_format|Invalid playlist record/i.test(W) ? se("This playlist has details that can't be saved yet. Review the playlist name and entries, correct any marked fields, then select Save playlist or Save changes. Your valid draft data is still here.") : se(B ? "Couldn't save this playlist right now. Your draft is still here. Select Save playlist to try again, or Discard draft to leave without saving." : `Couldn't save changes to “${ke?.name ?? j}” right now. Your edits are still here. Select Save changes to try again, or Stop editing to leave without saving.`);
      q.current === C && K("");
    } finally {
      q.current === C && dt(!1);
    }
  }
  function Ze(a = tt.length - 1) {
    const v = tt[a];
    !v || ze || (kt.current++, fr.current = Oe?.media_content_id ?? "", Yt(v), Fr(tt.slice(0, a)), Rn(!1), At(!1), Wr(""), cr(void 0), $r(""), jt(""));
  }
  function pn(a, v) {
    if (!(!ee || !Ue || X || ze || G || a.kind === "custom" && a.entries.length === 0)) {
      if (ne((j) => {
        const C = { ...j };
        return delete C[a.record_id], C;
      }), of(ge)) {
        St.current = v, Y(a);
        return;
      }
      Zr(a);
    }
  }
  async function Zr(a) {
    const v = Ve.current, j = at, C = v?.states[j];
    if (!v?.connection.connected || !v.user?.id || !C || !wl(C) || !j || G) return;
    const T = q.current;
    re(a.record_id), K(`Preparing “${a.name}” for ${nn(C)}…`);
    try {
      if (await v.callWS({
        type: "bl_haos/playlist_library/start",
        record_id: a.record_id,
        entity_id: j
      }), q.current !== T) return;
      const W = Ve.current?.states[j];
      if (!W || !wl(W)) {
        ne((we) => ({
          ...we,
          [a.record_id]: `Couldn't confirm “${a.name}” started on ${nn(C)}. Check the current queue before trying again.`
        })), K("");
        return;
      }
      K(`Queue updated on ${nn(W)}.`), Y(void 0);
    } catch {
      q.current === T && (ne((W) => ({
        ...W,
        [a.record_id]: `Couldn't confirm “${a.name}” started on ${nn(C)}. Check the current queue before trying again.`
      })), K(""));
    } finally {
      q.current === T && re("");
    }
  }
  async function Hn(a, v = at) {
    const j = Ve.current, C = j?.states[v];
    if (!j?.connection.connected || !j.user?.id || !C || !wl(C) || !a.can_play || v !== at || Ae || !a.media_content_id.startsWith("media-source://") || wr.current) return;
    const T = ++dn.current;
    wr.current = !0, ur(!0), jt(""), sn(""), Nl(a), Dn(void 0);
    try {
      if (await j.callService("media_player", "play_media", {
        media_content_id: a.media_content_id,
        media_content_type: a.media_content_type
      }, { entity_id: C.entity_id }), dn.current !== T) return;
      const W = Ve.current?.states[C.entity_id];
      W && wl(W) ? sn(`Starting playback on ${nn(W)}`) : jt("The selected speaker is unavailable. Select a connected speaker to play media.");
    } catch {
      dn.current === T && (jt(`Home Assistant could not play this item on ${nn(C)}. Check the provider access and speaker connection, then try again.`), Dn({ item: a, target: C.entity_id }));
    } finally {
      dn.current === T && (wr.current = !1, ur(!1));
    }
  }
  return /* @__PURE__ */ s.jsxs("main", { className: "neu-page", onKeyDown: (a) => {
    pe === "browse" && a.key === "Escape" && tt.length && !ze && (a.preventDefault(), Ze());
  }, children: [
    /* @__PURE__ */ s.jsxs("header", { className: "catalog-header", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "catalog-heading", children: [
        pe === "browse" && /* @__PURE__ */ s.jsx(
          "button",
          {
            className: "neu-button icon-button",
            "aria-label": "Back",
            title: "Back",
            ref: hi,
            disabled: tt.length === 0 || ze,
            onClick: () => Ze(),
            children: /* @__PURE__ */ s.jsx(Xd, { size: 20, "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("p", { className: "eyebrow", children: "BL-HAOS" }),
          /* @__PURE__ */ s.jsx("h1", { children: pe === "library" ? "Media Library" : "Media Catalog" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "target-control", children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "catalog-target", children: "Play on" }),
        /* @__PURE__ */ s.jsxs(
          "select",
          {
            id: "catalog-target",
            className: "neu-inset",
            value: at,
            disabled: !ee || ze || !!G,
            onChange: (a) => {
              Cl(a.target.value);
              const v = w?.states[a.target.value];
              El(v ? nn(v) : ""), sn(""), K(""), Dn(void 0), jt(""), ne({});
            },
            children: [
              /* @__PURE__ */ s.jsx("option", { value: "", children: "Select a connected speaker" }),
              at && !Ue && /* @__PURE__ */ s.jsxs("option", { value: at, disabled: !0, children: [
                qt,
                " (unavailable)"
              ] }),
              $t.map((a) => /* @__PURE__ */ s.jsx("option", { value: a.entity_id, children: nn(a) }, a.entity_id))
            ]
          }
        ),
        at && /* @__PURE__ */ s.jsx("span", { className: "selected-target", title: Ue && _t ? nn(_t) : qt, children: Ue && _t ? nn(_t) : qt })
      ] }),
      /* @__PURE__ */ s.jsx(
        "a",
        {
          className: "neu-button icon-button close-catalog",
          href: "/",
          "aria-label": "Close catalog",
          title: "Close catalog",
          onClick: (a) => {
            (B || ke) && (Bn() ? (a.preventDefault(), Un(a.currentTarget, !0)) : br());
          },
          children: /* @__PURE__ */ s.jsx(tf, { size: 20, "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("nav", { className: "view-toggle", "aria-label": "Media views", children: [
      /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", ref: vo, "aria-pressed": me === "media" && pe === "library", onClick: () => {
        he("media"), Pe(!1), ae("library"), !I && !X && !Z && Il();
      }, children: "Library" }),
      /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", ref: vi, "aria-pressed": me === "media" && pe === "browse", onClick: () => {
        he("media"), Al();
      }, children: "Browse media" }),
      /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", "aria-pressed": me === "speakers", onClick: () => he("speakers"), children: "Speakers" })
    ] }),
    me === "speakers" ? /* @__PURE__ */ s.jsx(rf, { hass: w }) : pe === "library" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      !ee && /* @__PURE__ */ s.jsx("p", { role: "alert", children: "Your Home Assistant session is unavailable." }),
      Z && /* @__PURE__ */ s.jsxs("div", { className: "error", role: "alert", children: [
        /* @__PURE__ */ s.jsx("p", { children: Z }),
        /* @__PURE__ */ s.jsx("button", { className: "neu-button", disabled: !ee || X, onClick: () => {
          Il();
        }, children: "Retry loading" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "status", role: "status", "aria-live": "polite", "aria-atomic": "true", children: X ? "Loading playlists..." : De }),
      /* @__PURE__ */ s.jsxs("section", { className: "neu-surface queue-summary", "aria-label": "Playback queue", children: [
        /* @__PURE__ */ s.jsx("h2", { children: "Playback queue" }),
        /* @__PURE__ */ s.jsxs("div", { className: "queue-summary-body", "aria-live": "polite", "aria-atomic": "true", children: [
          !at && /* @__PURE__ */ s.jsx("p", { children: "No active queue. Select a connected speaker to view playback." }),
          at && !Ue && /* @__PURE__ */ s.jsx("p", { children: "Speaker disconnected. The queue was stopped. Select a connected speaker to start a playlist." }),
          Ue && !ge && /* @__PURE__ */ s.jsx("p", { children: "No active queue" }),
          Ue && ge && /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            /* @__PURE__ */ s.jsx("p", { className: "queue-playlist", children: ge.status === "completed" ? "Playlist complete" : ge.playlist ?? "Playback queue" }),
            /* @__PURE__ */ s.jsx("p", { children: ge.title ?? "Current item unavailable" }),
            ge.artist && /* @__PURE__ */ s.jsx("p", { className: "metadata", children: ge.artist }),
            typeof ge.index == "number" && typeof ge.count == "number" && /* @__PURE__ */ s.jsxs("p", { children: [
              "Item ",
              ge.index,
              " of ",
              ge.count
            ] }),
            /* @__PURE__ */ s.jsxs("p", { children: [
              pc(ge.position),
              " / ",
              pc(ge.duration)
            ] }),
            /* @__PURE__ */ s.jsxs("p", { className: "metadata", children: [
              ge.status ?? "Status unavailable",
              ge.shuffle ? " · Shuffle on" : "",
              ge.repeat ? ` · Repeat ${ge.repeat}` : ""
            ] }),
            ge.error && /* @__PURE__ */ s.jsx("p", { className: "error", role: "alert", children: "Playback failed. Nothing was skipped." })
          ] })
        ] })
      ] }),
      $t.length === 0 && /* @__PURE__ */ s.jsx("p", { className: "warning", children: "No connected speakers are available. Connect a speaker, then select it to play a playlist." }),
      /* @__PURE__ */ s.jsxs("section", { className: "neu-surface", "aria-label": "Your playlists", "aria-busy": X, children: [
        /* @__PURE__ */ s.jsx("h2", { children: "Your playlists" }),
        /* @__PURE__ */ s.jsxs("div", { className: "library-body", children: [
          X && /* @__PURE__ */ s.jsx("p", { className: "library-message", children: "Loading playlists..." }),
          !X && !Z && I && !I.records.some((a) => a.kind === "custom") && !I.records.some(Va) && /* @__PURE__ */ s.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ s.jsx("h3", { children: "Your library is empty" }),
            /* @__PURE__ */ s.jsx("p", { children: "Create a playlist or browse Home Assistant media to save a playlist reference." })
          ] }),
          !X && /* @__PURE__ */ s.jsx("ul", { "aria-label": "Your playlists", children: (I?.records ?? []).filter(af).map((a) => /* @__PURE__ */ s.jsxs("li", { children: [
            /* @__PURE__ */ s.jsx(fi, { className: "media-icon", size: 24, "aria-hidden": "true" }),
            /* @__PURE__ */ s.jsxs("div", { className: "media-detail", children: [
              /* @__PURE__ */ s.jsx("span", { className: "media-title", children: a.name }),
              /* @__PURE__ */ s.jsxs("span", { className: "metadata", children: [
                a.entries.length,
                " items"
              ] }),
              oe[a.record_id] && /* @__PURE__ */ s.jsx("span", { className: "error", role: "alert", children: oe[a.record_id] })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
              /* @__PURE__ */ s.jsx(
                "button",
                {
                  className: "neu-button primary-button",
                  type: "button",
                  "aria-label": `Play playlist ${a.name}`,
                  ref: (v) => {
                    v ? un.current.set(a.record_id, v) : un.current.delete(a.record_id);
                  },
                  disabled: !ee || !Ue || a.entries.length === 0 || X || !!G,
                  onClick: (v) => pn(a, v.currentTarget),
                  children: G === a.record_id ? "Preparing..." : "Play playlist"
                }
              ),
              /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", ref: (v) => {
                v ? Pl.current.set(a.record_id, v) : Pl.current.delete(a.record_id);
              }, disabled: !ee || !!wt || B || !!ke, onClick: () => yi(a), children: "Edit playlist" }),
              /* @__PURE__ */ s.jsx(
                "button",
                {
                  className: "neu-button destructive-button",
                  type: "button",
                  disabled: !ee || !!wt || B || !!ke,
                  onClick: (v) => Wn(a, v.currentTarget),
                  children: "Delete playlist"
                }
              )
            ] })
          ] }, a.record_id)) }),
          !B && !ke && /* @__PURE__ */ s.jsx(
            "button",
            {
              className: "neu-button primary-button",
              type: "button",
              disabled: !ee || !I || !!Z || X || Be,
              ref: xt,
              onClick: Qr,
              children: "Create playlist"
            }
          ),
          (B || ke) && !Xe && /* @__PURE__ */ s.jsxs("form", { className: "playlist-form", onSubmit: (a) => {
            xi(a);
          }, children: [
            /* @__PURE__ */ s.jsx("label", { htmlFor: "playlist-name", children: "Playlist name" }),
            /* @__PURE__ */ s.jsx(
              "input",
              {
                id: "playlist-name",
                className: "neu-inset",
                type: "text",
                value: Ie,
                onChange: (a) => {
                  de(a.target.value), se("");
                },
                disabled: Be
              }
            ),
            /* @__PURE__ */ s.jsx("h3", { children: "Playlist entries" }),
            /* @__PURE__ */ s.jsxs("ol", { className: "playlist-entries", "aria-label": "Playlist entries", "aria-busy": Be, children: [
              xe.length === 0 && /* @__PURE__ */ s.jsx("li", { className: "empty-entry", children: "No media added yet. Add media to build this playlist, or save it as an empty draft." }),
              xe.map((a, v) => {
                const j = N[v], C = a.title || "Media item", T = (W, we) => {
                  const Qe = Ll.current.get(j) ?? {};
                  we ? Qe[W] = we : delete Qe[W], Ll.current.set(j, Qe);
                };
                return /* @__PURE__ */ s.jsxs("li", { children: [
                  /* @__PURE__ */ s.jsx(fi, { className: "media-icon", size: 24, "aria-hidden": "true" }),
                  /* @__PURE__ */ s.jsxs("div", { className: "media-detail", children: [
                    /* @__PURE__ */ s.jsx("span", { className: "media-title", title: C, children: C }),
                    /* @__PURE__ */ s.jsx("span", { className: "metadata", children: a.media_class ?? a.media_content_type ?? "Home Assistant media" }),
                    /* @__PURE__ */ s.jsx("span", { className: "metadata", children: Ol(`entry:${j}`) })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { className: "row-actions entry-actions", children: [
                    /* @__PURE__ */ s.jsx(
                      "button",
                      {
                        className: "neu-button",
                        type: "button",
                        disabled: !ee || on.has(`entry:${j}`),
                        onClick: () => {
                          $n(`entry:${j}`, a.media_content_id);
                        },
                        children: on.has(`entry:${j}`) ? "Checking availability..." : "Check availability"
                      }
                    ),
                    /* @__PURE__ */ s.jsx(
                      "button",
                      {
                        className: "neu-button icon-button",
                        type: "button",
                        "aria-label": "Move entry up",
                        title: "Move entry up",
                        ref: (W) => T("up", W),
                        disabled: Be || v === 0,
                        onClick: () => Sr(v, -1),
                        children: /* @__PURE__ */ s.jsx(Gd, { size: 18, "aria-hidden": "true" })
                      }
                    ),
                    /* @__PURE__ */ s.jsx(
                      "button",
                      {
                        className: "neu-button icon-button",
                        type: "button",
                        "aria-label": "Move entry down",
                        title: "Move entry down",
                        ref: (W) => T("down", W),
                        disabled: Be || v === xe.length - 1,
                        onClick: () => Sr(v, 1),
                        children: /* @__PURE__ */ s.jsx(qd, { size: 18, "aria-hidden": "true" })
                      }
                    ),
                    /* @__PURE__ */ s.jsx(
                      "button",
                      {
                        className: "neu-button",
                        type: "button",
                        "aria-label": `Remove ${C}`,
                        disabled: Be,
                        ref: (W) => T("remove", W),
                        onClick: () => Gr(v),
                        children: "Remove media item"
                      }
                    )
                  ] })
                ] }, j);
              })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "row-actions editor-actions", children: [
              /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", ref: Hr, disabled: !ee || Be, onClick: () => {
                Pe(!0), ae("browse"), !Oe && !Ae && fn({ path: [] });
              }, children: "Add media" }),
              /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "submit", disabled: !ee || Be || ot, children: Be ? "Saving..." : B ? "Save playlist" : "Save changes" }),
              /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", disabled: Be, onClick: (a) => Un(a.currentTarget), children: B ? "Discard draft" : "Stop editing" })
            ] }),
            ye && /* @__PURE__ */ s.jsx("p", { className: "error", role: "alert", children: ye })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "neu-surface provider-library", "aria-label": "Saved Home Assistant playlists", "aria-busy": X, children: [
        /* @__PURE__ */ s.jsx("h2", { children: "Saved Home Assistant playlists" }),
        /* @__PURE__ */ s.jsxs("div", { className: "provider-library-body", children: [
          X && /* @__PURE__ */ s.jsx("p", { className: "library-message", children: "Loading saved playlists..." }),
          !X && !Z && I && !I.records.some(Va) && /* @__PURE__ */ s.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ s.jsx("p", { children: "No Home Assistant playlists saved. Browse media to save a playlist reference." }),
            /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", disabled: !ee, onClick: Al, children: "Browse media" })
          ] }),
          !X && /* @__PURE__ */ s.jsx("ul", { "aria-label": "Saved Home Assistant playlists", children: (I?.records ?? []).filter(Va).map((a) => /* @__PURE__ */ s.jsxs("li", { children: [
            /* @__PURE__ */ s.jsx(fi, { className: "media-icon", size: 24, "aria-hidden": "true" }),
            /* @__PURE__ */ s.jsxs("div", { className: "media-detail", children: [
              /* @__PURE__ */ s.jsx("span", { className: "media-title provider-title", title: a.name, children: a.name }),
              /* @__PURE__ */ s.jsx("span", { className: "metadata", children: "Home Assistant playlist" }),
              /* @__PURE__ */ s.jsx("span", { className: "metadata", children: "Provider contents are managed by Home Assistant." }),
              /* @__PURE__ */ s.jsx("span", { className: "metadata", children: Ol(`provider:${a.record_id}`) }),
              oe[a.record_id] && /* @__PURE__ */ s.jsx("span", { className: "error", role: "alert", children: oe[a.record_id] }),
              Nn === a.record_id ? /* @__PURE__ */ s.jsxs("form", { className: "provider-rename-form", onSubmit: (v) => {
                v.preventDefault(), Bl(a);
              }, children: [
                /* @__PURE__ */ s.jsx("label", { htmlFor: `shortcut-name-${a.record_id}`, children: "Shortcut name" }),
                /* @__PURE__ */ s.jsx(
                  "input",
                  {
                    id: `shortcut-name-${a.record_id}`,
                    ref: sr,
                    className: "neu-inset",
                    value: or,
                    onChange: (v) => {
                      Pn(v.target.value), Kt("");
                    },
                    disabled: Ot
                  }
                ),
                /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
                  /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "submit", disabled: !ee || Ot, children: Ot ? "Saving..." : "Save shortcut name" }),
                  /* @__PURE__ */ s.jsx(
                    "button",
                    {
                      className: "neu-button",
                      type: "button",
                      disabled: Ot,
                      onClick: () => Gt(a.record_id),
                      children: "Cancel rename"
                    }
                  )
                ] }),
                pi && /* @__PURE__ */ s.jsx("p", { className: "error", role: "alert", children: pi })
              ] }) : /* @__PURE__ */ s.jsxs("div", { className: "row-actions provider-actions", children: [
                /* @__PURE__ */ s.jsx(
                  "button",
                  {
                    className: "neu-button primary-button",
                    type: "button",
                    "aria-label": `Play playlist ${a.name}`,
                    ref: (v) => {
                      v ? un.current.set(a.record_id, v) : un.current.delete(a.record_id);
                    },
                    disabled: !ee || !Ue || !!G,
                    onClick: (v) => pn(a, v.currentTarget),
                    children: G === a.record_id ? "Preparing..." : "Play playlist"
                  }
                ),
                /* @__PURE__ */ s.jsx(
                  "button",
                  {
                    className: "neu-button",
                    type: "button",
                    disabled: !ee || on.has(`provider:${a.record_id}`),
                    onClick: () => {
                      $n(`provider:${a.record_id}`, a.media_content_id);
                    },
                    children: on.has(`provider:${a.record_id}`) ? "Checking availability..." : "Check availability"
                  }
                ),
                /* @__PURE__ */ s.jsx(
                  "button",
                  {
                    className: "neu-button",
                    type: "button",
                    ref: (v) => {
                      v ? pr.current.set(a.record_id, v) : pr.current.delete(a.record_id);
                    },
                    disabled: !ee || !!Mt || !!Nn,
                    onClick: () => gi(a),
                    children: "Rename shortcut"
                  }
                ),
                /* @__PURE__ */ s.jsx(
                  "button",
                  {
                    className: "neu-button destructive-button",
                    type: "button",
                    ref: (v) => {
                      v ? Rl.current.set(a.record_id, v) : Rl.current.delete(a.record_id);
                    },
                    disabled: !ee || !!Mt || !!Nn,
                    onClick: (v) => Kr(a, v.currentTarget),
                    children: "Remove shortcut"
                  }
                )
              ] })
            ] })
          ] }, a.record_id)) })
        ] })
      ] })
    ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      !Xe && at && !Ue && /* @__PURE__ */ s.jsxs("p", { className: "warning", children: [
        qt,
        " is unavailable. Select a connected speaker to play media."
      ] }),
      !ee && /* @__PURE__ */ s.jsx("p", { role: "alert", children: "Your Home Assistant session is unavailable." }),
      Ln && /* @__PURE__ */ s.jsxs("div", { className: "error", role: "alert", children: [
        /* @__PURE__ */ s.jsx("p", { children: Ln }),
        Tn && /* @__PURE__ */ s.jsx(
          "button",
          {
            className: "neu-button",
            disabled: !ee || Ae || ze,
            onClick: () => {
              fn(Tn);
            },
            children: Tn.query !== void 0 ? "Retry search" : Tn.item ? `Retry opening ${Tn.item.title}` : "Retry media sources"
          }
        )
      ] }),
      zn && /* @__PURE__ */ s.jsxs("div", { className: "error", role: "alert", children: [
        /* @__PURE__ */ s.jsx("p", { children: zn }),
        dr && dr.target === at && /* @__PURE__ */ s.jsxs(
          "button",
          {
            className: "neu-button",
            disabled: !Ue || Ae || ze,
            onClick: () => {
              Hn(dr.item, dr.target);
            },
            children: [
              "Retry ",
              dr.item.title,
              " on ",
              qt
            ]
          }
        )
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "status", role: "status", "aria-live": "polite", "aria-atomic": "true", children: Ae ? "Loading media sources..." : De || Br }),
      /* @__PURE__ */ s.jsxs("nav", { className: "catalog-path", "aria-label": "Catalog path", children: [
        tt.map((a, v) => /* @__PURE__ */ s.jsx(
          "button",
          {
            className: "neu-button",
            disabled: ze,
            onClick: () => Ze(v),
            title: a.title,
            children: a.title
          },
          `${a.media_content_id}-${v}`
        )),
        /* @__PURE__ */ s.jsx("span", { "aria-current": "page", title: Oe?.title, children: Oe?.title ?? "Media sources" })
      ] }),
      /* @__PURE__ */ s.jsxs("section", { className: "neu-surface", "aria-label": Oe?.title ?? "Media sources", "aria-busy": Ae, children: [
        /* @__PURE__ */ s.jsx("h2", { children: Oe?.title ?? "Media sources" }),
        Oe?.can_search && /* @__PURE__ */ s.jsxs("form", { className: "catalog-search", role: "search", onSubmit: (a) => {
          a.preventDefault(), Ur.trim() && !Ae && fn({ item: Oe, path: tt, query: Ur.trim() });
        }, children: [
          /* @__PURE__ */ s.jsxs("label", { className: "search-control", children: [
            "Search media",
            /* @__PURE__ */ s.jsx(
              "input",
              {
                className: "neu-inset",
                type: "search",
                value: Ur,
                onChange: (a) => Wr(a.target.value),
                disabled: !ee || Ae || ze
              }
            )
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "neu-button icon-button", type: "submit", "aria-label": "Search", title: "Search", disabled: !Ur.trim() || !ee || Ae || ze, children: /* @__PURE__ */ s.jsx(ef, { size: 20, "aria-hidden": "true" }) }),
          ho && /* @__PURE__ */ s.jsx(
            "button",
            {
              className: "neu-button",
              type: "button",
              disabled: Ae || ze,
              onClick: () => {
                fn({ item: Oe, path: tt });
              },
              children: "Clear search"
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "catalog-body", children: [
          Oe && !Ae && !Oe.children?.length && (Xe ? /* @__PURE__ */ s.jsx("div", { className: "empty-state", children: /* @__PURE__ */ s.jsx("p", { children: "No playable audio media are available in this Home Assistant source." }) }) : /* @__PURE__ */ s.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ s.jsx("h3", { children: "No audio sources are available" }),
            /* @__PURE__ */ s.jsx("p", { children: "Home Assistant did not return a playable audio source. Check the media provider and try again." })
          ] })),
          /* @__PURE__ */ s.jsx("ul", { "aria-label": "Catalog items", children: (Oe?.children ?? []).map((a) => /* @__PURE__ */ s.jsxs("li", { "aria-current": mi?.media_content_id === a.media_content_id ? "true" : void 0, children: [
            /* @__PURE__ */ s.jsx(uf, { hass: w, thumbnail: a.thumbnail }),
            /* @__PURE__ */ s.jsxs("div", { className: "media-detail", children: [
              /* @__PURE__ */ s.jsx("span", { className: "media-title", title: a.title, children: a.title }),
              /* @__PURE__ */ s.jsx("span", { className: "metadata", title: a.media_content_type, children: a.media_class ?? a.media_content_type }),
              !a.can_play && !a.can_expand && /* @__PURE__ */ s.jsx("span", { className: "metadata", children: df })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
              a.can_expand && /* @__PURE__ */ s.jsx(
                "button",
                {
                  className: "neu-button icon-button",
                  "aria-label": `Open ${a.title}`,
                  title: `Open ${a.title}`,
                  ref: (v) => {
                    v ? Ce.current.set(a.media_content_id, v) : Ce.current.delete(a.media_content_id);
                  },
                  disabled: Ae || ze || !ee || !a.media_content_id.startsWith("media-source://"),
                  onClick: () => {
                    fn({ item: a, path: Oe ? [...tt, Oe] : [] });
                  },
                  children: /* @__PURE__ */ s.jsx(Zd, { size: 20, "aria-hidden": "true" })
                }
              ),
              Xe && a.can_play && (a.media_content_type.toLowerCase().startsWith("audio/") || ["music", "track", "episode"].includes(a.media_class?.toLowerCase() ?? "")) && /* @__PURE__ */ s.jsx(
                "button",
                {
                  className: "neu-button",
                  "aria-label": `Add media ${a.title}`,
                  disabled: Ae || ze || !ee,
                  onClick: () => wi(a),
                  children: "Add media"
                }
              ),
              !Xe && mc(a) && (bt === a.media_content_id ? /* @__PURE__ */ s.jsxs("form", { className: "provider-rename-form", onSubmit: (v) => {
                v.preventDefault(), $l(a, xl);
              }, children: [
                /* @__PURE__ */ s.jsx("label", { htmlFor: `provider-save-name-${a.media_content_id}`, children: "Shortcut name" }),
                /* @__PURE__ */ s.jsx(
                  "input",
                  {
                    id: `provider-save-name-${a.media_content_id}`,
                    ref: Sl,
                    className: "neu-inset",
                    value: xl,
                    onChange: (v) => {
                      En(v.target.value), ft((j) => {
                        const C = { ...j };
                        return delete C[a.media_content_id], C;
                      });
                    },
                    disabled: It.has(a.media_content_id)
                  }
                ),
                /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
                  /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "submit", disabled: !ee || It.has(a.media_content_id), children: It.has(a.media_content_id) ? "Saving..." : "Save shortcut" }),
                  /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", disabled: It.has(a.media_content_id), onClick: () => {
                    Cn(""), En(""), ft((v) => {
                      const j = { ...v };
                      return delete j[a.media_content_id], j;
                    });
                  }, children: "Cancel" })
                ] })
              ] }) : /* @__PURE__ */ s.jsx(
                "button",
                {
                  className: "neu-button",
                  type: "button",
                  "aria-label": `Save to library ${a.title}`,
                  disabled: !ee || Ae || ze || It.has(a.media_content_id) || !!I?.records.some((v) => v.kind === "provider" && v.media_content_id === a.media_content_id),
                  onClick: () => qr(a),
                  children: It.has(a.media_content_id) ? "Saving..." : I?.records.some((v) => v.kind === "provider" && v.media_content_id === a.media_content_id) ? "Saved to library" : "Save to library"
                }
              )),
              Ar[a.media_content_id] && /* @__PURE__ */ s.jsx("p", { className: "error", role: "alert", children: Ar[a.media_content_id] }),
              !Xe && a.can_play && /* @__PURE__ */ s.jsxs(
                "button",
                {
                  className: "neu-button",
                  "aria-label": `Play ${a.title}`,
                  disabled: !Ue || Ae || ze || !a.media_content_id.startsWith("media-source://"),
                  onClick: () => {
                    Hn(a);
                  },
                  children: [
                    /* @__PURE__ */ s.jsx(Jd, { size: 18, "aria-hidden": "true" }),
                    "Play"
                  ]
                }
              )
            ] })
          ] }, a.media_content_id)) })
        ] })
      ] })
    ] }),
    ue && /* @__PURE__ */ s.jsxs(
      "dialog",
      {
        ref: st,
        "aria-modal": "true",
        "aria-labelledby": "delete-playlist-heading",
        className: "confirmation-dialog",
        onKeyDown: Yr,
        onCancel: (a) => {
          a.preventDefault(), wt || Xt();
        },
        children: [
          /* @__PURE__ */ s.jsxs("h2", { id: "delete-playlist-heading", children: [
            "Delete playlist: ",
            ue.name
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "Delete “",
            ue.name,
            "” from your BL-HAOS library? Its saved entries will be removed. This cannot be undone."
          ] }),
          Ge && /* @__PURE__ */ s.jsx("p", { className: "error", role: "alert", children: Ge }),
          /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", ref: hr, disabled: !!wt, onClick: Xt, children: "Keep playlist" }),
            /* @__PURE__ */ s.jsx("button", { className: "neu-button destructive-button", type: "button", disabled: !!wt, onClick: () => {
              Fl();
            }, children: wt ? "Deleting playlist..." : "Delete playlist" })
          ] })
        ]
      }
    ),
    A && /* @__PURE__ */ s.jsxs(
      "dialog",
      {
        ref: zl,
        "aria-modal": "true",
        "aria-labelledby": "remove-shortcut-heading",
        className: "confirmation-dialog",
        onKeyDown: Yr,
        onCancel: (a) => {
          a.preventDefault(), Mt || Xt();
        },
        children: [
          /* @__PURE__ */ s.jsxs("h2", { id: "remove-shortcut-heading", children: [
            "Remove shortcut: ",
            A.name
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "Remove “",
            A.name,
            "” from your BL-HAOS library? The Home Assistant playlist itself will not be changed."
          ] }),
          ir && /* @__PURE__ */ s.jsx("p", { className: "error", role: "alert", children: ir }),
          /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", ref: vr, disabled: !!Mt, onClick: Xt, children: "Keep shortcut" }),
            /* @__PURE__ */ s.jsx("button", { className: "neu-button destructive-button", type: "button", disabled: !!Mt, onClick: () => {
              Xr();
            }, children: Mt ? "Removing shortcut..." : "Remove shortcut" })
          ] })
        ]
      }
    ),
    x && /* @__PURE__ */ s.jsxs(
      "dialog",
      {
        ref: Tl,
        "aria-modal": "true",
        "aria-labelledby": "discard-changes-heading",
        className: "confirmation-dialog",
        onKeyDown: Yr,
        onCancel: (a) => {
          a.preventDefault(), Xt();
        },
        children: [
          /* @__PURE__ */ s.jsx("h2", { id: "discard-changes-heading", children: "Discard changes" }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "Discard unsaved changes to “",
            ke?.name || Ie || "this playlist",
            "”? The saved playlist will remain unchanged."
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", ref: Mn, onClick: () => {
              In.current = !1, M(!1);
            }, children: "Keep editing" }),
            /* @__PURE__ */ s.jsx("button", { className: "neu-button destructive-button", type: "button", onClick: () => {
              const a = In.current;
              In.current = !1, M(!1), br(), Vr.current = a;
            }, children: "Discard changes" })
          ] })
        ]
      }
    ),
    Q && /* @__PURE__ */ s.jsxs(
      "dialog",
      {
        ref: Dl,
        "aria-modal": "true",
        "aria-labelledby": "replace-queue-heading",
        className: "confirmation-dialog",
        onKeyDown: Yr,
        onCancel: (a) => {
          a.preventDefault(), G || Xt();
        },
        children: [
          /* @__PURE__ */ s.jsx("h2", { id: "replace-queue-heading", children: "Replace queue" }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            "Replace queue: Stop the current queue on ",
            qt,
            " and play “",
            Q.name,
            "”?"
          ] }),
          G && /* @__PURE__ */ s.jsxs("p", { role: "status", "aria-live": "polite", "aria-atomic": "true", children: [
            "Preparing “",
            Q.name,
            "” for ",
            qt,
            "…"
          ] }),
          oe[Q.record_id] && /* @__PURE__ */ s.jsx("p", { className: "error", role: "alert", children: oe[Q.record_id] }),
          /* @__PURE__ */ s.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ s.jsx("button", { className: "neu-button", type: "button", ref: yr, disabled: !!G, onClick: Xt, children: "Keep current queue" }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                className: "neu-button primary-button",
                type: "button",
                disabled: !Ue || !!G,
                onClick: () => {
                  Zr(Q);
                },
                children: G ? "Preparing..." : "Replace queue"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const pf = `
:host { display:block; min-width:0; height:100%; color-scheme:dark;
  --neu-page:#151a23; --neu-surface:#242d3b; --neu-raised:#313d4f; --neu-deep:#0f141c;
  --neu-text:#eef2f7; --neu-muted:#b6c2d2; --neu-border:rgba(148,163,184,.18);
  font-family:ui-sans-serif,sans-serif; font-size:14px; color:var(--neu-text); letter-spacing:0; }
* { box-sizing:border-box; }
.neu-page { height:100dvh; min-height:0; padding:24px; background:var(--neu-page); display:flex; flex-direction:column; gap:16px; overflow-y:auto; }
.catalog-header { display:flex; align-items:center; justify-content:space-between; gap:24px; }
.catalog-heading { display:flex; align-items:center; gap:16px; min-width:0; }
.catalog-header > * { min-width:0; }
.close-catalog { text-decoration:none; align-self:center; }
.selected-target { font-size:16px; font-weight:600; line-height:1.2; overflow-wrap:anywhere; color:#93c5fd; }
.catalog-path { display:flex; flex-wrap:wrap; align-items:center; gap:8px; min-width:0; overflow-wrap:anywhere; }
.view-toggle { display:flex; gap:8px; }
.view-toggle [aria-pressed="true"] { box-shadow:inset 0 0 0 2px #3b82f6; }
.catalog-path button { min-width:44px; max-width:100%; overflow-wrap:anywhere; text-align:left; }
.catalog-path [aria-current] { color:#93c5fd; }
.catalog-search { display:flex; align-items:end; flex-wrap:wrap; gap:8px; padding:16px; }
.search-control { display:grid; gap:8px; flex:1; min-width:0; }
.catalog-body { min-height:0; overflow-y:auto; overscroll-behavior:contain; }
.library-body { display:grid; gap:16px; padding:16px; min-width:0; overflow-y:auto; }
.queue-summary { flex:0 0 auto; }
.queue-summary-body { display:grid; gap:4px; padding:16px; min-width:0; overflow-wrap:anywhere; }
.queue-playlist { font-size:16px; font-weight:600; line-height:1.2; }
.provider-library-body { min-height:0; overflow-y:auto; overscroll-behavior:contain; }
.provider-library .media-detail { display:flex; flex-direction:column; align-items:flex-start; }
.library-body > .empty-state { padding:24px 0; }
.library-message { margin:0; }
.playlist-form { display:grid; gap:8px; max-width:480px; }
.playlist-form h3 { margin:16px 0 0; font-size:16px; font-weight:600; line-height:1.2; }
.playlist-entries { min-width:0; max-height:40vh; overflow-y:auto; overscroll-behavior:contain; border:1px solid var(--neu-border); border-radius:8px; }
.playlist-entries li { grid-template-columns:48px minmax(0,1fr) auto; }
.playlist-entries .empty-entry { display:block; min-height:80px; padding:24px 16px; color:var(--neu-muted); }
.entry-actions { flex-wrap:wrap; }
.editor-actions { flex-wrap:wrap; }
.provider-rename-form { display:grid; gap:8px; width:100%; }
.provider-actions { flex-wrap:wrap; }
.media-title.provider-title { display:block; overflow:visible; overflow-wrap:anywhere; -webkit-line-clamp:unset; -webkit-box-orient:unset; }
.primary-button { background:#3b82f6; border-color:#3b82f6; color:#fff; }
.destructive-button { color:#fda4af; }
.confirmation-dialog { width:min(560px,calc(100vw - 48px)); max-height:calc(100dvh - 48px); overflow:auto; padding:24px; color:var(--neu-text); background:var(--neu-surface); border:1px solid var(--neu-border); border-radius:8px; box-shadow:0 20px 60px rgba(0,0,0,.55); }
.confirmation-dialog::backdrop { background:rgba(0,0,0,.72); }
.confirmation-dialog h2 { padding:0 0 16px; border:0; }
.confirmation-dialog p { line-height:1.5; overflow-wrap:anywhere; }
.confirmation-dialog .row-actions { justify-content:flex-end; flex-wrap:wrap; margin-top:24px; }
.empty-state { padding:24px 16px; }
.empty-state h3 { font-size:16px; font-weight:600; margin:0; }
.empty-state p { line-height:1.5; }
li[aria-current="true"] { background:rgba(59,130,246,.12); box-shadow:inset 3px 0 #3b82f6; }
h1 { font-size:24px; font-weight:600; line-height:1.2; margin:4px 0 0; }
h2 { font-size:16px; font-weight:600; line-height:1.2; margin:0; padding:24px 16px; border-bottom:1px solid var(--neu-border); flex-shrink:0; overflow-wrap:anywhere; }
.eyebrow,.metadata { color:var(--neu-muted); font-size:12px; font-weight:400; line-height:1.5; margin:0; }
.target-control { display:grid; gap:8px; width:320px; max-width:100%; flex-shrink:0; }
select,button,input,a { font:inherit; color:inherit; min-height:44px; border-radius:8px; }
.neu-inset { width:100%; padding:8px 12px; background:var(--neu-deep); border:1px solid rgba(148,163,184,.45); }
.neu-button { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:8px 16px; background:var(--neu-raised); border:1px solid rgba(148,163,184,.45); cursor:pointer; transition:background-color 150ms; max-width:100%; overflow-wrap:anywhere; }
.neu-button:hover:not(:disabled) { background:#3b4a60; }
button:disabled { opacity:.55; cursor:default; }
.icon-button { width:44px; height:44px; padding:0; flex-shrink:0; }
.neu-surface { display:flex; flex-direction:column; min-height:160px; flex:1; overflow:hidden; background:var(--neu-surface); border:1px solid var(--neu-border); border-radius:8px; box-shadow:inset 0 1px rgba(148,163,184,.07),0 10px 24px -16px rgba(5,8,12,.55); }
ul { list-style:none; padding:0; margin:0; }
li { display:grid; grid-template-columns:48px minmax(0,1fr) auto; align-items:center; gap:16px; padding:16px; min-height:80px; border-bottom:1px solid var(--neu-border); }
li:last-child { border-bottom:0; }
.thumbnail { width:48px; height:48px; object-fit:cover; border-radius:4px; }
.media-icon { justify-self:center; color:var(--neu-muted); }
.media-detail { display:grid; gap:4px; min-width:0; overflow-wrap:anywhere; }
.media-title { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.5; }
.row-actions { display:flex; gap:8px; }
.status { min-height:18px; margin:0; font-size:12px; line-height:1.5; color:#6ee7b7; overflow-wrap:anywhere; }
.error,.warning { padding:16px 0; overflow-wrap:anywhere; line-height:1.5; }
.error { color:#fda4af; } .warning { color:#fcd34d; }
.neu-surface > p { margin:24px 16px; }
:focus-visible { outline:2px solid #67e8f9; outline-offset:2px; }
@media(min-width:768px) { .neu-page { padding:40px; } }
@media(max-width:640px) { .catalog-header { align-items:stretch; flex-direction:column; } .target-control { width:100%; }
  .close-catalog { align-self:flex-start; }
  li { grid-template-columns:48px minmax(0,1fr); gap:8px 16px; } .row-actions { grid-column:2; flex-wrap:wrap; }
  .playlist-entries li { grid-template-columns:40px minmax(0,1fr); } .playlist-entries .entry-actions { grid-column:2; } }
@media(prefers-reduced-motion:reduce) { * { transition:none !important; } }
`;
class mf extends HTMLElement {
  constructor() {
    super();
    const V = this.attachShadow({ mode: "open" }), y = document.createElement("style");
    y.textContent = pf, this.mount = document.createElement("div"), V.append(y, this.mount);
  }
  set hass(V) {
    this.suppliedHass = V, this.render();
  }
  get hass() {
    return this.suppliedHass;
  }
  connectedCallback() {
    this.root = bd.createRoot(this.mount), this.render();
  }
  disconnectedCallback() {
    this.root?.unmount(), this.root = void 0;
  }
  render() {
    this.root?.render(/* @__PURE__ */ s.jsx(ff, { hass: this.suppliedHass }));
  }
}
customElements.get("bl-haos-media-panel") || customElements.define("bl-haos-media-panel", mf);
export {
  ff as MediaPanel,
  mf as MediaPanelElement
};
