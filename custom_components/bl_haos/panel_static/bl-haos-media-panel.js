var Lu = { exports: {} }, Vl = {}, Tu = { exports: {} }, Q = {};
var ba;
function Fd() {
  if (ba) return Q;
  ba = 1;
  var C = /* @__PURE__ */ Symbol.for("react.element"), X = /* @__PURE__ */ Symbol.for("react.portal"), v = /* @__PURE__ */ Symbol.for("react.fragment"), he = /* @__PURE__ */ Symbol.for("react.strict_mode"), ae = /* @__PURE__ */ Symbol.for("react.profiler"), G = /* @__PURE__ */ Symbol.for("react.provider"), oe = /* @__PURE__ */ Symbol.for("react.context"), J = /* @__PURE__ */ Symbol.for("react.forward_ref"), Z = /* @__PURE__ */ Symbol.for("react.suspense"), ve = /* @__PURE__ */ Symbol.for("react.memo"), _e = /* @__PURE__ */ Symbol.for("react.lazy"), ue = Symbol.iterator;
  function U(a) {
    return a === null || typeof a != "object" ? null : (a = ue && a[ue] || a["@@iterator"], typeof a == "function" ? a : null);
  }
  var le = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, Ve = Object.assign, K = {};
  function ee(a, g, L) {
    this.props = a, this.context = g, this.refs = K, this.updater = L || le;
  }
  ee.prototype.isReactComponent = {}, ee.prototype.setState = function(a, g) {
    if (typeof a != "object" && typeof a != "function" && a != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, g, "setState");
  }, ee.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
  };
  function it() {
  }
  it.prototype = ee.prototype;
  function Ze(a, g, L) {
    this.props = a, this.context = g, this.refs = K, this.updater = L || le;
  }
  var Ee = Ze.prototype = new it();
  Ee.constructor = Ze, Ve(Ee, ee.prototype), Ee.isPureReactComponent = !0;
  var ye = Array.isArray, Qe = Object.prototype.hasOwnProperty, Se = { current: null }, Ke = { key: !0, ref: !0, __self: !0, __source: !0 };
  function se(a, g, L) {
    var B, $ = {}, ie = null, V = null;
    if (g != null) for (B in g.ref !== void 0 && (V = g.ref), g.key !== void 0 && (ie = "" + g.key), g) Qe.call(g, B) && !Ke.hasOwnProperty(B) && ($[B] = g[B]);
    var Y = arguments.length - 2;
    if (Y === 1) $.children = L;
    else if (1 < Y) {
      for (var q = Array(Y), Ce = 0; Ce < Y; Ce++) q[Ce] = arguments[Ce + 2];
      $.children = q;
    }
    if (a && a.defaultProps) for (B in Y = a.defaultProps, Y) $[B] === void 0 && ($[B] = Y[B]);
    return { $$typeof: C, type: a, key: ie, ref: V, props: $, _owner: Se.current };
  }
  function ze(a, g) {
    return { $$typeof: C, type: a.type, key: g, ref: a.ref, props: a.props, _owner: a._owner };
  }
  function ft(a) {
    return typeof a == "object" && a !== null && a.$$typeof === C;
  }
  function Zt(a) {
    var g = { "=": "=0", ":": "=2" };
    return "$" + a.replace(/[=:]/g, function(L) {
      return g[L];
    });
  }
  var qe = /\/+/g;
  function Le(a, g) {
    return typeof a == "object" && a !== null && a.key != null ? Zt("" + a.key) : g.toString(36);
  }
  function Te(a, g, L, B, $) {
    var ie = typeof a;
    (ie === "undefined" || ie === "boolean") && (a = null);
    var V = !1;
    if (a === null) V = !0;
    else switch (ie) {
      case "string":
      case "number":
        V = !0;
        break;
      case "object":
        switch (a.$$typeof) {
          case C:
          case X:
            V = !0;
        }
    }
    if (V) return V = a, $ = $(V), a = B === "" ? "." + Le(V, 0) : B, ye($) ? (L = "", a != null && (L = a.replace(qe, "$&/") + "/"), Te($, g, L, "", function(Ce) {
      return Ce;
    })) : $ != null && (ft($) && ($ = ze($, L + (!$.key || V && V.key === $.key ? "" : ("" + $.key).replace(qe, "$&/") + "/") + a)), g.push($)), 1;
    if (V = 0, B = B === "" ? "." : B + ":", ye(a)) for (var Y = 0; Y < a.length; Y++) {
      ie = a[Y];
      var q = B + Le(ie, Y);
      V += Te(ie, g, L, q, $);
    }
    else if (q = U(a), typeof q == "function") for (a = q.call(a), Y = 0; !(ie = a.next()).done; ) ie = ie.value, q = B + Le(ie, Y++), V += Te(ie, g, L, q, $);
    else if (ie === "object") throw g = String(a), Error("Objects are not valid as a React child (found: " + (g === "[object Object]" ? "object with keys {" + Object.keys(a).join(", ") + "}" : g) + "). If you meant to render a collection of children, use an array instead.");
    return V;
  }
  function Pe(a, g, L) {
    if (a == null) return a;
    var B = [], $ = 0;
    return Te(a, B, "", "", function(ie) {
      return g.call(L, ie, $++);
    }), B;
  }
  function Oe(a) {
    if (a._status === -1) {
      var g = a._result;
      g = g(), g.then(function(L) {
        (a._status === 0 || a._status === -1) && (a._status = 1, a._result = L);
      }, function(L) {
        (a._status === 0 || a._status === -1) && (a._status = 2, a._result = L);
      }), a._status === -1 && (a._status = 0, a._result = g);
    }
    if (a._status === 1) return a._result.default;
    throw a._result;
  }
  var te = { current: null }, N = { transition: null }, M = { ReactCurrentDispatcher: te, ReactCurrentBatchConfig: N, ReactCurrentOwner: Se };
  return Q.Children = { map: Pe, forEach: function(a, g, L) {
    Pe(a, function() {
      g.apply(this, arguments);
    }, L);
  }, count: function(a) {
    var g = 0;
    return Pe(a, function() {
      g++;
    }), g;
  }, toArray: function(a) {
    return Pe(a, function(g) {
      return g;
    }) || [];
  }, only: function(a) {
    if (!ft(a)) throw Error("React.Children.only expected to receive a single React element child.");
    return a;
  } }, Q.Component = ee, Q.Fragment = v, Q.Profiler = ae, Q.PureComponent = Ze, Q.StrictMode = he, Q.Suspense = Z, Q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = M, Q.cloneElement = function(a, g, L) {
    if (a == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
    var B = Ve({}, a.props), $ = a.key, ie = a.ref, V = a._owner;
    if (g != null) {
      if (g.ref !== void 0 && (ie = g.ref, V = Se.current), g.key !== void 0 && ($ = "" + g.key), a.type && a.type.defaultProps) var Y = a.type.defaultProps;
      for (q in g) Qe.call(g, q) && !Ke.hasOwnProperty(q) && (B[q] = g[q] === void 0 && Y !== void 0 ? Y[q] : g[q]);
    }
    var q = arguments.length - 2;
    if (q === 1) B.children = L;
    else if (1 < q) {
      Y = Array(q);
      for (var Ce = 0; Ce < q; Ce++) Y[Ce] = arguments[Ce + 2];
      B.children = Y;
    }
    return { $$typeof: C, type: a.type, key: $, ref: ie, props: B, _owner: V };
  }, Q.createContext = function(a) {
    return a = { $$typeof: oe, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, a.Provider = { $$typeof: G, _context: a }, a.Consumer = a;
  }, Q.createElement = se, Q.createFactory = function(a) {
    var g = se.bind(null, a);
    return g.type = a, g;
  }, Q.createRef = function() {
    return { current: null };
  }, Q.forwardRef = function(a) {
    return { $$typeof: J, render: a };
  }, Q.isValidElement = ft, Q.lazy = function(a) {
    return { $$typeof: _e, _payload: { _status: -1, _result: a }, _init: Oe };
  }, Q.memo = function(a, g) {
    return { $$typeof: ve, type: a, compare: g === void 0 ? null : g };
  }, Q.startTransition = function(a) {
    var g = N.transition;
    N.transition = {};
    try {
      a();
    } finally {
      N.transition = g;
    }
  }, Q.unstable_act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, Q.useCallback = function(a, g) {
    return te.current.useCallback(a, g);
  }, Q.useContext = function(a) {
    return te.current.useContext(a);
  }, Q.useDebugValue = function() {
  }, Q.useDeferredValue = function(a) {
    return te.current.useDeferredValue(a);
  }, Q.useEffect = function(a, g) {
    return te.current.useEffect(a, g);
  }, Q.useId = function() {
    return te.current.useId();
  }, Q.useImperativeHandle = function(a, g, L) {
    return te.current.useImperativeHandle(a, g, L);
  }, Q.useInsertionEffect = function(a, g) {
    return te.current.useInsertionEffect(a, g);
  }, Q.useLayoutEffect = function(a, g) {
    return te.current.useLayoutEffect(a, g);
  }, Q.useMemo = function(a, g) {
    return te.current.useMemo(a, g);
  }, Q.useReducer = function(a, g, L) {
    return te.current.useReducer(a, g, L);
  }, Q.useRef = function(a) {
    return te.current.useRef(a);
  }, Q.useState = function(a) {
    return te.current.useState(a);
  }, Q.useSyncExternalStore = function(a, g, L) {
    return te.current.useSyncExternalStore(a, g, L);
  }, Q.useTransition = function() {
    return te.current.useTransition();
  }, Q.version = "18.2.0", Q;
}
var ec;
function Fu() {
  return ec || (ec = 1, Tu.exports = Fd()), Tu.exports;
}
var tc;
function Ad() {
  if (tc) return Vl;
  tc = 1;
  var C = Fu(), X = /* @__PURE__ */ Symbol.for("react.element"), v = /* @__PURE__ */ Symbol.for("react.fragment"), he = Object.prototype.hasOwnProperty, ae = C.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, G = { key: !0, ref: !0, __self: !0, __source: !0 };
  function oe(J, Z, ve) {
    var _e, ue = {}, U = null, le = null;
    ve !== void 0 && (U = "" + ve), Z.key !== void 0 && (U = "" + Z.key), Z.ref !== void 0 && (le = Z.ref);
    for (_e in Z) he.call(Z, _e) && !G.hasOwnProperty(_e) && (ue[_e] = Z[_e]);
    if (J && J.defaultProps) for (_e in Z = J.defaultProps, Z) ue[_e] === void 0 && (ue[_e] = Z[_e]);
    return { $$typeof: X, type: J, key: U, ref: le, props: ue, _owner: ae.current };
  }
  return Vl.Fragment = v, Vl.jsx = oe, Vl.jsxs = oe, Vl;
}
var nc;
function Ud() {
  return nc || (nc = 1, Lu.exports = Ad()), Lu.exports;
}
var p = Ud(), _ = Fu(), bi = {}, Du = { exports: {} }, dt = {}, Mu = { exports: {} }, Iu = {};
var rc;
function Bd() {
  return rc || (rc = 1, (function(C) {
    function X(N, M) {
      var a = N.length;
      N.push(M);
      e: for (; 0 < a; ) {
        var g = a - 1 >>> 1, L = N[g];
        if (0 < ae(L, M)) N[g] = M, N[a] = L, a = g;
        else break e;
      }
    }
    function v(N) {
      return N.length === 0 ? null : N[0];
    }
    function he(N) {
      if (N.length === 0) return null;
      var M = N[0], a = N.pop();
      if (a !== M) {
        N[0] = a;
        e: for (var g = 0, L = N.length, B = L >>> 1; g < B; ) {
          var $ = 2 * (g + 1) - 1, ie = N[$], V = $ + 1, Y = N[V];
          if (0 > ae(ie, a)) V < L && 0 > ae(Y, ie) ? (N[g] = Y, N[V] = a, g = V) : (N[g] = ie, N[$] = a, g = $);
          else if (V < L && 0 > ae(Y, a)) N[g] = Y, N[V] = a, g = V;
          else break e;
        }
      }
      return M;
    }
    function ae(N, M) {
      var a = N.sortIndex - M.sortIndex;
      return a !== 0 ? a : N.id - M.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var G = performance;
      C.unstable_now = function() {
        return G.now();
      };
    } else {
      var oe = Date, J = oe.now();
      C.unstable_now = function() {
        return oe.now() - J;
      };
    }
    var Z = [], ve = [], _e = 1, ue = null, U = 3, le = !1, Ve = !1, K = !1, ee = typeof setTimeout == "function" ? setTimeout : null, it = typeof clearTimeout == "function" ? clearTimeout : null, Ze = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Ee(N) {
      for (var M = v(ve); M !== null; ) {
        if (M.callback === null) he(ve);
        else if (M.startTime <= N) he(ve), M.sortIndex = M.expirationTime, X(Z, M);
        else break;
        M = v(ve);
      }
    }
    function ye(N) {
      if (K = !1, Ee(N), !Ve) if (v(Z) !== null) Ve = !0, Oe(Qe);
      else {
        var M = v(ve);
        M !== null && te(ye, M.startTime - N);
      }
    }
    function Qe(N, M) {
      Ve = !1, K && (K = !1, it(se), se = -1), le = !0;
      var a = U;
      try {
        for (Ee(M), ue = v(Z); ue !== null && (!(ue.expirationTime > M) || N && !Zt()); ) {
          var g = ue.callback;
          if (typeof g == "function") {
            ue.callback = null, U = ue.priorityLevel;
            var L = g(ue.expirationTime <= M);
            M = C.unstable_now(), typeof L == "function" ? ue.callback = L : ue === v(Z) && he(Z), Ee(M);
          } else he(Z);
          ue = v(Z);
        }
        if (ue !== null) var B = !0;
        else {
          var $ = v(ve);
          $ !== null && te(ye, $.startTime - M), B = !1;
        }
        return B;
      } finally {
        ue = null, U = a, le = !1;
      }
    }
    var Se = !1, Ke = null, se = -1, ze = 5, ft = -1;
    function Zt() {
      return !(C.unstable_now() - ft < ze);
    }
    function qe() {
      if (Ke !== null) {
        var N = C.unstable_now();
        ft = N;
        var M = !0;
        try {
          M = Ke(!0, N);
        } finally {
          M ? Le() : (Se = !1, Ke = null);
        }
      } else Se = !1;
    }
    var Le;
    if (typeof Ze == "function") Le = function() {
      Ze(qe);
    };
    else if (typeof MessageChannel < "u") {
      var Te = new MessageChannel(), Pe = Te.port2;
      Te.port1.onmessage = qe, Le = function() {
        Pe.postMessage(null);
      };
    } else Le = function() {
      ee(qe, 0);
    };
    function Oe(N) {
      Ke = N, Se || (Se = !0, Le());
    }
    function te(N, M) {
      se = ee(function() {
        N(C.unstable_now());
      }, M);
    }
    C.unstable_IdlePriority = 5, C.unstable_ImmediatePriority = 1, C.unstable_LowPriority = 4, C.unstable_NormalPriority = 3, C.unstable_Profiling = null, C.unstable_UserBlockingPriority = 2, C.unstable_cancelCallback = function(N) {
      N.callback = null;
    }, C.unstable_continueExecution = function() {
      Ve || le || (Ve = !0, Oe(Qe));
    }, C.unstable_forceFrameRate = function(N) {
      0 > N || 125 < N ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ze = 0 < N ? Math.floor(1e3 / N) : 5;
    }, C.unstable_getCurrentPriorityLevel = function() {
      return U;
    }, C.unstable_getFirstCallbackNode = function() {
      return v(Z);
    }, C.unstable_next = function(N) {
      switch (U) {
        case 1:
        case 2:
        case 3:
          var M = 3;
          break;
        default:
          M = U;
      }
      var a = U;
      U = M;
      try {
        return N();
      } finally {
        U = a;
      }
    }, C.unstable_pauseExecution = function() {
    }, C.unstable_requestPaint = function() {
    }, C.unstable_runWithPriority = function(N, M) {
      switch (N) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          N = 3;
      }
      var a = U;
      U = N;
      try {
        return M();
      } finally {
        U = a;
      }
    }, C.unstable_scheduleCallback = function(N, M, a) {
      var g = C.unstable_now();
      switch (typeof a == "object" && a !== null ? (a = a.delay, a = typeof a == "number" && 0 < a ? g + a : g) : a = g, N) {
        case 1:
          var L = -1;
          break;
        case 2:
          L = 250;
          break;
        case 5:
          L = 1073741823;
          break;
        case 4:
          L = 1e4;
          break;
        default:
          L = 5e3;
      }
      return L = a + L, N = { id: _e++, callback: M, priorityLevel: N, startTime: a, expirationTime: L, sortIndex: -1 }, a > g ? (N.sortIndex = a, X(ve, N), v(Z) === null && N === v(ve) && (K ? (it(se), se = -1) : K = !0, te(ye, a - g))) : (N.sortIndex = L, X(Z, N), Ve || le || (Ve = !0, Oe(Qe))), N;
    }, C.unstable_shouldYield = Zt, C.unstable_wrapCallback = function(N) {
      var M = U;
      return function() {
        var a = U;
        U = M;
        try {
          return N.apply(this, arguments);
        } finally {
          U = a;
        }
      };
    };
  })(Iu)), Iu;
}
var lc;
function $d() {
  return lc || (lc = 1, Mu.exports = Bd()), Mu.exports;
}
var ic;
function Hd() {
  if (ic) return dt;
  ic = 1;
  var C = Fu(), X = $d();
  function v(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var he = /* @__PURE__ */ new Set(), ae = {};
  function G(e, t) {
    oe(e, t), oe(e + "Capture", t);
  }
  function oe(e, t) {
    for (ae[e] = t, e = 0; e < t.length; e++) he.add(t[e]);
  }
  var J = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Z = Object.prototype.hasOwnProperty, ve = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, _e = {}, ue = {};
  function U(e) {
    return Z.call(ue, e) ? !0 : Z.call(_e, e) ? !1 : ve.test(e) ? ue[e] = !0 : (_e[e] = !0, !1);
  }
  function le(e, t, n, r) {
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
  function Ve(e, t, n, r) {
    if (t === null || typeof t > "u" || le(e, t, n, r)) return !0;
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
  function K(e, t, n, r, l, i, o) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = o;
  }
  var ee = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    ee[e] = new K(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    ee[t] = new K(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    ee[e] = new K(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    ee[e] = new K(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    ee[e] = new K(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    ee[e] = new K(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    ee[e] = new K(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    ee[e] = new K(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    ee[e] = new K(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var it = /[\-:]([a-z])/g;
  function Ze(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      it,
      Ze
    );
    ee[t] = new K(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(it, Ze);
    ee[t] = new K(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(it, Ze);
    ee[t] = new K(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    ee[e] = new K(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), ee.xlinkHref = new K("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    ee[e] = new K(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Ee(e, t, n, r) {
    var l = ee.hasOwnProperty(t) ? ee[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Ve(t, n, l, r) && (n = null), r || l === null ? U(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ye = C.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Qe = /* @__PURE__ */ Symbol.for("react.element"), Se = /* @__PURE__ */ Symbol.for("react.portal"), Ke = /* @__PURE__ */ Symbol.for("react.fragment"), se = /* @__PURE__ */ Symbol.for("react.strict_mode"), ze = /* @__PURE__ */ Symbol.for("react.profiler"), ft = /* @__PURE__ */ Symbol.for("react.provider"), Zt = /* @__PURE__ */ Symbol.for("react.context"), qe = /* @__PURE__ */ Symbol.for("react.forward_ref"), Le = /* @__PURE__ */ Symbol.for("react.suspense"), Te = /* @__PURE__ */ Symbol.for("react.suspense_list"), Pe = /* @__PURE__ */ Symbol.for("react.memo"), Oe = /* @__PURE__ */ Symbol.for("react.lazy"), te = /* @__PURE__ */ Symbol.for("react.offscreen"), N = Symbol.iterator;
  function M(e) {
    return e === null || typeof e != "object" ? null : (e = N && e[N] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var a = Object.assign, g;
  function L(e) {
    if (g === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      g = t && t[1] || "";
    }
    return `
` + g + e;
  }
  var B = !1;
  function $(e, t) {
    if (!e || B) return "";
    B = !0;
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
                var c = `
` + l[o].replace(" at new ", " at ");
                return e.displayName && c.includes("<anonymous>") && (c = c.replace("<anonymous>", e.displayName)), c;
              }
            while (1 <= o && 0 <= u);
          break;
        }
      }
    } finally {
      B = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? L(e) : "";
  }
  function ie(e) {
    switch (e.tag) {
      case 5:
        return L(e.type);
      case 16:
        return L("Lazy");
      case 13:
        return L("Suspense");
      case 19:
        return L("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = $(e.type, !1), e;
      case 11:
        return e = $(e.type.render, !1), e;
      case 1:
        return e = $(e.type, !0), e;
      default:
        return "";
    }
  }
  function V(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case Ke:
        return "Fragment";
      case Se:
        return "Portal";
      case ze:
        return "Profiler";
      case se:
        return "StrictMode";
      case Le:
        return "Suspense";
      case Te:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Zt:
        return (e.displayName || "Context") + ".Consumer";
      case ft:
        return (e._context.displayName || "Context") + ".Provider";
      case qe:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Pe:
        return t = e.displayName || null, t !== null ? t : V(e.type) || "Memo";
      case Oe:
        t = e._payload, e = e._init;
        try {
          return V(e(t));
        } catch {
        }
    }
    return null;
  }
  function Y(e) {
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
        return V(t);
      case 8:
        return t === se ? "StrictMode" : "Mode";
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
  function q(e) {
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
  function Ce(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function rl(e) {
    var t = Ce(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  function Yn(e) {
    e._valueTracker || (e._valueTracker = rl(e));
  }
  function Ct(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = Ce(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function yn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function gn(e, t) {
    var n = t.checked;
    return a({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function ll(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = q(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function wn(e, t) {
    t = t.checked, t != null && Ee(e, "checked", t, !1);
  }
  function Sr(e, t) {
    wn(e, t);
    var n = q(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? xn(e, t.type, n) : t.hasOwnProperty("defaultValue") && xn(e, t.type, q(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Sn(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function xn(e, t, n) {
    (t !== "number" || yn(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var kn = Array.isArray;
  function gt(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + q(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function qt(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(v(91));
    return a({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function xr(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(v(92));
        if (kn(n)) {
          if (1 < n.length) throw Error(v(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: q(n) };
  }
  function il(e, t) {
    var n = q(t.value), r = q(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function At(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function kr(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Jt(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? kr(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var je, _r = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (je = je || document.createElement("div"), je.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = je.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function nt(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var bt = {
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
  }, Nt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(bt).forEach(function(e) {
    Nt.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), bt[t] = bt[e];
    });
  });
  function ol(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || bt.hasOwnProperty(e) && bt[e] ? ("" + t).trim() : t + "px";
  }
  function _n(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = ol(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var Ql = a({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function De(e, t) {
    if (t) {
      if (Ql[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(v(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(v(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(v(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(v(62));
    }
  }
  function en(e, t) {
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
  var Fe = null;
  function Xn(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Er = null, Pt = null, tn = null;
  function Ut(e) {
    if (e = Rl(e)) {
      if (typeof Er != "function") throw Error(v(280));
      var t = e.stateNode;
      t && (t = mi(t), Er(e.stateNode, e.type, t));
    }
  }
  function Kl(e) {
    Pt ? tn ? tn.push(e) : tn = [e] : Pt = e;
  }
  function En() {
    if (Pt) {
      var e = Pt, t = tn;
      if (tn = Pt = null, Ut(e), t) for (e = 0; e < t.length; e++) Ut(t[e]);
    }
  }
  function Gn(e, t) {
    return e(t);
  }
  function Zn() {
  }
  var ul = !1;
  function Cr(e, t, n) {
    if (ul) return e(t, n);
    ul = !0;
    try {
      return Gn(e, t, n);
    } finally {
      ul = !1, (Pt !== null || tn !== null) && (Zn(), En());
    }
  }
  function jt(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = mi(n);
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
    if (n && typeof n != "function") throw Error(v(231, t, typeof n));
    return n;
  }
  var Cn = !1;
  if (J) try {
    var Rt = {};
    Object.defineProperty(Rt, "passive", { get: function() {
      Cn = !0;
    } }), window.addEventListener("test", Rt, Rt), window.removeEventListener("test", Rt, Rt);
  } catch {
    Cn = !1;
  }
  function qn(e, t, n, r, l, i, o, u, c) {
    var h = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, h);
    } catch (S) {
      this.onError(S);
    }
  }
  var Jn = !1, bn = null, nn = !1, er = null, Yl = { onError: function(e) {
    Jn = !0, bn = e;
  } };
  function sl(e, t, n, r, l, i, o, u, c) {
    Jn = !1, bn = null, qn.apply(Yl, arguments);
  }
  function al(e, t, n, r, l, i, o, u, c) {
    if (sl.apply(this, arguments), Jn) {
      if (Jn) {
        var h = bn;
        Jn = !1, bn = null;
      } else throw Error(v(198));
      nn || (nn = !0, er = h);
    }
  }
  function zt(e) {
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
  function cl(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Nr(e) {
    if (zt(e) !== e) throw Error(v(188));
  }
  function Pr(e) {
    var t = e.alternate;
    if (!t) {
      if (t = zt(e), t === null) throw Error(v(188));
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
          if (i === n) return Nr(l), e;
          if (i === r) return Nr(l), t;
          i = i.sibling;
        }
        throw Error(v(188));
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
          if (!o) throw Error(v(189));
        }
      }
      if (n.alternate !== r) throw Error(v(190));
    }
    if (n.tag !== 3) throw Error(v(188));
    return n.stateNode.current === n ? e : t;
  }
  function tr(e) {
    return e = Pr(e), e !== null ? dl(e) : null;
  }
  function dl(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = dl(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Xl = X.unstable_scheduleCallback, jr = X.unstable_cancelCallback, fl = X.unstable_shouldYield, pl = X.unstable_requestPaint, ge = X.unstable_now, Gl = X.unstable_getCurrentPriorityLevel, Rr = X.unstable_ImmediatePriority, ml = X.unstable_UserBlockingPriority, pt = X.unstable_NormalPriority, zr = X.unstable_LowPriority, Nn = X.unstable_IdlePriority, nr = null, Be = null;
  function Pn(e) {
    if (Be && typeof Be.onCommitFiberRoot == "function") try {
      Be.onCommitFiberRoot(nr, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var H = Math.clz32 ? Math.clz32 : Lr, rr = Math.log, Zl = Math.LN2;
  function Lr(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (rr(e) / Zl | 0) | 0;
  }
  var Lt = 64, rn = 4194304;
  function Ye(e) {
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
  function lr(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, i = e.pingedLanes, o = n & 268435455;
    if (o !== 0) {
      var u = o & ~l;
      u !== 0 ? r = Ye(u) : (i &= o, i !== 0 && (r = Ye(i)));
    } else o = n & ~l, o !== 0 ? r = Ye(o) : i !== 0 && (r = Ye(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, i = t & -t, l >= i || l === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - H(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function ql(e, t) {
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
  function ce(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var o = 31 - H(i), u = 1 << o, c = l[o];
      c === -1 ? ((u & n) === 0 || (u & r) !== 0) && (l[o] = ql(u, t)) : c <= t && (e.expiredLanes |= u), i &= ~u;
    }
  }
  function hl(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function ln() {
    var e = Lt;
    return Lt <<= 1, (Lt & 4194240) === 0 && (Lt = 64), e;
  }
  function Bt(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function on(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - H(t), e[t] = n;
  }
  function un(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - H(n), i = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~i;
    }
  }
  function Tr(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - H(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var re = 0;
  function Jl(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var ir, Dr, vl, bl, ei, $t = !1, jn = [], Ht = null, Wt = null, Vt = null, or = /* @__PURE__ */ new Map(), ur = /* @__PURE__ */ new Map(), Qt = [], no = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function ti(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Ht = null;
        break;
      case "dragenter":
      case "dragleave":
        Wt = null;
        break;
      case "mouseover":
      case "mouseout":
        Vt = null;
        break;
      case "pointerover":
      case "pointerout":
        or.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ur.delete(t.pointerId);
    }
  }
  function Rn(e, t, n, r, l, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = Rl(t), t !== null && Dr(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function ro(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Ht = Rn(Ht, e, t, n, r, l), !0;
      case "dragenter":
        return Wt = Rn(Wt, e, t, n, r, l), !0;
      case "mouseover":
        return Vt = Rn(Vt, e, t, n, r, l), !0;
      case "pointerover":
        var i = l.pointerId;
        return or.set(i, Rn(or.get(i) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return i = l.pointerId, ur.set(i, Rn(ur.get(i) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function ni(e) {
    var t = sr(e.target);
    if (t !== null) {
      var n = zt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = cl(n), t !== null) {
            e.blockedOn = t, ei(e.priority, function() {
              vl(n);
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
  function zn(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = sn(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Fe = r, n.target.dispatchEvent(r), Fe = null;
      } else return t = Rl(n), t !== null && Dr(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function yl(e, t, n) {
    zn(e) && n.delete(t);
  }
  function s() {
    $t = !1, Ht !== null && zn(Ht) && (Ht = null), Wt !== null && zn(Wt) && (Wt = null), Vt !== null && zn(Vt) && (Vt = null), or.forEach(yl), ur.forEach(yl);
  }
  function y(e, t) {
    e.blockedOn === t && (e.blockedOn = null, $t || ($t = !0, X.unstable_scheduleCallback(X.unstable_NormalPriority, s)));
  }
  function P(e) {
    function t(l) {
      return y(l, e);
    }
    if (0 < jn.length) {
      y(jn[0], e);
      for (var n = 1; n < jn.length; n++) {
        var r = jn[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Ht !== null && y(Ht, e), Wt !== null && y(Wt, e), Vt !== null && y(Vt, e), or.forEach(t), ur.forEach(t), n = 0; n < Qt.length; n++) r = Qt[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Qt.length && (n = Qt[0], n.blockedOn === null); ) ni(n), n.blockedOn === null && Qt.shift();
  }
  var E = ye.ReactCurrentBatchConfig, F = !0;
  function W(e, t, n, r) {
    var l = re, i = E.transition;
    E.transition = null;
    try {
      re = 1, Me(e, t, n, r);
    } finally {
      re = l, E.transition = i;
    }
  }
  function de(e, t, n, r) {
    var l = re, i = E.transition;
    E.transition = null;
    try {
      re = 4, Me(e, t, n, r);
    } finally {
      re = l, E.transition = i;
    }
  }
  function Me(e, t, n, r) {
    if (F) {
      var l = sn(e, t, n, r);
      if (l === null) xo(e, t, r, Mr, n), ti(e, r);
      else if (ro(l, e, t, n, r)) r.stopPropagation();
      else if (ti(e, r), t & 4 && -1 < no.indexOf(e)) {
        for (; l !== null; ) {
          var i = Rl(l);
          if (i !== null && ir(i), i = sn(e, t, n, r), i === null && xo(e, t, r, Mr, n), i === l) break;
          l = i;
        }
        l !== null && r.stopPropagation();
      } else xo(e, t, r, null, n);
    }
  }
  var Mr = null;
  function sn(e, t, n, r) {
    if (Mr = null, e = Xn(r), e = sr(e), e !== null) if (t = zt(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = cl(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Mr = e, null;
  }
  function Au(e) {
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
        switch (Gl()) {
          case Rr:
            return 1;
          case ml:
            return 4;
          case pt:
          case zr:
            return 16;
          case Nn:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Ln = null, lo = null, ri = null;
  function Uu() {
    if (ri) return ri;
    var e, t = lo, n = t.length, r, l = "value" in Ln ? Ln.value : Ln.textContent, i = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var o = n - e;
    for (r = 1; r <= o && t[n - r] === l[i - r]; r++) ;
    return ri = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function li(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function ii() {
    return !0;
  }
  function Bu() {
    return !1;
  }
  function mt(e) {
    function t(n, r, l, i, o) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
      for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(i) : i[u]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? ii : Bu, this.isPropagationStopped = Bu, this;
    }
    return a(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = ii);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = ii);
    }, persist: function() {
    }, isPersistent: ii }), t;
  }
  var Ir = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, io = mt(Ir), gl = a({}, Ir, { view: 0, detail: 0 }), cc = mt(gl), oo, uo, wl, oi = a({}, gl, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ao, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== wl && (wl && e.type === "mousemove" ? (oo = e.screenX - wl.screenX, uo = e.screenY - wl.screenY) : uo = oo = 0, wl = e), oo);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : uo;
  } }), $u = mt(oi), dc = a({}, oi, { dataTransfer: 0 }), fc = mt(dc), pc = a({}, gl, { relatedTarget: 0 }), so = mt(pc), mc = a({}, Ir, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), hc = mt(mc), vc = a({}, Ir, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), yc = mt(vc), gc = a({}, Ir, { data: 0 }), Hu = mt(gc), wc = {
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
  }, xc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function kc(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = xc[e]) ? !!t[e] : !1;
  }
  function ao() {
    return kc;
  }
  var _c = a({}, gl, { key: function(e) {
    if (e.key) {
      var t = wc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = li(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Sc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ao, charCode: function(e) {
    return e.type === "keypress" ? li(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? li(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Ec = mt(_c), Cc = a({}, oi, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Wu = mt(Cc), Nc = a({}, gl, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ao }), Pc = mt(Nc), jc = a({}, Ir, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Rc = mt(jc), zc = a({}, oi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Lc = mt(zc), Tc = [9, 13, 27, 32], co = J && "CompositionEvent" in window, Sl = null;
  J && "documentMode" in document && (Sl = document.documentMode);
  var Dc = J && "TextEvent" in window && !Sl, Vu = J && (!co || Sl && 8 < Sl && 11 >= Sl), Qu = " ", Ku = !1;
  function Yu(e, t) {
    switch (e) {
      case "keyup":
        return Tc.indexOf(t.keyCode) !== -1;
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
  function Xu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Or = !1;
  function Mc(e, t) {
    switch (e) {
      case "compositionend":
        return Xu(t);
      case "keypress":
        return t.which !== 32 ? null : (Ku = !0, Qu);
      case "textInput":
        return e = t.data, e === Qu && Ku ? null : e;
      default:
        return null;
    }
  }
  function Ic(e, t) {
    if (Or) return e === "compositionend" || !co && Yu(e, t) ? (e = Uu(), ri = lo = Ln = null, Or = !1, e) : null;
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
        return Vu && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Oc = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Gu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Oc[e.type] : t === "textarea";
  }
  function Zu(e, t, n, r) {
    Kl(r), t = di(t, "onChange"), 0 < t.length && (n = new io("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var xl = null, kl = null;
  function Fc(e) {
    ms(e, 0);
  }
  function ui(e) {
    var t = $r(e);
    if (Ct(t)) return e;
  }
  function Ac(e, t) {
    if (e === "change") return t;
  }
  var qu = !1;
  if (J) {
    var fo;
    if (J) {
      var po = "oninput" in document;
      if (!po) {
        var Ju = document.createElement("div");
        Ju.setAttribute("oninput", "return;"), po = typeof Ju.oninput == "function";
      }
      fo = po;
    } else fo = !1;
    qu = fo && (!document.documentMode || 9 < document.documentMode);
  }
  function bu() {
    xl && (xl.detachEvent("onpropertychange", es), kl = xl = null);
  }
  function es(e) {
    if (e.propertyName === "value" && ui(kl)) {
      var t = [];
      Zu(t, kl, e, Xn(e)), Cr(Fc, t);
    }
  }
  function Uc(e, t, n) {
    e === "focusin" ? (bu(), xl = t, kl = n, xl.attachEvent("onpropertychange", es)) : e === "focusout" && bu();
  }
  function Bc(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return ui(kl);
  }
  function $c(e, t) {
    if (e === "click") return ui(t);
  }
  function Hc(e, t) {
    if (e === "input" || e === "change") return ui(t);
  }
  function Wc(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Tt = typeof Object.is == "function" ? Object.is : Wc;
  function _l(e, t) {
    if (Tt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!Z.call(t, l) || !Tt(e[l], t[l])) return !1;
    }
    return !0;
  }
  function ts(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function ns(e, t) {
    var n = ts(e);
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
      n = ts(n);
    }
  }
  function rs(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? rs(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ls() {
    for (var e = window, t = yn(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = yn(e.document);
    }
    return t;
  }
  function mo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Vc(e) {
    var t = ls(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && rs(n.ownerDocument.documentElement, n)) {
      if (r !== null && mo(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, i = Math.min(r.start, l);
          r = r.end === void 0 ? i : Math.min(r.end, l), !e.extend && i > r && (l = r, r = i, i = l), l = ns(n, i);
          var o = ns(
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
  var Qc = J && "documentMode" in document && 11 >= document.documentMode, Fr = null, ho = null, El = null, vo = !1;
  function is(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    vo || Fr == null || Fr !== yn(r) || (r = Fr, "selectionStart" in r && mo(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), El && _l(El, r) || (El = r, r = di(ho, "onSelect"), 0 < r.length && (t = new io("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Fr)));
  }
  function si(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Ar = { animationend: si("Animation", "AnimationEnd"), animationiteration: si("Animation", "AnimationIteration"), animationstart: si("Animation", "AnimationStart"), transitionend: si("Transition", "TransitionEnd") }, yo = {}, os = {};
  J && (os = document.createElement("div").style, "AnimationEvent" in window || (delete Ar.animationend.animation, delete Ar.animationiteration.animation, delete Ar.animationstart.animation), "TransitionEvent" in window || delete Ar.transitionend.transition);
  function ai(e) {
    if (yo[e]) return yo[e];
    if (!Ar[e]) return e;
    var t = Ar[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in os) return yo[e] = t[n];
    return e;
  }
  var us = ai("animationend"), ss = ai("animationiteration"), as = ai("animationstart"), cs = ai("transitionend"), ds = /* @__PURE__ */ new Map(), fs = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Tn(e, t) {
    ds.set(e, t), G(t, [e]);
  }
  for (var go = 0; go < fs.length; go++) {
    var wo = fs[go], Kc = wo.toLowerCase(), Yc = wo[0].toUpperCase() + wo.slice(1);
    Tn(Kc, "on" + Yc);
  }
  Tn(us, "onAnimationEnd"), Tn(ss, "onAnimationIteration"), Tn(as, "onAnimationStart"), Tn("dblclick", "onDoubleClick"), Tn("focusin", "onFocus"), Tn("focusout", "onBlur"), Tn(cs, "onTransitionEnd"), oe("onMouseEnter", ["mouseout", "mouseover"]), oe("onMouseLeave", ["mouseout", "mouseover"]), oe("onPointerEnter", ["pointerout", "pointerover"]), oe("onPointerLeave", ["pointerout", "pointerover"]), G("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), G("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), G("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), G("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), G("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), G("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Cl = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Xc = new Set("cancel close invalid load scroll toggle".split(" ").concat(Cl));
  function ps(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, al(r, t, void 0, e), e.currentTarget = null;
  }
  function ms(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var o = r.length - 1; 0 <= o; o--) {
          var u = r[o], c = u.instance, h = u.currentTarget;
          if (u = u.listener, c !== i && l.isPropagationStopped()) break e;
          ps(l, u, h), i = c;
        }
        else for (o = 0; o < r.length; o++) {
          if (u = r[o], c = u.instance, h = u.currentTarget, u = u.listener, c !== i && l.isPropagationStopped()) break e;
          ps(l, u, h), i = c;
        }
      }
    }
    if (nn) throw e = er, nn = !1, er = null, e;
  }
  function pe(e, t) {
    var n = t[Po];
    n === void 0 && (n = t[Po] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (hs(t, e, 2, !1), n.add(r));
  }
  function So(e, t, n) {
    var r = 0;
    t && (r |= 4), hs(n, e, r, t);
  }
  var ci = "_reactListening" + Math.random().toString(36).slice(2);
  function Nl(e) {
    if (!e[ci]) {
      e[ci] = !0, he.forEach(function(n) {
        n !== "selectionchange" && (Xc.has(n) || So(n, !1, e), So(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[ci] || (t[ci] = !0, So("selectionchange", !1, t));
    }
  }
  function hs(e, t, n, r) {
    switch (Au(t)) {
      case 1:
        var l = W;
        break;
      case 4:
        l = de;
        break;
      default:
        l = Me;
    }
    n = l.bind(null, t, n, e), l = void 0, !Cn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function xo(e, t, n, r, l) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var u = r.stateNode.containerInfo;
        if (u === l || u.nodeType === 8 && u.parentNode === l) break;
        if (o === 4) for (o = r.return; o !== null; ) {
          var c = o.tag;
          if ((c === 3 || c === 4) && (c = o.stateNode.containerInfo, c === l || c.nodeType === 8 && c.parentNode === l)) return;
          o = o.return;
        }
        for (; u !== null; ) {
          if (o = sr(u), o === null) return;
          if (c = o.tag, c === 5 || c === 6) {
            r = i = o;
            continue e;
          }
          u = u.parentNode;
        }
      }
      r = r.return;
    }
    Cr(function() {
      var h = i, S = Xn(n), x = [];
      e: {
        var w = ds.get(e);
        if (w !== void 0) {
          var j = io, z = e;
          switch (e) {
            case "keypress":
              if (li(n) === 0) break e;
            case "keydown":
            case "keyup":
              j = Ec;
              break;
            case "focusin":
              z = "focus", j = so;
              break;
            case "focusout":
              z = "blur", j = so;
              break;
            case "beforeblur":
            case "afterblur":
              j = so;
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
              j = $u;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              j = fc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              j = Pc;
              break;
            case us:
            case ss:
            case as:
              j = hc;
              break;
            case cs:
              j = Rc;
              break;
            case "scroll":
              j = cc;
              break;
            case "wheel":
              j = Lc;
              break;
            case "copy":
            case "cut":
            case "paste":
              j = yc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              j = Wu;
          }
          var T = (t & 4) !== 0, Re = !T && e === "scroll", f = T ? w !== null ? w + "Capture" : null : w;
          T = [];
          for (var d = h, m; d !== null; ) {
            m = d;
            var k = m.stateNode;
            if (m.tag === 5 && k !== null && (m = k, f !== null && (k = jt(d, f), k != null && T.push(Pl(d, k, m)))), Re) break;
            d = d.return;
          }
          0 < T.length && (w = new j(w, z, null, n, S), x.push({ event: w, listeners: T }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (w = e === "mouseover" || e === "pointerover", j = e === "mouseout" || e === "pointerout", w && n !== Fe && (z = n.relatedTarget || n.fromElement) && (sr(z) || z[an])) break e;
          if ((j || w) && (w = S.window === S ? S : (w = S.ownerDocument) ? w.defaultView || w.parentWindow : window, j ? (z = n.relatedTarget || n.toElement, j = h, z = z ? sr(z) : null, z !== null && (Re = zt(z), z !== Re || z.tag !== 5 && z.tag !== 6) && (z = null)) : (j = null, z = h), j !== z)) {
            if (T = $u, k = "onMouseLeave", f = "onMouseEnter", d = "mouse", (e === "pointerout" || e === "pointerover") && (T = Wu, k = "onPointerLeave", f = "onPointerEnter", d = "pointer"), Re = j == null ? w : $r(j), m = z == null ? w : $r(z), w = new T(k, d + "leave", j, n, S), w.target = Re, w.relatedTarget = m, k = null, sr(S) === h && (T = new T(f, d + "enter", z, n, S), T.target = m, T.relatedTarget = Re, k = T), Re = k, j && z) t: {
              for (T = j, f = z, d = 0, m = T; m; m = Ur(m)) d++;
              for (m = 0, k = f; k; k = Ur(k)) m++;
              for (; 0 < d - m; ) T = Ur(T), d--;
              for (; 0 < m - d; ) f = Ur(f), m--;
              for (; d--; ) {
                if (T === f || f !== null && T === f.alternate) break t;
                T = Ur(T), f = Ur(f);
              }
              T = null;
            }
            else T = null;
            j !== null && vs(x, w, j, T, !1), z !== null && Re !== null && vs(x, Re, z, T, !0);
          }
        }
        e: {
          if (w = h ? $r(h) : window, j = w.nodeName && w.nodeName.toLowerCase(), j === "select" || j === "input" && w.type === "file") var D = Ac;
          else if (Gu(w)) if (qu) D = Hc;
          else {
            D = Bc;
            var I = Uc;
          }
          else (j = w.nodeName) && j.toLowerCase() === "input" && (w.type === "checkbox" || w.type === "radio") && (D = $c);
          if (D && (D = D(e, h))) {
            Zu(x, D, n, S);
            break e;
          }
          I && I(e, w, h), e === "focusout" && (I = w._wrapperState) && I.controlled && w.type === "number" && xn(w, "number", w.value);
        }
        switch (I = h ? $r(h) : window, e) {
          case "focusin":
            (Gu(I) || I.contentEditable === "true") && (Fr = I, ho = h, El = null);
            break;
          case "focusout":
            El = ho = Fr = null;
            break;
          case "mousedown":
            vo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            vo = !1, is(x, n, S);
            break;
          case "selectionchange":
            if (Qc) break;
          case "keydown":
          case "keyup":
            is(x, n, S);
        }
        var O;
        if (co) e: {
          switch (e) {
            case "compositionstart":
              var A = "onCompositionStart";
              break e;
            case "compositionend":
              A = "onCompositionEnd";
              break e;
            case "compositionupdate":
              A = "onCompositionUpdate";
              break e;
          }
          A = void 0;
        }
        else Or ? Yu(e, n) && (A = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (A = "onCompositionStart");
        A && (Vu && n.locale !== "ko" && (Or || A !== "onCompositionStart" ? A === "onCompositionEnd" && Or && (O = Uu()) : (Ln = S, lo = "value" in Ln ? Ln.value : Ln.textContent, Or = !0)), I = di(h, A), 0 < I.length && (A = new Hu(A, e, null, n, S), x.push({ event: A, listeners: I }), O ? A.data = O : (O = Xu(n), O !== null && (A.data = O)))), (O = Dc ? Mc(e, n) : Ic(e, n)) && (h = di(h, "onBeforeInput"), 0 < h.length && (S = new Hu("onBeforeInput", "beforeinput", null, n, S), x.push({ event: S, listeners: h }), S.data = O));
      }
      ms(x, t);
    });
  }
  function Pl(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function di(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, i = l.stateNode;
      l.tag === 5 && i !== null && (l = i, i = jt(e, n), i != null && r.unshift(Pl(e, i, l)), i = jt(e, t), i != null && r.push(Pl(e, i, l))), e = e.return;
    }
    return r;
  }
  function Ur(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function vs(e, t, n, r, l) {
    for (var i = t._reactName, o = []; n !== null && n !== r; ) {
      var u = n, c = u.alternate, h = u.stateNode;
      if (c !== null && c === r) break;
      u.tag === 5 && h !== null && (u = h, l ? (c = jt(n, i), c != null && o.unshift(Pl(n, c, u))) : l || (c = jt(n, i), c != null && o.push(Pl(n, c, u)))), n = n.return;
    }
    o.length !== 0 && e.push({ event: t, listeners: o });
  }
  var Gc = /\r\n?/g, Zc = /\u0000|\uFFFD/g;
  function ys(e) {
    return (typeof e == "string" ? e : "" + e).replace(Gc, `
`).replace(Zc, "");
  }
  function fi(e, t, n) {
    if (t = ys(t), ys(e) !== t && n) throw Error(v(425));
  }
  function pi() {
  }
  var ko = null, _o = null;
  function Eo(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Co = typeof setTimeout == "function" ? setTimeout : void 0, qc = typeof clearTimeout == "function" ? clearTimeout : void 0, gs = typeof Promise == "function" ? Promise : void 0, Jc = typeof queueMicrotask == "function" ? queueMicrotask : typeof gs < "u" ? function(e) {
    return gs.resolve(null).then(e).catch(bc);
  } : Co;
  function bc(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function No(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), P(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    P(t);
  }
  function Dn(e) {
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
  function ws(e) {
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
  var Br = Math.random().toString(36).slice(2), Kt = "__reactFiber$" + Br, jl = "__reactProps$" + Br, an = "__reactContainer$" + Br, Po = "__reactEvents$" + Br, ed = "__reactListeners$" + Br, td = "__reactHandles$" + Br;
  function sr(e) {
    var t = e[Kt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[an] || n[Kt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = ws(e); e !== null; ) {
          if (n = e[Kt]) return n;
          e = ws(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function Rl(e) {
    return e = e[Kt] || e[an], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function $r(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(v(33));
  }
  function mi(e) {
    return e[jl] || null;
  }
  var jo = [], Hr = -1;
  function Mn(e) {
    return { current: e };
  }
  function me(e) {
    0 > Hr || (e.current = jo[Hr], jo[Hr] = null, Hr--);
  }
  function fe(e, t) {
    Hr++, jo[Hr] = e.current, e.current = t;
  }
  var In = {}, Je = Mn(In), ot = Mn(!1), ar = In;
  function Wr(e, t) {
    var n = e.type.contextTypes;
    if (!n) return In;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, i;
    for (i in n) l[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function ut(e) {
    return e = e.childContextTypes, e != null;
  }
  function hi() {
    me(ot), me(Je);
  }
  function Ss(e, t, n) {
    if (Je.current !== In) throw Error(v(168));
    fe(Je, t), fe(ot, n);
  }
  function xs(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(v(108, Y(e) || "Unknown", l));
    return a({}, n, r);
  }
  function vi(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || In, ar = Je.current, fe(Je, e), fe(ot, ot.current), !0;
  }
  function ks(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(v(169));
    n ? (e = xs(e, t, ar), r.__reactInternalMemoizedMergedChildContext = e, me(ot), me(Je), fe(Je, e)) : me(ot), fe(ot, n);
  }
  var cn = null, yi = !1, Ro = !1;
  function _s(e) {
    cn === null ? cn = [e] : cn.push(e);
  }
  function nd(e) {
    yi = !0, _s(e);
  }
  function On() {
    if (!Ro && cn !== null) {
      Ro = !0;
      var e = 0, t = re;
      try {
        var n = cn;
        for (re = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        cn = null, yi = !1;
      } catch (l) {
        throw cn !== null && (cn = cn.slice(e + 1)), Xl(Rr, On), l;
      } finally {
        re = t, Ro = !1;
      }
    }
    return null;
  }
  var Vr = [], Qr = 0, gi = null, wi = 0, wt = [], St = 0, cr = null, dn = 1, fn = "";
  function dr(e, t) {
    Vr[Qr++] = wi, Vr[Qr++] = gi, gi = e, wi = t;
  }
  function Es(e, t, n) {
    wt[St++] = dn, wt[St++] = fn, wt[St++] = cr, cr = e;
    var r = dn;
    e = fn;
    var l = 32 - H(r) - 1;
    r &= ~(1 << l), n += 1;
    var i = 32 - H(t) + l;
    if (30 < i) {
      var o = l - l % 5;
      i = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, dn = 1 << 32 - H(t) + l | n << l | r, fn = i + e;
    } else dn = 1 << i | n << l | r, fn = e;
  }
  function zo(e) {
    e.return !== null && (dr(e, 1), Es(e, 1, 0));
  }
  function Lo(e) {
    for (; e === gi; ) gi = Vr[--Qr], Vr[Qr] = null, wi = Vr[--Qr], Vr[Qr] = null;
    for (; e === cr; ) cr = wt[--St], wt[St] = null, fn = wt[--St], wt[St] = null, dn = wt[--St], wt[St] = null;
  }
  var ht = null, vt = null, we = !1, Dt = null;
  function Cs(e, t) {
    var n = Et(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function Ns(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, ht = e, vt = Dn(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, ht = e, vt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = cr !== null ? { id: dn, overflow: fn } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = Et(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, ht = e, vt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function To(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Do(e) {
    if (we) {
      var t = vt;
      if (t) {
        var n = t;
        if (!Ns(e, t)) {
          if (To(e)) throw Error(v(418));
          t = Dn(n.nextSibling);
          var r = ht;
          t && Ns(e, t) ? Cs(r, n) : (e.flags = e.flags & -4097 | 2, we = !1, ht = e);
        }
      } else {
        if (To(e)) throw Error(v(418));
        e.flags = e.flags & -4097 | 2, we = !1, ht = e;
      }
    }
  }
  function Ps(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    ht = e;
  }
  function Si(e) {
    if (e !== ht) return !1;
    if (!we) return Ps(e), we = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Eo(e.type, e.memoizedProps)), t && (t = vt)) {
      if (To(e)) throw js(), Error(v(418));
      for (; t; ) Cs(e, t), t = Dn(t.nextSibling);
    }
    if (Ps(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(v(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                vt = Dn(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        vt = null;
      }
    } else vt = ht ? Dn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function js() {
    for (var e = vt; e; ) e = Dn(e.nextSibling);
  }
  function Kr() {
    vt = ht = null, we = !1;
  }
  function Mo(e) {
    Dt === null ? Dt = [e] : Dt.push(e);
  }
  var rd = ye.ReactCurrentBatchConfig;
  function Mt(e, t) {
    if (e && e.defaultProps) {
      t = a({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  var xi = Mn(null), ki = null, Yr = null, Io = null;
  function Oo() {
    Io = Yr = ki = null;
  }
  function Fo(e) {
    var t = xi.current;
    me(xi), e._currentValue = t;
  }
  function Ao(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Xr(e, t) {
    ki = e, Io = Yr = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (st = !0), e.firstContext = null);
  }
  function xt(e) {
    var t = e._currentValue;
    if (Io !== e) if (e = { context: e, memoizedValue: t, next: null }, Yr === null) {
      if (ki === null) throw Error(v(308));
      Yr = e, ki.dependencies = { lanes: 0, firstContext: e };
    } else Yr = Yr.next = e;
    return t;
  }
  var fr = null;
  function Uo(e) {
    fr === null ? fr = [e] : fr.push(e);
  }
  function Rs(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Uo(t)) : (n.next = l.next, l.next = n), t.interleaved = n, pn(e, r);
  }
  function pn(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Fn = !1;
  function Bo(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function zs(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function mn(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function An(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (b & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, pn(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Uo(r)) : (t.next = l.next, l.next = t), r.interleaved = t, pn(e, n);
  }
  function _i(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, Tr(e, n);
    }
  }
  function Ls(e, t) {
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
  function Ei(e, t, n, r) {
    var l = e.updateQueue;
    Fn = !1;
    var i = l.firstBaseUpdate, o = l.lastBaseUpdate, u = l.shared.pending;
    if (u !== null) {
      l.shared.pending = null;
      var c = u, h = c.next;
      c.next = null, o === null ? i = h : o.next = h, o = c;
      var S = e.alternate;
      S !== null && (S = S.updateQueue, u = S.lastBaseUpdate, u !== o && (u === null ? S.firstBaseUpdate = h : u.next = h, S.lastBaseUpdate = c));
    }
    if (i !== null) {
      var x = l.baseState;
      o = 0, S = h = c = null, u = i;
      do {
        var w = u.lane, j = u.eventTime;
        if ((r & w) === w) {
          S !== null && (S = S.next = {
            eventTime: j,
            lane: 0,
            tag: u.tag,
            payload: u.payload,
            callback: u.callback,
            next: null
          });
          e: {
            var z = e, T = u;
            switch (w = t, j = n, T.tag) {
              case 1:
                if (z = T.payload, typeof z == "function") {
                  x = z.call(j, x, w);
                  break e;
                }
                x = z;
                break e;
              case 3:
                z.flags = z.flags & -65537 | 128;
              case 0:
                if (z = T.payload, w = typeof z == "function" ? z.call(j, x, w) : z, w == null) break e;
                x = a({}, x, w);
                break e;
              case 2:
                Fn = !0;
            }
          }
          u.callback !== null && u.lane !== 0 && (e.flags |= 64, w = l.effects, w === null ? l.effects = [u] : w.push(u));
        } else j = { eventTime: j, lane: w, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, S === null ? (h = S = j, c = x) : S = S.next = j, o |= w;
        if (u = u.next, u === null) {
          if (u = l.shared.pending, u === null) break;
          w = u, u = w.next, w.next = null, l.lastBaseUpdate = w, l.shared.pending = null;
        }
      } while (!0);
      if (S === null && (c = x), l.baseState = c, l.firstBaseUpdate = h, l.lastBaseUpdate = S, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          o |= l.lane, l = l.next;
        while (l !== t);
      } else i === null && (l.shared.lanes = 0);
      hr |= o, e.lanes = o, e.memoizedState = x;
    }
  }
  function Ts(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(v(191, l));
        l.call(r);
      }
    }
  }
  var Ds = new C.Component().refs;
  function $o(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : a({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Ci = { isMounted: function(e) {
    return (e = e._reactInternals) ? zt(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = lt(), l = Hn(e), i = mn(r, l);
    i.payload = t, n != null && (i.callback = n), t = An(e, i, l), t !== null && (Ft(t, e, l, r), _i(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = lt(), l = Hn(e), i = mn(r, l);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = An(e, i, l), t !== null && (Ft(t, e, l, r), _i(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = lt(), r = Hn(e), l = mn(n, r);
    l.tag = 2, t != null && (l.callback = t), t = An(e, l, r), t !== null && (Ft(t, e, r, n), _i(t, e, r));
  } };
  function Ms(e, t, n, r, l, i, o) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !_l(n, r) || !_l(l, i) : !0;
  }
  function Is(e, t, n) {
    var r = !1, l = In, i = t.contextType;
    return typeof i == "object" && i !== null ? i = xt(i) : (l = ut(t) ? ar : Je.current, r = t.contextTypes, i = (r = r != null) ? Wr(e, l) : In), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Ci, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function Os(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Ci.enqueueReplaceState(t, t.state, null);
  }
  function Ho(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = Ds, Bo(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? l.context = xt(i) : (i = ut(t) ? ar : Je.current, l.context = Wr(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && ($o(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && Ci.enqueueReplaceState(l, l.state, null), Ei(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function zl(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(v(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(v(147, e));
        var l = r, i = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(o) {
          var u = l.refs;
          u === Ds && (u = l.refs = {}), o === null ? delete u[i] : u[i] = o;
        }, t._stringRef = i, t);
      }
      if (typeof e != "string") throw Error(v(284));
      if (!n._owner) throw Error(v(290, e));
    }
    return e;
  }
  function Ni(e, t) {
    throw e = Object.prototype.toString.call(t), Error(v(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Fs(e) {
    var t = e._init;
    return t(e._payload);
  }
  function As(e) {
    function t(f, d) {
      if (e) {
        var m = f.deletions;
        m === null ? (f.deletions = [d], f.flags |= 16) : m.push(d);
      }
    }
    function n(f, d) {
      if (!e) return null;
      for (; d !== null; ) t(f, d), d = d.sibling;
      return null;
    }
    function r(f, d) {
      for (f = /* @__PURE__ */ new Map(); d !== null; ) d.key !== null ? f.set(d.key, d) : f.set(d.index, d), d = d.sibling;
      return f;
    }
    function l(f, d) {
      return f = Vn(f, d), f.index = 0, f.sibling = null, f;
    }
    function i(f, d, m) {
      return f.index = m, e ? (m = f.alternate, m !== null ? (m = m.index, m < d ? (f.flags |= 2, d) : m) : (f.flags |= 2, d)) : (f.flags |= 1048576, d);
    }
    function o(f) {
      return e && f.alternate === null && (f.flags |= 2), f;
    }
    function u(f, d, m, k) {
      return d === null || d.tag !== 6 ? (d = Cu(m, f.mode, k), d.return = f, d) : (d = l(d, m), d.return = f, d);
    }
    function c(f, d, m, k) {
      var D = m.type;
      return D === Ke ? S(f, d, m.props.children, k, m.key) : d !== null && (d.elementType === D || typeof D == "object" && D !== null && D.$$typeof === Oe && Fs(D) === d.type) ? (k = l(d, m.props), k.ref = zl(f, d, m), k.return = f, k) : (k = Qi(m.type, m.key, m.props, null, f.mode, k), k.ref = zl(f, d, m), k.return = f, k);
    }
    function h(f, d, m, k) {
      return d === null || d.tag !== 4 || d.stateNode.containerInfo !== m.containerInfo || d.stateNode.implementation !== m.implementation ? (d = Nu(m, f.mode, k), d.return = f, d) : (d = l(d, m.children || []), d.return = f, d);
    }
    function S(f, d, m, k, D) {
      return d === null || d.tag !== 7 ? (d = wr(m, f.mode, k, D), d.return = f, d) : (d = l(d, m), d.return = f, d);
    }
    function x(f, d, m) {
      if (typeof d == "string" && d !== "" || typeof d == "number") return d = Cu("" + d, f.mode, m), d.return = f, d;
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case Qe:
            return m = Qi(d.type, d.key, d.props, null, f.mode, m), m.ref = zl(f, null, d), m.return = f, m;
          case Se:
            return d = Nu(d, f.mode, m), d.return = f, d;
          case Oe:
            var k = d._init;
            return x(f, k(d._payload), m);
        }
        if (kn(d) || M(d)) return d = wr(d, f.mode, m, null), d.return = f, d;
        Ni(f, d);
      }
      return null;
    }
    function w(f, d, m, k) {
      var D = d !== null ? d.key : null;
      if (typeof m == "string" && m !== "" || typeof m == "number") return D !== null ? null : u(f, d, "" + m, k);
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case Qe:
            return m.key === D ? c(f, d, m, k) : null;
          case Se:
            return m.key === D ? h(f, d, m, k) : null;
          case Oe:
            return D = m._init, w(
              f,
              d,
              D(m._payload),
              k
            );
        }
        if (kn(m) || M(m)) return D !== null ? null : S(f, d, m, k, null);
        Ni(f, m);
      }
      return null;
    }
    function j(f, d, m, k, D) {
      if (typeof k == "string" && k !== "" || typeof k == "number") return f = f.get(m) || null, u(d, f, "" + k, D);
      if (typeof k == "object" && k !== null) {
        switch (k.$$typeof) {
          case Qe:
            return f = f.get(k.key === null ? m : k.key) || null, c(d, f, k, D);
          case Se:
            return f = f.get(k.key === null ? m : k.key) || null, h(d, f, k, D);
          case Oe:
            var I = k._init;
            return j(f, d, m, I(k._payload), D);
        }
        if (kn(k) || M(k)) return f = f.get(m) || null, S(d, f, k, D, null);
        Ni(d, k);
      }
      return null;
    }
    function z(f, d, m, k) {
      for (var D = null, I = null, O = d, A = d = 0, We = null; O !== null && A < m.length; A++) {
        O.index > A ? (We = O, O = null) : We = O.sibling;
        var ne = w(f, O, m[A], k);
        if (ne === null) {
          O === null && (O = We);
          break;
        }
        e && O && ne.alternate === null && t(f, O), d = i(ne, d, A), I === null ? D = ne : I.sibling = ne, I = ne, O = We;
      }
      if (A === m.length) return n(f, O), we && dr(f, A), D;
      if (O === null) {
        for (; A < m.length; A++) O = x(f, m[A], k), O !== null && (d = i(O, d, A), I === null ? D = O : I.sibling = O, I = O);
        return we && dr(f, A), D;
      }
      for (O = r(f, O); A < m.length; A++) We = j(O, f, A, m[A], k), We !== null && (e && We.alternate !== null && O.delete(We.key === null ? A : We.key), d = i(We, d, A), I === null ? D = We : I.sibling = We, I = We);
      return e && O.forEach(function(Qn) {
        return t(f, Qn);
      }), we && dr(f, A), D;
    }
    function T(f, d, m, k) {
      var D = M(m);
      if (typeof D != "function") throw Error(v(150));
      if (m = D.call(m), m == null) throw Error(v(151));
      for (var I = D = null, O = d, A = d = 0, We = null, ne = m.next(); O !== null && !ne.done; A++, ne = m.next()) {
        O.index > A ? (We = O, O = null) : We = O.sibling;
        var Qn = w(f, O, ne.value, k);
        if (Qn === null) {
          O === null && (O = We);
          break;
        }
        e && O && Qn.alternate === null && t(f, O), d = i(Qn, d, A), I === null ? D = Qn : I.sibling = Qn, I = Qn, O = We;
      }
      if (ne.done) return n(
        f,
        O
      ), we && dr(f, A), D;
      if (O === null) {
        for (; !ne.done; A++, ne = m.next()) ne = x(f, ne.value, k), ne !== null && (d = i(ne, d, A), I === null ? D = ne : I.sibling = ne, I = ne);
        return we && dr(f, A), D;
      }
      for (O = r(f, O); !ne.done; A++, ne = m.next()) ne = j(O, f, A, ne.value, k), ne !== null && (e && ne.alternate !== null && O.delete(ne.key === null ? A : ne.key), d = i(ne, d, A), I === null ? D = ne : I.sibling = ne, I = ne);
      return e && O.forEach(function(Od) {
        return t(f, Od);
      }), we && dr(f, A), D;
    }
    function Re(f, d, m, k) {
      if (typeof m == "object" && m !== null && m.type === Ke && m.key === null && (m = m.props.children), typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case Qe:
            e: {
              for (var D = m.key, I = d; I !== null; ) {
                if (I.key === D) {
                  if (D = m.type, D === Ke) {
                    if (I.tag === 7) {
                      n(f, I.sibling), d = l(I, m.props.children), d.return = f, f = d;
                      break e;
                    }
                  } else if (I.elementType === D || typeof D == "object" && D !== null && D.$$typeof === Oe && Fs(D) === I.type) {
                    n(f, I.sibling), d = l(I, m.props), d.ref = zl(f, I, m), d.return = f, f = d;
                    break e;
                  }
                  n(f, I);
                  break;
                } else t(f, I);
                I = I.sibling;
              }
              m.type === Ke ? (d = wr(m.props.children, f.mode, k, m.key), d.return = f, f = d) : (k = Qi(m.type, m.key, m.props, null, f.mode, k), k.ref = zl(f, d, m), k.return = f, f = k);
            }
            return o(f);
          case Se:
            e: {
              for (I = m.key; d !== null; ) {
                if (d.key === I) if (d.tag === 4 && d.stateNode.containerInfo === m.containerInfo && d.stateNode.implementation === m.implementation) {
                  n(f, d.sibling), d = l(d, m.children || []), d.return = f, f = d;
                  break e;
                } else {
                  n(f, d);
                  break;
                }
                else t(f, d);
                d = d.sibling;
              }
              d = Nu(m, f.mode, k), d.return = f, f = d;
            }
            return o(f);
          case Oe:
            return I = m._init, Re(f, d, I(m._payload), k);
        }
        if (kn(m)) return z(f, d, m, k);
        if (M(m)) return T(f, d, m, k);
        Ni(f, m);
      }
      return typeof m == "string" && m !== "" || typeof m == "number" ? (m = "" + m, d !== null && d.tag === 6 ? (n(f, d.sibling), d = l(d, m), d.return = f, f = d) : (n(f, d), d = Cu(m, f.mode, k), d.return = f, f = d), o(f)) : n(f, d);
    }
    return Re;
  }
  var Gr = As(!0), Us = As(!1), Ll = {}, Yt = Mn(Ll), Tl = Mn(Ll), Dl = Mn(Ll);
  function pr(e) {
    if (e === Ll) throw Error(v(174));
    return e;
  }
  function Wo(e, t) {
    switch (fe(Dl, t), fe(Tl, e), fe(Yt, Ll), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Jt(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Jt(t, e);
    }
    me(Yt), fe(Yt, t);
  }
  function Zr() {
    me(Yt), me(Tl), me(Dl);
  }
  function Bs(e) {
    pr(Dl.current);
    var t = pr(Yt.current), n = Jt(t, e.type);
    t !== n && (fe(Tl, e), fe(Yt, n));
  }
  function Vo(e) {
    Tl.current === e && (me(Yt), me(Tl));
  }
  var xe = Mn(0);
  function Pi(e) {
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
  var Qo = [];
  function Ko() {
    for (var e = 0; e < Qo.length; e++) Qo[e]._workInProgressVersionPrimary = null;
    Qo.length = 0;
  }
  var ji = ye.ReactCurrentDispatcher, Yo = ye.ReactCurrentBatchConfig, mr = 0, ke = null, Ae = null, $e = null, Ri = !1, Ml = !1, Il = 0, ld = 0;
  function be() {
    throw Error(v(321));
  }
  function Xo(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!Tt(e[n], t[n])) return !1;
    return !0;
  }
  function Go(e, t, n, r, l, i) {
    if (mr = i, ke = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, ji.current = e === null || e.memoizedState === null ? sd : ad, e = n(r, l), Ml) {
      i = 0;
      do {
        if (Ml = !1, Il = 0, 25 <= i) throw Error(v(301));
        i += 1, $e = Ae = null, t.updateQueue = null, ji.current = cd, e = n(r, l);
      } while (Ml);
    }
    if (ji.current = Ti, t = Ae !== null && Ae.next !== null, mr = 0, $e = Ae = ke = null, Ri = !1, t) throw Error(v(300));
    return e;
  }
  function Zo() {
    var e = Il !== 0;
    return Il = 0, e;
  }
  function Xt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return $e === null ? ke.memoizedState = $e = e : $e = $e.next = e, $e;
  }
  function kt() {
    if (Ae === null) {
      var e = ke.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Ae.next;
    var t = $e === null ? ke.memoizedState : $e.next;
    if (t !== null) $e = t, Ae = e;
    else {
      if (e === null) throw Error(v(310));
      Ae = e, e = { memoizedState: Ae.memoizedState, baseState: Ae.baseState, baseQueue: Ae.baseQueue, queue: Ae.queue, next: null }, $e === null ? ke.memoizedState = $e = e : $e = $e.next = e;
    }
    return $e;
  }
  function Ol(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function qo(e) {
    var t = kt(), n = t.queue;
    if (n === null) throw Error(v(311));
    n.lastRenderedReducer = e;
    var r = Ae, l = r.baseQueue, i = n.pending;
    if (i !== null) {
      if (l !== null) {
        var o = l.next;
        l.next = i.next, i.next = o;
      }
      r.baseQueue = l = i, n.pending = null;
    }
    if (l !== null) {
      i = l.next, r = r.baseState;
      var u = o = null, c = null, h = i;
      do {
        var S = h.lane;
        if ((mr & S) === S) c !== null && (c = c.next = { lane: 0, action: h.action, hasEagerState: h.hasEagerState, eagerState: h.eagerState, next: null }), r = h.hasEagerState ? h.eagerState : e(r, h.action);
        else {
          var x = {
            lane: S,
            action: h.action,
            hasEagerState: h.hasEagerState,
            eagerState: h.eagerState,
            next: null
          };
          c === null ? (u = c = x, o = r) : c = c.next = x, ke.lanes |= S, hr |= S;
        }
        h = h.next;
      } while (h !== null && h !== i);
      c === null ? o = r : c.next = u, Tt(r, t.memoizedState) || (st = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = c, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        i = l.lane, ke.lanes |= i, hr |= i, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function Jo(e) {
    var t = kt(), n = t.queue;
    if (n === null) throw Error(v(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, i = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var o = l = l.next;
      do
        i = e(i, o.action), o = o.next;
      while (o !== l);
      Tt(i, t.memoizedState) || (st = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
    }
    return [i, r];
  }
  function $s() {
  }
  function Hs(e, t) {
    var n = ke, r = kt(), l = t(), i = !Tt(r.memoizedState, l);
    if (i && (r.memoizedState = l, st = !0), r = r.queue, bo(Qs.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || $e !== null && $e.memoizedState.tag & 1) {
      if (n.flags |= 2048, Fl(9, Vs.bind(null, n, r, l, t), void 0, null), He === null) throw Error(v(349));
      (mr & 30) !== 0 || Ws(n, t, l);
    }
    return l;
  }
  function Ws(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = ke.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, ke.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Vs(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Ks(t) && Ys(e);
  }
  function Qs(e, t, n) {
    return n(function() {
      Ks(t) && Ys(e);
    });
  }
  function Ks(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Tt(e, n);
    } catch {
      return !0;
    }
  }
  function Ys(e) {
    var t = pn(e, 1);
    t !== null && Ft(t, e, 1, -1);
  }
  function Xs(e) {
    var t = Xt();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Ol, lastRenderedState: e }, t.queue = e, e = e.dispatch = ud.bind(null, ke, e), [t.memoizedState, e];
  }
  function Fl(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = ke.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, ke.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Gs() {
    return kt().memoizedState;
  }
  function zi(e, t, n, r) {
    var l = Xt();
    ke.flags |= e, l.memoizedState = Fl(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function Li(e, t, n, r) {
    var l = kt();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (Ae !== null) {
      var o = Ae.memoizedState;
      if (i = o.destroy, r !== null && Xo(r, o.deps)) {
        l.memoizedState = Fl(t, n, i, r);
        return;
      }
    }
    ke.flags |= e, l.memoizedState = Fl(1 | t, n, i, r);
  }
  function Zs(e, t) {
    return zi(8390656, 8, e, t);
  }
  function bo(e, t) {
    return Li(2048, 8, e, t);
  }
  function qs(e, t) {
    return Li(4, 2, e, t);
  }
  function Js(e, t) {
    return Li(4, 4, e, t);
  }
  function bs(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function ea(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Li(4, 4, bs.bind(null, t, e), n);
  }
  function eu() {
  }
  function ta(e, t) {
    var n = kt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Xo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function na(e, t) {
    var n = kt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Xo(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function ra(e, t, n) {
    return (mr & 21) === 0 ? (e.baseState && (e.baseState = !1, st = !0), e.memoizedState = n) : (Tt(n, t) || (n = ln(), ke.lanes |= n, hr |= n, e.baseState = !0), t);
  }
  function id(e, t) {
    var n = re;
    re = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Yo.transition;
    Yo.transition = {};
    try {
      e(!1), t();
    } finally {
      re = n, Yo.transition = r;
    }
  }
  function la() {
    return kt().memoizedState;
  }
  function od(e, t, n) {
    var r = Hn(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, ia(e)) oa(t, n);
    else if (n = Rs(e, t, n, r), n !== null) {
      var l = lt();
      Ft(n, e, r, l), ua(n, t, r);
    }
  }
  function ud(e, t, n) {
    var r = Hn(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (ia(e)) oa(t, l);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var o = t.lastRenderedState, u = i(o, n);
        if (l.hasEagerState = !0, l.eagerState = u, Tt(u, o)) {
          var c = t.interleaved;
          c === null ? (l.next = l, Uo(t)) : (l.next = c.next, c.next = l), t.interleaved = l;
          return;
        }
      } catch {
      }
      n = Rs(e, t, l, r), n !== null && (l = lt(), Ft(n, e, r, l), ua(n, t, r));
    }
  }
  function ia(e) {
    var t = e.alternate;
    return e === ke || t !== null && t === ke;
  }
  function oa(e, t) {
    Ml = Ri = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function ua(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, Tr(e, n);
    }
  }
  var Ti = { readContext: xt, useCallback: be, useContext: be, useEffect: be, useImperativeHandle: be, useInsertionEffect: be, useLayoutEffect: be, useMemo: be, useReducer: be, useRef: be, useState: be, useDebugValue: be, useDeferredValue: be, useTransition: be, useMutableSource: be, useSyncExternalStore: be, useId: be, unstable_isNewReconciler: !1 }, sd = { readContext: xt, useCallback: function(e, t) {
    return Xt().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: xt, useEffect: Zs, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, zi(
      4194308,
      4,
      bs.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return zi(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return zi(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = Xt();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = Xt();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = od.bind(null, ke, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = Xt();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Xs, useDebugValue: eu, useDeferredValue: function(e) {
    return Xt().memoizedState = e;
  }, useTransition: function() {
    var e = Xs(!1), t = e[0];
    return e = id.bind(null, e[1]), Xt().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = ke, l = Xt();
    if (we) {
      if (n === void 0) throw Error(v(407));
      n = n();
    } else {
      if (n = t(), He === null) throw Error(v(349));
      (mr & 30) !== 0 || Ws(r, t, n);
    }
    l.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return l.queue = i, Zs(Qs.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, Fl(9, Vs.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = Xt(), t = He.identifierPrefix;
    if (we) {
      var n = fn, r = dn;
      n = (r & ~(1 << 32 - H(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Il++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = ld++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, ad = {
    readContext: xt,
    useCallback: ta,
    useContext: xt,
    useEffect: bo,
    useImperativeHandle: ea,
    useInsertionEffect: qs,
    useLayoutEffect: Js,
    useMemo: na,
    useReducer: qo,
    useRef: Gs,
    useState: function() {
      return qo(Ol);
    },
    useDebugValue: eu,
    useDeferredValue: function(e) {
      var t = kt();
      return ra(t, Ae.memoizedState, e);
    },
    useTransition: function() {
      var e = qo(Ol)[0], t = kt().memoizedState;
      return [e, t];
    },
    useMutableSource: $s,
    useSyncExternalStore: Hs,
    useId: la,
    unstable_isNewReconciler: !1
  }, cd = { readContext: xt, useCallback: ta, useContext: xt, useEffect: bo, useImperativeHandle: ea, useInsertionEffect: qs, useLayoutEffect: Js, useMemo: na, useReducer: Jo, useRef: Gs, useState: function() {
    return Jo(Ol);
  }, useDebugValue: eu, useDeferredValue: function(e) {
    var t = kt();
    return Ae === null ? t.memoizedState = e : ra(t, Ae.memoizedState, e);
  }, useTransition: function() {
    var e = Jo(Ol)[0], t = kt().memoizedState;
    return [e, t];
  }, useMutableSource: $s, useSyncExternalStore: Hs, useId: la, unstable_isNewReconciler: !1 };
  function qr(e, t) {
    try {
      var n = "", r = t;
      do
        n += ie(r), r = r.return;
      while (r);
      var l = n;
    } catch (i) {
      l = `
Error generating stack: ` + i.message + `
` + i.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function tu(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function nu(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var dd = typeof WeakMap == "function" ? WeakMap : Map;
  function sa(e, t, n) {
    n = mn(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Ui || (Ui = !0, yu = r), nu(e, t);
    }, n;
  }
  function aa(e, t, n) {
    n = mn(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        nu(e, t);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
      nu(e, t), typeof r != "function" && (Bn === null ? Bn = /* @__PURE__ */ new Set([this]) : Bn.add(this));
      var o = t.stack;
      this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
    }), n;
  }
  function ca(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new dd();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = Cd.bind(null, e, t, n), t.then(e, e));
  }
  function da(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function fa(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = mn(-1, 1), t.tag = 2, An(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var fd = ye.ReactCurrentOwner, st = !1;
  function rt(e, t, n, r) {
    t.child = e === null ? Us(t, null, n, r) : Gr(t, e.child, n, r);
  }
  function pa(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return Xr(t, l), r = Go(e, t, n, r, i, l), n = Zo(), e !== null && !st ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, hn(e, t, l)) : (we && n && zo(t), t.flags |= 1, rt(e, t, r, l), t.child);
  }
  function ma(e, t, n, r, l) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !Eu(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, ha(e, t, i, r, l)) : (e = Qi(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & l) === 0) {
      var o = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : _l, n(o, r) && e.ref === t.ref) return hn(e, t, l);
    }
    return t.flags |= 1, e = Vn(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function ha(e, t, n, r, l) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (_l(i, r) && e.ref === t.ref) if (st = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (st = !0);
      else return t.lanes = e.lanes, hn(e, t, l);
    }
    return ru(e, t, n, r, l);
  }
  function va(e, t, n) {
    var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, fe(br, yt), yt |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, fe(br, yt), yt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, fe(br, yt), yt |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, fe(br, yt), yt |= r;
    return rt(e, t, l, n), t.child;
  }
  function ya(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function ru(e, t, n, r, l) {
    var i = ut(n) ? ar : Je.current;
    return i = Wr(t, i), Xr(t, l), n = Go(e, t, n, r, i, l), r = Zo(), e !== null && !st ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, hn(e, t, l)) : (we && r && zo(t), t.flags |= 1, rt(e, t, n, l), t.child);
  }
  function ga(e, t, n, r, l) {
    if (ut(n)) {
      var i = !0;
      vi(t);
    } else i = !1;
    if (Xr(t, l), t.stateNode === null) Mi(e, t), Is(t, n, r), Ho(t, n, r, l), r = !0;
    else if (e === null) {
      var o = t.stateNode, u = t.memoizedProps;
      o.props = u;
      var c = o.context, h = n.contextType;
      typeof h == "object" && h !== null ? h = xt(h) : (h = ut(n) ? ar : Je.current, h = Wr(t, h));
      var S = n.getDerivedStateFromProps, x = typeof S == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      x || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== r || c !== h) && Os(t, o, r, h), Fn = !1;
      var w = t.memoizedState;
      o.state = w, Ei(t, r, o, l), c = t.memoizedState, u !== r || w !== c || ot.current || Fn ? (typeof S == "function" && ($o(t, n, S, r), c = t.memoizedState), (u = Fn || Ms(t, n, u, r, w, c, h)) ? (x || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = c), o.props = r, o.state = c, o.context = h, r = u) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      o = t.stateNode, zs(e, t), u = t.memoizedProps, h = t.type === t.elementType ? u : Mt(t.type, u), o.props = h, x = t.pendingProps, w = o.context, c = n.contextType, typeof c == "object" && c !== null ? c = xt(c) : (c = ut(n) ? ar : Je.current, c = Wr(t, c));
      var j = n.getDerivedStateFromProps;
      (S = typeof j == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== x || w !== c) && Os(t, o, r, c), Fn = !1, w = t.memoizedState, o.state = w, Ei(t, r, o, l);
      var z = t.memoizedState;
      u !== x || w !== z || ot.current || Fn ? (typeof j == "function" && ($o(t, n, j, r), z = t.memoizedState), (h = Fn || Ms(t, n, h, r, w, z, c) || !1) ? (S || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, z, c), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, z, c)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && w === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && w === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = z), o.props = r, o.state = z, o.context = c, r = h) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && w === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && w === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return lu(e, t, n, r, i, l);
  }
  function lu(e, t, n, r, l, i) {
    ya(e, t);
    var o = (t.flags & 128) !== 0;
    if (!r && !o) return l && ks(t, n, !1), hn(e, t, i);
    r = t.stateNode, fd.current = t;
    var u = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && o ? (t.child = Gr(t, e.child, null, i), t.child = Gr(t, null, u, i)) : rt(e, t, u, i), t.memoizedState = r.state, l && ks(t, n, !0), t.child;
  }
  function wa(e) {
    var t = e.stateNode;
    t.pendingContext ? Ss(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Ss(e, t.context, !1), Wo(e, t.containerInfo);
  }
  function Sa(e, t, n, r, l) {
    return Kr(), Mo(l), t.flags |= 256, rt(e, t, n, r), t.child;
  }
  var iu = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ou(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function xa(e, t, n) {
    var r = t.pendingProps, l = xe.current, i = !1, o = (t.flags & 128) !== 0, u;
    if ((u = o) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), fe(xe, l & 1), e === null)
      return Do(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = Ki(o, r, 0, null), e = wr(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = ou(n), t.memoizedState = iu, e) : uu(t, o));
    if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return pd(e, t, o, r, u, l, n);
    if (i) {
      i = r.fallback, o = t.mode, l = e.child, u = l.sibling;
      var c = { mode: "hidden", children: r.children };
      return (o & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = c, t.deletions = null) : (r = Vn(l, c), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? i = Vn(u, i) : (i = wr(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? ou(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = iu, r;
    }
    return i = e.child, e = i.sibling, r = Vn(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function uu(e, t) {
    return t = Ki({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Di(e, t, n, r) {
    return r !== null && Mo(r), Gr(t, e.child, null, n), e = uu(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function pd(e, t, n, r, l, i, o) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = tu(Error(v(422))), Di(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = Ki({ mode: "visible", children: r.children }, l, 0, null), i = wr(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && Gr(t, e.child, null, o), t.child.memoizedState = ou(o), t.memoizedState = iu, i);
    if ((t.mode & 1) === 0) return Di(e, t, o, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
      return r = u, i = Error(v(419)), r = tu(i, r, void 0), Di(e, t, o, r);
    }
    if (u = (o & e.childLanes) !== 0, st || u) {
      if (r = He, r !== null) {
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
        l = (l & (r.suspendedLanes | o)) !== 0 ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, pn(e, l), Ft(r, e, l, -1));
      }
      return _u(), r = tu(Error(v(421))), Di(e, t, o, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Nd.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, vt = Dn(l.nextSibling), ht = t, we = !0, Dt = null, e !== null && (wt[St++] = dn, wt[St++] = fn, wt[St++] = cr, dn = e.id, fn = e.overflow, cr = t), t = uu(t, r.children), t.flags |= 4096, t);
  }
  function ka(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Ao(e.return, t, n);
  }
  function su(e, t, n, r, l) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = l);
  }
  function _a(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, i = r.tail;
    if (rt(e, t, r.children, n), r = xe.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && ka(e, n, t);
        else if (e.tag === 19) ka(e, n, t);
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
    if (fe(xe, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && Pi(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), su(t, !1, l, n, i);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && Pi(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        su(t, !0, n, null, i);
        break;
      case "together":
        su(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Mi(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function hn(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), hr |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(v(153));
    if (t.child !== null) {
      for (e = t.child, n = Vn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Vn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function md(e, t, n) {
    switch (t.tag) {
      case 3:
        wa(t), Kr();
        break;
      case 5:
        Bs(t);
        break;
      case 1:
        ut(t.type) && vi(t);
        break;
      case 4:
        Wo(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        fe(xi, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (fe(xe, xe.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? xa(e, t, n) : (fe(xe, xe.current & 1), e = hn(e, t, n), e !== null ? e.sibling : null);
        fe(xe, xe.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return _a(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), fe(xe, xe.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, va(e, t, n);
    }
    return hn(e, t, n);
  }
  var Ea, au, Ca, Na;
  Ea = function(e, t) {
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
  }, au = function() {
  }, Ca = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, pr(Yt.current);
      var i = null;
      switch (n) {
        case "input":
          l = gn(e, l), r = gn(e, r), i = [];
          break;
        case "select":
          l = a({}, l, { value: void 0 }), r = a({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          l = qt(e, l), r = qt(e, r), i = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = pi);
      }
      De(n, r);
      var o;
      n = null;
      for (h in l) if (!r.hasOwnProperty(h) && l.hasOwnProperty(h) && l[h] != null) if (h === "style") {
        var u = l[h];
        for (o in u) u.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
      } else h !== "dangerouslySetInnerHTML" && h !== "children" && h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && h !== "autoFocus" && (ae.hasOwnProperty(h) ? i || (i = []) : (i = i || []).push(h, null));
      for (h in r) {
        var c = r[h];
        if (u = l?.[h], r.hasOwnProperty(h) && c !== u && (c != null || u != null)) if (h === "style") if (u) {
          for (o in u) !u.hasOwnProperty(o) || c && c.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
          for (o in c) c.hasOwnProperty(o) && u[o] !== c[o] && (n || (n = {}), n[o] = c[o]);
        } else n || (i || (i = []), i.push(
          h,
          n
        )), n = c;
        else h === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, u = u ? u.__html : void 0, c != null && u !== c && (i = i || []).push(h, c)) : h === "children" ? typeof c != "string" && typeof c != "number" || (i = i || []).push(h, "" + c) : h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && (ae.hasOwnProperty(h) ? (c != null && h === "onScroll" && pe("scroll", e), i || u === c || (i = [])) : (i = i || []).push(h, c));
      }
      n && (i = i || []).push("style", n);
      var h = i;
      (t.updateQueue = h) && (t.flags |= 4);
    }
  }, Na = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function Al(e, t) {
    if (!we) switch (e.tailMode) {
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
  function et(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function hd(e, t, n) {
    var r = t.pendingProps;
    switch (Lo(t), t.tag) {
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
        return et(t), null;
      case 1:
        return ut(t.type) && hi(), et(t), null;
      case 3:
        return r = t.stateNode, Zr(), me(ot), me(Je), Ko(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (Si(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Dt !== null && (Su(Dt), Dt = null))), au(e, t), et(t), null;
      case 5:
        Vo(t);
        var l = pr(Dl.current);
        if (n = t.type, e !== null && t.stateNode != null) Ca(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(v(166));
            return et(t), null;
          }
          if (e = pr(Yt.current), Si(t)) {
            r = t.stateNode, n = t.type;
            var i = t.memoizedProps;
            switch (r[Kt] = t, r[jl] = i, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                pe("cancel", r), pe("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                pe("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < Cl.length; l++) pe(Cl[l], r);
                break;
              case "source":
                pe("error", r);
                break;
              case "img":
              case "image":
              case "link":
                pe(
                  "error",
                  r
                ), pe("load", r);
                break;
              case "details":
                pe("toggle", r);
                break;
              case "input":
                ll(r, i), pe("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, pe("invalid", r);
                break;
              case "textarea":
                xr(r, i), pe("invalid", r);
            }
            De(n, i), l = null;
            for (var o in i) if (i.hasOwnProperty(o)) {
              var u = i[o];
              o === "children" ? typeof u == "string" ? r.textContent !== u && (i.suppressHydrationWarning !== !0 && fi(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (i.suppressHydrationWarning !== !0 && fi(
                r.textContent,
                u,
                e
              ), l = ["children", "" + u]) : ae.hasOwnProperty(o) && u != null && o === "onScroll" && pe("scroll", r);
            }
            switch (n) {
              case "input":
                Yn(r), Sn(r, i, !0);
                break;
              case "textarea":
                Yn(r), At(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = pi);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = kr(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[Kt] = t, e[jl] = r, Ea(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (o = en(n, r), n) {
                case "dialog":
                  pe("cancel", e), pe("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  pe("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < Cl.length; l++) pe(Cl[l], e);
                  l = r;
                  break;
                case "source":
                  pe("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  pe(
                    "error",
                    e
                  ), pe("load", e), l = r;
                  break;
                case "details":
                  pe("toggle", e), l = r;
                  break;
                case "input":
                  ll(e, r), l = gn(e, r), pe("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = a({}, r, { value: void 0 }), pe("invalid", e);
                  break;
                case "textarea":
                  xr(e, r), l = qt(e, r), pe("invalid", e);
                  break;
                default:
                  l = r;
              }
              De(n, l), u = l;
              for (i in u) if (u.hasOwnProperty(i)) {
                var c = u[i];
                i === "style" ? _n(e, c) : i === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, c != null && _r(e, c)) : i === "children" ? typeof c == "string" ? (n !== "textarea" || c !== "") && nt(e, c) : typeof c == "number" && nt(e, "" + c) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (ae.hasOwnProperty(i) ? c != null && i === "onScroll" && pe("scroll", e) : c != null && Ee(e, i, c, o));
              }
              switch (n) {
                case "input":
                  Yn(e), Sn(e, r, !1);
                  break;
                case "textarea":
                  Yn(e), At(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + q(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? gt(e, !!r.multiple, i, !1) : r.defaultValue != null && gt(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = pi);
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
        return et(t), null;
      case 6:
        if (e && t.stateNode != null) Na(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(v(166));
          if (n = pr(Dl.current), pr(Yt.current), Si(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[Kt] = t, (i = r.nodeValue !== n) && (e = ht, e !== null)) switch (e.tag) {
              case 3:
                fi(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && fi(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            i && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Kt] = t, t.stateNode = r;
        }
        return et(t), null;
      case 13:
        if (me(xe), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (we && vt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) js(), Kr(), t.flags |= 98560, i = !1;
          else if (i = Si(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(v(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(v(317));
              i[Kt] = t;
            } else Kr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            et(t), i = !1;
          } else Dt !== null && (Su(Dt), Dt = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (xe.current & 1) !== 0 ? Ue === 0 && (Ue = 3) : _u())), t.updateQueue !== null && (t.flags |= 4), et(t), null);
      case 4:
        return Zr(), au(e, t), e === null && Nl(t.stateNode.containerInfo), et(t), null;
      case 10:
        return Fo(t.type._context), et(t), null;
      case 17:
        return ut(t.type) && hi(), et(t), null;
      case 19:
        if (me(xe), i = t.memoizedState, i === null) return et(t), null;
        if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) Al(i, !1);
        else {
          if (Ue !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (o = Pi(e), o !== null) {
              for (t.flags |= 128, Al(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return fe(xe, xe.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && ge() > el && (t.flags |= 128, r = !0, Al(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = Pi(o), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), Al(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !we) return et(t), null;
          } else 2 * ge() - i.renderingStartTime > el && n !== 1073741824 && (t.flags |= 128, r = !0, Al(i, !1), t.lanes = 4194304);
          i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = ge(), t.sibling = null, n = xe.current, fe(xe, r ? n & 1 | 2 : n & 1), t) : (et(t), null);
      case 22:
      case 23:
        return ku(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (yt & 1073741824) !== 0 && (et(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : et(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(v(156, t.tag));
  }
  function vd(e, t) {
    switch (Lo(t), t.tag) {
      case 1:
        return ut(t.type) && hi(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Zr(), me(ot), me(Je), Ko(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Vo(t), null;
      case 13:
        if (me(xe), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(v(340));
          Kr();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return me(xe), null;
      case 4:
        return Zr(), null;
      case 10:
        return Fo(t.type._context), null;
      case 22:
      case 23:
        return ku(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ii = !1, tt = !1, yd = typeof WeakSet == "function" ? WeakSet : Set, R = null;
  function Jr(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      Ne(e, t, r);
    }
    else n.current = null;
  }
  function cu(e, t, n) {
    try {
      n();
    } catch (r) {
      Ne(e, t, r);
    }
  }
  var Pa = !1;
  function gd(e, t) {
    if (ko = F, e = ls(), mo(e)) {
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
          var o = 0, u = -1, c = -1, h = 0, S = 0, x = e, w = null;
          t: for (; ; ) {
            for (var j; x !== n || l !== 0 && x.nodeType !== 3 || (u = o + l), x !== i || r !== 0 && x.nodeType !== 3 || (c = o + r), x.nodeType === 3 && (o += x.nodeValue.length), (j = x.firstChild) !== null; )
              w = x, x = j;
            for (; ; ) {
              if (x === e) break t;
              if (w === n && ++h === l && (u = o), w === i && ++S === r && (c = o), (j = x.nextSibling) !== null) break;
              x = w, w = x.parentNode;
            }
            x = j;
          }
          n = u === -1 || c === -1 ? null : { start: u, end: c };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (_o = { focusedElem: e, selectionRange: n }, F = !1, R = t; R !== null; ) if (t = R, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, R = e;
    else for (; R !== null; ) {
      t = R;
      try {
        var z = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (z !== null) {
              var T = z.memoizedProps, Re = z.memoizedState, f = t.stateNode, d = f.getSnapshotBeforeUpdate(t.elementType === t.type ? T : Mt(t.type, T), Re);
              f.__reactInternalSnapshotBeforeUpdate = d;
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
            throw Error(v(163));
        }
      } catch (k) {
        Ne(t, t.return, k);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, R = e;
        break;
      }
      R = t.return;
    }
    return z = Pa, Pa = !1, z;
  }
  function Ul(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var i = l.destroy;
          l.destroy = void 0, i !== void 0 && cu(t, n, i);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Oi(e, t) {
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
  function du(e) {
    var t = e.ref;
    if (t !== null) {
      var n = e.stateNode;
      e.tag, e = n, typeof t == "function" ? t(e) : t.current = e;
    }
  }
  function ja(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, ja(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Kt], delete t[jl], delete t[Po], delete t[ed], delete t[td])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Ra(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function za(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Ra(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function fu(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = pi));
    else if (r !== 4 && (e = e.child, e !== null)) for (fu(e, t, n), e = e.sibling; e !== null; ) fu(e, t, n), e = e.sibling;
  }
  function pu(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (pu(e, t, n), e = e.sibling; e !== null; ) pu(e, t, n), e = e.sibling;
  }
  var Xe = null, It = !1;
  function Un(e, t, n) {
    for (n = n.child; n !== null; ) La(e, t, n), n = n.sibling;
  }
  function La(e, t, n) {
    if (Be && typeof Be.onCommitFiberUnmount == "function") try {
      Be.onCommitFiberUnmount(nr, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        tt || Jr(n, t);
      case 6:
        var r = Xe, l = It;
        Xe = null, Un(e, t, n), Xe = r, It = l, Xe !== null && (It ? (e = Xe, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Xe.removeChild(n.stateNode));
        break;
      case 18:
        Xe !== null && (It ? (e = Xe, n = n.stateNode, e.nodeType === 8 ? No(e.parentNode, n) : e.nodeType === 1 && No(e, n), P(e)) : No(Xe, n.stateNode));
        break;
      case 4:
        r = Xe, l = It, Xe = n.stateNode.containerInfo, It = !0, Un(e, t, n), Xe = r, It = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!tt && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var i = l, o = i.destroy;
            i = i.tag, o !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && cu(n, t, o), l = l.next;
          } while (l !== r);
        }
        Un(e, t, n);
        break;
      case 1:
        if (!tt && (Jr(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (u) {
          Ne(n, t, u);
        }
        Un(e, t, n);
        break;
      case 21:
        Un(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (tt = (r = tt) || n.memoizedState !== null, Un(e, t, n), tt = r) : Un(e, t, n);
        break;
      default:
        Un(e, t, n);
    }
  }
  function Ta(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new yd()), t.forEach(function(r) {
        var l = Pd.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function Ot(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e, o = t, u = o;
        e: for (; u !== null; ) {
          switch (u.tag) {
            case 5:
              Xe = u.stateNode, It = !1;
              break e;
            case 3:
              Xe = u.stateNode.containerInfo, It = !0;
              break e;
            case 4:
              Xe = u.stateNode.containerInfo, It = !0;
              break e;
          }
          u = u.return;
        }
        if (Xe === null) throw Error(v(160));
        La(i, o, l), Xe = null, It = !1;
        var c = l.alternate;
        c !== null && (c.return = null), l.return = null;
      } catch (h) {
        Ne(l, t, h);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Da(t, e), t = t.sibling;
  }
  function Da(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Ot(t, e), Gt(e), r & 4) {
          try {
            Ul(3, e, e.return), Oi(3, e);
          } catch (T) {
            Ne(e, e.return, T);
          }
          try {
            Ul(5, e, e.return);
          } catch (T) {
            Ne(e, e.return, T);
          }
        }
        break;
      case 1:
        Ot(t, e), Gt(e), r & 512 && n !== null && Jr(n, n.return);
        break;
      case 5:
        if (Ot(t, e), Gt(e), r & 512 && n !== null && Jr(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            nt(l, "");
          } catch (T) {
            Ne(e, e.return, T);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, u = e.type, c = e.updateQueue;
          if (e.updateQueue = null, c !== null) try {
            u === "input" && i.type === "radio" && i.name != null && wn(l, i), en(u, o);
            var h = en(u, i);
            for (o = 0; o < c.length; o += 2) {
              var S = c[o], x = c[o + 1];
              S === "style" ? _n(l, x) : S === "dangerouslySetInnerHTML" ? _r(l, x) : S === "children" ? nt(l, x) : Ee(l, S, x, h);
            }
            switch (u) {
              case "input":
                Sr(l, i);
                break;
              case "textarea":
                il(l, i);
                break;
              case "select":
                var w = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var j = i.value;
                j != null ? gt(l, !!i.multiple, j, !1) : w !== !!i.multiple && (i.defaultValue != null ? gt(
                  l,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : gt(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[jl] = i;
          } catch (T) {
            Ne(e, e.return, T);
          }
        }
        break;
      case 6:
        if (Ot(t, e), Gt(e), r & 4) {
          if (e.stateNode === null) throw Error(v(162));
          l = e.stateNode, i = e.memoizedProps;
          try {
            l.nodeValue = i;
          } catch (T) {
            Ne(e, e.return, T);
          }
        }
        break;
      case 3:
        if (Ot(t, e), Gt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          P(t.containerInfo);
        } catch (T) {
          Ne(e, e.return, T);
        }
        break;
      case 4:
        Ot(t, e), Gt(e);
        break;
      case 13:
        Ot(t, e), Gt(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (vu = ge())), r & 4 && Ta(e);
        break;
      case 22:
        if (S = n !== null && n.memoizedState !== null, e.mode & 1 ? (tt = (h = tt) || S, Ot(t, e), tt = h) : Ot(t, e), Gt(e), r & 8192) {
          if (h = e.memoizedState !== null, (e.stateNode.isHidden = h) && !S && (e.mode & 1) !== 0) for (R = e, S = e.child; S !== null; ) {
            for (x = R = S; R !== null; ) {
              switch (w = R, j = w.child, w.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Ul(4, w, w.return);
                  break;
                case 1:
                  Jr(w, w.return);
                  var z = w.stateNode;
                  if (typeof z.componentWillUnmount == "function") {
                    r = w, n = w.return;
                    try {
                      t = r, z.props = t.memoizedProps, z.state = t.memoizedState, z.componentWillUnmount();
                    } catch (T) {
                      Ne(r, n, T);
                    }
                  }
                  break;
                case 5:
                  Jr(w, w.return);
                  break;
                case 22:
                  if (w.memoizedState !== null) {
                    Oa(x);
                    continue;
                  }
              }
              j !== null ? (j.return = w, R = j) : Oa(x);
            }
            S = S.sibling;
          }
          e: for (S = null, x = e; ; ) {
            if (x.tag === 5) {
              if (S === null) {
                S = x;
                try {
                  l = x.stateNode, h ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (u = x.stateNode, c = x.memoizedProps.style, o = c != null && c.hasOwnProperty("display") ? c.display : null, u.style.display = ol("display", o));
                } catch (T) {
                  Ne(e, e.return, T);
                }
              }
            } else if (x.tag === 6) {
              if (S === null) try {
                x.stateNode.nodeValue = h ? "" : x.memoizedProps;
              } catch (T) {
                Ne(e, e.return, T);
              }
            } else if ((x.tag !== 22 && x.tag !== 23 || x.memoizedState === null || x === e) && x.child !== null) {
              x.child.return = x, x = x.child;
              continue;
            }
            if (x === e) break e;
            for (; x.sibling === null; ) {
              if (x.return === null || x.return === e) break e;
              S === x && (S = null), x = x.return;
            }
            S === x && (S = null), x.sibling.return = x.return, x = x.sibling;
          }
        }
        break;
      case 19:
        Ot(t, e), Gt(e), r & 4 && Ta(e);
        break;
      case 21:
        break;
      default:
        Ot(
          t,
          e
        ), Gt(e);
    }
  }
  function Gt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (Ra(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(v(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (nt(l, ""), r.flags &= -33);
            var i = za(e);
            pu(e, i, l);
            break;
          case 3:
          case 4:
            var o = r.stateNode.containerInfo, u = za(e);
            fu(e, u, o);
            break;
          default:
            throw Error(v(161));
        }
      } catch (c) {
        Ne(e, e.return, c);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function wd(e, t, n) {
    R = e, Ma(e);
  }
  function Ma(e, t, n) {
    for (var r = (e.mode & 1) !== 0; R !== null; ) {
      var l = R, i = l.child;
      if (l.tag === 22 && r) {
        var o = l.memoizedState !== null || Ii;
        if (!o) {
          var u = l.alternate, c = u !== null && u.memoizedState !== null || tt;
          u = Ii;
          var h = tt;
          if (Ii = o, (tt = c) && !h) for (R = l; R !== null; ) o = R, c = o.child, o.tag === 22 && o.memoizedState !== null ? Fa(l) : c !== null ? (c.return = o, R = c) : Fa(l);
          for (; i !== null; ) R = i, Ma(i), i = i.sibling;
          R = l, Ii = u, tt = h;
        }
        Ia(e);
      } else (l.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = l, R = i) : Ia(e);
    }
  }
  function Ia(e) {
    for (; R !== null; ) {
      var t = R;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              tt || Oi(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !tt) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : Mt(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var i = t.updateQueue;
              i !== null && Ts(t, i, r);
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
                Ts(t, o, n);
              }
              break;
            case 5:
              var u = t.stateNode;
              if (n === null && t.flags & 4) {
                n = u;
                var c = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    c.autoFocus && n.focus();
                    break;
                  case "img":
                    c.src && (n.src = c.src);
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
                  var S = h.memoizedState;
                  if (S !== null) {
                    var x = S.dehydrated;
                    x !== null && P(x);
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
              throw Error(v(163));
          }
          tt || t.flags & 512 && du(t);
        } catch (w) {
          Ne(t, t.return, w);
        }
      }
      if (t === e) {
        R = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, R = n;
        break;
      }
      R = t.return;
    }
  }
  function Oa(e) {
    for (; R !== null; ) {
      var t = R;
      if (t === e) {
        R = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, R = n;
        break;
      }
      R = t.return;
    }
  }
  function Fa(e) {
    for (; R !== null; ) {
      var t = R;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Oi(4, t);
            } catch (c) {
              Ne(t, n, c);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (c) {
                Ne(t, l, c);
              }
            }
            var i = t.return;
            try {
              du(t);
            } catch (c) {
              Ne(t, i, c);
            }
            break;
          case 5:
            var o = t.return;
            try {
              du(t);
            } catch (c) {
              Ne(t, o, c);
            }
        }
      } catch (c) {
        Ne(t, t.return, c);
      }
      if (t === e) {
        R = null;
        break;
      }
      var u = t.sibling;
      if (u !== null) {
        u.return = t.return, R = u;
        break;
      }
      R = t.return;
    }
  }
  var Sd = Math.ceil, Fi = ye.ReactCurrentDispatcher, mu = ye.ReactCurrentOwner, _t = ye.ReactCurrentBatchConfig, b = 0, He = null, Ie = null, Ge = 0, yt = 0, br = Mn(0), Ue = 0, Bl = null, hr = 0, Ai = 0, hu = 0, $l = null, at = null, vu = 0, el = 1 / 0, vn = null, Ui = !1, yu = null, Bn = null, Bi = !1, $n = null, $i = 0, Hl = 0, gu = null, Hi = -1, Wi = 0;
  function lt() {
    return (b & 6) !== 0 ? ge() : Hi !== -1 ? Hi : Hi = ge();
  }
  function Hn(e) {
    return (e.mode & 1) === 0 ? 1 : (b & 2) !== 0 && Ge !== 0 ? Ge & -Ge : rd.transition !== null ? (Wi === 0 && (Wi = ln()), Wi) : (e = re, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Au(e.type)), e);
  }
  function Ft(e, t, n, r) {
    if (50 < Hl) throw Hl = 0, gu = null, Error(v(185));
    on(e, n, r), ((b & 2) === 0 || e !== He) && (e === He && ((b & 2) === 0 && (Ai |= n), Ue === 4 && Wn(e, Ge)), ct(e, r), n === 1 && b === 0 && (t.mode & 1) === 0 && (el = ge() + 500, yi && On()));
  }
  function ct(e, t) {
    var n = e.callbackNode;
    ce(e, t);
    var r = lr(e, e === He ? Ge : 0);
    if (r === 0) n !== null && jr(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && jr(n), t === 1) e.tag === 0 ? nd(Ua.bind(null, e)) : _s(Ua.bind(null, e)), Jc(function() {
        (b & 6) === 0 && On();
      }), n = null;
      else {
        switch (Jl(r)) {
          case 1:
            n = Rr;
            break;
          case 4:
            n = ml;
            break;
          case 16:
            n = pt;
            break;
          case 536870912:
            n = Nn;
            break;
          default:
            n = pt;
        }
        n = Ya(n, Aa.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Aa(e, t) {
    if (Hi = -1, Wi = 0, (b & 6) !== 0) throw Error(v(327));
    var n = e.callbackNode;
    if (tl() && e.callbackNode !== n) return null;
    var r = lr(e, e === He ? Ge : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Vi(e, r);
    else {
      t = r;
      var l = b;
      b |= 2;
      var i = $a();
      (He !== e || Ge !== t) && (vn = null, el = ge() + 500, yr(e, t));
      do
        try {
          _d();
          break;
        } catch (u) {
          Ba(e, u);
        }
      while (!0);
      Oo(), Fi.current = i, b = l, Ie !== null ? t = 0 : (He = null, Ge = 0, t = Ue);
    }
    if (t !== 0) {
      if (t === 2 && (l = hl(e), l !== 0 && (r = l, t = wu(e, l))), t === 1) throw n = Bl, yr(e, 0), Wn(e, r), ct(e, ge()), n;
      if (t === 6) Wn(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !xd(l) && (t = Vi(e, r), t === 2 && (i = hl(e), i !== 0 && (r = i, t = wu(e, i))), t === 1)) throw n = Bl, yr(e, 0), Wn(e, r), ct(e, ge()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(v(345));
          case 2:
            gr(e, at, vn);
            break;
          case 3:
            if (Wn(e, r), (r & 130023424) === r && (t = vu + 500 - ge(), 10 < t)) {
              if (lr(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                lt(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Co(gr.bind(null, e, at, vn), t);
              break;
            }
            gr(e, at, vn);
            break;
          case 4:
            if (Wn(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var o = 31 - H(r);
              i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
            }
            if (r = l, r = ge() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Sd(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Co(gr.bind(null, e, at, vn), r);
              break;
            }
            gr(e, at, vn);
            break;
          case 5:
            gr(e, at, vn);
            break;
          default:
            throw Error(v(329));
        }
      }
    }
    return ct(e, ge()), e.callbackNode === n ? Aa.bind(null, e) : null;
  }
  function wu(e, t) {
    var n = $l;
    return e.current.memoizedState.isDehydrated && (yr(e, t).flags |= 256), e = Vi(e, t), e !== 2 && (t = at, at = n, t !== null && Su(t)), e;
  }
  function Su(e) {
    at === null ? at = e : at.push.apply(at, e);
  }
  function xd(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var l = n[r], i = l.getSnapshot;
          l = l.value;
          try {
            if (!Tt(i(), l)) return !1;
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
  function Wn(e, t) {
    for (t &= ~hu, t &= ~Ai, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - H(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Ua(e) {
    if ((b & 6) !== 0) throw Error(v(327));
    tl();
    var t = lr(e, 0);
    if ((t & 1) === 0) return ct(e, ge()), null;
    var n = Vi(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = hl(e);
      r !== 0 && (t = r, n = wu(e, r));
    }
    if (n === 1) throw n = Bl, yr(e, 0), Wn(e, t), ct(e, ge()), n;
    if (n === 6) throw Error(v(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, gr(e, at, vn), ct(e, ge()), null;
  }
  function xu(e, t) {
    var n = b;
    b |= 1;
    try {
      return e(t);
    } finally {
      b = n, b === 0 && (el = ge() + 500, yi && On());
    }
  }
  function vr(e) {
    $n !== null && $n.tag === 0 && (b & 6) === 0 && tl();
    var t = b;
    b |= 1;
    var n = _t.transition, r = re;
    try {
      if (_t.transition = null, re = 1, e) return e();
    } finally {
      re = r, _t.transition = n, b = t, (b & 6) === 0 && On();
    }
  }
  function ku() {
    yt = br.current, me(br);
  }
  function yr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, qc(n)), Ie !== null) for (n = Ie.return; n !== null; ) {
      var r = n;
      switch (Lo(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && hi();
          break;
        case 3:
          Zr(), me(ot), me(Je), Ko();
          break;
        case 5:
          Vo(r);
          break;
        case 4:
          Zr();
          break;
        case 13:
          me(xe);
          break;
        case 19:
          me(xe);
          break;
        case 10:
          Fo(r.type._context);
          break;
        case 22:
        case 23:
          ku();
      }
      n = n.return;
    }
    if (He = e, Ie = e = Vn(e.current, null), Ge = yt = t, Ue = 0, Bl = null, hu = Ai = hr = 0, at = $l = null, fr !== null) {
      for (t = 0; t < fr.length; t++) if (n = fr[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, i = n.pending;
        if (i !== null) {
          var o = i.next;
          i.next = l, r.next = o;
        }
        n.pending = r;
      }
      fr = null;
    }
    return e;
  }
  function Ba(e, t) {
    do {
      var n = Ie;
      try {
        if (Oo(), ji.current = Ti, Ri) {
          for (var r = ke.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          Ri = !1;
        }
        if (mr = 0, $e = Ae = ke = null, Ml = !1, Il = 0, mu.current = null, n === null || n.return === null) {
          Ue = 1, Bl = t, Ie = null;
          break;
        }
        e: {
          var i = e, o = n.return, u = n, c = t;
          if (t = Ge, u.flags |= 32768, c !== null && typeof c == "object" && typeof c.then == "function") {
            var h = c, S = u, x = S.tag;
            if ((S.mode & 1) === 0 && (x === 0 || x === 11 || x === 15)) {
              var w = S.alternate;
              w ? (S.updateQueue = w.updateQueue, S.memoizedState = w.memoizedState, S.lanes = w.lanes) : (S.updateQueue = null, S.memoizedState = null);
            }
            var j = da(o);
            if (j !== null) {
              j.flags &= -257, fa(j, o, u, i, t), j.mode & 1 && ca(i, h, t), t = j, c = h;
              var z = t.updateQueue;
              if (z === null) {
                var T = /* @__PURE__ */ new Set();
                T.add(c), t.updateQueue = T;
              } else z.add(c);
              break e;
            } else {
              if ((t & 1) === 0) {
                ca(i, h, t), _u();
                break e;
              }
              c = Error(v(426));
            }
          } else if (we && u.mode & 1) {
            var Re = da(o);
            if (Re !== null) {
              (Re.flags & 65536) === 0 && (Re.flags |= 256), fa(Re, o, u, i, t), Mo(qr(c, u));
              break e;
            }
          }
          i = c = qr(c, u), Ue !== 4 && (Ue = 2), $l === null ? $l = [i] : $l.push(i), i = o;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var f = sa(i, c, t);
                Ls(i, f);
                break e;
              case 1:
                u = c;
                var d = i.type, m = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof d.getDerivedStateFromError == "function" || m !== null && typeof m.componentDidCatch == "function" && (Bn === null || !Bn.has(m)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var k = aa(i, u, t);
                  Ls(i, k);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        Wa(n);
      } catch (D) {
        t = D, Ie === n && n !== null && (Ie = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function $a() {
    var e = Fi.current;
    return Fi.current = Ti, e === null ? Ti : e;
  }
  function _u() {
    (Ue === 0 || Ue === 3 || Ue === 2) && (Ue = 4), He === null || (hr & 268435455) === 0 && (Ai & 268435455) === 0 || Wn(He, Ge);
  }
  function Vi(e, t) {
    var n = b;
    b |= 2;
    var r = $a();
    (He !== e || Ge !== t) && (vn = null, yr(e, t));
    do
      try {
        kd();
        break;
      } catch (l) {
        Ba(e, l);
      }
    while (!0);
    if (Oo(), b = n, Fi.current = r, Ie !== null) throw Error(v(261));
    return He = null, Ge = 0, Ue;
  }
  function kd() {
    for (; Ie !== null; ) Ha(Ie);
  }
  function _d() {
    for (; Ie !== null && !fl(); ) Ha(Ie);
  }
  function Ha(e) {
    var t = Ka(e.alternate, e, yt);
    e.memoizedProps = e.pendingProps, t === null ? Wa(e) : Ie = t, mu.current = null;
  }
  function Wa(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = hd(n, t, yt), n !== null) {
          Ie = n;
          return;
        }
      } else {
        if (n = vd(n, t), n !== null) {
          n.flags &= 32767, Ie = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Ue = 6, Ie = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Ie = t;
        return;
      }
      Ie = t = e;
    } while (t !== null);
    Ue === 0 && (Ue = 5);
  }
  function gr(e, t, n) {
    var r = re, l = _t.transition;
    try {
      _t.transition = null, re = 1, Ed(e, t, n, r);
    } finally {
      _t.transition = l, re = r;
    }
    return null;
  }
  function Ed(e, t, n, r) {
    do
      tl();
    while ($n !== null);
    if ((b & 6) !== 0) throw Error(v(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(v(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = n.lanes | n.childLanes;
    if (un(e, i), e === He && (Ie = He = null, Ge = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Bi || (Bi = !0, Ya(pt, function() {
      return tl(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = _t.transition, _t.transition = null;
      var o = re;
      re = 1;
      var u = b;
      b |= 4, mu.current = null, gd(e, n), Da(n, e), Vc(_o), F = !!ko, _o = ko = null, e.current = n, wd(n), pl(), b = u, re = o, _t.transition = i;
    } else e.current = n;
    if (Bi && (Bi = !1, $n = e, $i = l), i = e.pendingLanes, i === 0 && (Bn = null), Pn(n.stateNode), ct(e, ge()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Ui) throw Ui = !1, e = yu, yu = null, e;
    return ($i & 1) !== 0 && e.tag !== 0 && tl(), i = e.pendingLanes, (i & 1) !== 0 ? e === gu ? Hl++ : (Hl = 0, gu = e) : Hl = 0, On(), null;
  }
  function tl() {
    if ($n !== null) {
      var e = Jl($i), t = _t.transition, n = re;
      try {
        if (_t.transition = null, re = 16 > e ? 16 : e, $n === null) var r = !1;
        else {
          if (e = $n, $n = null, $i = 0, (b & 6) !== 0) throw Error(v(331));
          var l = b;
          for (b |= 4, R = e.current; R !== null; ) {
            var i = R, o = i.child;
            if ((R.flags & 16) !== 0) {
              var u = i.deletions;
              if (u !== null) {
                for (var c = 0; c < u.length; c++) {
                  var h = u[c];
                  for (R = h; R !== null; ) {
                    var S = R;
                    switch (S.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Ul(8, S, i);
                    }
                    var x = S.child;
                    if (x !== null) x.return = S, R = x;
                    else for (; R !== null; ) {
                      S = R;
                      var w = S.sibling, j = S.return;
                      if (ja(S), S === h) {
                        R = null;
                        break;
                      }
                      if (w !== null) {
                        w.return = j, R = w;
                        break;
                      }
                      R = j;
                    }
                  }
                }
                var z = i.alternate;
                if (z !== null) {
                  var T = z.child;
                  if (T !== null) {
                    z.child = null;
                    do {
                      var Re = T.sibling;
                      T.sibling = null, T = Re;
                    } while (T !== null);
                  }
                }
                R = i;
              }
            }
            if ((i.subtreeFlags & 2064) !== 0 && o !== null) o.return = i, R = o;
            else e: for (; R !== null; ) {
              if (i = R, (i.flags & 2048) !== 0) switch (i.tag) {
                case 0:
                case 11:
                case 15:
                  Ul(9, i, i.return);
              }
              var f = i.sibling;
              if (f !== null) {
                f.return = i.return, R = f;
                break e;
              }
              R = i.return;
            }
          }
          var d = e.current;
          for (R = d; R !== null; ) {
            o = R;
            var m = o.child;
            if ((o.subtreeFlags & 2064) !== 0 && m !== null) m.return = o, R = m;
            else e: for (o = d; R !== null; ) {
              if (u = R, (u.flags & 2048) !== 0) try {
                switch (u.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Oi(9, u);
                }
              } catch (D) {
                Ne(u, u.return, D);
              }
              if (u === o) {
                R = null;
                break e;
              }
              var k = u.sibling;
              if (k !== null) {
                k.return = u.return, R = k;
                break e;
              }
              R = u.return;
            }
          }
          if (b = l, On(), Be && typeof Be.onPostCommitFiberRoot == "function") try {
            Be.onPostCommitFiberRoot(nr, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        re = n, _t.transition = t;
      }
    }
    return !1;
  }
  function Va(e, t, n) {
    t = qr(n, t), t = sa(e, t, 1), e = An(e, t, 1), t = lt(), e !== null && (on(e, 1, t), ct(e, t));
  }
  function Ne(e, t, n) {
    if (e.tag === 3) Va(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Va(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Bn === null || !Bn.has(r))) {
          e = qr(n, e), e = aa(t, e, 1), t = An(t, e, 1), e = lt(), t !== null && (on(t, 1, e), ct(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Cd(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = lt(), e.pingedLanes |= e.suspendedLanes & n, He === e && (Ge & n) === n && (Ue === 4 || Ue === 3 && (Ge & 130023424) === Ge && 500 > ge() - vu ? yr(e, 0) : hu |= n), ct(e, t);
  }
  function Qa(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = rn, rn <<= 1, (rn & 130023424) === 0 && (rn = 4194304)));
    var n = lt();
    e = pn(e, t), e !== null && (on(e, t, n), ct(e, n));
  }
  function Nd(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Qa(e, n);
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
        throw Error(v(314));
    }
    r !== null && r.delete(t), Qa(e, n);
  }
  var Ka;
  Ka = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || ot.current) st = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return st = !1, md(e, t, n);
      st = (e.flags & 131072) !== 0;
    }
    else st = !1, we && (t.flags & 1048576) !== 0 && Es(t, wi, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Mi(e, t), e = t.pendingProps;
        var l = Wr(t, Je.current);
        Xr(t, n), l = Go(null, t, r, e, l, n);
        var i = Zo();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, ut(r) ? (i = !0, vi(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Bo(t), l.updater = Ci, t.stateNode = l, l._reactInternals = t, Ho(t, r, e, n), t = lu(null, t, r, !0, i, n)) : (t.tag = 0, we && i && zo(t), rt(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Mi(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Rd(r), e = Mt(r, e), l) {
            case 0:
              t = ru(null, t, r, e, n);
              break e;
            case 1:
              t = ga(null, t, r, e, n);
              break e;
            case 11:
              t = pa(null, t, r, e, n);
              break e;
            case 14:
              t = ma(null, t, r, Mt(r.type, e), n);
              break e;
          }
          throw Error(v(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Mt(r, l), ru(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Mt(r, l), ga(e, t, r, l, n);
      case 3:
        e: {
          if (wa(t), e === null) throw Error(v(387));
          r = t.pendingProps, i = t.memoizedState, l = i.element, zs(e, t), Ei(t, r, null, n);
          var o = t.memoizedState;
          if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            l = qr(Error(v(423)), t), t = Sa(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = qr(Error(v(424)), t), t = Sa(e, t, r, n, l);
            break e;
          } else for (vt = Dn(t.stateNode.containerInfo.firstChild), ht = t, we = !0, Dt = null, n = Us(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Kr(), r === l) {
              t = hn(e, t, n);
              break e;
            }
            rt(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Bs(t), e === null && Do(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, Eo(r, l) ? o = null : i !== null && Eo(r, i) && (t.flags |= 32), ya(e, t), rt(e, t, o, n), t.child;
      case 6:
        return e === null && Do(t), null;
      case 13:
        return xa(e, t, n);
      case 4:
        return Wo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Gr(t, null, r, n) : rt(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Mt(r, l), pa(e, t, r, l, n);
      case 7:
        return rt(e, t, t.pendingProps, n), t.child;
      case 8:
        return rt(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return rt(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, fe(xi, r._currentValue), r._currentValue = o, i !== null) if (Tt(i.value, o)) {
            if (i.children === l.children && !ot.current) {
              t = hn(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var u = i.dependencies;
            if (u !== null) {
              o = i.child;
              for (var c = u.firstContext; c !== null; ) {
                if (c.context === r) {
                  if (i.tag === 1) {
                    c = mn(-1, n & -n), c.tag = 2;
                    var h = i.updateQueue;
                    if (h !== null) {
                      h = h.shared;
                      var S = h.pending;
                      S === null ? c.next = c : (c.next = S.next, S.next = c), h.pending = c;
                    }
                  }
                  i.lanes |= n, c = i.alternate, c !== null && (c.lanes |= n), Ao(
                    i.return,
                    n,
                    t
                  ), u.lanes |= n;
                  break;
                }
                c = c.next;
              }
            } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (o = i.return, o === null) throw Error(v(341));
              o.lanes |= n, u = o.alternate, u !== null && (u.lanes |= n), Ao(o, n, t), o = i.sibling;
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
          rt(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, Xr(t, n), l = xt(l), r = r(l), t.flags |= 1, rt(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = Mt(r, t.pendingProps), l = Mt(r.type, l), ma(e, t, r, l, n);
      case 15:
        return ha(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : Mt(r, l), Mi(e, t), t.tag = 1, ut(r) ? (e = !0, vi(t)) : e = !1, Xr(t, n), Is(t, r, l), Ho(t, r, l, n), lu(null, t, r, !0, e, n);
      case 19:
        return _a(e, t, n);
      case 22:
        return va(e, t, n);
    }
    throw Error(v(156, t.tag));
  };
  function Ya(e, t) {
    return Xl(e, t);
  }
  function jd(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Et(e, t, n, r) {
    return new jd(e, t, n, r);
  }
  function Eu(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Rd(e) {
    if (typeof e == "function") return Eu(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === qe) return 11;
      if (e === Pe) return 14;
    }
    return 2;
  }
  function Vn(e, t) {
    var n = e.alternate;
    return n === null ? (n = Et(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Qi(e, t, n, r, l, i) {
    var o = 2;
    if (r = e, typeof e == "function") Eu(e) && (o = 1);
    else if (typeof e == "string") o = 5;
    else e: switch (e) {
      case Ke:
        return wr(n.children, l, i, t);
      case se:
        o = 8, l |= 8;
        break;
      case ze:
        return e = Et(12, n, t, l | 2), e.elementType = ze, e.lanes = i, e;
      case Le:
        return e = Et(13, n, t, l), e.elementType = Le, e.lanes = i, e;
      case Te:
        return e = Et(19, n, t, l), e.elementType = Te, e.lanes = i, e;
      case te:
        return Ki(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case ft:
            o = 10;
            break e;
          case Zt:
            o = 9;
            break e;
          case qe:
            o = 11;
            break e;
          case Pe:
            o = 14;
            break e;
          case Oe:
            o = 16, r = null;
            break e;
        }
        throw Error(v(130, e == null ? e : typeof e, ""));
    }
    return t = Et(o, n, t, l), t.elementType = e, t.type = r, t.lanes = i, t;
  }
  function wr(e, t, n, r) {
    return e = Et(7, e, r, t), e.lanes = n, e;
  }
  function Ki(e, t, n, r) {
    return e = Et(22, e, r, t), e.elementType = te, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Cu(e, t, n) {
    return e = Et(6, e, null, t), e.lanes = n, e;
  }
  function Nu(e, t, n) {
    return t = Et(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function zd(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Bt(0), this.expirationTimes = Bt(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Bt(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Pu(e, t, n, r, l, i, o, u, c) {
    return e = new zd(e, t, n, u, c), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = Et(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Bo(i), e;
  }
  function Ld(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Se, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Xa(e) {
    if (!e) return In;
    e = e._reactInternals;
    e: {
      if (zt(e) !== e || e.tag !== 1) throw Error(v(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (ut(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(v(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (ut(n)) return xs(e, n, t);
    }
    return t;
  }
  function Ga(e, t, n, r, l, i, o, u, c) {
    return e = Pu(n, r, !0, e, l, i, o, u, c), e.context = Xa(null), n = e.current, r = lt(), l = Hn(n), i = mn(r, l), i.callback = t ?? null, An(n, i, l), e.current.lanes = l, on(e, l, r), ct(e, r), e;
  }
  function Yi(e, t, n, r) {
    var l = t.current, i = lt(), o = Hn(l);
    return n = Xa(n), t.context === null ? t.context = n : t.pendingContext = n, t = mn(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = An(l, t, o), e !== null && (Ft(e, l, o, i), _i(e, l, o)), o;
  }
  function Xi(e) {
    return e = e.current, e.child ? (e.child.tag === 5, e.child.stateNode) : null;
  }
  function Za(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function ju(e, t) {
    Za(e, t), (e = e.alternate) && Za(e, t);
  }
  function Td() {
    return null;
  }
  var qa = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Ru(e) {
    this._internalRoot = e;
  }
  Gi.prototype.render = Ru.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(v(409));
    Yi(e, t, null, null);
  }, Gi.prototype.unmount = Ru.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      vr(function() {
        Yi(null, e, null, null);
      }), t[an] = null;
    }
  };
  function Gi(e) {
    this._internalRoot = e;
  }
  Gi.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = bl();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Qt.length && t !== 0 && t < Qt[n].priority; n++) ;
      Qt.splice(n, 0, e), n === 0 && ni(e);
    }
  };
  function zu(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Zi(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Ja() {
  }
  function Dd(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var h = Xi(o);
          i.call(h);
        };
      }
      var o = Ga(t, r, e, 0, null, !1, !1, "", Ja);
      return e._reactRootContainer = o, e[an] = o.current, Nl(e.nodeType === 8 ? e.parentNode : e), vr(), o;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var u = r;
      r = function() {
        var h = Xi(c);
        u.call(h);
      };
    }
    var c = Pu(e, 0, !1, null, null, !1, !1, "", Ja);
    return e._reactRootContainer = c, e[an] = c.current, Nl(e.nodeType === 8 ? e.parentNode : e), vr(function() {
      Yi(t, c, n, r);
    }), c;
  }
  function qi(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
      var o = i;
      if (typeof l == "function") {
        var u = l;
        l = function() {
          var c = Xi(o);
          u.call(c);
        };
      }
      Yi(t, o, e, l);
    } else o = Dd(n, t, e, l, r);
    return Xi(o);
  }
  ir = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Ye(t.pendingLanes);
          n !== 0 && (Tr(t, n | 1), ct(t, ge()), (b & 6) === 0 && (el = ge() + 500, On()));
        }
        break;
      case 13:
        vr(function() {
          var r = pn(e, 1);
          if (r !== null) {
            var l = lt();
            Ft(r, e, 1, l);
          }
        }), ju(e, 1);
    }
  }, Dr = function(e) {
    if (e.tag === 13) {
      var t = pn(e, 134217728);
      if (t !== null) {
        var n = lt();
        Ft(t, e, 134217728, n);
      }
      ju(e, 134217728);
    }
  }, vl = function(e) {
    if (e.tag === 13) {
      var t = Hn(e), n = pn(e, t);
      if (n !== null) {
        var r = lt();
        Ft(n, e, t, r);
      }
      ju(e, t);
    }
  }, bl = function() {
    return re;
  }, ei = function(e, t) {
    var n = re;
    try {
      return re = e, t();
    } finally {
      re = n;
    }
  }, Er = function(e, t, n) {
    switch (t) {
      case "input":
        if (Sr(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = mi(r);
              if (!l) throw Error(v(90));
              Ct(r), Sr(r, l);
            }
          }
        }
        break;
      case "textarea":
        il(e, n);
        break;
      case "select":
        t = n.value, t != null && gt(e, !!n.multiple, t, !1);
    }
  }, Gn = xu, Zn = vr;
  var Md = { usingClientEntryPoint: !1, Events: [Rl, $r, mi, Kl, En, xu] }, Wl = { findFiberByHostInstance: sr, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" }, Id = { bundleType: Wl.bundleType, version: Wl.version, rendererPackageName: Wl.rendererPackageName, rendererConfig: Wl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ye.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = tr(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Wl.findFiberByHostInstance || Td, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ji = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ji.isDisabled && Ji.supportsFiber) try {
      nr = Ji.inject(Id), Be = Ji;
    } catch {
    }
  }
  return dt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Md, dt.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!zu(t)) throw Error(v(200));
    return Ld(e, t, null, n);
  }, dt.createRoot = function(e, t) {
    if (!zu(e)) throw Error(v(299));
    var n = !1, r = "", l = qa;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Pu(e, 1, !1, null, null, n, !1, r, l), e[an] = t.current, Nl(e.nodeType === 8 ? e.parentNode : e), new Ru(t);
  }, dt.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(v(188)) : (e = Object.keys(e).join(","), Error(v(268, e)));
    return e = tr(t), e = e === null ? null : e.stateNode, e;
  }, dt.flushSync = function(e) {
    return vr(e);
  }, dt.hydrate = function(e, t, n) {
    if (!Zi(t)) throw Error(v(200));
    return qi(null, e, t, !0, n);
  }, dt.hydrateRoot = function(e, t, n) {
    if (!zu(e)) throw Error(v(405));
    var r = n != null && n.hydratedSources || null, l = !1, i = "", o = qa;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = Ga(t, null, e, 1, n ?? null, l, !1, i, o), e[an] = t.current, Nl(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Gi(t);
  }, dt.render = function(e, t, n) {
    if (!Zi(t)) throw Error(v(200));
    return qi(null, e, t, !1, n);
  }, dt.unmountComponentAtNode = function(e) {
    if (!Zi(e)) throw Error(v(40));
    return e._reactRootContainer ? (vr(function() {
      qi(null, null, e, !1, function() {
        e._reactRootContainer = null, e[an] = null;
      });
    }), !0) : !1;
  }, dt.unstable_batchedUpdates = xu, dt.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Zi(n)) throw Error(v(200));
    if (e == null || e._reactInternals === void 0) throw Error(v(38));
    return qi(e, t, n, !1, r);
  }, dt.version = "18.2.0-next-9e3b772b8-20220608", dt;
}
var oc;
function Wd() {
  if (oc) return Du.exports;
  oc = 1;
  function C() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(C);
      } catch (X) {
        console.error(X);
      }
  }
  return C(), Du.exports = Hd(), Du.exports;
}
var uc;
function Vd() {
  if (uc) return bi;
  uc = 1;
  var C = Wd();
  return bi.createRoot = C.createRoot, bi.hydrateRoot = C.hydrateRoot, bi;
}
var Qd = Vd();
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
const Yd = (C) => C.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().trim(), Kn = (C, X) => {
  const v = _.forwardRef(
    ({
      color: he = "currentColor",
      size: ae = 24,
      strokeWidth: G = 2,
      absoluteStrokeWidth: oe,
      className: J = "",
      children: Z,
      ...ve
    }, _e) => _.createElement(
      "svg",
      {
        ref: _e,
        ...Kd,
        width: ae,
        height: ae,
        stroke: he,
        strokeWidth: oe ? Number(G) * 24 / Number(ae) : G,
        className: ["lucide", `lucide-${Yd(C)}`, J].join(" "),
        ...ve
      },
      [
        ...X.map(([ue, U]) => _.createElement(ue, U)),
        ...Array.isArray(Z) ? Z : [Z]
      ]
    )
  );
  return v.displayName = `${C}`, v;
};
const Xd = Kn("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Gd = Kn("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
const Zd = Kn("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
const qd = Kn("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
const eo = Kn("Music2", [
  ["circle", { cx: "8", cy: "18", r: "4", key: "1fc0mg" }],
  ["path", { d: "M12 18V2l7 4", key: "g04rme" }]
]);
const Jd = Kn("Play", [
  ["polygon", { points: "5 3 19 12 5 21 5 3", key: "191637" }]
]);
const bd = Kn("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
const ef = Kn("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
function to(C) {
  return C.entity_id.startsWith("media_player.") && typeof C.attributes.bluetooth_address == "string" && /^(?:[0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(C.attributes.bluetooth_address) && typeof C.attributes.adapter == "string" && C.attributes.adapter.trim().length > 0 && ["idle", "playing", "paused"].includes(C.state);
}
function nl(C) {
  return typeof C.attributes.friendly_name == "string" ? C.attributes.friendly_name : C.entity_id;
}
function tf(C) {
  return C.kind === "custom";
}
function Ou(C) {
  return C.kind === "provider";
}
function sc(C) {
  return C.media_class?.toLowerCase() === "playlist" || C.media_content_type.toLowerCase().includes("playlist");
}
function ac(C) {
  if (!(!C?.startsWith("/") || C.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(C)))
    try {
      const X = "https://ha.invalid", v = new URL(C, X);
      if (v.origin !== X || v.protocol !== "https:" || v.username || v.password) return;
      const he = `${v.pathname}${v.search}${v.hash}`;
      return he.startsWith("//") ? void 0 : he;
    } catch {
      return;
    }
}
const nf = "Your Home Assistant session cannot access this media source. Reconnect or ask an administrator for access, then try again.", rf = "This source cannot play audio on a BL-HAOS speaker. Choose an audio item or provider playlist.";
function lf({ hass: C, initialView: X = "library" }) {
  const v = _.useRef(X), [he, ae] = _.useState(X), [G, oe] = _.useState(), [J, Z] = _.useState(!1), [ve, _e] = _.useState(""), [ue, U] = _.useState(""), [le, Ve] = _.useState(!1), [K, ee] = _.useState(), [it, Ze] = _.useState(""), [Ee, ye] = _.useState([]), [Qe, Se] = _.useState([]), [Ke, se] = _.useState(""), [ze, ft] = _.useState(!1), [Zt, qe] = _.useState(!1), [Le, Te] = _.useState(!1), [Pe, Oe] = _.useState(), [te, N] = _.useState(), [M, a] = _.useState(!1), [g, L] = _.useState(""), [B, $] = _.useState(""), [ie, V] = _.useState(""), [Y, q] = _.useState(""), [Ce, rl] = _.useState(() => /* @__PURE__ */ new Set()), [Yn, Ct] = _.useState({}), [yn, gn] = _.useState(""), [ll, wn] = _.useState(""), Sr = _.useRef(null), [Sn, xn] = _.useState(""), [kn, gt] = _.useState(""), [qt, xr] = _.useState(!1), [il, At] = _.useState(""), kr = _.useRef(null), Jt = _.useRef(""), [je, _r] = _.useState(), [nt, bt] = _.useState([]), [Nt, ol] = _.useState(""), [_n, Ql] = _.useState(""), [De, en] = _.useState(!1), [Fe, Xn] = _.useState(!1), [Er, Pt] = _.useState(""), [tn, Ut] = _.useState(""), [Kl, En] = _.useState(""), [Gn, Zn] = _.useState(""), [ul, Cr] = _.useState(!1), [jt, Cn] = _.useState(), [Rt, qn] = _.useState(), [Jn, bn] = _.useState(), nn = _.useRef(""), er = _.useRef(!1), Yl = _.useRef(null), sl = _.useRef(/* @__PURE__ */ new Map()), al = _.useRef(/* @__PURE__ */ new Map()), zt = _.useRef(/* @__PURE__ */ new Map()), cl = _.useRef(/* @__PURE__ */ new Map()), Nr = _.useRef(/* @__PURE__ */ new Map()), Pr = _.useRef(), tr = _.useRef(), dl = _.useRef(null), Xl = _.useRef(null), jr = _.useRef(null), fl = _.useRef(null), pl = _.useRef(null), ge = _.useRef(null), Gl = _.useRef(null), Rr = _.useRef(null), ml = _.useRef(null), pt = _.useRef(null), zr = _.useRef(!1), Nn = _.useRef({ name: "", entries: [] }), nr = _.useRef(null), Be = _.useRef(0), Pn = _.useRef(0), H = _.useRef(0), rr = _.useRef(""), Zl = _.useRef(0), Lr = _.useRef(/* @__PURE__ */ new Set()), Lt = _.useRef(0), rn = _.useRef(!1), Ye = _.useRef(C);
  Ye.current = C;
  const lr = C?.connection, ql = C?.user?.id, ce = !!(lr?.connected && ql), hl = Object.values(C?.states ?? {}).filter(to), ln = C?.states[Nt], Bt = ce && ln !== void 0 && to(ln);
  async function on() {
    const s = Ye.current;
    if (!s?.connection.connected || !s.user?.id) {
      Z(!1);
      return;
    }
    const y = ++Pn.current;
    Z(!0), _e("");
    try {
      const P = await s.callWS({ type: "bl_haos/playlist_library/list" });
      Pn.current === y && oe(P);
    } catch {
      Pn.current === y && _e("Couldn't load your library. Reconnect Home Assistant, then select Retry loading.");
    } finally {
      Pn.current === y && Z(!1);
    }
  }
  _.useLayoutEffect(() => {
    const s = Ye.current;
    if (H.current++, ++Be.current, Pn.current++, Lt.current++, rn.current = !1, _r(void 0), bt([]), ae(v.current), oe(void 0), _e(""), U(""), Ve(!1), ee(void 0), Ze(""), ye([]), Se([]), se(""), ft(!1), qe(!1), Te(!1), Oe(void 0), N(void 0), a(!1), L(""), $(""), V(""), q(""), rl(/* @__PURE__ */ new Set()), Lr.current.clear(), Ct({}), xn(""), gt(""), xr(!1), At(""), gn(""), wn(""), Jt.current = "", rr.current = "", ol(""), Ql(""), Xn(!1), En(""), Cn(void 0), qn(void 0), bn(void 0), Zn(""), Cr(!1), en(ce), Pt(""), Ut(""), !(!s || !ce))
      return en(!1), v.current === "browse" ? un({ path: [] }, !0) : on(), () => {
        H.current++, Be.current++, Pn.current++, Lt.current++;
      };
  }, [lr, ql, ce]), _.useLayoutEffect(() => {
    nn.current ? (sl.current.get(nn.current)?.focus(), nn.current = "") : er.current && (Yl.current?.focus(), er.current = !1);
  }, [je]), _.useLayoutEffect(() => {
    const s = Pr.current;
    if (!s) return;
    Pr.current = void 0;
    const y = Nr.current.get(s.key);
    s.action === "down" && y?.down && !y.down.disabled ? y.down.focus() : s.action === "up" && y?.up && !y.up.disabled ? y.up.focus() : y?.remove ? y.remove.focus() : nr.current?.focus();
  }, [Qe]), _.useLayoutEffect(() => {
    const s = Pe ? jr.current : te ? fl.current : M ? pl.current : void 0, y = [jr.current, fl.current, pl.current];
    s && !s.open && (typeof s.showModal == "function" ? s.showModal() : s.setAttribute("open", ""));
    for (const P of y)
      !P?.open || P === s || (typeof P.close == "function" ? P.close() : P.removeAttribute("open"));
  }, [Pe, te, M]), _.useLayoutEffect(() => {
    Pe ? ge.current?.focus() : te ? Gl.current?.focus() : M ? Rr.current?.focus() : pt.current?.isConnected && pt.current.focus(), !Pe && !te && !M && (pt.current = null);
  }, [Pe, te, M]), _.useLayoutEffect(() => {
    const s = tr.current;
    s && (tr.current = void 0, s === "create" ? dl.current?.focus() : al.current.get(s)?.focus());
  }, [G, le, K, Pe, M]), _.useLayoutEffect(() => {
    if (yn && Sr.current?.focus(), Sn) {
      kr.current?.focus();
      return;
    }
    const s = Jt.current;
    s && (Jt.current = "", zt.current.get(s)?.focus());
  }, [yn, Sn, G]);
  async function un(s, y = !1) {
    const P = Ye.current, { item: E, path: F, query: W } = s;
    if (!P?.connection.connected || !P.user?.id || Fe && !y || E && (!E.media_content_id.startsWith("media-source://") || (W === void 0 ? !E.can_expand : !E.can_search))) return;
    const de = ++Be.current;
    en(!0), Pt(""), Ut(""), En(""), Cn(void 0), qn(void 0);
    try {
      const Me = await P.callWS(W !== void 0 && E ? { type: "media_source/search_media", media_content_id: E.media_content_id, search_query: W } : { type: "media_source/browse_media", ...E ? { media_content_id: E.media_content_id } : {} });
      if (Be.current !== de) return;
      E && W === void 0 && (er.current = !0), bt(F), _r("result" in Me && E ? { ...E, children: Me.result } : Me), Cr(W !== void 0), W === void 0 && Zn("");
    } catch {
      Be.current === de && (Pt(nf), Cn(s));
    } finally {
      Be.current === de && en(!1);
    }
  }
  function Tr() {
    ae("browse"), (le || K) && Te(!0), !je && !De && un({ path: [] });
  }
  function re() {
    rr.current = crypto.randomUUID(), Ze(""), ye([]), Se([]), Nn.current = { name: "", entries: [] }, se(""), qe(!1), ee(void 0), Ve(!0), Te(!1), ae("library");
  }
  function Jl(s) {
    ee(s), Ve(!1), Ze(s.name), ye(s.entries.map((y) => ({ ...y }))), Se(s.entries.map(() => `entry-${Zl.current++}`)), Nn.current = { name: s.name, entries: s.entries.map((y) => ({ ...y })) }, se(""), qe(!1), Te(!1), ae("library");
  }
  function ir() {
    const s = K?.record_id ?? (le ? "create" : "");
    s && (tr.current = s), Ve(!1), ee(void 0), Ze(""), ye([]), Se([]), se(""), qe(!1), Te(!1), Nn.current = { name: "", entries: [] }, rr.current = "", ae("library");
  }
  function Dr() {
    return it !== Nn.current.name || JSON.stringify(Ee) !== JSON.stringify(Nn.current.entries);
  }
  function vl(s, y = !1) {
    if (pt.current = s, zr.current = y, Dr()) {
      a(!0);
      return;
    }
    ir();
  }
  function bl(s, y) {
    pt.current = y, L(""), Oe(s);
  }
  function ei(s, y) {
    pt.current = y, V(""), N(s);
  }
  function $t() {
    Oe(void 0), N(void 0), a(!1), L(""), V("");
  }
  function jn(s) {
    if (s.key === "Escape" && !B && !Y) {
      s.preventDefault(), $t();
      return;
    }
    if (s.key !== "Tab") return;
    const y = Array.from(s.currentTarget.querySelectorAll("button:not(:disabled)"));
    if (!y.length) return;
    const P = y[0], E = y[y.length - 1];
    s.shiftKey && document.activeElement === P ? (s.preventDefault(), E.focus()) : !s.shiftKey && document.activeElement === E && (s.preventDefault(), P.focus());
  }
  async function Ht() {
    const s = Ye.current, y = Pe;
    if (!y || !s?.connection.connected || !s.user?.id || B) return;
    const P = H.current;
    $(y.record_id), L(""), U("Deleting playlist...");
    try {
      const E = await s.callWS({
        type: "bl_haos/playlist_library/delete_custom",
        record_id: y.record_id,
        revision: G?.revision ?? 0
      });
      if (H.current !== P) return;
      const F = E, de = (G?.records ?? []).filter((sn) => sn.kind === "custom").findIndex((sn) => sn.record_id === y.record_id), Me = F.records.filter((sn) => sn.kind === "custom"), Mr = Me[Math.min(Math.max(de, 0), Me.length - 1)];
      tr.current = Mr?.record_id ?? "create", pt.current = null, oe(F), Oe(void 0), U("Playlist deleted.");
    } catch (E) {
      if (H.current !== P) return;
      const F = E instanceof Error ? E.message : "";
      if (/Playlist library changed/i.test(F)) {
        L(`Couldn't delete “${y.name}” right now. It remains in your library. Select Delete playlist to try again, or Keep playlist.`);
        try {
          const W = await s.callWS({ type: "bl_haos/playlist_library/list" });
          H.current === P && oe(W);
        } catch {
        }
      } else
        L(`Couldn't delete “${y.name}” right now. It remains in your library. Select Delete playlist to try again, or Keep playlist.`);
      H.current === P && U("");
    } finally {
      H.current === P && $("");
    }
  }
  function Wt(s) {
    gn(s.media_content_id), wn(s.title), Ct((y) => {
      const P = { ...y };
      return delete P[s.media_content_id], P;
    });
  }
  async function Vt(s, y) {
    const P = Ye.current, E = s.media_content_id, F = y.trim();
    if (!F) {
      Ct((de) => ({ ...de, [E]: "Enter a shortcut name before saving." }));
      return;
    }
    if (new TextEncoder().encode(F).length > 128) {
      Ct((de) => ({
        ...de,
        [E]: "Shortcut names must be at most 128 UTF-8 bytes. Enter a shorter name."
      }));
      return;
    }
    if (!P?.connection.connected || !P.user?.id || !sc(s) || Ce.has(E) || Lr.current.has(E) || !E.startsWith("media-source://")) return;
    const W = H.current;
    Lr.current.add(E), rl((de) => new Set(de).add(E)), Ct((de) => {
      const Me = { ...de };
      return delete Me[E], Me;
    }), U(`Saving “${F}” to your library...`);
    try {
      const de = await P.callWS({
        type: "bl_haos/playlist_library/save_provider",
        media_content_id: E,
        name: F,
        ...s.title ? { title: s.title } : {},
        ...s.media_class ? { media_class: s.media_class } : {},
        ...s.media_content_type ? { media_content_type: s.media_content_type } : {}
      });
      if (H.current !== W) return;
      oe(de), gn(""), wn(""), U("Playlist saved to your library.");
    } catch {
      H.current === W && (Ct((de) => ({
        ...de,
        [E]: `Couldn't save “${F}” to your library right now. Nothing was added. Select Save shortcut to try again, or cancel to return to Browse media.`
      })), U(""));
    } finally {
      H.current === W && (Lr.current.delete(E), rl((de) => {
        const Me = new Set(de);
        return Me.delete(E), Me;
      }));
    }
  }
  function or(s) {
    xn(s.record_id), gt(s.name), At("");
  }
  function ur(s) {
    Jt.current = s, xn(""), gt(""), At("");
  }
  async function Qt(s) {
    const y = Ye.current, P = kn.trim();
    if (!P) {
      At("Enter a shortcut name before saving.");
      return;
    }
    if (!y?.connection.connected || !y.user?.id || qt) return;
    const E = H.current;
    xr(!0), At(""), U("Saving shortcut name...");
    try {
      const F = await y.callWS({
        type: "bl_haos/playlist_library/rename_provider",
        record_id: s.record_id,
        name: P,
        revision: G?.revision ?? 0
      });
      if (H.current !== E) return;
      oe(F), Jt.current = s.record_id, xn(""), gt(""), U("Shortcut name saved.");
    } catch (F) {
      if (H.current !== E) return;
      if (At(F instanceof Error && /invalid_format|Invalid playlist record/i.test(F.message) ? "Shortcut names must be non-empty and at most 128 UTF-8 bytes. Enter a shorter name, then save again." : `Couldn't rename “${s.name}” right now. Your local name is still here. Select Save shortcut name to try again.`), kr.current?.focus(), F instanceof Error && /Playlist library changed/i.test(F.message))
        try {
          const W = await y.callWS({ type: "bl_haos/playlist_library/list" });
          H.current === E && oe(W);
        } catch {
        }
      H.current === E && U("");
    } finally {
      H.current === E && xr(!1);
    }
  }
  async function no() {
    const s = Ye.current, y = te;
    if (!y || !s?.connection.connected || !s.user?.id || Y) return;
    const P = H.current;
    q(y.record_id), V(""), U("Removing shortcut...");
    try {
      const E = await s.callWS({
        type: "bl_haos/playlist_library/delete_provider",
        record_id: y.record_id,
        revision: G?.revision ?? 0
      });
      if (H.current !== P) return;
      oe(E), pt.current = ml.current, N(void 0), U("Shortcut removed. The Home Assistant playlist is unchanged.");
    } catch (E) {
      if (H.current !== P) return;
      if (V(`Couldn't remove “${y.name}” right now. The shortcut remains in your library, and the Home Assistant playlist is unchanged. Select Remove shortcut to try again, or Keep shortcut.`), E instanceof Error && /Playlist library changed/i.test(E.message))
        try {
          const F = await s.callWS({ type: "bl_haos/playlist_library/list" });
          H.current === P && oe(F);
        } catch {
        }
      H.current === P && U("");
    } finally {
      H.current === P && q("");
    }
  }
  function ti(s) {
    if (!s.can_play || !s.media_content_id.startsWith("media-source://")) return;
    const y = s.media_class?.toLowerCase();
    if (!(s.media_content_type.toLowerCase().startsWith("audio/") || ["music", "track", "episode"].includes(y ?? ""))) return;
    const E = {
      media_content_id: s.media_content_id,
      title: s.title,
      ...s.media_class ? { media_class: s.media_class } : {},
      media_content_type: s.media_content_type
    };
    ye((F) => [...F, E]), Se((F) => [...F, `entry-${Zl.current++}`]), se(""), Te(!1), ae("library");
  }
  function Rn(s, y) {
    const P = s + y;
    if (P < 0 || P >= Ee.length) return;
    const E = [...Ee], F = [...Qe];
    [E[s], E[P]] = [E[P], E[s]], [F[s], F[P]] = [F[P], F[s]], Pr.current = { key: Qe[s], action: y === 1 ? "down" : "up" }, ye(E), Se(F), se("");
    const W = Ee[s].title || "Media item";
    U(`Moved ${W} to position ${P + 1} of ${Ee.length}.`);
  }
  function ro(s) {
    const y = Ee.filter((F, W) => W !== s), P = Qe.filter((F, W) => W !== s), E = Math.min(s, P.length - 1);
    Pr.current = E >= 0 ? { key: P[E], action: "remove" } : { key: "", action: "remove" }, ye(y), Se(P), se("");
  }
  async function ni(s) {
    s.preventDefault();
    const y = Ye.current, P = it.trim();
    if (!P) {
      se("Enter a playlist name before saving.");
      return;
    }
    if (!y?.connection.connected || !y.user?.id || ze) return;
    const E = H.current;
    le && (rr.current ||= crypto.randomUUID()), ft(!0), se(""), U(le ? "Saving playlist..." : "Saving changes...");
    try {
      const F = await y.callWS({
        type: le ? "bl_haos/playlist_library/save_custom" : "bl_haos/playlist_library/update_custom",
        record_id: le ? rr.current : K.record_id,
        name: P,
        entries: Ee,
        revision: G?.revision ?? 0
      });
      if (H.current !== E) return;
      oe(F), ir(), U(le ? "Playlist saved." : "Changes saved.");
    } catch (F) {
      if (H.current !== E) return;
      const W = F instanceof Error ? F.message : "";
      if (/Playlist library changed/i.test(W)) {
        qe(!0), se("This playlist changed in Home Assistant. Your edits are still here. The newer saved version was kept; stop editing and reopen the playlist to review it.");
        try {
          const de = await y.callWS({ type: "bl_haos/playlist_library/list" });
          H.current === E && oe(de);
        } catch {
        }
      } else /not found/i.test(W) ? se("The selected playlist or a media item couldn't be matched. Return to Your playlists and select Edit playlist on the intended row; for an affected media item, remove it or add it again from Browse media. Your valid draft data is still here.") : /invalid_format|Invalid playlist record/i.test(W) ? se("This playlist has details that can't be saved yet. Review the playlist name and entries, correct any marked fields, then select Save playlist or Save changes. Your valid draft data is still here.") : se(le ? "Couldn't save this playlist right now. Your draft is still here. Select Save playlist to try again, or Discard draft to leave without saving." : `Couldn't save changes to “${K?.name ?? P}” right now. Your edits are still here. Select Save changes to try again, or Stop editing to leave without saving.`);
      H.current === E && U("");
    } finally {
      H.current === E && ft(!1);
    }
  }
  function zn(s = nt.length - 1) {
    const y = nt[s];
    !y || Fe || (Be.current++, nn.current = je?.media_content_id ?? "", _r(y), bt(nt.slice(0, s)), en(!1), Cr(!1), Zn(""), Cn(void 0), Pt(""), Ut(""));
  }
  async function yl(s, y = Nt) {
    const P = Ye.current, E = P?.states[y];
    if (!P?.connection.connected || !P.user?.id || !E || !to(E) || !s.can_play || y !== Nt || De || !s.media_content_id.startsWith("media-source://") || rn.current) return;
    const F = ++Lt.current;
    rn.current = !0, Xn(!0), Ut(""), En(""), bn(s), qn(void 0);
    try {
      if (await P.callService("media_player", "play_media", {
        media_content_id: s.media_content_id,
        media_content_type: s.media_content_type
      }, { entity_id: E.entity_id }), Lt.current !== F) return;
      const W = Ye.current?.states[E.entity_id];
      W && to(W) ? En(`Starting playback on ${nl(W)}`) : Ut("The selected speaker is unavailable. Select a connected speaker to play media.");
    } catch {
      Lt.current === F && (Ut(`Home Assistant could not play this item on ${nl(E)}. Check the provider access and speaker connection, then try again.`), qn({ item: s, target: E.entity_id }));
    } finally {
      Lt.current === F && (rn.current = !1, Xn(!1));
    }
  }
  return /* @__PURE__ */ p.jsxs("main", { className: "neu-page", onKeyDown: (s) => {
    he === "browse" && s.key === "Escape" && nt.length && !Fe && (s.preventDefault(), zn());
  }, children: [
    /* @__PURE__ */ p.jsxs("header", { className: "catalog-header", children: [
      /* @__PURE__ */ p.jsxs("div", { className: "catalog-heading", children: [
        he === "browse" && /* @__PURE__ */ p.jsx(
          "button",
          {
            className: "neu-button icon-button",
            "aria-label": "Back",
            title: "Back",
            ref: Yl,
            disabled: nt.length === 0 || Fe,
            onClick: () => zn(),
            children: /* @__PURE__ */ p.jsx(Gd, { size: 20, "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ p.jsxs("div", { children: [
          /* @__PURE__ */ p.jsx("p", { className: "eyebrow", children: "BL-HAOS" }),
          /* @__PURE__ */ p.jsx("h1", { children: he === "library" ? "Media Library" : "Media Catalog" })
        ] })
      ] }),
      he === "browse" && /* @__PURE__ */ p.jsxs("div", { className: "target-control", children: [
        /* @__PURE__ */ p.jsx("label", { htmlFor: "catalog-target", children: "Play on" }),
        /* @__PURE__ */ p.jsxs(
          "select",
          {
            id: "catalog-target",
            className: "neu-inset",
            value: Nt,
            disabled: !ce || Fe,
            onChange: (s) => {
              ol(s.target.value);
              const y = C?.states[s.target.value];
              Ql(y ? nl(y) : ""), En(""), qn(void 0), Ut("");
            },
            children: [
              /* @__PURE__ */ p.jsx("option", { value: "", children: "Select a connected speaker" }),
              Nt && !Bt && /* @__PURE__ */ p.jsxs("option", { value: Nt, disabled: !0, children: [
                _n,
                " (unavailable)"
              ] }),
              hl.map((s) => /* @__PURE__ */ p.jsx("option", { value: s.entity_id, children: nl(s) }, s.entity_id))
            ]
          }
        ),
        Nt && /* @__PURE__ */ p.jsx("span", { className: "selected-target", title: Bt && ln ? nl(ln) : _n, children: Bt && ln ? nl(ln) : _n })
      ] }),
      /* @__PURE__ */ p.jsx(
        "a",
        {
          className: "neu-button icon-button close-catalog",
          href: "/",
          "aria-label": "Close catalog",
          title: "Close catalog",
          onClick: (s) => {
            (le || K) && (Dr() ? (s.preventDefault(), vl(s.currentTarget, !0)) : ir());
          },
          children: /* @__PURE__ */ p.jsx(ef, { size: 20, "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ p.jsxs("nav", { className: "view-toggle", "aria-label": "Media views", children: [
      /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "button", ref: Xl, "aria-pressed": he === "library", onClick: () => {
        Te(!1), ae("library"), !G && !J && !ve && on();
      }, children: "Library" }),
      /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "button", ref: ml, "aria-pressed": he === "browse", onClick: Tr, children: "Browse media" })
    ] }),
    he === "library" ? /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
      !ce && /* @__PURE__ */ p.jsx("p", { role: "alert", children: "Your Home Assistant session is unavailable." }),
      ve && /* @__PURE__ */ p.jsxs("div", { className: "error", role: "alert", children: [
        /* @__PURE__ */ p.jsx("p", { children: ve }),
        /* @__PURE__ */ p.jsx("button", { className: "neu-button", disabled: !ce || J, onClick: () => {
          on();
        }, children: "Retry loading" })
      ] }),
      /* @__PURE__ */ p.jsx("p", { className: "status", role: "status", "aria-live": "polite", "aria-atomic": "true", children: J ? "Loading playlists..." : ue }),
      /* @__PURE__ */ p.jsxs("section", { className: "neu-surface", "aria-label": "Your playlists", "aria-busy": J, children: [
        /* @__PURE__ */ p.jsx("h2", { children: "Your playlists" }),
        /* @__PURE__ */ p.jsxs("div", { className: "library-body", children: [
          J && /* @__PURE__ */ p.jsx("p", { className: "library-message", children: "Loading playlists..." }),
          !J && !ve && G && !G.records.some((s) => s.kind === "custom") && !G.records.some(Ou) && /* @__PURE__ */ p.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ p.jsx("h3", { children: "Your library is empty" }),
            /* @__PURE__ */ p.jsx("p", { children: "Create a playlist or browse Home Assistant media to save a playlist reference." })
          ] }),
          !J && /* @__PURE__ */ p.jsx("ul", { "aria-label": "Your playlists", children: (G?.records ?? []).filter(tf).map((s) => /* @__PURE__ */ p.jsxs("li", { children: [
            /* @__PURE__ */ p.jsx(eo, { className: "media-icon", size: 24, "aria-hidden": "true" }),
            /* @__PURE__ */ p.jsxs("div", { className: "media-detail", children: [
              /* @__PURE__ */ p.jsx("span", { className: "media-title", children: s.name }),
              /* @__PURE__ */ p.jsxs("span", { className: "metadata", children: [
                s.entries.length,
                " items"
              ] })
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "row-actions", children: [
              /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "button", ref: (y) => {
                y ? al.current.set(s.record_id, y) : al.current.delete(s.record_id);
              }, disabled: !ce || !!B || le || !!K, onClick: () => Jl(s), children: "Edit playlist" }),
              /* @__PURE__ */ p.jsx(
                "button",
                {
                  className: "neu-button destructive-button",
                  type: "button",
                  disabled: !ce || !!B || le || !!K,
                  onClick: (y) => bl(s, y.currentTarget),
                  children: "Delete playlist"
                }
              )
            ] })
          ] }, s.record_id)) }),
          !le && !K && /* @__PURE__ */ p.jsx(
            "button",
            {
              className: "neu-button primary-button",
              type: "button",
              disabled: !ce || !G || !!ve || J || ze,
              ref: dl,
              onClick: re,
              children: "Create playlist"
            }
          ),
          (le || K) && !Le && /* @__PURE__ */ p.jsxs("form", { className: "playlist-form", onSubmit: (s) => {
            ni(s);
          }, children: [
            /* @__PURE__ */ p.jsx("label", { htmlFor: "playlist-name", children: "Playlist name" }),
            /* @__PURE__ */ p.jsx(
              "input",
              {
                id: "playlist-name",
                className: "neu-inset",
                type: "text",
                value: it,
                onChange: (s) => {
                  Ze(s.target.value), se("");
                },
                disabled: ze
              }
            ),
            /* @__PURE__ */ p.jsx("h3", { children: "Playlist entries" }),
            /* @__PURE__ */ p.jsxs("ol", { className: "playlist-entries", "aria-label": "Playlist entries", "aria-busy": ze, children: [
              Ee.length === 0 && /* @__PURE__ */ p.jsx("li", { className: "empty-entry", children: "No media added yet. Add media to build this playlist, or save it as an empty draft." }),
              Ee.map((s, y) => {
                const P = Qe[y], E = s.title || "Media item", F = (W, de) => {
                  const Me = Nr.current.get(P) ?? {};
                  de ? Me[W] = de : delete Me[W], Nr.current.set(P, Me);
                };
                return /* @__PURE__ */ p.jsxs("li", { children: [
                  /* @__PURE__ */ p.jsx(eo, { className: "media-icon", size: 24, "aria-hidden": "true" }),
                  /* @__PURE__ */ p.jsxs("div", { className: "media-detail", children: [
                    /* @__PURE__ */ p.jsx("span", { className: "media-title", title: E, children: E }),
                    /* @__PURE__ */ p.jsx("span", { className: "metadata", children: s.media_class ?? s.media_content_type ?? "Home Assistant media" }),
                    /* @__PURE__ */ p.jsx("span", { className: "metadata", children: "Not checked" })
                  ] }),
                  /* @__PURE__ */ p.jsxs("div", { className: "row-actions entry-actions", children: [
                    /* @__PURE__ */ p.jsx(
                      "button",
                      {
                        className: "neu-button icon-button",
                        type: "button",
                        "aria-label": "Move entry up",
                        title: "Move entry up",
                        ref: (W) => F("up", W),
                        disabled: ze || y === 0,
                        onClick: () => Rn(y, -1),
                        children: /* @__PURE__ */ p.jsx(Zd, { size: 18, "aria-hidden": "true" })
                      }
                    ),
                    /* @__PURE__ */ p.jsx(
                      "button",
                      {
                        className: "neu-button icon-button",
                        type: "button",
                        "aria-label": "Move entry down",
                        title: "Move entry down",
                        ref: (W) => F("down", W),
                        disabled: ze || y === Ee.length - 1,
                        onClick: () => Rn(y, 1),
                        children: /* @__PURE__ */ p.jsx(Xd, { size: 18, "aria-hidden": "true" })
                      }
                    ),
                    /* @__PURE__ */ p.jsx(
                      "button",
                      {
                        className: "neu-button",
                        type: "button",
                        "aria-label": `Remove ${E}`,
                        disabled: ze,
                        ref: (W) => F("remove", W),
                        onClick: () => ro(y),
                        children: "Remove media item"
                      }
                    )
                  ] })
                ] }, P);
              })
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "row-actions editor-actions", children: [
              /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "button", ref: nr, disabled: !ce || ze, onClick: () => {
                Te(!0), ae("browse"), !je && !De && un({ path: [] });
              }, children: "Add media" }),
              /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "submit", disabled: !ce || ze || Zt, children: ze ? "Saving..." : le ? "Save playlist" : "Save changes" }),
              /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "button", disabled: ze, onClick: (s) => vl(s.currentTarget), children: le ? "Discard draft" : "Stop editing" })
            ] }),
            Ke && /* @__PURE__ */ p.jsx("p", { className: "error", role: "alert", children: Ke })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ p.jsxs("section", { className: "neu-surface provider-library", "aria-label": "Saved Home Assistant playlists", "aria-busy": J, children: [
        /* @__PURE__ */ p.jsx("h2", { children: "Saved Home Assistant playlists" }),
        /* @__PURE__ */ p.jsxs("div", { className: "provider-library-body", children: [
          J && /* @__PURE__ */ p.jsx("p", { className: "library-message", children: "Loading saved playlists..." }),
          !J && !ve && G && !G.records.some(Ou) && /* @__PURE__ */ p.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ p.jsx("p", { children: "No Home Assistant playlists saved. Browse media to save a playlist reference." }),
            /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "button", disabled: !ce, onClick: Tr, children: "Browse media" })
          ] }),
          !J && /* @__PURE__ */ p.jsx("ul", { "aria-label": "Saved Home Assistant playlists", children: (G?.records ?? []).filter(Ou).map((s) => /* @__PURE__ */ p.jsxs("li", { children: [
            /* @__PURE__ */ p.jsx(eo, { className: "media-icon", size: 24, "aria-hidden": "true" }),
            /* @__PURE__ */ p.jsxs("div", { className: "media-detail", children: [
              /* @__PURE__ */ p.jsx("span", { className: "media-title provider-title", title: s.name, children: s.name }),
              /* @__PURE__ */ p.jsx("span", { className: "metadata", children: "Home Assistant playlist" }),
              /* @__PURE__ */ p.jsx("span", { className: "metadata", children: "Provider contents are managed by Home Assistant." }),
              Sn === s.record_id ? /* @__PURE__ */ p.jsxs("form", { className: "provider-rename-form", onSubmit: (y) => {
                y.preventDefault(), Qt(s);
              }, children: [
                /* @__PURE__ */ p.jsx("label", { htmlFor: `shortcut-name-${s.record_id}`, children: "Shortcut name" }),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    id: `shortcut-name-${s.record_id}`,
                    ref: kr,
                    className: "neu-inset",
                    value: kn,
                    onChange: (y) => {
                      gt(y.target.value), At("");
                    },
                    disabled: qt
                  }
                ),
                /* @__PURE__ */ p.jsxs("div", { className: "row-actions", children: [
                  /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "submit", disabled: !ce || qt, children: qt ? "Saving..." : "Save shortcut name" }),
                  /* @__PURE__ */ p.jsx(
                    "button",
                    {
                      className: "neu-button",
                      type: "button",
                      disabled: qt,
                      onClick: () => ur(s.record_id),
                      children: "Cancel rename"
                    }
                  )
                ] }),
                il && /* @__PURE__ */ p.jsx("p", { className: "error", role: "alert", children: il })
              ] }) : /* @__PURE__ */ p.jsxs("div", { className: "row-actions provider-actions", children: [
                /* @__PURE__ */ p.jsx(
                  "button",
                  {
                    className: "neu-button",
                    type: "button",
                    ref: (y) => {
                      y ? zt.current.set(s.record_id, y) : zt.current.delete(s.record_id);
                    },
                    disabled: !ce || !!Y || !!Sn,
                    onClick: () => or(s),
                    children: "Rename shortcut"
                  }
                ),
                /* @__PURE__ */ p.jsx(
                  "button",
                  {
                    className: "neu-button destructive-button",
                    type: "button",
                    ref: (y) => {
                      y ? cl.current.set(s.record_id, y) : cl.current.delete(s.record_id);
                    },
                    disabled: !ce || !!Y || !!Sn,
                    onClick: (y) => ei(s, y.currentTarget),
                    children: "Remove shortcut"
                  }
                )
              ] })
            ] })
          ] }, s.record_id)) })
        ] })
      ] })
    ] }) : /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
      !Le && Nt && !Bt && /* @__PURE__ */ p.jsxs("p", { className: "warning", children: [
        _n,
        " is unavailable. Select a connected speaker to play media."
      ] }),
      !ce && /* @__PURE__ */ p.jsx("p", { role: "alert", children: "Your Home Assistant session is unavailable." }),
      Er && /* @__PURE__ */ p.jsxs("div", { className: "error", role: "alert", children: [
        /* @__PURE__ */ p.jsx("p", { children: Er }),
        jt && /* @__PURE__ */ p.jsx(
          "button",
          {
            className: "neu-button",
            disabled: !ce || De || Fe,
            onClick: () => {
              un(jt);
            },
            children: jt.query !== void 0 ? "Retry search" : jt.item ? `Retry opening ${jt.item.title}` : "Retry media sources"
          }
        )
      ] }),
      tn && /* @__PURE__ */ p.jsxs("div", { className: "error", role: "alert", children: [
        /* @__PURE__ */ p.jsx("p", { children: tn }),
        Rt && Rt.target === Nt && /* @__PURE__ */ p.jsxs(
          "button",
          {
            className: "neu-button",
            disabled: !Bt || De || Fe,
            onClick: () => {
              yl(Rt.item, Rt.target);
            },
            children: [
              "Retry ",
              Rt.item.title,
              " on ",
              _n
            ]
          }
        )
      ] }),
      /* @__PURE__ */ p.jsx("p", { className: "status", role: "status", "aria-live": "polite", "aria-atomic": "true", children: De ? "Loading media sources..." : ue || Kl }),
      /* @__PURE__ */ p.jsxs("nav", { className: "catalog-path", "aria-label": "Catalog path", children: [
        nt.map((s, y) => /* @__PURE__ */ p.jsx(
          "button",
          {
            className: "neu-button",
            disabled: Fe,
            onClick: () => zn(y),
            title: s.title,
            children: s.title
          },
          `${s.media_content_id}-${y}`
        )),
        /* @__PURE__ */ p.jsx("span", { "aria-current": "page", title: je?.title, children: je?.title ?? "Media sources" })
      ] }),
      /* @__PURE__ */ p.jsxs("section", { className: "neu-surface", "aria-label": je?.title ?? "Media sources", "aria-busy": De, children: [
        /* @__PURE__ */ p.jsx("h2", { children: je?.title ?? "Media sources" }),
        je?.can_search && /* @__PURE__ */ p.jsxs("form", { className: "catalog-search", role: "search", onSubmit: (s) => {
          s.preventDefault(), Gn.trim() && !De && un({ item: je, path: nt, query: Gn.trim() });
        }, children: [
          /* @__PURE__ */ p.jsxs("label", { className: "search-control", children: [
            "Search media",
            /* @__PURE__ */ p.jsx(
              "input",
              {
                className: "neu-inset",
                type: "search",
                value: Gn,
                onChange: (s) => Zn(s.target.value),
                disabled: !ce || De || Fe
              }
            )
          ] }),
          /* @__PURE__ */ p.jsx("button", { className: "neu-button icon-button", type: "submit", "aria-label": "Search", title: "Search", disabled: !Gn.trim() || !ce || De || Fe, children: /* @__PURE__ */ p.jsx(bd, { size: 20, "aria-hidden": "true" }) }),
          ul && /* @__PURE__ */ p.jsx(
            "button",
            {
              className: "neu-button",
              type: "button",
              disabled: De || Fe,
              onClick: () => {
                un({ item: je, path: nt });
              },
              children: "Clear search"
            }
          )
        ] }),
        /* @__PURE__ */ p.jsxs("div", { className: "catalog-body", children: [
          je && !De && !je.children?.length && (Le ? /* @__PURE__ */ p.jsx("div", { className: "empty-state", children: /* @__PURE__ */ p.jsx("p", { children: "No playable audio media are available in this Home Assistant source." }) }) : /* @__PURE__ */ p.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ p.jsx("h3", { children: "No audio sources are available" }),
            /* @__PURE__ */ p.jsx("p", { children: "Home Assistant did not return a playable audio source. Check the media provider and try again." })
          ] })),
          /* @__PURE__ */ p.jsx("ul", { "aria-label": "Catalog items", children: (je?.children ?? []).map((s) => /* @__PURE__ */ p.jsxs("li", { "aria-current": Jn?.media_content_id === s.media_content_id ? "true" : void 0, children: [
            ac(s.thumbnail) ? /* @__PURE__ */ p.jsx("img", { className: "thumbnail", src: ac(s.thumbnail), alt: "", loading: "lazy", referrerPolicy: "no-referrer" }) : /* @__PURE__ */ p.jsx(eo, { className: "media-icon", size: 24, "aria-hidden": "true" }),
            /* @__PURE__ */ p.jsxs("div", { className: "media-detail", children: [
              /* @__PURE__ */ p.jsx("span", { className: "media-title", title: s.title, children: s.title }),
              /* @__PURE__ */ p.jsx("span", { className: "metadata", title: s.media_content_type, children: s.media_class ?? s.media_content_type }),
              !s.can_play && !s.can_expand && /* @__PURE__ */ p.jsx("span", { className: "metadata", children: rf })
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "row-actions", children: [
              s.can_expand && /* @__PURE__ */ p.jsx(
                "button",
                {
                  className: "neu-button icon-button",
                  "aria-label": `Open ${s.title}`,
                  title: `Open ${s.title}`,
                  ref: (y) => {
                    y ? sl.current.set(s.media_content_id, y) : sl.current.delete(s.media_content_id);
                  },
                  disabled: De || Fe || !ce || !s.media_content_id.startsWith("media-source://"),
                  onClick: () => {
                    un({ item: s, path: je ? [...nt, je] : [] });
                  },
                  children: /* @__PURE__ */ p.jsx(qd, { size: 20, "aria-hidden": "true" })
                }
              ),
              Le && s.can_play && (s.media_content_type.toLowerCase().startsWith("audio/") || ["music", "track", "episode"].includes(s.media_class?.toLowerCase() ?? "")) && /* @__PURE__ */ p.jsx(
                "button",
                {
                  className: "neu-button",
                  "aria-label": `Add media ${s.title}`,
                  disabled: De || Fe || !ce,
                  onClick: () => ti(s),
                  children: "Add media"
                }
              ),
              !Le && sc(s) && (yn === s.media_content_id ? /* @__PURE__ */ p.jsxs("form", { className: "provider-rename-form", onSubmit: (y) => {
                y.preventDefault(), Vt(s, ll);
              }, children: [
                /* @__PURE__ */ p.jsx("label", { htmlFor: `provider-save-name-${s.media_content_id}`, children: "Shortcut name" }),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    id: `provider-save-name-${s.media_content_id}`,
                    ref: Sr,
                    className: "neu-inset",
                    value: ll,
                    onChange: (y) => {
                      wn(y.target.value), Ct((P) => {
                        const E = { ...P };
                        return delete E[s.media_content_id], E;
                      });
                    },
                    disabled: Ce.has(s.media_content_id)
                  }
                ),
                /* @__PURE__ */ p.jsxs("div", { className: "row-actions", children: [
                  /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "submit", disabled: !ce || Ce.has(s.media_content_id), children: Ce.has(s.media_content_id) ? "Saving..." : "Save shortcut" }),
                  /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "button", disabled: Ce.has(s.media_content_id), onClick: () => {
                    gn(""), wn(""), Ct((y) => {
                      const P = { ...y };
                      return delete P[s.media_content_id], P;
                    });
                  }, children: "Cancel" })
                ] })
              ] }) : /* @__PURE__ */ p.jsx(
                "button",
                {
                  className: "neu-button",
                  type: "button",
                  "aria-label": `Save to library ${s.title}`,
                  disabled: !ce || De || Fe || Ce.has(s.media_content_id) || !!G?.records.some((y) => y.kind === "provider" && y.media_content_id === s.media_content_id),
                  onClick: () => Wt(s),
                  children: Ce.has(s.media_content_id) ? "Saving..." : G?.records.some((y) => y.kind === "provider" && y.media_content_id === s.media_content_id) ? "Saved to library" : "Save to library"
                }
              )),
              Yn[s.media_content_id] && /* @__PURE__ */ p.jsx("p", { className: "error", role: "alert", children: Yn[s.media_content_id] }),
              !Le && s.can_play && /* @__PURE__ */ p.jsxs(
                "button",
                {
                  className: "neu-button",
                  "aria-label": `Play ${s.title}`,
                  disabled: !Bt || De || Fe || !s.media_content_id.startsWith("media-source://"),
                  onClick: () => {
                    yl(s);
                  },
                  children: [
                    /* @__PURE__ */ p.jsx(Jd, { size: 18, "aria-hidden": "true" }),
                    "Play"
                  ]
                }
              )
            ] })
          ] }, s.media_content_id)) })
        ] })
      ] })
    ] }),
    Pe && /* @__PURE__ */ p.jsxs(
      "dialog",
      {
        ref: jr,
        "aria-modal": "true",
        "aria-labelledby": "delete-playlist-heading",
        className: "confirmation-dialog",
        onKeyDown: jn,
        onCancel: (s) => {
          s.preventDefault(), B || $t();
        },
        children: [
          /* @__PURE__ */ p.jsxs("h2", { id: "delete-playlist-heading", children: [
            "Delete playlist: ",
            Pe.name
          ] }),
          /* @__PURE__ */ p.jsxs("p", { children: [
            "Delete “",
            Pe.name,
            "” from your BL-HAOS library? Its saved entries will be removed. This cannot be undone."
          ] }),
          g && /* @__PURE__ */ p.jsx("p", { className: "error", role: "alert", children: g }),
          /* @__PURE__ */ p.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "button", ref: ge, disabled: !!B, onClick: $t, children: "Keep playlist" }),
            /* @__PURE__ */ p.jsx("button", { className: "neu-button destructive-button", type: "button", disabled: !!B, onClick: () => {
              Ht();
            }, children: B ? "Deleting playlist..." : "Delete playlist" })
          ] })
        ]
      }
    ),
    te && /* @__PURE__ */ p.jsxs(
      "dialog",
      {
        ref: fl,
        "aria-modal": "true",
        "aria-labelledby": "remove-shortcut-heading",
        className: "confirmation-dialog",
        onKeyDown: jn,
        onCancel: (s) => {
          s.preventDefault(), Y || $t();
        },
        children: [
          /* @__PURE__ */ p.jsxs("h2", { id: "remove-shortcut-heading", children: [
            "Remove shortcut: ",
            te.name
          ] }),
          /* @__PURE__ */ p.jsxs("p", { children: [
            "Remove “",
            te.name,
            "” from your BL-HAOS library? The Home Assistant playlist itself will not be changed."
          ] }),
          ie && /* @__PURE__ */ p.jsx("p", { className: "error", role: "alert", children: ie }),
          /* @__PURE__ */ p.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "button", ref: Gl, disabled: !!Y, onClick: $t, children: "Keep shortcut" }),
            /* @__PURE__ */ p.jsx("button", { className: "neu-button destructive-button", type: "button", disabled: !!Y, onClick: () => {
              no();
            }, children: Y ? "Removing shortcut..." : "Remove shortcut" })
          ] })
        ]
      }
    ),
    M && /* @__PURE__ */ p.jsxs(
      "dialog",
      {
        ref: pl,
        "aria-modal": "true",
        "aria-labelledby": "discard-changes-heading",
        className: "confirmation-dialog",
        onKeyDown: jn,
        onCancel: (s) => {
          s.preventDefault(), $t();
        },
        children: [
          /* @__PURE__ */ p.jsx("h2", { id: "discard-changes-heading", children: "Discard changes" }),
          /* @__PURE__ */ p.jsxs("p", { children: [
            "Discard unsaved changes to “",
            K?.name || it || "this playlist",
            "”? The saved playlist will remain unchanged."
          ] }),
          /* @__PURE__ */ p.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ p.jsx("button", { className: "neu-button", type: "button", ref: Rr, onClick: () => {
              zr.current = !1, a(!1);
            }, children: "Keep editing" }),
            /* @__PURE__ */ p.jsx("button", { className: "neu-button destructive-button", type: "button", onClick: () => {
              const s = zr.current;
              zr.current = !1, a(!1), ir(), s && window.location.assign("/");
            }, children: "Discard changes" })
          ] })
        ]
      }
    )
  ] });
}
const of = `
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
.provider-library-body { min-height:0; overflow-y:auto; overscroll-behavior:contain; }
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
.provider-title { display:block; overflow:visible; overflow-wrap:anywhere; -webkit-line-clamp:unset; }
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
class uf extends HTMLElement {
  constructor() {
    super();
    const X = this.attachShadow({ mode: "open" }), v = document.createElement("style");
    v.textContent = of, this.mount = document.createElement("div"), X.append(v, this.mount);
  }
  set hass(X) {
    this.suppliedHass = X, this.render();
  }
  get hass() {
    return this.suppliedHass;
  }
  connectedCallback() {
    this.root = Qd.createRoot(this.mount), this.render();
  }
  disconnectedCallback() {
    this.root?.unmount(), this.root = void 0;
  }
  render() {
    this.root?.render(/* @__PURE__ */ p.jsx(lf, { hass: this.suppliedHass }));
  }
}
customElements.get("bl-haos-media-panel") || customElements.define("bl-haos-media-panel", uf);
export {
  lf as MediaPanel,
  uf as MediaPanelElement
};
