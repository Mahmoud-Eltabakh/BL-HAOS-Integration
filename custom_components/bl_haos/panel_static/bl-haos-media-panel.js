var Au = { exports: {} }, ii = {}, Bu = { exports: {} }, q = {};
var nc;
function Ad() {
  if (nc) return q;
  nc = 1;
  var E = /* @__PURE__ */ Symbol.for("react.element"), W = /* @__PURE__ */ Symbol.for("react.portal"), y = /* @__PURE__ */ Symbol.for("react.fragment"), xe = /* @__PURE__ */ Symbol.for("react.strict_mode"), de = /* @__PURE__ */ Symbol.for("react.profiler"), X = /* @__PURE__ */ Symbol.for("react.provider"), ae = /* @__PURE__ */ Symbol.for("react.context"), G = /* @__PURE__ */ Symbol.for("react.forward_ref"), Z = /* @__PURE__ */ Symbol.for("react.suspense"), ye = /* @__PURE__ */ Symbol.for("react.memo"), Ce = /* @__PURE__ */ Symbol.for("react.lazy"), se = Symbol.iterator;
  function F(s) {
    return s === null || typeof s != "object" ? null : (s = se && s[se] || s["@@iterator"], typeof s == "function" ? s : null);
  }
  var ie = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, Ke = Object.assign, Q = {};
  function ne(s, g, D) {
    this.props = s, this.context = g, this.refs = Q, this.updater = D || ie;
  }
  ne.prototype.isReactComponent = {}, ne.prototype.setState = function(s, g) {
    if (typeof s != "object" && typeof s != "function" && s != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, s, g, "setState");
  }, ne.prototype.forceUpdate = function(s) {
    this.updater.enqueueForceUpdate(this, s, "forceUpdate");
  };
  function dt() {
  }
  dt.prototype = ne.prototype;
  function Je(s, g, D) {
    this.props = s, this.context = g, this.refs = Q, this.updater = D || ie;
  }
  var Ne = Je.prototype = new dt();
  Ne.constructor = Je, Ke(Ne, ne.prototype), Ne.isPureReactComponent = !0;
  var ge = Array.isArray, Ye = Object.prototype.hasOwnProperty, Se = { current: null }, qe = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ce(s, g, D) {
    var U, V = {}, b = null, K = null;
    if (g != null) for (U in g.ref !== void 0 && (K = g.ref), g.key !== void 0 && (b = "" + g.key), g) Ye.call(g, U) && !qe.hasOwnProperty(U) && (V[U] = g[U]);
    var ue = arguments.length - 2;
    if (ue === 1) V.children = D;
    else if (1 < ue) {
      for (var Y = Array(ue), ke = 0; ke < ue; ke++) Y[ke] = arguments[ke + 2];
      V.children = Y;
    }
    if (s && s.defaultProps) for (U in ue = s.defaultProps, ue) V[U] === void 0 && (V[U] = ue[U]);
    return { $$typeof: E, type: s, key: b, ref: K, props: V, _owner: Se.current };
  }
  function Le(s, g) {
    return { $$typeof: E, type: s.type, key: g, ref: s.ref, props: s.props, _owner: s._owner };
  }
  function wt(s) {
    return typeof s == "object" && s !== null && s.$$typeof === E;
  }
  function ln(s) {
    var g = { "=": "=0", ":": "=2" };
    return "$" + s.replace(/[=:]/g, function(D) {
      return g[D];
    });
  }
  var be = /\/+/g;
  function Te(s, g) {
    return typeof s == "object" && s !== null && s.key != null ? ln("" + s.key) : g.toString(36);
  }
  function De(s, g, D, U, V) {
    var b = typeof s;
    (b === "undefined" || b === "boolean") && (s = null);
    var K = !1;
    if (s === null) K = !0;
    else switch (b) {
      case "string":
      case "number":
        K = !0;
        break;
      case "object":
        switch (s.$$typeof) {
          case E:
          case W:
            K = !0;
        }
    }
    if (K) return K = s, V = V(K), s = U === "" ? "." + Te(K, 0) : U, ge(V) ? (D = "", s != null && (D = s.replace(be, "$&/") + "/"), De(V, g, D, "", function(ke) {
      return ke;
    })) : V != null && (wt(V) && (V = Le(V, D + (!V.key || K && K.key === V.key ? "" : ("" + V.key).replace(be, "$&/") + "/") + s)), g.push(V)), 1;
    if (K = 0, U = U === "" ? "." : U + ":", ge(s)) for (var ue = 0; ue < s.length; ue++) {
      b = s[ue];
      var Y = U + Te(b, ue);
      K += De(b, g, D, Y, V);
    }
    else if (Y = F(s), typeof Y == "function") for (s = Y.call(s), ue = 0; !(b = s.next()).done; ) b = b.value, Y = U + Te(b, ue++), K += De(b, g, D, Y, V);
    else if (b === "object") throw g = String(s), Error("Objects are not valid as a React child (found: " + (g === "[object Object]" ? "object with keys {" + Object.keys(s).join(", ") + "}" : g) + "). If you meant to render a collection of children, use an array instead.");
    return K;
  }
  function Re(s, g, D) {
    if (s == null) return s;
    var U = [], V = 0;
    return De(s, U, "", "", function(b) {
      return g.call(D, b, V++);
    }), U;
  }
  function Fe(s) {
    if (s._status === -1) {
      var g = s._result;
      g = g(), g.then(function(D) {
        (s._status === 0 || s._status === -1) && (s._status = 1, s._result = D);
      }, function(D) {
        (s._status === 0 || s._status === -1) && (s._status = 2, s._result = D);
      }), s._status === -1 && (s._status = 0, s._result = g);
    }
    if (s._status === 1) return s._result.default;
    throw s._result;
  }
  var re = { current: null }, j = { transition: null }, I = { ReactCurrentDispatcher: re, ReactCurrentBatchConfig: j, ReactCurrentOwner: Se };
  return q.Children = { map: Re, forEach: function(s, g, D) {
    Re(s, function() {
      g.apply(this, arguments);
    }, D);
  }, count: function(s) {
    var g = 0;
    return Re(s, function() {
      g++;
    }), g;
  }, toArray: function(s) {
    return Re(s, function(g) {
      return g;
    }) || [];
  }, only: function(s) {
    if (!wt(s)) throw Error("React.Children.only expected to receive a single React element child.");
    return s;
  } }, q.Component = ne, q.Fragment = y, q.Profiler = de, q.PureComponent = Je, q.StrictMode = xe, q.Suspense = Z, q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = I, q.cloneElement = function(s, g, D) {
    if (s == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + s + ".");
    var U = Ke({}, s.props), V = s.key, b = s.ref, K = s._owner;
    if (g != null) {
      if (g.ref !== void 0 && (b = g.ref, K = Se.current), g.key !== void 0 && (V = "" + g.key), s.type && s.type.defaultProps) var ue = s.type.defaultProps;
      for (Y in g) Ye.call(g, Y) && !qe.hasOwnProperty(Y) && (U[Y] = g[Y] === void 0 && ue !== void 0 ? ue[Y] : g[Y]);
    }
    var Y = arguments.length - 2;
    if (Y === 1) U.children = D;
    else if (1 < Y) {
      ue = Array(Y);
      for (var ke = 0; ke < Y; ke++) ue[ke] = arguments[ke + 2];
      U.children = ue;
    }
    return { $$typeof: E, type: s.type, key: V, ref: b, props: U, _owner: K };
  }, q.createContext = function(s) {
    return s = { $$typeof: ae, _currentValue: s, _currentValue2: s, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, s.Provider = { $$typeof: X, _context: s }, s.Consumer = s;
  }, q.createElement = ce, q.createFactory = function(s) {
    var g = ce.bind(null, s);
    return g.type = s, g;
  }, q.createRef = function() {
    return { current: null };
  }, q.forwardRef = function(s) {
    return { $$typeof: G, render: s };
  }, q.isValidElement = wt, q.lazy = function(s) {
    return { $$typeof: Ce, _payload: { _status: -1, _result: s }, _init: Fe };
  }, q.memo = function(s, g) {
    return { $$typeof: ye, type: s, compare: g === void 0 ? null : g };
  }, q.startTransition = function(s) {
    var g = j.transition;
    j.transition = {};
    try {
      s();
    } finally {
      j.transition = g;
    }
  }, q.unstable_act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, q.useCallback = function(s, g) {
    return re.current.useCallback(s, g);
  }, q.useContext = function(s) {
    return re.current.useContext(s);
  }, q.useDebugValue = function() {
  }, q.useDeferredValue = function(s) {
    return re.current.useDeferredValue(s);
  }, q.useEffect = function(s, g) {
    return re.current.useEffect(s, g);
  }, q.useId = function() {
    return re.current.useId();
  }, q.useImperativeHandle = function(s, g, D) {
    return re.current.useImperativeHandle(s, g, D);
  }, q.useInsertionEffect = function(s, g) {
    return re.current.useInsertionEffect(s, g);
  }, q.useLayoutEffect = function(s, g) {
    return re.current.useLayoutEffect(s, g);
  }, q.useMemo = function(s, g) {
    return re.current.useMemo(s, g);
  }, q.useReducer = function(s, g, D) {
    return re.current.useReducer(s, g, D);
  }, q.useRef = function(s) {
    return re.current.useRef(s);
  }, q.useState = function(s) {
    return re.current.useState(s);
  }, q.useSyncExternalStore = function(s, g, D) {
    return re.current.useSyncExternalStore(s, g, D);
  }, q.useTransition = function() {
    return re.current.useTransition();
  }, q.version = "18.2.0", q;
}
var rc;
function Vu() {
  return rc || (rc = 1, Bu.exports = Ad()), Bu.exports;
}
var lc;
function Bd() {
  if (lc) return ii;
  lc = 1;
  var E = Vu(), W = /* @__PURE__ */ Symbol.for("react.element"), y = /* @__PURE__ */ Symbol.for("react.fragment"), xe = Object.prototype.hasOwnProperty, de = E.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, X = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ae(G, Z, ye) {
    var Ce, se = {}, F = null, ie = null;
    ye !== void 0 && (F = "" + ye), Z.key !== void 0 && (F = "" + Z.key), Z.ref !== void 0 && (ie = Z.ref);
    for (Ce in Z) xe.call(Z, Ce) && !X.hasOwnProperty(Ce) && (se[Ce] = Z[Ce]);
    if (G && G.defaultProps) for (Ce in Z = G.defaultProps, Z) se[Ce] === void 0 && (se[Ce] = Z[Ce]);
    return { $$typeof: W, type: G, key: F, ref: ie, props: se, _owner: de.current };
  }
  return ii.Fragment = y, ii.jsx = ae, ii.jsxs = ae, ii;
}
var ic;
function Ud() {
  return ic || (ic = 1, Au.exports = Bd()), Au.exports;
}
var f = Ud(), S = Vu(), uo = {}, Uu = { exports: {} }, gt = {}, $u = { exports: {} }, Hu = {};
var oc;
function $d() {
  return oc || (oc = 1, (function(E) {
    function W(j, I) {
      var s = j.length;
      j.push(I);
      e: for (; 0 < s; ) {
        var g = s - 1 >>> 1, D = j[g];
        if (0 < de(D, I)) j[g] = I, j[s] = D, s = g;
        else break e;
      }
    }
    function y(j) {
      return j.length === 0 ? null : j[0];
    }
    function xe(j) {
      if (j.length === 0) return null;
      var I = j[0], s = j.pop();
      if (s !== I) {
        j[0] = s;
        e: for (var g = 0, D = j.length, U = D >>> 1; g < U; ) {
          var V = 2 * (g + 1) - 1, b = j[V], K = V + 1, ue = j[K];
          if (0 > de(b, s)) K < D && 0 > de(ue, b) ? (j[g] = ue, j[K] = s, g = K) : (j[g] = b, j[V] = s, g = V);
          else if (K < D && 0 > de(ue, s)) j[g] = ue, j[K] = s, g = K;
          else break e;
        }
      }
      return I;
    }
    function de(j, I) {
      var s = j.sortIndex - I.sortIndex;
      return s !== 0 ? s : j.id - I.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var X = performance;
      E.unstable_now = function() {
        return X.now();
      };
    } else {
      var ae = Date, G = ae.now();
      E.unstable_now = function() {
        return ae.now() - G;
      };
    }
    var Z = [], ye = [], Ce = 1, se = null, F = 3, ie = !1, Ke = !1, Q = !1, ne = typeof setTimeout == "function" ? setTimeout : null, dt = typeof clearTimeout == "function" ? clearTimeout : null, Je = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Ne(j) {
      for (var I = y(ye); I !== null; ) {
        if (I.callback === null) xe(ye);
        else if (I.startTime <= j) xe(ye), I.sortIndex = I.expirationTime, W(Z, I);
        else break;
        I = y(ye);
      }
    }
    function ge(j) {
      if (Q = !1, Ne(j), !Ke) if (y(Z) !== null) Ke = !0, Fe(Ye);
      else {
        var I = y(ye);
        I !== null && re(ge, I.startTime - j);
      }
    }
    function Ye(j, I) {
      Ke = !1, Q && (Q = !1, dt(ce), ce = -1), ie = !0;
      var s = F;
      try {
        for (Ne(I), se = y(Z); se !== null && (!(se.expirationTime > I) || j && !ln()); ) {
          var g = se.callback;
          if (typeof g == "function") {
            se.callback = null, F = se.priorityLevel;
            var D = g(se.expirationTime <= I);
            I = E.unstable_now(), typeof D == "function" ? se.callback = D : se === y(Z) && xe(Z), Ne(I);
          } else xe(Z);
          se = y(Z);
        }
        if (se !== null) var U = !0;
        else {
          var V = y(ye);
          V !== null && re(ge, V.startTime - I), U = !1;
        }
        return U;
      } finally {
        se = null, F = s, ie = !1;
      }
    }
    var Se = !1, qe = null, ce = -1, Le = 5, wt = -1;
    function ln() {
      return !(E.unstable_now() - wt < Le);
    }
    function be() {
      if (qe !== null) {
        var j = E.unstable_now();
        wt = j;
        var I = !0;
        try {
          I = qe(!0, j);
        } finally {
          I ? Te() : (Se = !1, qe = null);
        }
      } else Se = !1;
    }
    var Te;
    if (typeof Je == "function") Te = function() {
      Je(be);
    };
    else if (typeof MessageChannel < "u") {
      var De = new MessageChannel(), Re = De.port2;
      De.port1.onmessage = be, Te = function() {
        Re.postMessage(null);
      };
    } else Te = function() {
      ne(be, 0);
    };
    function Fe(j) {
      qe = j, Se || (Se = !0, Te());
    }
    function re(j, I) {
      ce = ne(function() {
        j(E.unstable_now());
      }, I);
    }
    E.unstable_IdlePriority = 5, E.unstable_ImmediatePriority = 1, E.unstable_LowPriority = 4, E.unstable_NormalPriority = 3, E.unstable_Profiling = null, E.unstable_UserBlockingPriority = 2, E.unstable_cancelCallback = function(j) {
      j.callback = null;
    }, E.unstable_continueExecution = function() {
      Ke || ie || (Ke = !0, Fe(Ye));
    }, E.unstable_forceFrameRate = function(j) {
      0 > j || 125 < j ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Le = 0 < j ? Math.floor(1e3 / j) : 5;
    }, E.unstable_getCurrentPriorityLevel = function() {
      return F;
    }, E.unstable_getFirstCallbackNode = function() {
      return y(Z);
    }, E.unstable_next = function(j) {
      switch (F) {
        case 1:
        case 2:
        case 3:
          var I = 3;
          break;
        default:
          I = F;
      }
      var s = F;
      F = I;
      try {
        return j();
      } finally {
        F = s;
      }
    }, E.unstable_pauseExecution = function() {
    }, E.unstable_requestPaint = function() {
    }, E.unstable_runWithPriority = function(j, I) {
      switch (j) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          j = 3;
      }
      var s = F;
      F = j;
      try {
        return I();
      } finally {
        F = s;
      }
    }, E.unstable_scheduleCallback = function(j, I, s) {
      var g = E.unstable_now();
      switch (typeof s == "object" && s !== null ? (s = s.delay, s = typeof s == "number" && 0 < s ? g + s : g) : s = g, j) {
        case 1:
          var D = -1;
          break;
        case 2:
          D = 250;
          break;
        case 5:
          D = 1073741823;
          break;
        case 4:
          D = 1e4;
          break;
        default:
          D = 5e3;
      }
      return D = s + D, j = { id: Ce++, callback: I, priorityLevel: j, startTime: s, expirationTime: D, sortIndex: -1 }, s > g ? (j.sortIndex = s, W(ye, j), y(Z) === null && j === y(ye) && (Q ? (dt(ce), ce = -1) : Q = !0, re(ge, s - g))) : (j.sortIndex = D, W(Z, j), Ke || ie || (Ke = !0, Fe(Ye))), j;
    }, E.unstable_shouldYield = ln, E.unstable_wrapCallback = function(j) {
      var I = F;
      return function() {
        var s = F;
        F = I;
        try {
          return j.apply(this, arguments);
        } finally {
          F = s;
        }
      };
    };
  })(Hu)), Hu;
}
var uc;
function Hd() {
  return uc || (uc = 1, $u.exports = $d()), $u.exports;
}
var ac;
function Wd() {
  if (ac) return gt;
  ac = 1;
  var E = Vu(), W = Hd();
  function y(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var xe = /* @__PURE__ */ new Set(), de = {};
  function X(e, t) {
    ae(e, t), ae(e + "Capture", t);
  }
  function ae(e, t) {
    for (de[e] = t, e = 0; e < t.length; e++) xe.add(t[e]);
  }
  var G = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Z = Object.prototype.hasOwnProperty, ye = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Ce = {}, se = {};
  function F(e) {
    return Z.call(se, e) ? !0 : Z.call(Ce, e) ? !1 : ye.test(e) ? se[e] = !0 : (Ce[e] = !0, !1);
  }
  function ie(e, t, n, r) {
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
  function Ke(e, t, n, r) {
    if (t === null || typeof t > "u" || ie(e, t, n, r)) return !0;
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
  function Q(e, t, n, r, l, i, o) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = o;
  }
  var ne = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    ne[e] = new Q(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    ne[t] = new Q(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    ne[e] = new Q(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    ne[e] = new Q(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    ne[e] = new Q(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    ne[e] = new Q(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    ne[e] = new Q(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    ne[e] = new Q(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    ne[e] = new Q(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var dt = /[\-:]([a-z])/g;
  function Je(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      dt,
      Je
    );
    ne[t] = new Q(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(dt, Je);
    ne[t] = new Q(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(dt, Je);
    ne[t] = new Q(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    ne[e] = new Q(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), ne.xlinkHref = new Q("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    ne[e] = new Q(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Ne(e, t, n, r) {
    var l = ne.hasOwnProperty(t) ? ne[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Ke(t, n, l, r) && (n = null), r || l === null ? F(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ge = E.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Ye = /* @__PURE__ */ Symbol.for("react.element"), Se = /* @__PURE__ */ Symbol.for("react.portal"), qe = /* @__PURE__ */ Symbol.for("react.fragment"), ce = /* @__PURE__ */ Symbol.for("react.strict_mode"), Le = /* @__PURE__ */ Symbol.for("react.profiler"), wt = /* @__PURE__ */ Symbol.for("react.provider"), ln = /* @__PURE__ */ Symbol.for("react.context"), be = /* @__PURE__ */ Symbol.for("react.forward_ref"), Te = /* @__PURE__ */ Symbol.for("react.suspense"), De = /* @__PURE__ */ Symbol.for("react.suspense_list"), Re = /* @__PURE__ */ Symbol.for("react.memo"), Fe = /* @__PURE__ */ Symbol.for("react.lazy"), re = /* @__PURE__ */ Symbol.for("react.offscreen"), j = Symbol.iterator;
  function I(e) {
    return e === null || typeof e != "object" ? null : (e = j && e[j] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var s = Object.assign, g;
  function D(e) {
    if (g === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      g = t && t[1] || "";
    }
    return `
` + g + e;
  }
  var U = !1;
  function V(e, t) {
    if (!e || U) return "";
    U = !0;
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
`), o = l.length - 1, a = i.length - 1; 1 <= o && 0 <= a && l[o] !== i[a]; ) a--;
        for (; 1 <= o && 0 <= a; o--, a--) if (l[o] !== i[a]) {
          if (o !== 1 || a !== 1)
            do
              if (o--, a--, 0 > a || l[o] !== i[a]) {
                var c = `
` + l[o].replace(" at new ", " at ");
                return e.displayName && c.includes("<anonymous>") && (c = c.replace("<anonymous>", e.displayName)), c;
              }
            while (1 <= o && 0 <= a);
          break;
        }
      }
    } finally {
      U = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? D(e) : "";
  }
  function b(e) {
    switch (e.tag) {
      case 5:
        return D(e.type);
      case 16:
        return D("Lazy");
      case 13:
        return D("Suspense");
      case 19:
        return D("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = V(e.type, !1), e;
      case 11:
        return e = V(e.type.render, !1), e;
      case 1:
        return e = V(e.type, !0), e;
      default:
        return "";
    }
  }
  function K(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case qe:
        return "Fragment";
      case Se:
        return "Portal";
      case Le:
        return "Profiler";
      case ce:
        return "StrictMode";
      case Te:
        return "Suspense";
      case De:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case ln:
        return (e.displayName || "Context") + ".Consumer";
      case wt:
        return (e._context.displayName || "Context") + ".Provider";
      case be:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Re:
        return t = e.displayName || null, t !== null ? t : K(e.type) || "Memo";
      case Fe:
        t = e._payload, e = e._init;
        try {
          return K(e(t));
        } catch {
        }
    }
    return null;
  }
  function ue(e) {
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
        return K(t);
      case 8:
        return t === ce ? "StrictMode" : "Mode";
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
  function Y(e) {
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
  function ke(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function hl(e) {
    var t = ke(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  function tr(e) {
    e._valueTracker || (e._valueTracker = hl(e));
  }
  function Cn(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = ke(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function xt(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function nr(e, t) {
    var n = t.checked;
    return s({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Ht(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = Y(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Dr(e, t) {
    t = t.checked, t != null && Ne(e, "checked", t, !1);
  }
  function Mr(e, t) {
    Dr(e, t);
    var n = Y(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? rr(e, t.type, n) : t.hasOwnProperty("defaultValue") && rr(e, t.type, Y(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Dt(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function rr(e, t, n) {
    (t !== "number" || xt(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Wt = Array.isArray;
  function on(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + Y(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function un(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(y(91));
    return s({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function vl(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(y(92));
        if (Wt(n)) {
          if (1 < n.length) throw Error(y(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: Y(n) };
  }
  function Nn(e, t) {
    var n = Y(t.value), r = Y(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function lr(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function yl(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function an(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? yl(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Vt, Ir = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Vt = Vt || document.createElement("div"), Vt.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Vt.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function jn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var St = {
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
  }, oi = ["Webkit", "ms", "Moz", "O"];
  Object.keys(St).forEach(function(e) {
    oi.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), St[t] = St[e];
    });
  });
  function Or(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || St.hasOwnProperty(e) && St[e] ? ("" + t).trim() : t + "px";
  }
  function Pn(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = Or(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var gl = s({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function ir(e, t) {
    if (t) {
      if (gl[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(y(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(y(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(y(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(y(62));
    }
  }
  function sn(e, t) {
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
  var Me = null;
  function or(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var kt = null, Qt = null, Ae = null;
  function wl(e) {
    if (e = Vl(e)) {
      if (typeof kt != "function") throw Error(y(280));
      var t = e.stateNode;
      t && (t = ki(t), kt(e.stateNode, e.type, t));
    }
  }
  function Kt(e) {
    Qt ? Ae ? Ae.push(e) : Ae = [e] : Qt = e;
  }
  function xl() {
    if (Qt) {
      var e = Qt, t = Ae;
      if (Ae = Qt = null, wl(e), t) for (e = 0; e < t.length; e++) wl(t[e]);
    }
  }
  function Be(e, t) {
    return e(t);
  }
  function Rn() {
  }
  var Ie = !1;
  function Fr(e, t, n) {
    if (Ie) return e(t, n);
    Ie = !0;
    try {
      return Be(e, t, n);
    } finally {
      Ie = !1, (Qt !== null || Ae !== null) && (Rn(), xl());
    }
  }
  function zn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = ki(n);
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
  var Ln = !1;
  if (G) try {
    var Tn = {};
    Object.defineProperty(Tn, "passive", { get: function() {
      Ln = !0;
    } }), window.addEventListener("test", Tn, Tn), window.removeEventListener("test", Tn, Tn);
  } catch {
    Ln = !1;
  }
  function cn(e, t, n, r, l, i, o, a, c) {
    var h = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, h);
    } catch (x) {
      this.onError(x);
    }
  }
  var ur = !1, Yt = null, dn = !1, Dn = null, so = { onError: function(e) {
    ur = !0, Yt = e;
  } };
  function Sl(e, t, n, r, l, i, o, a, c) {
    ur = !1, Yt = null, cn.apply(so, arguments);
  }
  function ar(e, t, n, r, l, i, o, a, c) {
    if (Sl.apply(this, arguments), ur) {
      if (ur) {
        var h = Yt;
        ur = !1, Yt = null;
      } else throw Error(y(198));
      dn || (dn = !0, Dn = h);
    }
  }
  function Nt(e) {
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
  function Mn(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function In(e) {
    if (Nt(e) !== e) throw Error(y(188));
  }
  function co(e) {
    var t = e.alternate;
    if (!t) {
      if (t = Nt(e), t === null) throw Error(y(188));
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
          if (i === n) return In(l), e;
          if (i === r) return In(l), t;
          i = i.sibling;
        }
        throw Error(y(188));
      }
      if (n.return !== r.return) n = l, r = i;
      else {
        for (var o = !1, a = l.child; a; ) {
          if (a === n) {
            o = !0, n = l, r = i;
            break;
          }
          if (a === r) {
            o = !0, r = l, n = i;
            break;
          }
          a = a.sibling;
        }
        if (!o) {
          for (a = i.child; a; ) {
            if (a === n) {
              o = !0, n = i, r = l;
              break;
            }
            if (a === r) {
              o = !0, r = i, n = l;
              break;
            }
            a = a.sibling;
          }
          if (!o) throw Error(y(189));
        }
      }
      if (n.alternate !== r) throw Error(y(190));
    }
    if (n.tag !== 3) throw Error(y(188));
    return n.stateNode.current === n ? e : t;
  }
  function kl(e) {
    return e = co(e), e !== null ? sr(e) : null;
  }
  function sr(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = sr(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Ar = W.unstable_scheduleCallback, _l = W.unstable_cancelCallback, El = W.unstable_shouldYield, Cl = W.unstable_requestPaint, pe = W.unstable_now, ui = W.unstable_getCurrentPriorityLevel, On = W.unstable_ImmediatePriority, Br = W.unstable_UserBlockingPriority, fn = W.unstable_NormalPriority, Ur = W.unstable_LowPriority, Nl = W.unstable_IdlePriority, $r = null, ft = null;
  function jl(e) {
    if (ft && typeof ft.onCommitFiberRoot == "function") try {
      ft.onCommitFiberRoot($r, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var ut = Math.clz32 ? Math.clz32 : si, Pl = Math.log, ai = Math.LN2;
  function si(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Pl(e) / ai | 0) | 0;
  }
  var cr = 64, dr = 4194304;
  function Fn(e) {
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
  function et(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, i = e.pingedLanes, o = n & 268435455;
    if (o !== 0) {
      var a = o & ~l;
      a !== 0 ? r = Fn(a) : (i &= o, i !== 0 && (r = Fn(i)));
    } else o = n & ~l, o !== 0 ? r = Fn(o) : i !== 0 && (r = Fn(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, i = t & -t, l >= i || l === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - ut(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function Hr(e, t) {
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
  function fr(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var o = 31 - ut(i), a = 1 << o, c = l[o];
      c === -1 ? ((a & n) === 0 || (a & r) !== 0) && (l[o] = Hr(a, t)) : c <= t && (e.expiredLanes |= a), i &= ~a;
    }
  }
  function Wr(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function qt() {
    var e = cr;
    return cr <<= 1, (cr & 4194240) === 0 && (cr = 64), e;
  }
  function Xt(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function H(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - ut(t), e[t] = n;
  }
  function pr(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - ut(n), i = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~i;
    }
  }
  function Vr(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - ut(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var ee = 0;
  function mr(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var hr, Gt, vr, Xe, Rl, Qr = !1, J = [], Mt = null, tt = null, je = null, me = /* @__PURE__ */ new Map(), pn = /* @__PURE__ */ new Map(), It = [], ci = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Zt(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Mt = null;
        break;
      case "dragenter":
      case "dragleave":
        tt = null;
        break;
      case "mouseover":
      case "mouseout":
        je = null;
        break;
      case "pointerover":
      case "pointerout":
        me.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        pn.delete(t.pointerId);
    }
  }
  function An(e, t, n, r, l, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = Vl(t), t !== null && Gt(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function fo(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Mt = An(Mt, e, t, n, r, l), !0;
      case "dragenter":
        return tt = An(tt, e, t, n, r, l), !0;
      case "mouseover":
        return je = An(je, e, t, n, r, l), !0;
      case "pointerover":
        var i = l.pointerId;
        return me.set(i, An(me.get(i) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return i = l.pointerId, pn.set(i, An(pn.get(i) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function di(e) {
    var t = Sr(e.target);
    if (t !== null) {
      var n = Nt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = Mn(n), t !== null) {
            e.blockedOn = t, Rl(e.priority, function() {
              vr(n);
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
  function mn(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Tl(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Me = r, n.target.dispatchEvent(r), Me = null;
      } else return t = Vl(n), t !== null && Gt(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function zl(e, t, n) {
    mn(e) && n.delete(t);
  }
  function fi() {
    Qr = !1, Mt !== null && mn(Mt) && (Mt = null), tt !== null && mn(tt) && (tt = null), je !== null && mn(je) && (je = null), me.forEach(zl), pn.forEach(zl);
  }
  function yr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Qr || (Qr = !0, W.unstable_scheduleCallback(W.unstable_NormalPriority, fi)));
  }
  function gr(e) {
    function t(l) {
      return yr(l, e);
    }
    if (0 < J.length) {
      yr(J[0], e);
      for (var n = 1; n < J.length; n++) {
        var r = J[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Mt !== null && yr(Mt, e), tt !== null && yr(tt, e), je !== null && yr(je, e), me.forEach(t), pn.forEach(t), n = 0; n < It.length; n++) r = It[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < It.length && (n = It[0], n.blockedOn === null); ) di(n), n.blockedOn === null && It.shift();
  }
  var at = ge.ReactCurrentBatchConfig, hn = !0;
  function po(e, t, n, r) {
    var l = ee, i = at.transition;
    at.transition = null;
    try {
      ee = 1, Ll(e, t, n, r);
    } finally {
      ee = l, at.transition = i;
    }
  }
  function mo(e, t, n, r) {
    var l = ee, i = at.transition;
    at.transition = null;
    try {
      ee = 4, Ll(e, t, n, r);
    } finally {
      ee = l, at.transition = i;
    }
  }
  function Ll(e, t, n, r) {
    if (hn) {
      var l = Tl(e, t, n, r);
      if (l === null) Po(e, t, r, Kr, n), Zt(e, r);
      else if (fo(l, e, t, n, r)) r.stopPropagation();
      else if (Zt(e, r), t & 4 && -1 < ci.indexOf(e)) {
        for (; l !== null; ) {
          var i = Vl(l);
          if (i !== null && hr(i), i = Tl(e, t, n, r), i === null && Po(e, t, r, Kr, n), i === l) break;
          l = i;
        }
        l !== null && r.stopPropagation();
      } else Po(e, t, r, null, n);
    }
  }
  var Kr = null;
  function Tl(e, t, n, r) {
    if (Kr = null, e = or(r), e = Sr(e), e !== null) if (t = Nt(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = Mn(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Kr = e, null;
  }
  function pi(e) {
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
        switch (ui()) {
          case On:
            return 1;
          case Br:
            return 4;
          case fn:
          case Ur:
            return 16;
          case Nl:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Jt = null, Dl = null, wr = null;
  function mi() {
    if (wr) return wr;
    var e, t = Dl, n = t.length, r, l = "value" in Jt ? Jt.value : Jt.textContent, i = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var o = n - e;
    for (r = 1; r <= o && t[n - r] === l[i - r]; r++) ;
    return wr = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Yr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Bn() {
    return !0;
  }
  function Ml() {
    return !1;
  }
  function nt(e) {
    function t(n, r, l, i, o) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
      for (var a in e) e.hasOwnProperty(a) && (n = e[a], this[a] = n ? n(i) : i[a]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Bn : Ml, this.isPropagationStopped = Ml, this;
    }
    return s(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Bn);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Bn);
    }, persist: function() {
    }, isPersistent: Bn }), t;
  }
  var vn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, u = nt(vn), v = s({}, vn, { view: 0, detail: 0 }), N = nt(v), _, L, O, oe = s({}, v, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: yo, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== O && (O && e.type === "mousemove" ? (_ = e.screenX - O.screenX, L = e.screenY - O.screenY) : L = _ = 0, O = e), _);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : L;
  } }), Ue = nt(oe), ho = s({}, oe, { dataTransfer: 0 }), xr = nt(ho), mc = s({}, v, { relatedTarget: 0 }), vo = nt(mc), hc = s({}, vn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), vc = nt(hc), yc = s({}, vn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), gc = nt(yc), wc = s({}, vn, { data: 0 }), Qu = nt(wc), xc = {
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
  function yo() {
    return _c;
  }
  var Ec = s({}, v, { key: function(e) {
    if (e.key) {
      var t = xc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Yr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Sc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: yo, charCode: function(e) {
    return e.type === "keypress" ? Yr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Yr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Cc = nt(Ec), Nc = s({}, oe, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Ku = nt(Nc), jc = s({}, v, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: yo }), Pc = nt(jc), Rc = s({}, vn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), zc = nt(Rc), Lc = s({}, oe, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Tc = nt(Lc), Dc = [9, 13, 27, 32], go = G && "CompositionEvent" in window, Il = null;
  G && "documentMode" in document && (Il = document.documentMode);
  var Mc = G && "TextEvent" in window && !Il, Yu = G && (!go || Il && 8 < Il && 11 >= Il), qu = " ", Xu = !1;
  function Gu(e, t) {
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
  function Zu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var qr = !1;
  function Ic(e, t) {
    switch (e) {
      case "compositionend":
        return Zu(t);
      case "keypress":
        return t.which !== 32 ? null : (Xu = !0, qu);
      case "textInput":
        return e = t.data, e === qu && Xu ? null : e;
      default:
        return null;
    }
  }
  function Oc(e, t) {
    if (qr) return e === "compositionend" || !go && Gu(e, t) ? (e = mi(), wr = Dl = Jt = null, qr = !1, e) : null;
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
        return Yu && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Fc = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Ju(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Fc[e.type] : t === "textarea";
  }
  function bu(e, t, n, r) {
    Kt(r), t = wi(t, "onChange"), 0 < t.length && (n = new u("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var Ol = null, Fl = null;
  function Ac(e) {
    ya(e, 0);
  }
  function hi(e) {
    var t = br(e);
    if (Cn(t)) return e;
  }
  function Bc(e, t) {
    if (e === "change") return t;
  }
  var ea = !1;
  if (G) {
    var wo;
    if (G) {
      var xo = "oninput" in document;
      if (!xo) {
        var ta = document.createElement("div");
        ta.setAttribute("oninput", "return;"), xo = typeof ta.oninput == "function";
      }
      wo = xo;
    } else wo = !1;
    ea = wo && (!document.documentMode || 9 < document.documentMode);
  }
  function na() {
    Ol && (Ol.detachEvent("onpropertychange", ra), Fl = Ol = null);
  }
  function ra(e) {
    if (e.propertyName === "value" && hi(Fl)) {
      var t = [];
      bu(t, Fl, e, or(e)), Fr(Ac, t);
    }
  }
  function Uc(e, t, n) {
    e === "focusin" ? (na(), Ol = t, Fl = n, Ol.attachEvent("onpropertychange", ra)) : e === "focusout" && na();
  }
  function $c(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return hi(Fl);
  }
  function Hc(e, t) {
    if (e === "click") return hi(t);
  }
  function Wc(e, t) {
    if (e === "input" || e === "change") return hi(t);
  }
  function Vc(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Ot = typeof Object.is == "function" ? Object.is : Vc;
  function Al(e, t) {
    if (Ot(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!Z.call(t, l) || !Ot(e[l], t[l])) return !1;
    }
    return !0;
  }
  function la(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function ia(e, t) {
    var n = la(e);
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
      n = la(n);
    }
  }
  function oa(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? oa(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ua() {
    for (var e = window, t = xt(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = xt(e.document);
    }
    return t;
  }
  function So(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Qc(e) {
    var t = ua(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && oa(n.ownerDocument.documentElement, n)) {
      if (r !== null && So(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, i = Math.min(r.start, l);
          r = r.end === void 0 ? i : Math.min(r.end, l), !e.extend && i > r && (l = r, r = i, i = l), l = ia(n, i);
          var o = ia(
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
  var Kc = G && "documentMode" in document && 11 >= document.documentMode, Xr = null, ko = null, Bl = null, _o = !1;
  function aa(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    _o || Xr == null || Xr !== xt(r) || (r = Xr, "selectionStart" in r && So(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), Bl && Al(Bl, r) || (Bl = r, r = wi(ko, "onSelect"), 0 < r.length && (t = new u("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Xr)));
  }
  function vi(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Gr = { animationend: vi("Animation", "AnimationEnd"), animationiteration: vi("Animation", "AnimationIteration"), animationstart: vi("Animation", "AnimationStart"), transitionend: vi("Transition", "TransitionEnd") }, Eo = {}, sa = {};
  G && (sa = document.createElement("div").style, "AnimationEvent" in window || (delete Gr.animationend.animation, delete Gr.animationiteration.animation, delete Gr.animationstart.animation), "TransitionEvent" in window || delete Gr.transitionend.transition);
  function yi(e) {
    if (Eo[e]) return Eo[e];
    if (!Gr[e]) return e;
    var t = Gr[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in sa) return Eo[e] = t[n];
    return e;
  }
  var ca = yi("animationend"), da = yi("animationiteration"), fa = yi("animationstart"), pa = yi("transitionend"), ma = /* @__PURE__ */ new Map(), ha = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Un(e, t) {
    ma.set(e, t), X(t, [e]);
  }
  for (var Co = 0; Co < ha.length; Co++) {
    var No = ha[Co], Yc = No.toLowerCase(), qc = No[0].toUpperCase() + No.slice(1);
    Un(Yc, "on" + qc);
  }
  Un(ca, "onAnimationEnd"), Un(da, "onAnimationIteration"), Un(fa, "onAnimationStart"), Un("dblclick", "onDoubleClick"), Un("focusin", "onFocus"), Un("focusout", "onBlur"), Un(pa, "onTransitionEnd"), ae("onMouseEnter", ["mouseout", "mouseover"]), ae("onMouseLeave", ["mouseout", "mouseover"]), ae("onPointerEnter", ["pointerout", "pointerover"]), ae("onPointerLeave", ["pointerout", "pointerover"]), X("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), X("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), X("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), X("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), X("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), X("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Ul = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Xc = new Set("cancel close invalid load scroll toggle".split(" ").concat(Ul));
  function va(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, ar(r, t, void 0, e), e.currentTarget = null;
  }
  function ya(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var o = r.length - 1; 0 <= o; o--) {
          var a = r[o], c = a.instance, h = a.currentTarget;
          if (a = a.listener, c !== i && l.isPropagationStopped()) break e;
          va(l, a, h), i = c;
        }
        else for (o = 0; o < r.length; o++) {
          if (a = r[o], c = a.instance, h = a.currentTarget, a = a.listener, c !== i && l.isPropagationStopped()) break e;
          va(l, a, h), i = c;
        }
      }
    }
    if (dn) throw e = Dn, dn = !1, Dn = null, e;
  }
  function he(e, t) {
    var n = t[Mo];
    n === void 0 && (n = t[Mo] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (ga(t, e, 2, !1), n.add(r));
  }
  function jo(e, t, n) {
    var r = 0;
    t && (r |= 4), ga(n, e, r, t);
  }
  var gi = "_reactListening" + Math.random().toString(36).slice(2);
  function $l(e) {
    if (!e[gi]) {
      e[gi] = !0, xe.forEach(function(n) {
        n !== "selectionchange" && (Xc.has(n) || jo(n, !1, e), jo(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[gi] || (t[gi] = !0, jo("selectionchange", !1, t));
    }
  }
  function ga(e, t, n, r) {
    switch (pi(t)) {
      case 1:
        var l = po;
        break;
      case 4:
        l = mo;
        break;
      default:
        l = Ll;
    }
    n = l.bind(null, t, n, e), l = void 0, !Ln || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function Po(e, t, n, r, l) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var a = r.stateNode.containerInfo;
        if (a === l || a.nodeType === 8 && a.parentNode === l) break;
        if (o === 4) for (o = r.return; o !== null; ) {
          var c = o.tag;
          if ((c === 3 || c === 4) && (c = o.stateNode.containerInfo, c === l || c.nodeType === 8 && c.parentNode === l)) return;
          o = o.return;
        }
        for (; a !== null; ) {
          if (o = Sr(a), o === null) return;
          if (c = o.tag, c === 5 || c === 6) {
            r = i = o;
            continue e;
          }
          a = a.parentNode;
        }
      }
      r = r.return;
    }
    Fr(function() {
      var h = i, x = or(n), k = [];
      e: {
        var w = ma.get(e);
        if (w !== void 0) {
          var P = u, z = e;
          switch (e) {
            case "keypress":
              if (Yr(n) === 0) break e;
            case "keydown":
            case "keyup":
              P = Cc;
              break;
            case "focusin":
              z = "focus", P = vo;
              break;
            case "focusout":
              z = "blur", P = vo;
              break;
            case "beforeblur":
            case "afterblur":
              P = vo;
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
              P = Ue;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              P = xr;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              P = Pc;
              break;
            case ca:
            case da:
            case fa:
              P = vc;
              break;
            case pa:
              P = zc;
              break;
            case "scroll":
              P = N;
              break;
            case "wheel":
              P = Tc;
              break;
            case "copy":
            case "cut":
            case "paste":
              P = gc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              P = Ku;
          }
          var T = (t & 4) !== 0, ze = !T && e === "scroll", p = T ? w !== null ? w + "Capture" : null : w;
          T = [];
          for (var d = h, m; d !== null; ) {
            m = d;
            var C = m.stateNode;
            if (m.tag === 5 && C !== null && (m = C, p !== null && (C = zn(d, p), C != null && T.push(Hl(d, C, m)))), ze) break;
            d = d.return;
          }
          0 < T.length && (w = new P(w, z, null, n, x), k.push({ event: w, listeners: T }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (w = e === "mouseover" || e === "pointerover", P = e === "mouseout" || e === "pointerout", w && n !== Me && (z = n.relatedTarget || n.fromElement) && (Sr(z) || z[yn])) break e;
          if ((P || w) && (w = x.window === x ? x : (w = x.ownerDocument) ? w.defaultView || w.parentWindow : window, P ? (z = n.relatedTarget || n.toElement, P = h, z = z ? Sr(z) : null, z !== null && (ze = Nt(z), z !== ze || z.tag !== 5 && z.tag !== 6) && (z = null)) : (P = null, z = h), P !== z)) {
            if (T = Ue, C = "onMouseLeave", p = "onMouseEnter", d = "mouse", (e === "pointerout" || e === "pointerover") && (T = Ku, C = "onPointerLeave", p = "onPointerEnter", d = "pointer"), ze = P == null ? w : br(P), m = z == null ? w : br(z), w = new T(C, d + "leave", P, n, x), w.target = ze, w.relatedTarget = m, C = null, Sr(x) === h && (T = new T(p, d + "enter", z, n, x), T.target = m, T.relatedTarget = ze, C = T), ze = C, P && z) t: {
              for (T = P, p = z, d = 0, m = T; m; m = Zr(m)) d++;
              for (m = 0, C = p; C; C = Zr(C)) m++;
              for (; 0 < d - m; ) T = Zr(T), d--;
              for (; 0 < m - d; ) p = Zr(p), m--;
              for (; d--; ) {
                if (T === p || p !== null && T === p.alternate) break t;
                T = Zr(T), p = Zr(p);
              }
              T = null;
            }
            else T = null;
            P !== null && wa(k, w, P, T, !1), z !== null && ze !== null && wa(k, ze, z, T, !0);
          }
        }
        e: {
          if (w = h ? br(h) : window, P = w.nodeName && w.nodeName.toLowerCase(), P === "select" || P === "input" && w.type === "file") var M = Bc;
          else if (Ju(w)) if (ea) M = Wc;
          else {
            M = $c;
            var A = Uc;
          }
          else (P = w.nodeName) && P.toLowerCase() === "input" && (w.type === "checkbox" || w.type === "radio") && (M = Hc);
          if (M && (M = M(e, h))) {
            bu(k, M, n, x);
            break e;
          }
          A && A(e, w, h), e === "focusout" && (A = w._wrapperState) && A.controlled && w.type === "number" && rr(w, "number", w.value);
        }
        switch (A = h ? br(h) : window, e) {
          case "focusin":
            (Ju(A) || A.contentEditable === "true") && (Xr = A, ko = h, Bl = null);
            break;
          case "focusout":
            Bl = ko = Xr = null;
            break;
          case "mousedown":
            _o = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            _o = !1, aa(k, n, x);
            break;
          case "selectionchange":
            if (Kc) break;
          case "keydown":
          case "keyup":
            aa(k, n, x);
        }
        var B;
        if (go) e: {
          switch (e) {
            case "compositionstart":
              var $ = "onCompositionStart";
              break e;
            case "compositionend":
              $ = "onCompositionEnd";
              break e;
            case "compositionupdate":
              $ = "onCompositionUpdate";
              break e;
          }
          $ = void 0;
        }
        else qr ? Gu(e, n) && ($ = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && ($ = "onCompositionStart");
        $ && (Yu && n.locale !== "ko" && (qr || $ !== "onCompositionStart" ? $ === "onCompositionEnd" && qr && (B = mi()) : (Jt = x, Dl = "value" in Jt ? Jt.value : Jt.textContent, qr = !0)), A = wi(h, $), 0 < A.length && ($ = new Qu($, e, null, n, x), k.push({ event: $, listeners: A }), B ? $.data = B : (B = Zu(n), B !== null && ($.data = B)))), (B = Mc ? Ic(e, n) : Oc(e, n)) && (h = wi(h, "onBeforeInput"), 0 < h.length && (x = new Qu("onBeforeInput", "beforeinput", null, n, x), k.push({ event: x, listeners: h }), x.data = B));
      }
      ya(k, t);
    });
  }
  function Hl(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function wi(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, i = l.stateNode;
      l.tag === 5 && i !== null && (l = i, i = zn(e, n), i != null && r.unshift(Hl(e, i, l)), i = zn(e, t), i != null && r.push(Hl(e, i, l))), e = e.return;
    }
    return r;
  }
  function Zr(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function wa(e, t, n, r, l) {
    for (var i = t._reactName, o = []; n !== null && n !== r; ) {
      var a = n, c = a.alternate, h = a.stateNode;
      if (c !== null && c === r) break;
      a.tag === 5 && h !== null && (a = h, l ? (c = zn(n, i), c != null && o.unshift(Hl(n, c, a))) : l || (c = zn(n, i), c != null && o.push(Hl(n, c, a)))), n = n.return;
    }
    o.length !== 0 && e.push({ event: t, listeners: o });
  }
  var Gc = /\r\n?/g, Zc = /\u0000|\uFFFD/g;
  function xa(e) {
    return (typeof e == "string" ? e : "" + e).replace(Gc, `
`).replace(Zc, "");
  }
  function xi(e, t, n) {
    if (t = xa(t), xa(e) !== t && n) throw Error(y(425));
  }
  function Si() {
  }
  var Ro = null, zo = null;
  function Lo(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var To = typeof setTimeout == "function" ? setTimeout : void 0, Jc = typeof clearTimeout == "function" ? clearTimeout : void 0, Sa = typeof Promise == "function" ? Promise : void 0, bc = typeof queueMicrotask == "function" ? queueMicrotask : typeof Sa < "u" ? function(e) {
    return Sa.resolve(null).then(e).catch(ed);
  } : To;
  function ed(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Do(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), gr(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    gr(t);
  }
  function $n(e) {
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
  function ka(e) {
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
  var Jr = Math.random().toString(36).slice(2), bt = "__reactFiber$" + Jr, Wl = "__reactProps$" + Jr, yn = "__reactContainer$" + Jr, Mo = "__reactEvents$" + Jr, td = "__reactListeners$" + Jr, nd = "__reactHandles$" + Jr;
  function Sr(e) {
    var t = e[bt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[yn] || n[bt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = ka(e); e !== null; ) {
          if (n = e[bt]) return n;
          e = ka(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function Vl(e) {
    return e = e[bt] || e[yn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function br(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(y(33));
  }
  function ki(e) {
    return e[Wl] || null;
  }
  var Io = [], el = -1;
  function Hn(e) {
    return { current: e };
  }
  function ve(e) {
    0 > el || (e.current = Io[el], Io[el] = null, el--);
  }
  function fe(e, t) {
    el++, Io[el] = e.current, e.current = t;
  }
  var Wn = {}, rt = Hn(Wn), pt = Hn(!1), kr = Wn;
  function tl(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Wn;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, i;
    for (i in n) l[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function mt(e) {
    return e = e.childContextTypes, e != null;
  }
  function _i() {
    ve(pt), ve(rt);
  }
  function _a(e, t, n) {
    if (rt.current !== Wn) throw Error(y(168));
    fe(rt, t), fe(pt, n);
  }
  function Ea(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(y(108, ue(e) || "Unknown", l));
    return s({}, n, r);
  }
  function Ei(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Wn, kr = rt.current, fe(rt, e), fe(pt, pt.current), !0;
  }
  function Ca(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(y(169));
    n ? (e = Ea(e, t, kr), r.__reactInternalMemoizedMergedChildContext = e, ve(pt), ve(rt), fe(rt, e)) : ve(pt), fe(pt, n);
  }
  var gn = null, Ci = !1, Oo = !1;
  function Na(e) {
    gn === null ? gn = [e] : gn.push(e);
  }
  function rd(e) {
    Ci = !0, Na(e);
  }
  function Vn() {
    if (!Oo && gn !== null) {
      Oo = !0;
      var e = 0, t = ee;
      try {
        var n = gn;
        for (ee = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        gn = null, Ci = !1;
      } catch (l) {
        throw gn !== null && (gn = gn.slice(e + 1)), Ar(On, Vn), l;
      } finally {
        ee = t, Oo = !1;
      }
    }
    return null;
  }
  var nl = [], rl = 0, Ni = null, ji = 0, jt = [], Pt = 0, _r = null, wn = 1, xn = "";
  function Er(e, t) {
    nl[rl++] = ji, nl[rl++] = Ni, Ni = e, ji = t;
  }
  function ja(e, t, n) {
    jt[Pt++] = wn, jt[Pt++] = xn, jt[Pt++] = _r, _r = e;
    var r = wn;
    e = xn;
    var l = 32 - ut(r) - 1;
    r &= ~(1 << l), n += 1;
    var i = 32 - ut(t) + l;
    if (30 < i) {
      var o = l - l % 5;
      i = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, wn = 1 << 32 - ut(t) + l | n << l | r, xn = i + e;
    } else wn = 1 << i | n << l | r, xn = e;
  }
  function Fo(e) {
    e.return !== null && (Er(e, 1), ja(e, 1, 0));
  }
  function Ao(e) {
    for (; e === Ni; ) Ni = nl[--rl], nl[rl] = null, ji = nl[--rl], nl[rl] = null;
    for (; e === _r; ) _r = jt[--Pt], jt[Pt] = null, xn = jt[--Pt], jt[Pt] = null, wn = jt[--Pt], jt[Pt] = null;
  }
  var _t = null, Et = null, we = !1, Ft = null;
  function Pa(e, t) {
    var n = Tt(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function Ra(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, _t = e, Et = $n(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, _t = e, Et = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = _r !== null ? { id: wn, overflow: xn } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = Tt(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, _t = e, Et = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Bo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Uo(e) {
    if (we) {
      var t = Et;
      if (t) {
        var n = t;
        if (!Ra(e, t)) {
          if (Bo(e)) throw Error(y(418));
          t = $n(n.nextSibling);
          var r = _t;
          t && Ra(e, t) ? Pa(r, n) : (e.flags = e.flags & -4097 | 2, we = !1, _t = e);
        }
      } else {
        if (Bo(e)) throw Error(y(418));
        e.flags = e.flags & -4097 | 2, we = !1, _t = e;
      }
    }
  }
  function za(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    _t = e;
  }
  function Pi(e) {
    if (e !== _t) return !1;
    if (!we) return za(e), we = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Lo(e.type, e.memoizedProps)), t && (t = Et)) {
      if (Bo(e)) throw La(), Error(y(418));
      for (; t; ) Pa(e, t), t = $n(t.nextSibling);
    }
    if (za(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(y(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                Et = $n(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        Et = null;
      }
    } else Et = _t ? $n(e.stateNode.nextSibling) : null;
    return !0;
  }
  function La() {
    for (var e = Et; e; ) e = $n(e.nextSibling);
  }
  function ll() {
    Et = _t = null, we = !1;
  }
  function $o(e) {
    Ft === null ? Ft = [e] : Ft.push(e);
  }
  var ld = ge.ReactCurrentBatchConfig;
  function At(e, t) {
    if (e && e.defaultProps) {
      t = s({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  var Ri = Hn(null), zi = null, il = null, Ho = null;
  function Wo() {
    Ho = il = zi = null;
  }
  function Vo(e) {
    var t = Ri.current;
    ve(Ri), e._currentValue = t;
  }
  function Qo(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function ol(e, t) {
    zi = e, Ho = il = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (ht = !0), e.firstContext = null);
  }
  function Rt(e) {
    var t = e._currentValue;
    if (Ho !== e) if (e = { context: e, memoizedValue: t, next: null }, il === null) {
      if (zi === null) throw Error(y(308));
      il = e, zi.dependencies = { lanes: 0, firstContext: e };
    } else il = il.next = e;
    return t;
  }
  var Cr = null;
  function Ko(e) {
    Cr === null ? Cr = [e] : Cr.push(e);
  }
  function Ta(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Ko(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Sn(e, r);
  }
  function Sn(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Qn = !1;
  function Yo(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Da(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function kn(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Kn(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (te & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Sn(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Ko(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Sn(e, n);
  }
  function Li(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, Vr(e, n);
    }
  }
  function Ma(e, t) {
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
  function Ti(e, t, n, r) {
    var l = e.updateQueue;
    Qn = !1;
    var i = l.firstBaseUpdate, o = l.lastBaseUpdate, a = l.shared.pending;
    if (a !== null) {
      l.shared.pending = null;
      var c = a, h = c.next;
      c.next = null, o === null ? i = h : o.next = h, o = c;
      var x = e.alternate;
      x !== null && (x = x.updateQueue, a = x.lastBaseUpdate, a !== o && (a === null ? x.firstBaseUpdate = h : a.next = h, x.lastBaseUpdate = c));
    }
    if (i !== null) {
      var k = l.baseState;
      o = 0, x = h = c = null, a = i;
      do {
        var w = a.lane, P = a.eventTime;
        if ((r & w) === w) {
          x !== null && (x = x.next = {
            eventTime: P,
            lane: 0,
            tag: a.tag,
            payload: a.payload,
            callback: a.callback,
            next: null
          });
          e: {
            var z = e, T = a;
            switch (w = t, P = n, T.tag) {
              case 1:
                if (z = T.payload, typeof z == "function") {
                  k = z.call(P, k, w);
                  break e;
                }
                k = z;
                break e;
              case 3:
                z.flags = z.flags & -65537 | 128;
              case 0:
                if (z = T.payload, w = typeof z == "function" ? z.call(P, k, w) : z, w == null) break e;
                k = s({}, k, w);
                break e;
              case 2:
                Qn = !0;
            }
          }
          a.callback !== null && a.lane !== 0 && (e.flags |= 64, w = l.effects, w === null ? l.effects = [a] : w.push(a));
        } else P = { eventTime: P, lane: w, tag: a.tag, payload: a.payload, callback: a.callback, next: null }, x === null ? (h = x = P, c = k) : x = x.next = P, o |= w;
        if (a = a.next, a === null) {
          if (a = l.shared.pending, a === null) break;
          w = a, a = w.next, w.next = null, l.lastBaseUpdate = w, l.shared.pending = null;
        }
      } while (!0);
      if (x === null && (c = k), l.baseState = c, l.firstBaseUpdate = h, l.lastBaseUpdate = x, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          o |= l.lane, l = l.next;
        while (l !== t);
      } else i === null && (l.shared.lanes = 0);
      Pr |= o, e.lanes = o, e.memoizedState = k;
    }
  }
  function Ia(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(y(191, l));
        l.call(r);
      }
    }
  }
  var Oa = new E.Component().refs;
  function qo(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : s({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Di = { isMounted: function(e) {
    return (e = e._reactInternals) ? Nt(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = ct(), l = Gn(e), i = kn(r, l);
    i.payload = t, n != null && (i.callback = n), t = Kn(e, i, l), t !== null && ($t(t, e, l, r), Li(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = ct(), l = Gn(e), i = kn(r, l);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Kn(e, i, l), t !== null && ($t(t, e, l, r), Li(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = ct(), r = Gn(e), l = kn(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Kn(e, l, r), t !== null && ($t(t, e, r, n), Li(t, e, r));
  } };
  function Fa(e, t, n, r, l, i, o) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !Al(n, r) || !Al(l, i) : !0;
  }
  function Aa(e, t, n) {
    var r = !1, l = Wn, i = t.contextType;
    return typeof i == "object" && i !== null ? i = Rt(i) : (l = mt(t) ? kr : rt.current, r = t.contextTypes, i = (r = r != null) ? tl(e, l) : Wn), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Di, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function Ba(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Di.enqueueReplaceState(t, t.state, null);
  }
  function Xo(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = Oa, Yo(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? l.context = Rt(i) : (i = mt(t) ? kr : rt.current, l.context = tl(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (qo(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && Di.enqueueReplaceState(l, l.state, null), Ti(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Ql(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(y(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(y(147, e));
        var l = r, i = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(o) {
          var a = l.refs;
          a === Oa && (a = l.refs = {}), o === null ? delete a[i] : a[i] = o;
        }, t._stringRef = i, t);
      }
      if (typeof e != "string") throw Error(y(284));
      if (!n._owner) throw Error(y(290, e));
    }
    return e;
  }
  function Mi(e, t) {
    throw e = Object.prototype.toString.call(t), Error(y(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Ua(e) {
    var t = e._init;
    return t(e._payload);
  }
  function $a(e) {
    function t(p, d) {
      if (e) {
        var m = p.deletions;
        m === null ? (p.deletions = [d], p.flags |= 16) : m.push(d);
      }
    }
    function n(p, d) {
      if (!e) return null;
      for (; d !== null; ) t(p, d), d = d.sibling;
      return null;
    }
    function r(p, d) {
      for (p = /* @__PURE__ */ new Map(); d !== null; ) d.key !== null ? p.set(d.key, d) : p.set(d.index, d), d = d.sibling;
      return p;
    }
    function l(p, d) {
      return p = Jn(p, d), p.index = 0, p.sibling = null, p;
    }
    function i(p, d, m) {
      return p.index = m, e ? (m = p.alternate, m !== null ? (m = m.index, m < d ? (p.flags |= 2, d) : m) : (p.flags |= 2, d)) : (p.flags |= 1048576, d);
    }
    function o(p) {
      return e && p.alternate === null && (p.flags |= 2), p;
    }
    function a(p, d, m, C) {
      return d === null || d.tag !== 6 ? (d = Tu(m, p.mode, C), d.return = p, d) : (d = l(d, m), d.return = p, d);
    }
    function c(p, d, m, C) {
      var M = m.type;
      return M === qe ? x(p, d, m.props.children, C, m.key) : d !== null && (d.elementType === M || typeof M == "object" && M !== null && M.$$typeof === Fe && Ua(M) === d.type) ? (C = l(d, m.props), C.ref = Ql(p, d, m), C.return = p, C) : (C = bi(m.type, m.key, m.props, null, p.mode, C), C.ref = Ql(p, d, m), C.return = p, C);
    }
    function h(p, d, m, C) {
      return d === null || d.tag !== 4 || d.stateNode.containerInfo !== m.containerInfo || d.stateNode.implementation !== m.implementation ? (d = Du(m, p.mode, C), d.return = p, d) : (d = l(d, m.children || []), d.return = p, d);
    }
    function x(p, d, m, C, M) {
      return d === null || d.tag !== 7 ? (d = Tr(m, p.mode, C, M), d.return = p, d) : (d = l(d, m), d.return = p, d);
    }
    function k(p, d, m) {
      if (typeof d == "string" && d !== "" || typeof d == "number") return d = Tu("" + d, p.mode, m), d.return = p, d;
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case Ye:
            return m = bi(d.type, d.key, d.props, null, p.mode, m), m.ref = Ql(p, null, d), m.return = p, m;
          case Se:
            return d = Du(d, p.mode, m), d.return = p, d;
          case Fe:
            var C = d._init;
            return k(p, C(d._payload), m);
        }
        if (Wt(d) || I(d)) return d = Tr(d, p.mode, m, null), d.return = p, d;
        Mi(p, d);
      }
      return null;
    }
    function w(p, d, m, C) {
      var M = d !== null ? d.key : null;
      if (typeof m == "string" && m !== "" || typeof m == "number") return M !== null ? null : a(p, d, "" + m, C);
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case Ye:
            return m.key === M ? c(p, d, m, C) : null;
          case Se:
            return m.key === M ? h(p, d, m, C) : null;
          case Fe:
            return M = m._init, w(
              p,
              d,
              M(m._payload),
              C
            );
        }
        if (Wt(m) || I(m)) return M !== null ? null : x(p, d, m, C, null);
        Mi(p, m);
      }
      return null;
    }
    function P(p, d, m, C, M) {
      if (typeof C == "string" && C !== "" || typeof C == "number") return p = p.get(m) || null, a(d, p, "" + C, M);
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case Ye:
            return p = p.get(C.key === null ? m : C.key) || null, c(d, p, C, M);
          case Se:
            return p = p.get(C.key === null ? m : C.key) || null, h(d, p, C, M);
          case Fe:
            var A = C._init;
            return P(p, d, m, A(C._payload), M);
        }
        if (Wt(C) || I(C)) return p = p.get(m) || null, x(d, p, C, M, null);
        Mi(d, C);
      }
      return null;
    }
    function z(p, d, m, C) {
      for (var M = null, A = null, B = d, $ = d = 0, Qe = null; B !== null && $ < m.length; $++) {
        B.index > $ ? (Qe = B, B = null) : Qe = B.sibling;
        var le = w(p, B, m[$], C);
        if (le === null) {
          B === null && (B = Qe);
          break;
        }
        e && B && le.alternate === null && t(p, B), d = i(le, d, $), A === null ? M = le : A.sibling = le, A = le, B = Qe;
      }
      if ($ === m.length) return n(p, B), we && Er(p, $), M;
      if (B === null) {
        for (; $ < m.length; $++) B = k(p, m[$], C), B !== null && (d = i(B, d, $), A === null ? M = B : A.sibling = B, A = B);
        return we && Er(p, $), M;
      }
      for (B = r(p, B); $ < m.length; $++) Qe = P(B, p, $, m[$], C), Qe !== null && (e && Qe.alternate !== null && B.delete(Qe.key === null ? $ : Qe.key), d = i(Qe, d, $), A === null ? M = Qe : A.sibling = Qe, A = Qe);
      return e && B.forEach(function(bn) {
        return t(p, bn);
      }), we && Er(p, $), M;
    }
    function T(p, d, m, C) {
      var M = I(m);
      if (typeof M != "function") throw Error(y(150));
      if (m = M.call(m), m == null) throw Error(y(151));
      for (var A = M = null, B = d, $ = d = 0, Qe = null, le = m.next(); B !== null && !le.done; $++, le = m.next()) {
        B.index > $ ? (Qe = B, B = null) : Qe = B.sibling;
        var bn = w(p, B, le.value, C);
        if (bn === null) {
          B === null && (B = Qe);
          break;
        }
        e && B && bn.alternate === null && t(p, B), d = i(bn, d, $), A === null ? M = bn : A.sibling = bn, A = bn, B = Qe;
      }
      if (le.done) return n(
        p,
        B
      ), we && Er(p, $), M;
      if (B === null) {
        for (; !le.done; $++, le = m.next()) le = k(p, le.value, C), le !== null && (d = i(le, d, $), A === null ? M = le : A.sibling = le, A = le);
        return we && Er(p, $), M;
      }
      for (B = r(p, B); !le.done; $++, le = m.next()) le = P(B, p, $, le.value, C), le !== null && (e && le.alternate !== null && B.delete(le.key === null ? $ : le.key), d = i(le, d, $), A === null ? M = le : A.sibling = le, A = le);
      return e && B.forEach(function(Fd) {
        return t(p, Fd);
      }), we && Er(p, $), M;
    }
    function ze(p, d, m, C) {
      if (typeof m == "object" && m !== null && m.type === qe && m.key === null && (m = m.props.children), typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case Ye:
            e: {
              for (var M = m.key, A = d; A !== null; ) {
                if (A.key === M) {
                  if (M = m.type, M === qe) {
                    if (A.tag === 7) {
                      n(p, A.sibling), d = l(A, m.props.children), d.return = p, p = d;
                      break e;
                    }
                  } else if (A.elementType === M || typeof M == "object" && M !== null && M.$$typeof === Fe && Ua(M) === A.type) {
                    n(p, A.sibling), d = l(A, m.props), d.ref = Ql(p, A, m), d.return = p, p = d;
                    break e;
                  }
                  n(p, A);
                  break;
                } else t(p, A);
                A = A.sibling;
              }
              m.type === qe ? (d = Tr(m.props.children, p.mode, C, m.key), d.return = p, p = d) : (C = bi(m.type, m.key, m.props, null, p.mode, C), C.ref = Ql(p, d, m), C.return = p, p = C);
            }
            return o(p);
          case Se:
            e: {
              for (A = m.key; d !== null; ) {
                if (d.key === A) if (d.tag === 4 && d.stateNode.containerInfo === m.containerInfo && d.stateNode.implementation === m.implementation) {
                  n(p, d.sibling), d = l(d, m.children || []), d.return = p, p = d;
                  break e;
                } else {
                  n(p, d);
                  break;
                }
                else t(p, d);
                d = d.sibling;
              }
              d = Du(m, p.mode, C), d.return = p, p = d;
            }
            return o(p);
          case Fe:
            return A = m._init, ze(p, d, A(m._payload), C);
        }
        if (Wt(m)) return z(p, d, m, C);
        if (I(m)) return T(p, d, m, C);
        Mi(p, m);
      }
      return typeof m == "string" && m !== "" || typeof m == "number" ? (m = "" + m, d !== null && d.tag === 6 ? (n(p, d.sibling), d = l(d, m), d.return = p, p = d) : (n(p, d), d = Tu(m, p.mode, C), d.return = p, p = d), o(p)) : n(p, d);
    }
    return ze;
  }
  var ul = $a(!0), Ha = $a(!1), Kl = {}, en = Hn(Kl), Yl = Hn(Kl), ql = Hn(Kl);
  function Nr(e) {
    if (e === Kl) throw Error(y(174));
    return e;
  }
  function Go(e, t) {
    switch (fe(ql, t), fe(Yl, e), fe(en, Kl), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : an(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = an(t, e);
    }
    ve(en), fe(en, t);
  }
  function al() {
    ve(en), ve(Yl), ve(ql);
  }
  function Wa(e) {
    Nr(ql.current);
    var t = Nr(en.current), n = an(t, e.type);
    t !== n && (fe(Yl, e), fe(en, n));
  }
  function Zo(e) {
    Yl.current === e && (ve(en), ve(Yl));
  }
  var _e = Hn(0);
  function Ii(e) {
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
  function bo() {
    for (var e = 0; e < Jo.length; e++) Jo[e]._workInProgressVersionPrimary = null;
    Jo.length = 0;
  }
  var Oi = ge.ReactCurrentDispatcher, eu = ge.ReactCurrentBatchConfig, jr = 0, Ee = null, $e = null, We = null, Fi = !1, Xl = !1, Gl = 0, id = 0;
  function lt() {
    throw Error(y(321));
  }
  function tu(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!Ot(e[n], t[n])) return !1;
    return !0;
  }
  function nu(e, t, n, r, l, i) {
    if (jr = i, Ee = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Oi.current = e === null || e.memoizedState === null ? sd : cd, e = n(r, l), Xl) {
      i = 0;
      do {
        if (Xl = !1, Gl = 0, 25 <= i) throw Error(y(301));
        i += 1, We = $e = null, t.updateQueue = null, Oi.current = dd, e = n(r, l);
      } while (Xl);
    }
    if (Oi.current = Ui, t = $e !== null && $e.next !== null, jr = 0, We = $e = Ee = null, Fi = !1, t) throw Error(y(300));
    return e;
  }
  function ru() {
    var e = Gl !== 0;
    return Gl = 0, e;
  }
  function tn() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return We === null ? Ee.memoizedState = We = e : We = We.next = e, We;
  }
  function zt() {
    if ($e === null) {
      var e = Ee.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = $e.next;
    var t = We === null ? Ee.memoizedState : We.next;
    if (t !== null) We = t, $e = e;
    else {
      if (e === null) throw Error(y(310));
      $e = e, e = { memoizedState: $e.memoizedState, baseState: $e.baseState, baseQueue: $e.baseQueue, queue: $e.queue, next: null }, We === null ? Ee.memoizedState = We = e : We = We.next = e;
    }
    return We;
  }
  function Zl(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function lu(e) {
    var t = zt(), n = t.queue;
    if (n === null) throw Error(y(311));
    n.lastRenderedReducer = e;
    var r = $e, l = r.baseQueue, i = n.pending;
    if (i !== null) {
      if (l !== null) {
        var o = l.next;
        l.next = i.next, i.next = o;
      }
      r.baseQueue = l = i, n.pending = null;
    }
    if (l !== null) {
      i = l.next, r = r.baseState;
      var a = o = null, c = null, h = i;
      do {
        var x = h.lane;
        if ((jr & x) === x) c !== null && (c = c.next = { lane: 0, action: h.action, hasEagerState: h.hasEagerState, eagerState: h.eagerState, next: null }), r = h.hasEagerState ? h.eagerState : e(r, h.action);
        else {
          var k = {
            lane: x,
            action: h.action,
            hasEagerState: h.hasEagerState,
            eagerState: h.eagerState,
            next: null
          };
          c === null ? (a = c = k, o = r) : c = c.next = k, Ee.lanes |= x, Pr |= x;
        }
        h = h.next;
      } while (h !== null && h !== i);
      c === null ? o = r : c.next = a, Ot(r, t.memoizedState) || (ht = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = c, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        i = l.lane, Ee.lanes |= i, Pr |= i, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function iu(e) {
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
      Ot(i, t.memoizedState) || (ht = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
    }
    return [i, r];
  }
  function Va() {
  }
  function Qa(e, t) {
    var n = Ee, r = zt(), l = t(), i = !Ot(r.memoizedState, l);
    if (i && (r.memoizedState = l, ht = !0), r = r.queue, ou(qa.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || We !== null && We.memoizedState.tag & 1) {
      if (n.flags |= 2048, Jl(9, Ya.bind(null, n, r, l, t), void 0, null), Ve === null) throw Error(y(349));
      (jr & 30) !== 0 || Ka(n, t, l);
    }
    return l;
  }
  function Ka(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Ee.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Ee.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Ya(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Xa(t) && Ga(e);
  }
  function qa(e, t, n) {
    return n(function() {
      Xa(t) && Ga(e);
    });
  }
  function Xa(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Ot(e, n);
    } catch {
      return !0;
    }
  }
  function Ga(e) {
    var t = Sn(e, 1);
    t !== null && $t(t, e, 1, -1);
  }
  function Za(e) {
    var t = tn();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Zl, lastRenderedState: e }, t.queue = e, e = e.dispatch = ad.bind(null, Ee, e), [t.memoizedState, e];
  }
  function Jl(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Ee.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Ee.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Ja() {
    return zt().memoizedState;
  }
  function Ai(e, t, n, r) {
    var l = tn();
    Ee.flags |= e, l.memoizedState = Jl(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function Bi(e, t, n, r) {
    var l = zt();
    r = r === void 0 ? null : r;
    var i = void 0;
    if ($e !== null) {
      var o = $e.memoizedState;
      if (i = o.destroy, r !== null && tu(r, o.deps)) {
        l.memoizedState = Jl(t, n, i, r);
        return;
      }
    }
    Ee.flags |= e, l.memoizedState = Jl(1 | t, n, i, r);
  }
  function ba(e, t) {
    return Ai(8390656, 8, e, t);
  }
  function ou(e, t) {
    return Bi(2048, 8, e, t);
  }
  function es(e, t) {
    return Bi(4, 2, e, t);
  }
  function ts(e, t) {
    return Bi(4, 4, e, t);
  }
  function ns(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function rs(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Bi(4, 4, ns.bind(null, t, e), n);
  }
  function uu() {
  }
  function ls(e, t) {
    var n = zt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && tu(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function is(e, t) {
    var n = zt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && tu(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function os(e, t, n) {
    return (jr & 21) === 0 ? (e.baseState && (e.baseState = !1, ht = !0), e.memoizedState = n) : (Ot(n, t) || (n = qt(), Ee.lanes |= n, Pr |= n, e.baseState = !0), t);
  }
  function od(e, t) {
    var n = ee;
    ee = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = eu.transition;
    eu.transition = {};
    try {
      e(!1), t();
    } finally {
      ee = n, eu.transition = r;
    }
  }
  function us() {
    return zt().memoizedState;
  }
  function ud(e, t, n) {
    var r = Gn(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, as(e)) ss(t, n);
    else if (n = Ta(e, t, n, r), n !== null) {
      var l = ct();
      $t(n, e, r, l), cs(n, t, r);
    }
  }
  function ad(e, t, n) {
    var r = Gn(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (as(e)) ss(t, l);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var o = t.lastRenderedState, a = i(o, n);
        if (l.hasEagerState = !0, l.eagerState = a, Ot(a, o)) {
          var c = t.interleaved;
          c === null ? (l.next = l, Ko(t)) : (l.next = c.next, c.next = l), t.interleaved = l;
          return;
        }
      } catch {
      }
      n = Ta(e, t, l, r), n !== null && (l = ct(), $t(n, e, r, l), cs(n, t, r));
    }
  }
  function as(e) {
    var t = e.alternate;
    return e === Ee || t !== null && t === Ee;
  }
  function ss(e, t) {
    Xl = Fi = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function cs(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, Vr(e, n);
    }
  }
  var Ui = { readContext: Rt, useCallback: lt, useContext: lt, useEffect: lt, useImperativeHandle: lt, useInsertionEffect: lt, useLayoutEffect: lt, useMemo: lt, useReducer: lt, useRef: lt, useState: lt, useDebugValue: lt, useDeferredValue: lt, useTransition: lt, useMutableSource: lt, useSyncExternalStore: lt, useId: lt, unstable_isNewReconciler: !1 }, sd = { readContext: Rt, useCallback: function(e, t) {
    return tn().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: Rt, useEffect: ba, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Ai(
      4194308,
      4,
      ns.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return Ai(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return Ai(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = tn();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = tn();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = ud.bind(null, Ee, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = tn();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Za, useDebugValue: uu, useDeferredValue: function(e) {
    return tn().memoizedState = e;
  }, useTransition: function() {
    var e = Za(!1), t = e[0];
    return e = od.bind(null, e[1]), tn().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = Ee, l = tn();
    if (we) {
      if (n === void 0) throw Error(y(407));
      n = n();
    } else {
      if (n = t(), Ve === null) throw Error(y(349));
      (jr & 30) !== 0 || Ka(r, t, n);
    }
    l.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return l.queue = i, ba(qa.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, Jl(9, Ya.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = tn(), t = Ve.identifierPrefix;
    if (we) {
      var n = xn, r = wn;
      n = (r & ~(1 << 32 - ut(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Gl++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = id++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, cd = {
    readContext: Rt,
    useCallback: ls,
    useContext: Rt,
    useEffect: ou,
    useImperativeHandle: rs,
    useInsertionEffect: es,
    useLayoutEffect: ts,
    useMemo: is,
    useReducer: lu,
    useRef: Ja,
    useState: function() {
      return lu(Zl);
    },
    useDebugValue: uu,
    useDeferredValue: function(e) {
      var t = zt();
      return os(t, $e.memoizedState, e);
    },
    useTransition: function() {
      var e = lu(Zl)[0], t = zt().memoizedState;
      return [e, t];
    },
    useMutableSource: Va,
    useSyncExternalStore: Qa,
    useId: us,
    unstable_isNewReconciler: !1
  }, dd = { readContext: Rt, useCallback: ls, useContext: Rt, useEffect: ou, useImperativeHandle: rs, useInsertionEffect: es, useLayoutEffect: ts, useMemo: is, useReducer: iu, useRef: Ja, useState: function() {
    return iu(Zl);
  }, useDebugValue: uu, useDeferredValue: function(e) {
    var t = zt();
    return $e === null ? t.memoizedState = e : os(t, $e.memoizedState, e);
  }, useTransition: function() {
    var e = iu(Zl)[0], t = zt().memoizedState;
    return [e, t];
  }, useMutableSource: Va, useSyncExternalStore: Qa, useId: us, unstable_isNewReconciler: !1 };
  function sl(e, t) {
    try {
      var n = "", r = t;
      do
        n += b(r), r = r.return;
      while (r);
      var l = n;
    } catch (i) {
      l = `
Error generating stack: ` + i.message + `
` + i.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function au(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function su(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var fd = typeof WeakMap == "function" ? WeakMap : Map;
  function ds(e, t, n) {
    n = kn(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Yi || (Yi = !0, Eu = r), su(e, t);
    }, n;
  }
  function fs(e, t, n) {
    n = kn(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        su(e, t);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
      su(e, t), typeof r != "function" && (qn === null ? qn = /* @__PURE__ */ new Set([this]) : qn.add(this));
      var o = t.stack;
      this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
    }), n;
  }
  function ps(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new fd();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = Nd.bind(null, e, t, n), t.then(e, e));
  }
  function ms(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function hs(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = kn(-1, 1), t.tag = 2, Kn(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var pd = ge.ReactCurrentOwner, ht = !1;
  function st(e, t, n, r) {
    t.child = e === null ? Ha(t, null, n, r) : ul(t, e.child, n, r);
  }
  function vs(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return ol(t, l), r = nu(e, t, n, r, i, l), n = ru(), e !== null && !ht ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, _n(e, t, l)) : (we && n && Fo(t), t.flags |= 1, st(e, t, r, l), t.child);
  }
  function ys(e, t, n, r, l) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !Lu(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, gs(e, t, i, r, l)) : (e = bi(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & l) === 0) {
      var o = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : Al, n(o, r) && e.ref === t.ref) return _n(e, t, l);
    }
    return t.flags |= 1, e = Jn(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function gs(e, t, n, r, l) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (Al(i, r) && e.ref === t.ref) if (ht = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (ht = !0);
      else return t.lanes = e.lanes, _n(e, t, l);
    }
    return cu(e, t, n, r, l);
  }
  function ws(e, t, n) {
    var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, fe(dl, Ct), Ct |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, fe(dl, Ct), Ct |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, fe(dl, Ct), Ct |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, fe(dl, Ct), Ct |= r;
    return st(e, t, l, n), t.child;
  }
  function xs(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function cu(e, t, n, r, l) {
    var i = mt(n) ? kr : rt.current;
    return i = tl(t, i), ol(t, l), n = nu(e, t, n, r, i, l), r = ru(), e !== null && !ht ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, _n(e, t, l)) : (we && r && Fo(t), t.flags |= 1, st(e, t, n, l), t.child);
  }
  function Ss(e, t, n, r, l) {
    if (mt(n)) {
      var i = !0;
      Ei(t);
    } else i = !1;
    if (ol(t, l), t.stateNode === null) Hi(e, t), Aa(t, n, r), Xo(t, n, r, l), r = !0;
    else if (e === null) {
      var o = t.stateNode, a = t.memoizedProps;
      o.props = a;
      var c = o.context, h = n.contextType;
      typeof h == "object" && h !== null ? h = Rt(h) : (h = mt(n) ? kr : rt.current, h = tl(t, h));
      var x = n.getDerivedStateFromProps, k = typeof x == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      k || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (a !== r || c !== h) && Ba(t, o, r, h), Qn = !1;
      var w = t.memoizedState;
      o.state = w, Ti(t, r, o, l), c = t.memoizedState, a !== r || w !== c || pt.current || Qn ? (typeof x == "function" && (qo(t, n, x, r), c = t.memoizedState), (a = Qn || Fa(t, n, a, r, w, c, h)) ? (k || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = c), o.props = r, o.state = c, o.context = h, r = a) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      o = t.stateNode, Da(e, t), a = t.memoizedProps, h = t.type === t.elementType ? a : At(t.type, a), o.props = h, k = t.pendingProps, w = o.context, c = n.contextType, typeof c == "object" && c !== null ? c = Rt(c) : (c = mt(n) ? kr : rt.current, c = tl(t, c));
      var P = n.getDerivedStateFromProps;
      (x = typeof P == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (a !== k || w !== c) && Ba(t, o, r, c), Qn = !1, w = t.memoizedState, o.state = w, Ti(t, r, o, l);
      var z = t.memoizedState;
      a !== k || w !== z || pt.current || Qn ? (typeof P == "function" && (qo(t, n, P, r), z = t.memoizedState), (h = Qn || Fa(t, n, h, r, w, z, c) || !1) ? (x || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, z, c), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, z, c)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || a === e.memoizedProps && w === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || a === e.memoizedProps && w === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = z), o.props = r, o.state = z, o.context = c, r = h) : (typeof o.componentDidUpdate != "function" || a === e.memoizedProps && w === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || a === e.memoizedProps && w === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return du(e, t, n, r, i, l);
  }
  function du(e, t, n, r, l, i) {
    xs(e, t);
    var o = (t.flags & 128) !== 0;
    if (!r && !o) return l && Ca(t, n, !1), _n(e, t, i);
    r = t.stateNode, pd.current = t;
    var a = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && o ? (t.child = ul(t, e.child, null, i), t.child = ul(t, null, a, i)) : st(e, t, a, i), t.memoizedState = r.state, l && Ca(t, n, !0), t.child;
  }
  function ks(e) {
    var t = e.stateNode;
    t.pendingContext ? _a(e, t.pendingContext, t.pendingContext !== t.context) : t.context && _a(e, t.context, !1), Go(e, t.containerInfo);
  }
  function _s(e, t, n, r, l) {
    return ll(), $o(l), t.flags |= 256, st(e, t, n, r), t.child;
  }
  var fu = { dehydrated: null, treeContext: null, retryLane: 0 };
  function pu(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Es(e, t, n) {
    var r = t.pendingProps, l = _e.current, i = !1, o = (t.flags & 128) !== 0, a;
    if ((a = o) || (a = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), a ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), fe(_e, l & 1), e === null)
      return Uo(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = eo(o, r, 0, null), e = Tr(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = pu(n), t.memoizedState = fu, e) : mu(t, o));
    if (l = e.memoizedState, l !== null && (a = l.dehydrated, a !== null)) return md(e, t, o, r, a, l, n);
    if (i) {
      i = r.fallback, o = t.mode, l = e.child, a = l.sibling;
      var c = { mode: "hidden", children: r.children };
      return (o & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = c, t.deletions = null) : (r = Jn(l, c), r.subtreeFlags = l.subtreeFlags & 14680064), a !== null ? i = Jn(a, i) : (i = Tr(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? pu(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = fu, r;
    }
    return i = e.child, e = i.sibling, r = Jn(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function mu(e, t) {
    return t = eo({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function $i(e, t, n, r) {
    return r !== null && $o(r), ul(t, e.child, null, n), e = mu(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function md(e, t, n, r, l, i, o) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = au(Error(y(422))), $i(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = eo({ mode: "visible", children: r.children }, l, 0, null), i = Tr(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && ul(t, e.child, null, o), t.child.memoizedState = pu(o), t.memoizedState = fu, i);
    if ((t.mode & 1) === 0) return $i(e, t, o, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var a = r.dgst;
      return r = a, i = Error(y(419)), r = au(i, r, void 0), $i(e, t, o, r);
    }
    if (a = (o & e.childLanes) !== 0, ht || a) {
      if (r = Ve, r !== null) {
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
        l = (l & (r.suspendedLanes | o)) !== 0 ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, Sn(e, l), $t(r, e, l, -1));
      }
      return zu(), r = au(Error(y(421))), $i(e, t, o, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = jd.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, Et = $n(l.nextSibling), _t = t, we = !0, Ft = null, e !== null && (jt[Pt++] = wn, jt[Pt++] = xn, jt[Pt++] = _r, wn = e.id, xn = e.overflow, _r = t), t = mu(t, r.children), t.flags |= 4096, t);
  }
  function Cs(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Qo(e.return, t, n);
  }
  function hu(e, t, n, r, l) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = l);
  }
  function Ns(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, i = r.tail;
    if (st(e, t, r.children, n), r = _e.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Cs(e, n, t);
        else if (e.tag === 19) Cs(e, n, t);
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
    if (fe(_e, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && Ii(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), hu(t, !1, l, n, i);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && Ii(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        hu(t, !0, n, null, i);
        break;
      case "together":
        hu(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Hi(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function _n(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), Pr |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(y(153));
    if (t.child !== null) {
      for (e = t.child, n = Jn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Jn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function hd(e, t, n) {
    switch (t.tag) {
      case 3:
        ks(t), ll();
        break;
      case 5:
        Wa(t);
        break;
      case 1:
        mt(t.type) && Ei(t);
        break;
      case 4:
        Go(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        fe(Ri, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (fe(_e, _e.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Es(e, t, n) : (fe(_e, _e.current & 1), e = _n(e, t, n), e !== null ? e.sibling : null);
        fe(_e, _e.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return Ns(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), fe(_e, _e.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, ws(e, t, n);
    }
    return _n(e, t, n);
  }
  var js, vu, Ps, Rs;
  js = function(e, t) {
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
  }, vu = function() {
  }, Ps = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, Nr(en.current);
      var i = null;
      switch (n) {
        case "input":
          l = nr(e, l), r = nr(e, r), i = [];
          break;
        case "select":
          l = s({}, l, { value: void 0 }), r = s({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          l = un(e, l), r = un(e, r), i = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Si);
      }
      ir(n, r);
      var o;
      n = null;
      for (h in l) if (!r.hasOwnProperty(h) && l.hasOwnProperty(h) && l[h] != null) if (h === "style") {
        var a = l[h];
        for (o in a) a.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
      } else h !== "dangerouslySetInnerHTML" && h !== "children" && h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && h !== "autoFocus" && (de.hasOwnProperty(h) ? i || (i = []) : (i = i || []).push(h, null));
      for (h in r) {
        var c = r[h];
        if (a = l?.[h], r.hasOwnProperty(h) && c !== a && (c != null || a != null)) if (h === "style") if (a) {
          for (o in a) !a.hasOwnProperty(o) || c && c.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
          for (o in c) c.hasOwnProperty(o) && a[o] !== c[o] && (n || (n = {}), n[o] = c[o]);
        } else n || (i || (i = []), i.push(
          h,
          n
        )), n = c;
        else h === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, a = a ? a.__html : void 0, c != null && a !== c && (i = i || []).push(h, c)) : h === "children" ? typeof c != "string" && typeof c != "number" || (i = i || []).push(h, "" + c) : h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && (de.hasOwnProperty(h) ? (c != null && h === "onScroll" && he("scroll", e), i || a === c || (i = [])) : (i = i || []).push(h, c));
      }
      n && (i = i || []).push("style", n);
      var h = i;
      (t.updateQueue = h) && (t.flags |= 4);
    }
  }, Rs = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function bl(e, t) {
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
  function it(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function vd(e, t, n) {
    var r = t.pendingProps;
    switch (Ao(t), t.tag) {
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
        return it(t), null;
      case 1:
        return mt(t.type) && _i(), it(t), null;
      case 3:
        return r = t.stateNode, al(), ve(pt), ve(rt), bo(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (Pi(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ft !== null && (ju(Ft), Ft = null))), vu(e, t), it(t), null;
      case 5:
        Zo(t);
        var l = Nr(ql.current);
        if (n = t.type, e !== null && t.stateNode != null) Ps(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(y(166));
            return it(t), null;
          }
          if (e = Nr(en.current), Pi(t)) {
            r = t.stateNode, n = t.type;
            var i = t.memoizedProps;
            switch (r[bt] = t, r[Wl] = i, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                he("cancel", r), he("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                he("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < Ul.length; l++) he(Ul[l], r);
                break;
              case "source":
                he("error", r);
                break;
              case "img":
              case "image":
              case "link":
                he(
                  "error",
                  r
                ), he("load", r);
                break;
              case "details":
                he("toggle", r);
                break;
              case "input":
                Ht(r, i), he("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, he("invalid", r);
                break;
              case "textarea":
                vl(r, i), he("invalid", r);
            }
            ir(n, i), l = null;
            for (var o in i) if (i.hasOwnProperty(o)) {
              var a = i[o];
              o === "children" ? typeof a == "string" ? r.textContent !== a && (i.suppressHydrationWarning !== !0 && xi(r.textContent, a, e), l = ["children", a]) : typeof a == "number" && r.textContent !== "" + a && (i.suppressHydrationWarning !== !0 && xi(
                r.textContent,
                a,
                e
              ), l = ["children", "" + a]) : de.hasOwnProperty(o) && a != null && o === "onScroll" && he("scroll", r);
            }
            switch (n) {
              case "input":
                tr(r), Dt(r, i, !0);
                break;
              case "textarea":
                tr(r), lr(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = Si);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = yl(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[bt] = t, e[Wl] = r, js(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (o = sn(n, r), n) {
                case "dialog":
                  he("cancel", e), he("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  he("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < Ul.length; l++) he(Ul[l], e);
                  l = r;
                  break;
                case "source":
                  he("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  he(
                    "error",
                    e
                  ), he("load", e), l = r;
                  break;
                case "details":
                  he("toggle", e), l = r;
                  break;
                case "input":
                  Ht(e, r), l = nr(e, r), he("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = s({}, r, { value: void 0 }), he("invalid", e);
                  break;
                case "textarea":
                  vl(e, r), l = un(e, r), he("invalid", e);
                  break;
                default:
                  l = r;
              }
              ir(n, l), a = l;
              for (i in a) if (a.hasOwnProperty(i)) {
                var c = a[i];
                i === "style" ? Pn(e, c) : i === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, c != null && Ir(e, c)) : i === "children" ? typeof c == "string" ? (n !== "textarea" || c !== "") && jn(e, c) : typeof c == "number" && jn(e, "" + c) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (de.hasOwnProperty(i) ? c != null && i === "onScroll" && he("scroll", e) : c != null && Ne(e, i, c, o));
              }
              switch (n) {
                case "input":
                  tr(e), Dt(e, r, !1);
                  break;
                case "textarea":
                  tr(e), lr(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + Y(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? on(e, !!r.multiple, i, !1) : r.defaultValue != null && on(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = Si);
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
        return it(t), null;
      case 6:
        if (e && t.stateNode != null) Rs(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(y(166));
          if (n = Nr(ql.current), Nr(en.current), Pi(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[bt] = t, (i = r.nodeValue !== n) && (e = _t, e !== null)) switch (e.tag) {
              case 3:
                xi(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && xi(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            i && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[bt] = t, t.stateNode = r;
        }
        return it(t), null;
      case 13:
        if (ve(_e), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (we && Et !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) La(), ll(), t.flags |= 98560, i = !1;
          else if (i = Pi(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(y(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(y(317));
              i[bt] = t;
            } else ll(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            it(t), i = !1;
          } else Ft !== null && (ju(Ft), Ft = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (_e.current & 1) !== 0 ? He === 0 && (He = 3) : zu())), t.updateQueue !== null && (t.flags |= 4), it(t), null);
      case 4:
        return al(), vu(e, t), e === null && $l(t.stateNode.containerInfo), it(t), null;
      case 10:
        return Vo(t.type._context), it(t), null;
      case 17:
        return mt(t.type) && _i(), it(t), null;
      case 19:
        if (ve(_e), i = t.memoizedState, i === null) return it(t), null;
        if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) bl(i, !1);
        else {
          if (He !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (o = Ii(e), o !== null) {
              for (t.flags |= 128, bl(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return fe(_e, _e.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && pe() > fl && (t.flags |= 128, r = !0, bl(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = Ii(o), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), bl(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !we) return it(t), null;
          } else 2 * pe() - i.renderingStartTime > fl && n !== 1073741824 && (t.flags |= 128, r = !0, bl(i, !1), t.lanes = 4194304);
          i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = pe(), t.sibling = null, n = _e.current, fe(_e, r ? n & 1 | 2 : n & 1), t) : (it(t), null);
      case 22:
      case 23:
        return Ru(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (Ct & 1073741824) !== 0 && (it(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : it(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(y(156, t.tag));
  }
  function yd(e, t) {
    switch (Ao(t), t.tag) {
      case 1:
        return mt(t.type) && _i(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return al(), ve(pt), ve(rt), bo(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Zo(t), null;
      case 13:
        if (ve(_e), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(y(340));
          ll();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return ve(_e), null;
      case 4:
        return al(), null;
      case 10:
        return Vo(t.type._context), null;
      case 22:
      case 23:
        return Ru(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Wi = !1, ot = !1, gd = typeof WeakSet == "function" ? WeakSet : Set, R = null;
  function cl(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      Pe(e, t, r);
    }
    else n.current = null;
  }
  function yu(e, t, n) {
    try {
      n();
    } catch (r) {
      Pe(e, t, r);
    }
  }
  var zs = !1;
  function wd(e, t) {
    if (Ro = hn, e = ua(), So(e)) {
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
          var o = 0, a = -1, c = -1, h = 0, x = 0, k = e, w = null;
          t: for (; ; ) {
            for (var P; k !== n || l !== 0 && k.nodeType !== 3 || (a = o + l), k !== i || r !== 0 && k.nodeType !== 3 || (c = o + r), k.nodeType === 3 && (o += k.nodeValue.length), (P = k.firstChild) !== null; )
              w = k, k = P;
            for (; ; ) {
              if (k === e) break t;
              if (w === n && ++h === l && (a = o), w === i && ++x === r && (c = o), (P = k.nextSibling) !== null) break;
              k = w, w = k.parentNode;
            }
            k = P;
          }
          n = a === -1 || c === -1 ? null : { start: a, end: c };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (zo = { focusedElem: e, selectionRange: n }, hn = !1, R = t; R !== null; ) if (t = R, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, R = e;
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
              var T = z.memoizedProps, ze = z.memoizedState, p = t.stateNode, d = p.getSnapshotBeforeUpdate(t.elementType === t.type ? T : At(t.type, T), ze);
              p.__reactInternalSnapshotBeforeUpdate = d;
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
      } catch (C) {
        Pe(t, t.return, C);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, R = e;
        break;
      }
      R = t.return;
    }
    return z = zs, zs = !1, z;
  }
  function ei(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var i = l.destroy;
          l.destroy = void 0, i !== void 0 && yu(t, n, i);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Vi(e, t) {
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
  function gu(e) {
    var t = e.ref;
    if (t !== null) {
      var n = e.stateNode;
      e.tag, e = n, typeof t == "function" ? t(e) : t.current = e;
    }
  }
  function Ls(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Ls(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[bt], delete t[Wl], delete t[Mo], delete t[td], delete t[nd])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Ts(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Ds(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Ts(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function wu(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Si));
    else if (r !== 4 && (e = e.child, e !== null)) for (wu(e, t, n), e = e.sibling; e !== null; ) wu(e, t, n), e = e.sibling;
  }
  function xu(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (xu(e, t, n), e = e.sibling; e !== null; ) xu(e, t, n), e = e.sibling;
  }
  var Ge = null, Bt = !1;
  function Yn(e, t, n) {
    for (n = n.child; n !== null; ) Ms(e, t, n), n = n.sibling;
  }
  function Ms(e, t, n) {
    if (ft && typeof ft.onCommitFiberUnmount == "function") try {
      ft.onCommitFiberUnmount($r, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        ot || cl(n, t);
      case 6:
        var r = Ge, l = Bt;
        Ge = null, Yn(e, t, n), Ge = r, Bt = l, Ge !== null && (Bt ? (e = Ge, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Ge.removeChild(n.stateNode));
        break;
      case 18:
        Ge !== null && (Bt ? (e = Ge, n = n.stateNode, e.nodeType === 8 ? Do(e.parentNode, n) : e.nodeType === 1 && Do(e, n), gr(e)) : Do(Ge, n.stateNode));
        break;
      case 4:
        r = Ge, l = Bt, Ge = n.stateNode.containerInfo, Bt = !0, Yn(e, t, n), Ge = r, Bt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!ot && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var i = l, o = i.destroy;
            i = i.tag, o !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && yu(n, t, o), l = l.next;
          } while (l !== r);
        }
        Yn(e, t, n);
        break;
      case 1:
        if (!ot && (cl(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (a) {
          Pe(n, t, a);
        }
        Yn(e, t, n);
        break;
      case 21:
        Yn(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (ot = (r = ot) || n.memoizedState !== null, Yn(e, t, n), ot = r) : Yn(e, t, n);
        break;
      default:
        Yn(e, t, n);
    }
  }
  function Is(e) {
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
  function Ut(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e, o = t, a = o;
        e: for (; a !== null; ) {
          switch (a.tag) {
            case 5:
              Ge = a.stateNode, Bt = !1;
              break e;
            case 3:
              Ge = a.stateNode.containerInfo, Bt = !0;
              break e;
            case 4:
              Ge = a.stateNode.containerInfo, Bt = !0;
              break e;
          }
          a = a.return;
        }
        if (Ge === null) throw Error(y(160));
        Ms(i, o, l), Ge = null, Bt = !1;
        var c = l.alternate;
        c !== null && (c.return = null), l.return = null;
      } catch (h) {
        Pe(l, t, h);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Os(t, e), t = t.sibling;
  }
  function Os(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Ut(t, e), nn(e), r & 4) {
          try {
            ei(3, e, e.return), Vi(3, e);
          } catch (T) {
            Pe(e, e.return, T);
          }
          try {
            ei(5, e, e.return);
          } catch (T) {
            Pe(e, e.return, T);
          }
        }
        break;
      case 1:
        Ut(t, e), nn(e), r & 512 && n !== null && cl(n, n.return);
        break;
      case 5:
        if (Ut(t, e), nn(e), r & 512 && n !== null && cl(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            jn(l, "");
          } catch (T) {
            Pe(e, e.return, T);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, a = e.type, c = e.updateQueue;
          if (e.updateQueue = null, c !== null) try {
            a === "input" && i.type === "radio" && i.name != null && Dr(l, i), sn(a, o);
            var h = sn(a, i);
            for (o = 0; o < c.length; o += 2) {
              var x = c[o], k = c[o + 1];
              x === "style" ? Pn(l, k) : x === "dangerouslySetInnerHTML" ? Ir(l, k) : x === "children" ? jn(l, k) : Ne(l, x, k, h);
            }
            switch (a) {
              case "input":
                Mr(l, i);
                break;
              case "textarea":
                Nn(l, i);
                break;
              case "select":
                var w = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var P = i.value;
                P != null ? on(l, !!i.multiple, P, !1) : w !== !!i.multiple && (i.defaultValue != null ? on(
                  l,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : on(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[Wl] = i;
          } catch (T) {
            Pe(e, e.return, T);
          }
        }
        break;
      case 6:
        if (Ut(t, e), nn(e), r & 4) {
          if (e.stateNode === null) throw Error(y(162));
          l = e.stateNode, i = e.memoizedProps;
          try {
            l.nodeValue = i;
          } catch (T) {
            Pe(e, e.return, T);
          }
        }
        break;
      case 3:
        if (Ut(t, e), nn(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          gr(t.containerInfo);
        } catch (T) {
          Pe(e, e.return, T);
        }
        break;
      case 4:
        Ut(t, e), nn(e);
        break;
      case 13:
        Ut(t, e), nn(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (_u = pe())), r & 4 && Is(e);
        break;
      case 22:
        if (x = n !== null && n.memoizedState !== null, e.mode & 1 ? (ot = (h = ot) || x, Ut(t, e), ot = h) : Ut(t, e), nn(e), r & 8192) {
          if (h = e.memoizedState !== null, (e.stateNode.isHidden = h) && !x && (e.mode & 1) !== 0) for (R = e, x = e.child; x !== null; ) {
            for (k = R = x; R !== null; ) {
              switch (w = R, P = w.child, w.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  ei(4, w, w.return);
                  break;
                case 1:
                  cl(w, w.return);
                  var z = w.stateNode;
                  if (typeof z.componentWillUnmount == "function") {
                    r = w, n = w.return;
                    try {
                      t = r, z.props = t.memoizedProps, z.state = t.memoizedState, z.componentWillUnmount();
                    } catch (T) {
                      Pe(r, n, T);
                    }
                  }
                  break;
                case 5:
                  cl(w, w.return);
                  break;
                case 22:
                  if (w.memoizedState !== null) {
                    Bs(k);
                    continue;
                  }
              }
              P !== null ? (P.return = w, R = P) : Bs(k);
            }
            x = x.sibling;
          }
          e: for (x = null, k = e; ; ) {
            if (k.tag === 5) {
              if (x === null) {
                x = k;
                try {
                  l = k.stateNode, h ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (a = k.stateNode, c = k.memoizedProps.style, o = c != null && c.hasOwnProperty("display") ? c.display : null, a.style.display = Or("display", o));
                } catch (T) {
                  Pe(e, e.return, T);
                }
              }
            } else if (k.tag === 6) {
              if (x === null) try {
                k.stateNode.nodeValue = h ? "" : k.memoizedProps;
              } catch (T) {
                Pe(e, e.return, T);
              }
            } else if ((k.tag !== 22 && k.tag !== 23 || k.memoizedState === null || k === e) && k.child !== null) {
              k.child.return = k, k = k.child;
              continue;
            }
            if (k === e) break e;
            for (; k.sibling === null; ) {
              if (k.return === null || k.return === e) break e;
              x === k && (x = null), k = k.return;
            }
            x === k && (x = null), k.sibling.return = k.return, k = k.sibling;
          }
        }
        break;
      case 19:
        Ut(t, e), nn(e), r & 4 && Is(e);
        break;
      case 21:
        break;
      default:
        Ut(
          t,
          e
        ), nn(e);
    }
  }
  function nn(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (Ts(n)) {
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
            r.flags & 32 && (jn(l, ""), r.flags &= -33);
            var i = Ds(e);
            xu(e, i, l);
            break;
          case 3:
          case 4:
            var o = r.stateNode.containerInfo, a = Ds(e);
            wu(e, a, o);
            break;
          default:
            throw Error(y(161));
        }
      } catch (c) {
        Pe(e, e.return, c);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function xd(e, t, n) {
    R = e, Fs(e);
  }
  function Fs(e, t, n) {
    for (var r = (e.mode & 1) !== 0; R !== null; ) {
      var l = R, i = l.child;
      if (l.tag === 22 && r) {
        var o = l.memoizedState !== null || Wi;
        if (!o) {
          var a = l.alternate, c = a !== null && a.memoizedState !== null || ot;
          a = Wi;
          var h = ot;
          if (Wi = o, (ot = c) && !h) for (R = l; R !== null; ) o = R, c = o.child, o.tag === 22 && o.memoizedState !== null ? Us(l) : c !== null ? (c.return = o, R = c) : Us(l);
          for (; i !== null; ) R = i, Fs(i), i = i.sibling;
          R = l, Wi = a, ot = h;
        }
        As(e);
      } else (l.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = l, R = i) : As(e);
    }
  }
  function As(e) {
    for (; R !== null; ) {
      var t = R;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              ot || Vi(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !ot) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : At(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var i = t.updateQueue;
              i !== null && Ia(t, i, r);
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
                Ia(t, o, n);
              }
              break;
            case 5:
              var a = t.stateNode;
              if (n === null && t.flags & 4) {
                n = a;
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
                  var x = h.memoizedState;
                  if (x !== null) {
                    var k = x.dehydrated;
                    k !== null && gr(k);
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
          ot || t.flags & 512 && gu(t);
        } catch (w) {
          Pe(t, t.return, w);
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
  function Bs(e) {
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
  function Us(e) {
    for (; R !== null; ) {
      var t = R;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Vi(4, t);
            } catch (c) {
              Pe(t, n, c);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (c) {
                Pe(t, l, c);
              }
            }
            var i = t.return;
            try {
              gu(t);
            } catch (c) {
              Pe(t, i, c);
            }
            break;
          case 5:
            var o = t.return;
            try {
              gu(t);
            } catch (c) {
              Pe(t, o, c);
            }
        }
      } catch (c) {
        Pe(t, t.return, c);
      }
      if (t === e) {
        R = null;
        break;
      }
      var a = t.sibling;
      if (a !== null) {
        a.return = t.return, R = a;
        break;
      }
      R = t.return;
    }
  }
  var Sd = Math.ceil, Qi = ge.ReactCurrentDispatcher, Su = ge.ReactCurrentOwner, Lt = ge.ReactCurrentBatchConfig, te = 0, Ve = null, Oe = null, Ze = 0, Ct = 0, dl = Hn(0), He = 0, ti = null, Pr = 0, Ki = 0, ku = 0, ni = null, vt = null, _u = 0, fl = 1 / 0, En = null, Yi = !1, Eu = null, qn = null, qi = !1, Xn = null, Xi = 0, ri = 0, Cu = null, Gi = -1, Zi = 0;
  function ct() {
    return (te & 6) !== 0 ? pe() : Gi !== -1 ? Gi : Gi = pe();
  }
  function Gn(e) {
    return (e.mode & 1) === 0 ? 1 : (te & 2) !== 0 && Ze !== 0 ? Ze & -Ze : ld.transition !== null ? (Zi === 0 && (Zi = qt()), Zi) : (e = ee, e !== 0 || (e = window.event, e = e === void 0 ? 16 : pi(e.type)), e);
  }
  function $t(e, t, n, r) {
    if (50 < ri) throw ri = 0, Cu = null, Error(y(185));
    H(e, n, r), ((te & 2) === 0 || e !== Ve) && (e === Ve && ((te & 2) === 0 && (Ki |= n), He === 4 && Zn(e, Ze)), yt(e, r), n === 1 && te === 0 && (t.mode & 1) === 0 && (fl = pe() + 500, Ci && Vn()));
  }
  function yt(e, t) {
    var n = e.callbackNode;
    fr(e, t);
    var r = et(e, e === Ve ? Ze : 0);
    if (r === 0) n !== null && _l(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && _l(n), t === 1) e.tag === 0 ? rd(Hs.bind(null, e)) : Na(Hs.bind(null, e)), bc(function() {
        (te & 6) === 0 && Vn();
      }), n = null;
      else {
        switch (mr(r)) {
          case 1:
            n = On;
            break;
          case 4:
            n = Br;
            break;
          case 16:
            n = fn;
            break;
          case 536870912:
            n = Nl;
            break;
          default:
            n = fn;
        }
        n = Gs(n, $s.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function $s(e, t) {
    if (Gi = -1, Zi = 0, (te & 6) !== 0) throw Error(y(327));
    var n = e.callbackNode;
    if (pl() && e.callbackNode !== n) return null;
    var r = et(e, e === Ve ? Ze : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Ji(e, r);
    else {
      t = r;
      var l = te;
      te |= 2;
      var i = Vs();
      (Ve !== e || Ze !== t) && (En = null, fl = pe() + 500, zr(e, t));
      do
        try {
          Ed();
          break;
        } catch (a) {
          Ws(e, a);
        }
      while (!0);
      Wo(), Qi.current = i, te = l, Oe !== null ? t = 0 : (Ve = null, Ze = 0, t = He);
    }
    if (t !== 0) {
      if (t === 2 && (l = Wr(e), l !== 0 && (r = l, t = Nu(e, l))), t === 1) throw n = ti, zr(e, 0), Zn(e, r), yt(e, pe()), n;
      if (t === 6) Zn(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !kd(l) && (t = Ji(e, r), t === 2 && (i = Wr(e), i !== 0 && (r = i, t = Nu(e, i))), t === 1)) throw n = ti, zr(e, 0), Zn(e, r), yt(e, pe()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(y(345));
          case 2:
            Lr(e, vt, En);
            break;
          case 3:
            if (Zn(e, r), (r & 130023424) === r && (t = _u + 500 - pe(), 10 < t)) {
              if (et(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                ct(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = To(Lr.bind(null, e, vt, En), t);
              break;
            }
            Lr(e, vt, En);
            break;
          case 4:
            if (Zn(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var o = 31 - ut(r);
              i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
            }
            if (r = l, r = pe() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Sd(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = To(Lr.bind(null, e, vt, En), r);
              break;
            }
            Lr(e, vt, En);
            break;
          case 5:
            Lr(e, vt, En);
            break;
          default:
            throw Error(y(329));
        }
      }
    }
    return yt(e, pe()), e.callbackNode === n ? $s.bind(null, e) : null;
  }
  function Nu(e, t) {
    var n = ni;
    return e.current.memoizedState.isDehydrated && (zr(e, t).flags |= 256), e = Ji(e, t), e !== 2 && (t = vt, vt = n, t !== null && ju(t)), e;
  }
  function ju(e) {
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
            if (!Ot(i(), l)) return !1;
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
  function Zn(e, t) {
    for (t &= ~ku, t &= ~Ki, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - ut(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Hs(e) {
    if ((te & 6) !== 0) throw Error(y(327));
    pl();
    var t = et(e, 0);
    if ((t & 1) === 0) return yt(e, pe()), null;
    var n = Ji(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = Wr(e);
      r !== 0 && (t = r, n = Nu(e, r));
    }
    if (n === 1) throw n = ti, zr(e, 0), Zn(e, t), yt(e, pe()), n;
    if (n === 6) throw Error(y(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, Lr(e, vt, En), yt(e, pe()), null;
  }
  function Pu(e, t) {
    var n = te;
    te |= 1;
    try {
      return e(t);
    } finally {
      te = n, te === 0 && (fl = pe() + 500, Ci && Vn());
    }
  }
  function Rr(e) {
    Xn !== null && Xn.tag === 0 && (te & 6) === 0 && pl();
    var t = te;
    te |= 1;
    var n = Lt.transition, r = ee;
    try {
      if (Lt.transition = null, ee = 1, e) return e();
    } finally {
      ee = r, Lt.transition = n, te = t, (te & 6) === 0 && Vn();
    }
  }
  function Ru() {
    Ct = dl.current, ve(dl);
  }
  function zr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Jc(n)), Oe !== null) for (n = Oe.return; n !== null; ) {
      var r = n;
      switch (Ao(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && _i();
          break;
        case 3:
          al(), ve(pt), ve(rt), bo();
          break;
        case 5:
          Zo(r);
          break;
        case 4:
          al();
          break;
        case 13:
          ve(_e);
          break;
        case 19:
          ve(_e);
          break;
        case 10:
          Vo(r.type._context);
          break;
        case 22:
        case 23:
          Ru();
      }
      n = n.return;
    }
    if (Ve = e, Oe = e = Jn(e.current, null), Ze = Ct = t, He = 0, ti = null, ku = Ki = Pr = 0, vt = ni = null, Cr !== null) {
      for (t = 0; t < Cr.length; t++) if (n = Cr[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, i = n.pending;
        if (i !== null) {
          var o = i.next;
          i.next = l, r.next = o;
        }
        n.pending = r;
      }
      Cr = null;
    }
    return e;
  }
  function Ws(e, t) {
    do {
      var n = Oe;
      try {
        if (Wo(), Oi.current = Ui, Fi) {
          for (var r = Ee.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          Fi = !1;
        }
        if (jr = 0, We = $e = Ee = null, Xl = !1, Gl = 0, Su.current = null, n === null || n.return === null) {
          He = 1, ti = t, Oe = null;
          break;
        }
        e: {
          var i = e, o = n.return, a = n, c = t;
          if (t = Ze, a.flags |= 32768, c !== null && typeof c == "object" && typeof c.then == "function") {
            var h = c, x = a, k = x.tag;
            if ((x.mode & 1) === 0 && (k === 0 || k === 11 || k === 15)) {
              var w = x.alternate;
              w ? (x.updateQueue = w.updateQueue, x.memoizedState = w.memoizedState, x.lanes = w.lanes) : (x.updateQueue = null, x.memoizedState = null);
            }
            var P = ms(o);
            if (P !== null) {
              P.flags &= -257, hs(P, o, a, i, t), P.mode & 1 && ps(i, h, t), t = P, c = h;
              var z = t.updateQueue;
              if (z === null) {
                var T = /* @__PURE__ */ new Set();
                T.add(c), t.updateQueue = T;
              } else z.add(c);
              break e;
            } else {
              if ((t & 1) === 0) {
                ps(i, h, t), zu();
                break e;
              }
              c = Error(y(426));
            }
          } else if (we && a.mode & 1) {
            var ze = ms(o);
            if (ze !== null) {
              (ze.flags & 65536) === 0 && (ze.flags |= 256), hs(ze, o, a, i, t), $o(sl(c, a));
              break e;
            }
          }
          i = c = sl(c, a), He !== 4 && (He = 2), ni === null ? ni = [i] : ni.push(i), i = o;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var p = ds(i, c, t);
                Ma(i, p);
                break e;
              case 1:
                a = c;
                var d = i.type, m = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof d.getDerivedStateFromError == "function" || m !== null && typeof m.componentDidCatch == "function" && (qn === null || !qn.has(m)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var C = fs(i, a, t);
                  Ma(i, C);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        Ks(n);
      } catch (M) {
        t = M, Oe === n && n !== null && (Oe = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Vs() {
    var e = Qi.current;
    return Qi.current = Ui, e === null ? Ui : e;
  }
  function zu() {
    (He === 0 || He === 3 || He === 2) && (He = 4), Ve === null || (Pr & 268435455) === 0 && (Ki & 268435455) === 0 || Zn(Ve, Ze);
  }
  function Ji(e, t) {
    var n = te;
    te |= 2;
    var r = Vs();
    (Ve !== e || Ze !== t) && (En = null, zr(e, t));
    do
      try {
        _d();
        break;
      } catch (l) {
        Ws(e, l);
      }
    while (!0);
    if (Wo(), te = n, Qi.current = r, Oe !== null) throw Error(y(261));
    return Ve = null, Ze = 0, He;
  }
  function _d() {
    for (; Oe !== null; ) Qs(Oe);
  }
  function Ed() {
    for (; Oe !== null && !El(); ) Qs(Oe);
  }
  function Qs(e) {
    var t = Xs(e.alternate, e, Ct);
    e.memoizedProps = e.pendingProps, t === null ? Ks(e) : Oe = t, Su.current = null;
  }
  function Ks(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = vd(n, t, Ct), n !== null) {
          Oe = n;
          return;
        }
      } else {
        if (n = yd(n, t), n !== null) {
          n.flags &= 32767, Oe = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          He = 6, Oe = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Oe = t;
        return;
      }
      Oe = t = e;
    } while (t !== null);
    He === 0 && (He = 5);
  }
  function Lr(e, t, n) {
    var r = ee, l = Lt.transition;
    try {
      Lt.transition = null, ee = 1, Cd(e, t, n, r);
    } finally {
      Lt.transition = l, ee = r;
    }
    return null;
  }
  function Cd(e, t, n, r) {
    do
      pl();
    while (Xn !== null);
    if ((te & 6) !== 0) throw Error(y(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(y(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = n.lanes | n.childLanes;
    if (pr(e, i), e === Ve && (Oe = Ve = null, Ze = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || qi || (qi = !0, Gs(fn, function() {
      return pl(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = Lt.transition, Lt.transition = null;
      var o = ee;
      ee = 1;
      var a = te;
      te |= 4, Su.current = null, wd(e, n), Os(n, e), Qc(zo), hn = !!Ro, zo = Ro = null, e.current = n, xd(n), Cl(), te = a, ee = o, Lt.transition = i;
    } else e.current = n;
    if (qi && (qi = !1, Xn = e, Xi = l), i = e.pendingLanes, i === 0 && (qn = null), jl(n.stateNode), yt(e, pe()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Yi) throw Yi = !1, e = Eu, Eu = null, e;
    return (Xi & 1) !== 0 && e.tag !== 0 && pl(), i = e.pendingLanes, (i & 1) !== 0 ? e === Cu ? ri++ : (ri = 0, Cu = e) : ri = 0, Vn(), null;
  }
  function pl() {
    if (Xn !== null) {
      var e = mr(Xi), t = Lt.transition, n = ee;
      try {
        if (Lt.transition = null, ee = 16 > e ? 16 : e, Xn === null) var r = !1;
        else {
          if (e = Xn, Xn = null, Xi = 0, (te & 6) !== 0) throw Error(y(331));
          var l = te;
          for (te |= 4, R = e.current; R !== null; ) {
            var i = R, o = i.child;
            if ((R.flags & 16) !== 0) {
              var a = i.deletions;
              if (a !== null) {
                for (var c = 0; c < a.length; c++) {
                  var h = a[c];
                  for (R = h; R !== null; ) {
                    var x = R;
                    switch (x.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ei(8, x, i);
                    }
                    var k = x.child;
                    if (k !== null) k.return = x, R = k;
                    else for (; R !== null; ) {
                      x = R;
                      var w = x.sibling, P = x.return;
                      if (Ls(x), x === h) {
                        R = null;
                        break;
                      }
                      if (w !== null) {
                        w.return = P, R = w;
                        break;
                      }
                      R = P;
                    }
                  }
                }
                var z = i.alternate;
                if (z !== null) {
                  var T = z.child;
                  if (T !== null) {
                    z.child = null;
                    do {
                      var ze = T.sibling;
                      T.sibling = null, T = ze;
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
                  ei(9, i, i.return);
              }
              var p = i.sibling;
              if (p !== null) {
                p.return = i.return, R = p;
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
              if (a = R, (a.flags & 2048) !== 0) try {
                switch (a.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Vi(9, a);
                }
              } catch (M) {
                Pe(a, a.return, M);
              }
              if (a === o) {
                R = null;
                break e;
              }
              var C = a.sibling;
              if (C !== null) {
                C.return = a.return, R = C;
                break e;
              }
              R = a.return;
            }
          }
          if (te = l, Vn(), ft && typeof ft.onPostCommitFiberRoot == "function") try {
            ft.onPostCommitFiberRoot($r, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        ee = n, Lt.transition = t;
      }
    }
    return !1;
  }
  function Ys(e, t, n) {
    t = sl(n, t), t = ds(e, t, 1), e = Kn(e, t, 1), t = ct(), e !== null && (H(e, 1, t), yt(e, t));
  }
  function Pe(e, t, n) {
    if (e.tag === 3) Ys(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Ys(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (qn === null || !qn.has(r))) {
          e = sl(n, e), e = fs(t, e, 1), t = Kn(t, e, 1), e = ct(), t !== null && (H(t, 1, e), yt(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Nd(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = ct(), e.pingedLanes |= e.suspendedLanes & n, Ve === e && (Ze & n) === n && (He === 4 || He === 3 && (Ze & 130023424) === Ze && 500 > pe() - _u ? zr(e, 0) : ku |= n), yt(e, t);
  }
  function qs(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = dr, dr <<= 1, (dr & 130023424) === 0 && (dr = 4194304)));
    var n = ct();
    e = Sn(e, t), e !== null && (H(e, t, n), yt(e, n));
  }
  function jd(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), qs(e, n);
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
    r !== null && r.delete(t), qs(e, n);
  }
  var Xs;
  Xs = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || pt.current) ht = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return ht = !1, hd(e, t, n);
      ht = (e.flags & 131072) !== 0;
    }
    else ht = !1, we && (t.flags & 1048576) !== 0 && ja(t, ji, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Hi(e, t), e = t.pendingProps;
        var l = tl(t, rt.current);
        ol(t, n), l = nu(null, t, r, e, l, n);
        var i = ru();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, mt(r) ? (i = !0, Ei(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Yo(t), l.updater = Di, t.stateNode = l, l._reactInternals = t, Xo(t, r, e, n), t = du(null, t, r, !0, i, n)) : (t.tag = 0, we && i && Fo(t), st(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Hi(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = zd(r), e = At(r, e), l) {
            case 0:
              t = cu(null, t, r, e, n);
              break e;
            case 1:
              t = Ss(null, t, r, e, n);
              break e;
            case 11:
              t = vs(null, t, r, e, n);
              break e;
            case 14:
              t = ys(null, t, r, At(r.type, e), n);
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
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : At(r, l), cu(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : At(r, l), Ss(e, t, r, l, n);
      case 3:
        e: {
          if (ks(t), e === null) throw Error(y(387));
          r = t.pendingProps, i = t.memoizedState, l = i.element, Da(e, t), Ti(t, r, null, n);
          var o = t.memoizedState;
          if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            l = sl(Error(y(423)), t), t = _s(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = sl(Error(y(424)), t), t = _s(e, t, r, n, l);
            break e;
          } else for (Et = $n(t.stateNode.containerInfo.firstChild), _t = t, we = !0, Ft = null, n = Ha(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (ll(), r === l) {
              t = _n(e, t, n);
              break e;
            }
            st(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Wa(t), e === null && Uo(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, Lo(r, l) ? o = null : i !== null && Lo(r, i) && (t.flags |= 32), xs(e, t), st(e, t, o, n), t.child;
      case 6:
        return e === null && Uo(t), null;
      case 13:
        return Es(e, t, n);
      case 4:
        return Go(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = ul(t, null, r, n) : st(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : At(r, l), vs(e, t, r, l, n);
      case 7:
        return st(e, t, t.pendingProps, n), t.child;
      case 8:
        return st(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return st(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, fe(Ri, r._currentValue), r._currentValue = o, i !== null) if (Ot(i.value, o)) {
            if (i.children === l.children && !pt.current) {
              t = _n(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var a = i.dependencies;
            if (a !== null) {
              o = i.child;
              for (var c = a.firstContext; c !== null; ) {
                if (c.context === r) {
                  if (i.tag === 1) {
                    c = kn(-1, n & -n), c.tag = 2;
                    var h = i.updateQueue;
                    if (h !== null) {
                      h = h.shared;
                      var x = h.pending;
                      x === null ? c.next = c : (c.next = x.next, x.next = c), h.pending = c;
                    }
                  }
                  i.lanes |= n, c = i.alternate, c !== null && (c.lanes |= n), Qo(
                    i.return,
                    n,
                    t
                  ), a.lanes |= n;
                  break;
                }
                c = c.next;
              }
            } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (o = i.return, o === null) throw Error(y(341));
              o.lanes |= n, a = o.alternate, a !== null && (a.lanes |= n), Qo(o, n, t), o = i.sibling;
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
          st(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, ol(t, n), l = Rt(l), r = r(l), t.flags |= 1, st(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = At(r, t.pendingProps), l = At(r.type, l), ys(e, t, r, l, n);
      case 15:
        return gs(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : At(r, l), Hi(e, t), t.tag = 1, mt(r) ? (e = !0, Ei(t)) : e = !1, ol(t, n), Aa(t, r, l), Xo(t, r, l, n), du(null, t, r, !0, e, n);
      case 19:
        return Ns(e, t, n);
      case 22:
        return ws(e, t, n);
    }
    throw Error(y(156, t.tag));
  };
  function Gs(e, t) {
    return Ar(e, t);
  }
  function Rd(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Tt(e, t, n, r) {
    return new Rd(e, t, n, r);
  }
  function Lu(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function zd(e) {
    if (typeof e == "function") return Lu(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === be) return 11;
      if (e === Re) return 14;
    }
    return 2;
  }
  function Jn(e, t) {
    var n = e.alternate;
    return n === null ? (n = Tt(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function bi(e, t, n, r, l, i) {
    var o = 2;
    if (r = e, typeof e == "function") Lu(e) && (o = 1);
    else if (typeof e == "string") o = 5;
    else e: switch (e) {
      case qe:
        return Tr(n.children, l, i, t);
      case ce:
        o = 8, l |= 8;
        break;
      case Le:
        return e = Tt(12, n, t, l | 2), e.elementType = Le, e.lanes = i, e;
      case Te:
        return e = Tt(13, n, t, l), e.elementType = Te, e.lanes = i, e;
      case De:
        return e = Tt(19, n, t, l), e.elementType = De, e.lanes = i, e;
      case re:
        return eo(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case wt:
            o = 10;
            break e;
          case ln:
            o = 9;
            break e;
          case be:
            o = 11;
            break e;
          case Re:
            o = 14;
            break e;
          case Fe:
            o = 16, r = null;
            break e;
        }
        throw Error(y(130, e == null ? e : typeof e, ""));
    }
    return t = Tt(o, n, t, l), t.elementType = e, t.type = r, t.lanes = i, t;
  }
  function Tr(e, t, n, r) {
    return e = Tt(7, e, r, t), e.lanes = n, e;
  }
  function eo(e, t, n, r) {
    return e = Tt(22, e, r, t), e.elementType = re, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Tu(e, t, n) {
    return e = Tt(6, e, null, t), e.lanes = n, e;
  }
  function Du(e, t, n) {
    return t = Tt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Ld(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Xt(0), this.expirationTimes = Xt(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Xt(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Mu(e, t, n, r, l, i, o, a, c) {
    return e = new Ld(e, t, n, a, c), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = Tt(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Yo(i), e;
  }
  function Td(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Se, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Zs(e) {
    if (!e) return Wn;
    e = e._reactInternals;
    e: {
      if (Nt(e) !== e || e.tag !== 1) throw Error(y(170));
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
      if (mt(n)) return Ea(e, n, t);
    }
    return t;
  }
  function Js(e, t, n, r, l, i, o, a, c) {
    return e = Mu(n, r, !0, e, l, i, o, a, c), e.context = Zs(null), n = e.current, r = ct(), l = Gn(n), i = kn(r, l), i.callback = t ?? null, Kn(n, i, l), e.current.lanes = l, H(e, l, r), yt(e, r), e;
  }
  function to(e, t, n, r) {
    var l = t.current, i = ct(), o = Gn(l);
    return n = Zs(n), t.context === null ? t.context = n : t.pendingContext = n, t = kn(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Kn(l, t, o), e !== null && ($t(e, l, o, i), Li(e, l, o)), o;
  }
  function no(e) {
    return e = e.current, e.child ? (e.child.tag === 5, e.child.stateNode) : null;
  }
  function bs(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Iu(e, t) {
    bs(e, t), (e = e.alternate) && bs(e, t);
  }
  function Dd() {
    return null;
  }
  var ec = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Ou(e) {
    this._internalRoot = e;
  }
  ro.prototype.render = Ou.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(y(409));
    to(e, t, null, null);
  }, ro.prototype.unmount = Ou.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Rr(function() {
        to(null, e, null, null);
      }), t[yn] = null;
    }
  };
  function ro(e) {
    this._internalRoot = e;
  }
  ro.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Xe();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < It.length && t !== 0 && t < It[n].priority; n++) ;
      It.splice(n, 0, e), n === 0 && di(e);
    }
  };
  function Fu(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function lo(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function tc() {
  }
  function Md(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var h = no(o);
          i.call(h);
        };
      }
      var o = Js(t, r, e, 0, null, !1, !1, "", tc);
      return e._reactRootContainer = o, e[yn] = o.current, $l(e.nodeType === 8 ? e.parentNode : e), Rr(), o;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var a = r;
      r = function() {
        var h = no(c);
        a.call(h);
      };
    }
    var c = Mu(e, 0, !1, null, null, !1, !1, "", tc);
    return e._reactRootContainer = c, e[yn] = c.current, $l(e.nodeType === 8 ? e.parentNode : e), Rr(function() {
      to(t, c, n, r);
    }), c;
  }
  function io(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
      var o = i;
      if (typeof l == "function") {
        var a = l;
        l = function() {
          var c = no(o);
          a.call(c);
        };
      }
      to(t, o, e, l);
    } else o = Md(n, t, e, l, r);
    return no(o);
  }
  hr = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Fn(t.pendingLanes);
          n !== 0 && (Vr(t, n | 1), yt(t, pe()), (te & 6) === 0 && (fl = pe() + 500, Vn()));
        }
        break;
      case 13:
        Rr(function() {
          var r = Sn(e, 1);
          if (r !== null) {
            var l = ct();
            $t(r, e, 1, l);
          }
        }), Iu(e, 1);
    }
  }, Gt = function(e) {
    if (e.tag === 13) {
      var t = Sn(e, 134217728);
      if (t !== null) {
        var n = ct();
        $t(t, e, 134217728, n);
      }
      Iu(e, 134217728);
    }
  }, vr = function(e) {
    if (e.tag === 13) {
      var t = Gn(e), n = Sn(e, t);
      if (n !== null) {
        var r = ct();
        $t(n, e, t, r);
      }
      Iu(e, t);
    }
  }, Xe = function() {
    return ee;
  }, Rl = function(e, t) {
    var n = ee;
    try {
      return ee = e, t();
    } finally {
      ee = n;
    }
  }, kt = function(e, t, n) {
    switch (t) {
      case "input":
        if (Mr(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = ki(r);
              if (!l) throw Error(y(90));
              Cn(r), Mr(r, l);
            }
          }
        }
        break;
      case "textarea":
        Nn(e, n);
        break;
      case "select":
        t = n.value, t != null && on(e, !!n.multiple, t, !1);
    }
  }, Be = Pu, Rn = Rr;
  var Id = { usingClientEntryPoint: !1, Events: [Vl, br, ki, Kt, xl, Pu] }, li = { findFiberByHostInstance: Sr, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" }, Od = { bundleType: li.bundleType, version: li.version, rendererPackageName: li.rendererPackageName, rendererConfig: li.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ge.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = kl(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: li.findFiberByHostInstance || Dd, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var oo = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!oo.isDisabled && oo.supportsFiber) try {
      $r = oo.inject(Od), ft = oo;
    } catch {
    }
  }
  return gt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Id, gt.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Fu(t)) throw Error(y(200));
    return Td(e, t, null, n);
  }, gt.createRoot = function(e, t) {
    if (!Fu(e)) throw Error(y(299));
    var n = !1, r = "", l = ec;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Mu(e, 1, !1, null, null, n, !1, r, l), e[yn] = t.current, $l(e.nodeType === 8 ? e.parentNode : e), new Ou(t);
  }, gt.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(y(188)) : (e = Object.keys(e).join(","), Error(y(268, e)));
    return e = kl(t), e = e === null ? null : e.stateNode, e;
  }, gt.flushSync = function(e) {
    return Rr(e);
  }, gt.hydrate = function(e, t, n) {
    if (!lo(t)) throw Error(y(200));
    return io(null, e, t, !0, n);
  }, gt.hydrateRoot = function(e, t, n) {
    if (!Fu(e)) throw Error(y(405));
    var r = n != null && n.hydratedSources || null, l = !1, i = "", o = ec;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = Js(t, null, e, 1, n ?? null, l, !1, i, o), e[yn] = t.current, $l(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new ro(t);
  }, gt.render = function(e, t, n) {
    if (!lo(t)) throw Error(y(200));
    return io(null, e, t, !1, n);
  }, gt.unmountComponentAtNode = function(e) {
    if (!lo(e)) throw Error(y(40));
    return e._reactRootContainer ? (Rr(function() {
      io(null, null, e, !1, function() {
        e._reactRootContainer = null, e[yn] = null;
      });
    }), !0) : !1;
  }, gt.unstable_batchedUpdates = Pu, gt.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!lo(n)) throw Error(y(200));
    if (e == null || e._reactInternals === void 0) throw Error(y(38));
    return io(e, t, n, !1, r);
  }, gt.version = "18.2.0-next-9e3b772b8-20220608", gt;
}
var sc;
function Vd() {
  if (sc) return Uu.exports;
  sc = 1;
  function E() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(E);
      } catch (W) {
        console.error(W);
      }
  }
  return E(), Uu.exports = Wd(), Uu.exports;
}
var cc;
function Qd() {
  if (cc) return uo;
  cc = 1;
  var E = Vd();
  return uo.createRoot = E.createRoot, uo.hydrateRoot = E.hydrateRoot, uo;
}
var Kd = Qd();
var Yd = {
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
const qd = (E) => E.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().trim(), er = (E, W) => {
  const y = S.forwardRef(
    ({
      color: xe = "currentColor",
      size: de = 24,
      strokeWidth: X = 2,
      absoluteStrokeWidth: ae,
      className: G = "",
      children: Z,
      ...ye
    }, Ce) => S.createElement(
      "svg",
      {
        ref: Ce,
        ...Yd,
        width: de,
        height: de,
        stroke: xe,
        strokeWidth: ae ? Number(X) * 24 / Number(de) : X,
        className: ["lucide", `lucide-${qd(E)}`, G].join(" "),
        ...ye
      },
      [
        ...W.map(([se, F]) => S.createElement(se, F)),
        ...Array.isArray(Z) ? Z : [Z]
      ]
    )
  );
  return y.displayName = `${E}`, y;
};
const Xd = er("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Gd = er("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
const Zd = er("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
const Jd = er("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
const ao = er("Music2", [
  ["circle", { cx: "8", cy: "18", r: "4", key: "1fc0mg" }],
  ["path", { d: "M12 18V2l7 4", key: "g04rme" }]
]);
const bd = er("Play", [
  ["polygon", { points: "5 3 19 12 5 21 5 3", key: "191637" }]
]);
const ef = er("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
const tf = er("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
function nf(E) {
  const W = E?.attributes.queue;
  return W && typeof W == "object" ? W : void 0;
}
function rf(E) {
  return E?.status === "playing" || E?.status === "paused" || E?.status === "failed";
}
function dc(E) {
  if (typeof E != "number" || !Number.isFinite(E) || E < 0) return "Time unavailable";
  const W = Math.floor(E);
  return `${Math.floor(W / 60)}:${String(W % 60).padStart(2, "0")}`;
}
function ml(E) {
  return E.entity_id.startsWith("media_player.") && typeof E.attributes.bluetooth_address == "string" && /^(?:[0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(E.attributes.bluetooth_address) && typeof E.attributes.adapter == "string" && E.attributes.adapter.trim().length > 0 && ["idle", "playing", "paused"].includes(E.state);
}
function rn(E) {
  return typeof E.attributes.friendly_name == "string" ? E.attributes.friendly_name : E.entity_id;
}
function lf(E) {
  return E.kind === "custom";
}
function Wu(E) {
  return E.kind === "provider";
}
function fc(E) {
  return E.media_class?.toLowerCase() === "playlist" || E.media_content_type.toLowerCase().includes("playlist");
}
function pc(E) {
  if (!(!E?.startsWith("/") || E.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(E)))
    try {
      const W = "https://ha.invalid", y = new URL(E, W);
      if (y.origin !== W || y.protocol !== "https:" || y.username || y.password) return;
      const xe = `${y.pathname}${y.search}${y.hash}`;
      return xe.startsWith("//") ? void 0 : xe;
    } catch {
      return;
    }
}
const of = "Your Home Assistant session cannot access this media source. Reconnect or ask an administrator for access, then try again.", uf = "This source cannot play audio on a BL-HAOS speaker. Choose an audio item or provider playlist.";
function af({ hass: E, initialView: W = "library" }) {
  const y = S.useRef(W), [xe, de] = S.useState(W), [X, ae] = S.useState(), [G, Z] = S.useState(!1), [ye, Ce] = S.useState(""), [se, F] = S.useState(""), [ie, Ke] = S.useState(!1), [Q, ne] = S.useState(), [dt, Je] = S.useState(""), [Ne, ge] = S.useState([]), [Ye, Se] = S.useState([]), [qe, ce] = S.useState(""), [Le, wt] = S.useState(!1), [ln, be] = S.useState(!1), [Te, De] = S.useState(!1), [Re, Fe] = S.useState(), [re, j] = S.useState(), [I, s] = S.useState(!1), [g, D] = S.useState(), [U, V] = S.useState(""), [b, K] = S.useState({}), [ue, Y] = S.useState(""), [ke, hl] = S.useState(""), [tr, Cn] = S.useState(""), [xt, nr] = S.useState(""), [Ht, Dr] = S.useState(() => /* @__PURE__ */ new Set()), [Mr, Dt] = S.useState({}), [rr, Wt] = S.useState(""), [on, un] = S.useState(""), vl = S.useRef(null), [Nn, lr] = S.useState(""), [yl, an] = S.useState(""), [Vt, Ir] = S.useState(!1), [jn, St] = S.useState(""), [oi, Or] = S.useState({}), [Pn, gl] = S.useState(() => /* @__PURE__ */ new Set()), ir = S.useRef(null), sn = S.useRef(""), [Me, or] = S.useState(), [kt, Qt] = S.useState([]), [Ae, wl] = S.useState(""), [Kt, xl] = S.useState(""), [Be, Rn] = S.useState(!1), [Ie, Fr] = S.useState(!1), [zn, Ln] = S.useState(""), [Tn, cn] = S.useState(""), [ur, Yt] = S.useState(""), [dn, Dn] = S.useState(""), [so, Sl] = S.useState(!1), [ar, Nt] = S.useState(), [Mn, In] = S.useState(), [co, kl] = S.useState(), sr = S.useRef(""), Ar = S.useRef(!1), _l = S.useRef(null), El = S.useRef(/* @__PURE__ */ new Map()), Cl = S.useRef(/* @__PURE__ */ new Map()), pe = S.useRef(/* @__PURE__ */ new Map()), ui = S.useRef(/* @__PURE__ */ new Map()), On = S.useRef(/* @__PURE__ */ new Map()), Br = S.useRef(/* @__PURE__ */ new Map()), fn = S.useRef(), Ur = S.useRef(), Nl = S.useRef(null), $r = S.useRef(null), ft = S.useRef(null), jl = S.useRef(null), ut = S.useRef(null), Pl = S.useRef(null), ai = S.useRef(null), si = S.useRef(null), cr = S.useRef(null), dr = S.useRef(null), Fn = S.useRef(null), et = S.useRef(null), Hr = S.useRef(!1), fr = S.useRef({ name: "", entries: [] }), Wr = S.useRef(null), qt = S.useRef(0), Xt = S.useRef(0), H = S.useRef(0), pr = S.useRef(""), Vr = S.useRef(0), ee = S.useRef(!1), mr = S.useRef(/* @__PURE__ */ new Set()), hr = S.useRef(/* @__PURE__ */ new Set()), Gt = S.useRef(0), vr = S.useRef(!1), Xe = S.useRef(E);
  Xe.current = E;
  const Rl = E?.connection, Qr = E?.user?.id, J = !!(Rl?.connected && Qr), Mt = Object.values(E?.states ?? {}).filter(ml), tt = E?.states[Ae], je = J && tt !== void 0 && ml(tt), me = nf(tt);
  async function pn() {
    const u = Xe.current;
    if (!u?.connection.connected || !u.user?.id) {
      Z(!1);
      return;
    }
    const v = ++Xt.current;
    Z(!0), Ce("");
    try {
      const N = await u.callWS({ type: "bl_haos/playlist_library/list" });
      Xt.current === v && ae(N);
    } catch {
      Xt.current === v && Ce("Couldn't load your library. Reconnect Home Assistant, then select Retry loading.");
    } finally {
      Xt.current === v && Z(!1);
    }
  }
  function It(u) {
    return Pn.has(u) ? "Checking availability..." : oi[u] === "available" ? "Available in Home Assistant" : oi[u] === "unavailable" ? "Unavailable in Home Assistant." : "Not checked";
  }
  async function ci(u, v) {
    const N = Xe.current;
    if (!N?.connection.connected || !N.user?.id || !v.startsWith("media-source://") || hr.current.has(u)) return;
    const _ = H.current;
    hr.current.add(u), gl((L) => new Set(L).add(u)), F("Checking availability...");
    try {
      if (await N.callWS({ type: "media_source/browse_media", media_content_id: v }), H.current !== _) return;
      Or((L) => ({ ...L, [u]: "available" })), F("Available in Home Assistant.");
    } catch {
      if (H.current !== _) return;
      Or((L) => ({ ...L, [u]: "unavailable" })), F("Unavailable in Home Assistant.");
    } finally {
      H.current === _ && (hr.current.delete(u), gl((L) => {
        const O = new Set(L);
        return O.delete(u), O;
      }));
    }
  }
  S.useLayoutEffect(() => {
    const u = Xe.current;
    if (H.current++, ++qt.current, Xt.current++, Gt.current++, vr.current = !1, or(void 0), Qt([]), de(y.current), ae(void 0), Ce(""), F(""), Ke(!1), ne(void 0), Je(""), ge([]), Se([]), ce(""), wt(!1), be(!1), De(!1), Fe(void 0), j(void 0), s(!1), D(void 0), V(""), K({}), Y(""), hl(""), Cn(""), nr(""), Dr(/* @__PURE__ */ new Set()), mr.current.clear(), Dt({}), lr(""), an(""), Ir(!1), St(""), Or({}), gl(/* @__PURE__ */ new Set()), hr.current.clear(), Wt(""), un(""), sn.current = "", pr.current = "", wl(""), xl(""), Fr(!1), Yt(""), Nt(void 0), In(void 0), kl(void 0), Dn(""), Sl(!1), Rn(J), Ln(""), cn(""), !(!u || !J))
      return Rn(!1), y.current === "browse" ? Zt({ path: [] }, !0) : pn(), () => {
        H.current++, qt.current++, Xt.current++, Gt.current++;
      };
  }, [Rl, Qr, J]), S.useLayoutEffect(() => {
    sr.current ? (El.current.get(sr.current)?.focus(), sr.current = "") : Ar.current && (_l.current?.focus(), Ar.current = !1);
  }, [Me]), S.useLayoutEffect(() => {
    const u = fn.current;
    if (!u) return;
    fn.current = void 0;
    const v = Br.current.get(u.key);
    u.action === "down" && v?.down && !v.down.disabled ? v.down.focus() : u.action === "up" && v?.up && !v.up.disabled ? v.up.focus() : v?.remove ? v.remove.focus() : Wr.current?.focus();
  }, [Ye]), S.useLayoutEffect(() => {
    const u = g ? Pl.current : Re ? ft.current : re ? jl.current : I ? ut.current : void 0, v = [ft.current, jl.current, ut.current, Pl.current];
    u && !u.open && (typeof u.showModal == "function" ? u.showModal() : u.setAttribute("open", ""));
    for (const N of v)
      !N?.open || N === u || (typeof N.close == "function" ? N.close() : N.removeAttribute("open"));
  }, [Re, re, I, g]), S.useLayoutEffect(() => {
    !ee.current || I || ie || Q || (ee.current = !1, et.current?.isConnected && et.current.click());
  }, [I, ie, Q]), S.useLayoutEffect(() => {
    g ? dr.current?.focus() : Re ? ai.current?.focus() : re ? si.current?.focus() : I ? cr.current?.focus() : et.current?.isConnected && et.current.focus(), !Re && !re && !I && !g && (et.current = null);
  }, [Re, re, I, g]), S.useLayoutEffect(() => {
    const u = Ur.current;
    u && (Ur.current = void 0, u === "create" ? Nl.current?.focus() : Cl.current.get(u)?.focus());
  }, [X, ie, Q, Re, I]), S.useLayoutEffect(() => {
    if (rr && vl.current?.focus(), Nn) {
      ir.current?.focus();
      return;
    }
    const u = sn.current;
    u && (sn.current = "", pe.current.get(u)?.focus());
  }, [rr, Nn, X]);
  async function Zt(u, v = !1) {
    const N = Xe.current, { item: _, path: L, query: O } = u;
    if (!N?.connection.connected || !N.user?.id || Ie && !v || _ && (!_.media_content_id.startsWith("media-source://") || (O === void 0 ? !_.can_expand : !_.can_search))) return;
    const oe = ++qt.current;
    Rn(!0), Ln(""), cn(""), Yt(""), Nt(void 0), In(void 0);
    try {
      const Ue = await N.callWS(O !== void 0 && _ ? { type: "media_source/search_media", media_content_id: _.media_content_id, search_query: O } : { type: "media_source/browse_media", ..._ ? { media_content_id: _.media_content_id } : {} });
      if (qt.current !== oe) return;
      _ && O === void 0 && (Ar.current = !0), Qt(L), or("result" in Ue && _ ? { ..._, children: Ue.result } : Ue), Sl(O !== void 0), O === void 0 && Dn("");
    } catch {
      qt.current === oe && (Ln(of), Nt(u));
    } finally {
      qt.current === oe && Rn(!1);
    }
  }
  function An() {
    de("browse"), (ie || Q) && De(!0), !Me && !Be && Zt({ path: [] });
  }
  function fo() {
    pr.current = crypto.randomUUID(), Je(""), ge([]), Se([]), fr.current = { name: "", entries: [] }, ce(""), be(!1), ne(void 0), Ke(!0), De(!1), de("library");
  }
  function di(u) {
    ne(u), Ke(!1), Je(u.name), ge(u.entries.map((v) => ({ ...v }))), Se(u.entries.map(() => `entry-${Vr.current++}`)), fr.current = { name: u.name, entries: u.entries.map((v) => ({ ...v })) }, ce(""), be(!1), De(!1), de("library");
  }
  function mn() {
    const u = Q?.record_id ?? (ie ? "create" : "");
    u && (Ur.current = u), Ke(!1), ne(void 0), Je(""), ge([]), Se([]), ce(""), be(!1), De(!1), fr.current = { name: "", entries: [] }, pr.current = "", de("library");
  }
  function zl() {
    return dt !== fr.current.name || JSON.stringify(Ne) !== JSON.stringify(fr.current.entries);
  }
  function fi(u, v = !1) {
    if (et.current = u, Hr.current = v, zl()) {
      s(!0);
      return;
    }
    mn();
  }
  function yr(u, v) {
    et.current = v, Y(""), Fe(u);
  }
  function gr(u, v) {
    et.current = v, Cn(""), j(u);
  }
  function at() {
    Fe(void 0), j(void 0), s(!1), D(void 0), Y(""), Cn("");
  }
  function hn(u) {
    if (u.key === "Escape" && !ke && !xt && !U) {
      u.preventDefault(), at();
      return;
    }
    if (u.key !== "Tab") return;
    const v = Array.from(u.currentTarget.querySelectorAll("button:not(:disabled)"));
    if (!v.length) return;
    const N = v[0], _ = v[v.length - 1];
    u.shiftKey && document.activeElement === N ? (u.preventDefault(), _.focus()) : !u.shiftKey && document.activeElement === _ && (u.preventDefault(), N.focus());
  }
  async function po() {
    const u = Xe.current, v = Re;
    if (!v || !u?.connection.connected || !u.user?.id || ke) return;
    const N = H.current;
    hl(v.record_id), Y(""), F("Deleting playlist...");
    try {
      const _ = await u.callWS({
        type: "bl_haos/playlist_library/delete_custom",
        record_id: v.record_id,
        revision: X?.revision ?? 0
      });
      if (H.current !== N) return;
      const L = _, oe = (X?.records ?? []).filter((xr) => xr.kind === "custom").findIndex((xr) => xr.record_id === v.record_id), Ue = L.records.filter((xr) => xr.kind === "custom"), ho = Ue[Math.min(Math.max(oe, 0), Ue.length - 1)];
      Ur.current = ho?.record_id ?? "create", et.current = null, ae(L), Fe(void 0), F("Playlist deleted.");
    } catch (_) {
      if (H.current !== N) return;
      const L = _ instanceof Error ? _.message : "";
      if (/Playlist library changed/i.test(L)) {
        Y(`Couldn't delete “${v.name}” right now. It remains in your library. Select Delete playlist to try again, or Keep playlist.`);
        try {
          const O = await u.callWS({ type: "bl_haos/playlist_library/list" });
          H.current === N && ae(O);
        } catch {
        }
      } else
        Y(`Couldn't delete “${v.name}” right now. It remains in your library. Select Delete playlist to try again, or Keep playlist.`);
      H.current === N && F("");
    } finally {
      H.current === N && hl("");
    }
  }
  function mo(u) {
    Wt(u.media_content_id), un(u.title), Dt((v) => {
      const N = { ...v };
      return delete N[u.media_content_id], N;
    });
  }
  async function Ll(u, v) {
    const N = Xe.current, _ = u.media_content_id, L = v.trim();
    if (!L) {
      Dt((oe) => ({ ...oe, [_]: "Enter a shortcut name before saving." }));
      return;
    }
    if (new TextEncoder().encode(L).length > 128) {
      Dt((oe) => ({
        ...oe,
        [_]: "Shortcut names must be at most 128 UTF-8 bytes. Enter a shorter name."
      }));
      return;
    }
    if (!N?.connection.connected || !N.user?.id || !fc(u) || Ht.has(_) || mr.current.has(_) || !_.startsWith("media-source://")) return;
    const O = H.current;
    mr.current.add(_), Dr((oe) => new Set(oe).add(_)), Dt((oe) => {
      const Ue = { ...oe };
      return delete Ue[_], Ue;
    }), F(`Saving “${L}” to your library...`);
    try {
      const oe = await N.callWS({
        type: "bl_haos/playlist_library/save_provider",
        media_content_id: _,
        name: L,
        ...u.title ? { title: u.title } : {},
        ...u.media_class ? { media_class: u.media_class } : {},
        ...u.media_content_type ? { media_content_type: u.media_content_type } : {}
      });
      if (H.current !== O) return;
      ae(oe), Wt(""), un(""), F("Playlist saved to your library.");
    } catch {
      H.current === O && (Dt((oe) => ({
        ...oe,
        [_]: `Couldn't save “${L}” to your library right now. Nothing was added. Select Save shortcut to try again, or cancel to return to Browse media.`
      })), F(""));
    } finally {
      H.current === O && (mr.current.delete(_), Dr((oe) => {
        const Ue = new Set(oe);
        return Ue.delete(_), Ue;
      }));
    }
  }
  function Kr(u) {
    lr(u.record_id), an(u.name), St("");
  }
  function Tl(u) {
    sn.current = u, lr(""), an(""), St("");
  }
  async function pi(u) {
    const v = Xe.current, N = yl.trim();
    if (!N) {
      St("Enter a shortcut name before saving.");
      return;
    }
    if (!v?.connection.connected || !v.user?.id || Vt) return;
    const _ = H.current;
    Ir(!0), St(""), F("Saving shortcut name...");
    try {
      const L = await v.callWS({
        type: "bl_haos/playlist_library/rename_provider",
        record_id: u.record_id,
        name: N,
        revision: X?.revision ?? 0
      });
      if (H.current !== _) return;
      ae(L), sn.current = u.record_id, lr(""), an(""), F("Shortcut name saved.");
    } catch (L) {
      if (H.current !== _) return;
      if (St(L instanceof Error && /invalid_format|Invalid playlist record/i.test(L.message) ? "Shortcut names must be non-empty and at most 128 UTF-8 bytes. Enter a shorter name, then save again." : `Couldn't rename “${u.name}” right now. Your local name is still here. Select Save shortcut name to try again.`), ir.current?.focus(), L instanceof Error && /Playlist library changed/i.test(L.message))
        try {
          const O = await v.callWS({ type: "bl_haos/playlist_library/list" });
          H.current === _ && ae(O);
        } catch {
        }
      H.current === _ && F("");
    } finally {
      H.current === _ && Ir(!1);
    }
  }
  async function Jt() {
    const u = Xe.current, v = re;
    if (!v || !u?.connection.connected || !u.user?.id || xt) return;
    const N = H.current;
    nr(v.record_id), Cn(""), F("Removing shortcut...");
    try {
      const _ = await u.callWS({
        type: "bl_haos/playlist_library/delete_provider",
        record_id: v.record_id,
        revision: X?.revision ?? 0
      });
      if (H.current !== N) return;
      ae(_), et.current = Fn.current, j(void 0), F("Shortcut removed. The Home Assistant playlist is unchanged.");
    } catch (_) {
      if (H.current !== N) return;
      if (Cn(`Couldn't remove “${v.name}” right now. The shortcut remains in your library, and the Home Assistant playlist is unchanged. Select Remove shortcut to try again, or Keep shortcut.`), _ instanceof Error && /Playlist library changed/i.test(_.message))
        try {
          const L = await u.callWS({ type: "bl_haos/playlist_library/list" });
          H.current === N && ae(L);
        } catch {
        }
      H.current === N && F("");
    } finally {
      H.current === N && nr("");
    }
  }
  function Dl(u) {
    if (!u.can_play || !u.media_content_id.startsWith("media-source://")) return;
    const v = u.media_class?.toLowerCase();
    if (!(u.media_content_type.toLowerCase().startsWith("audio/") || ["music", "track", "episode"].includes(v ?? ""))) return;
    const _ = {
      media_content_id: u.media_content_id,
      title: u.title,
      ...u.media_class ? { media_class: u.media_class } : {},
      media_content_type: u.media_content_type
    };
    ge((L) => [...L, _]), Se((L) => [...L, `entry-${Vr.current++}`]), ce(""), De(!1), de("library");
  }
  function wr(u, v) {
    const N = u + v;
    if (N < 0 || N >= Ne.length) return;
    const _ = [...Ne], L = [...Ye];
    [_[u], _[N]] = [_[N], _[u]], [L[u], L[N]] = [L[N], L[u]], fn.current = { key: Ye[u], action: v === 1 ? "down" : "up" }, ge(_), Se(L), ce("");
    const O = Ne[u].title || "Media item";
    F(`Moved ${O} to position ${N + 1} of ${Ne.length}.`);
  }
  function mi(u) {
    const v = Ne.filter((L, O) => O !== u), N = Ye.filter((L, O) => O !== u), _ = Math.min(u, N.length - 1);
    fn.current = _ >= 0 ? { key: N[_], action: "remove" } : { key: "", action: "remove" }, ge(v), Se(N), ce("");
  }
  async function Yr(u) {
    u.preventDefault();
    const v = Xe.current, N = dt.trim();
    if (!N) {
      ce("Enter a playlist name before saving.");
      return;
    }
    if (!v?.connection.connected || !v.user?.id || Le) return;
    const _ = H.current;
    ie && (pr.current ||= crypto.randomUUID()), wt(!0), ce(""), F(ie ? "Saving playlist..." : "Saving changes...");
    try {
      const L = await v.callWS({
        type: ie ? "bl_haos/playlist_library/save_custom" : "bl_haos/playlist_library/update_custom",
        record_id: ie ? pr.current : Q.record_id,
        name: N,
        entries: Ne,
        revision: X?.revision ?? 0
      });
      if (H.current !== _) return;
      ae(L), mn(), F(ie ? "Playlist saved." : "Changes saved.");
    } catch (L) {
      if (H.current !== _) return;
      const O = L instanceof Error ? L.message : "";
      if (/Playlist library changed/i.test(O)) {
        be(!0), ce("This playlist changed in Home Assistant. Your edits are still here. The newer saved version was kept; stop editing and reopen the playlist to review it.");
        try {
          const oe = await v.callWS({ type: "bl_haos/playlist_library/list" });
          H.current === _ && ae(oe);
        } catch {
        }
      } else /not found/i.test(O) ? ce("The selected playlist or a media item couldn't be matched. Return to Your playlists and select Edit playlist on the intended row; for an affected media item, remove it or add it again from Browse media. Your valid draft data is still here.") : /invalid_format|Invalid playlist record/i.test(O) ? ce("This playlist has details that can't be saved yet. Review the playlist name and entries, correct any marked fields, then select Save playlist or Save changes. Your valid draft data is still here.") : ce(ie ? "Couldn't save this playlist right now. Your draft is still here. Select Save playlist to try again, or Discard draft to leave without saving." : `Couldn't save changes to “${Q?.name ?? N}” right now. Your edits are still here. Select Save changes to try again, or Stop editing to leave without saving.`);
      H.current === _ && F("");
    } finally {
      H.current === _ && wt(!1);
    }
  }
  function Bn(u = kt.length - 1) {
    const v = kt[u];
    !v || Ie || (qt.current++, sr.current = Me?.media_content_id ?? "", or(v), Qt(kt.slice(0, u)), Rn(!1), Sl(!1), Dn(""), Nt(void 0), Ln(""), cn(""));
  }
  function Ml(u, v) {
    if (!(!J || !je || G || Ie || U || u.kind === "custom" && u.entries.length === 0)) {
      if (K((N) => {
        const _ = { ...N };
        return delete _[u.record_id], _;
      }), rf(me)) {
        et.current = v, D(u);
        return;
      }
      nt(u);
    }
  }
  async function nt(u) {
    const v = Xe.current, N = Ae, _ = v?.states[N];
    if (!v?.connection.connected || !v.user?.id || !_ || !ml(_) || !N || U) return;
    const L = H.current;
    V(u.record_id), F(`Preparing “${u.name}” for ${rn(_)}…`);
    try {
      if (await v.callWS({
        type: "bl_haos/playlist_library/start",
        record_id: u.record_id,
        entity_id: N
      }), H.current !== L) return;
      const O = Xe.current?.states[N];
      if (!O || !ml(O)) {
        K((oe) => ({
          ...oe,
          [u.record_id]: `Couldn't confirm “${u.name}” started on ${rn(_)}. Check the current queue before trying again.`
        })), F("");
        return;
      }
      F(`Queue updated on ${rn(O)}.`), D(void 0);
    } catch {
      H.current === L && (K((O) => ({
        ...O,
        [u.record_id]: `Couldn't confirm “${u.name}” started on ${rn(_)}. Check the current queue before trying again.`
      })), F(""));
    } finally {
      H.current === L && V("");
    }
  }
  async function vn(u, v = Ae) {
    const N = Xe.current, _ = N?.states[v];
    if (!N?.connection.connected || !N.user?.id || !_ || !ml(_) || !u.can_play || v !== Ae || Be || !u.media_content_id.startsWith("media-source://") || vr.current) return;
    const L = ++Gt.current;
    vr.current = !0, Fr(!0), cn(""), Yt(""), kl(u), In(void 0);
    try {
      if (await N.callService("media_player", "play_media", {
        media_content_id: u.media_content_id,
        media_content_type: u.media_content_type
      }, { entity_id: _.entity_id }), Gt.current !== L) return;
      const O = Xe.current?.states[_.entity_id];
      O && ml(O) ? Yt(`Starting playback on ${rn(O)}`) : cn("The selected speaker is unavailable. Select a connected speaker to play media.");
    } catch {
      Gt.current === L && (cn(`Home Assistant could not play this item on ${rn(_)}. Check the provider access and speaker connection, then try again.`), In({ item: u, target: _.entity_id }));
    } finally {
      Gt.current === L && (vr.current = !1, Fr(!1));
    }
  }
  return /* @__PURE__ */ f.jsxs("main", { className: "neu-page", onKeyDown: (u) => {
    xe === "browse" && u.key === "Escape" && kt.length && !Ie && (u.preventDefault(), Bn());
  }, children: [
    /* @__PURE__ */ f.jsxs("header", { className: "catalog-header", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "catalog-heading", children: [
        xe === "browse" && /* @__PURE__ */ f.jsx(
          "button",
          {
            className: "neu-button icon-button",
            "aria-label": "Back",
            title: "Back",
            ref: _l,
            disabled: kt.length === 0 || Ie,
            onClick: () => Bn(),
            children: /* @__PURE__ */ f.jsx(Gd, { size: 20, "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ f.jsxs("div", { children: [
          /* @__PURE__ */ f.jsx("p", { className: "eyebrow", children: "BL-HAOS" }),
          /* @__PURE__ */ f.jsx("h1", { children: xe === "library" ? "Media Library" : "Media Catalog" })
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "target-control", children: [
        /* @__PURE__ */ f.jsx("label", { htmlFor: "catalog-target", children: "Play on" }),
        /* @__PURE__ */ f.jsxs(
          "select",
          {
            id: "catalog-target",
            className: "neu-inset",
            value: Ae,
            disabled: !J || Ie || !!U,
            onChange: (u) => {
              wl(u.target.value);
              const v = E?.states[u.target.value];
              xl(v ? rn(v) : ""), Yt(""), F(""), In(void 0), cn(""), K({});
            },
            children: [
              /* @__PURE__ */ f.jsx("option", { value: "", children: "Select a connected speaker" }),
              Ae && !je && /* @__PURE__ */ f.jsxs("option", { value: Ae, disabled: !0, children: [
                Kt,
                " (unavailable)"
              ] }),
              Mt.map((u) => /* @__PURE__ */ f.jsx("option", { value: u.entity_id, children: rn(u) }, u.entity_id))
            ]
          }
        ),
        Ae && /* @__PURE__ */ f.jsx("span", { className: "selected-target", title: je && tt ? rn(tt) : Kt, children: je && tt ? rn(tt) : Kt })
      ] }),
      /* @__PURE__ */ f.jsx(
        "a",
        {
          className: "neu-button icon-button close-catalog",
          href: "/",
          "aria-label": "Close catalog",
          title: "Close catalog",
          onClick: (u) => {
            (ie || Q) && (zl() ? (u.preventDefault(), fi(u.currentTarget, !0)) : mn());
          },
          children: /* @__PURE__ */ f.jsx(tf, { size: 20, "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ f.jsxs("nav", { className: "view-toggle", "aria-label": "Media views", children: [
      /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "button", ref: $r, "aria-pressed": xe === "library", onClick: () => {
        De(!1), de("library"), !X && !G && !ye && pn();
      }, children: "Library" }),
      /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "button", ref: Fn, "aria-pressed": xe === "browse", onClick: An, children: "Browse media" })
    ] }),
    xe === "library" ? /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      !J && /* @__PURE__ */ f.jsx("p", { role: "alert", children: "Your Home Assistant session is unavailable." }),
      ye && /* @__PURE__ */ f.jsxs("div", { className: "error", role: "alert", children: [
        /* @__PURE__ */ f.jsx("p", { children: ye }),
        /* @__PURE__ */ f.jsx("button", { className: "neu-button", disabled: !J || G, onClick: () => {
          pn();
        }, children: "Retry loading" })
      ] }),
      /* @__PURE__ */ f.jsx("p", { className: "status", role: "status", "aria-live": "polite", "aria-atomic": "true", children: G ? "Loading playlists..." : se }),
      /* @__PURE__ */ f.jsxs("section", { className: "neu-surface queue-summary", "aria-label": "Playback queue", children: [
        /* @__PURE__ */ f.jsx("h2", { children: "Playback queue" }),
        /* @__PURE__ */ f.jsxs("div", { className: "queue-summary-body", "aria-live": "polite", "aria-atomic": "true", children: [
          !Ae && /* @__PURE__ */ f.jsx("p", { children: "No active queue. Select a connected speaker to view playback." }),
          Ae && !je && /* @__PURE__ */ f.jsx("p", { children: "Speaker disconnected. The queue was stopped. Select a connected speaker to start a playlist." }),
          je && !me && /* @__PURE__ */ f.jsx("p", { children: "No active queue" }),
          je && me && /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
            /* @__PURE__ */ f.jsx("p", { className: "queue-playlist", children: me.status === "completed" ? "Playlist complete" : me.playlist ?? "Playback queue" }),
            /* @__PURE__ */ f.jsx("p", { children: me.title ?? "Current item unavailable" }),
            me.artist && /* @__PURE__ */ f.jsx("p", { className: "metadata", children: me.artist }),
            typeof me.index == "number" && typeof me.count == "number" && /* @__PURE__ */ f.jsxs("p", { children: [
              "Item ",
              me.index,
              " of ",
              me.count
            ] }),
            /* @__PURE__ */ f.jsxs("p", { children: [
              dc(me.position),
              " / ",
              dc(me.duration)
            ] }),
            /* @__PURE__ */ f.jsxs("p", { className: "metadata", children: [
              me.status ?? "Status unavailable",
              me.shuffle ? " · Shuffle on" : "",
              me.repeat ? ` · Repeat ${me.repeat}` : ""
            ] }),
            me.error && /* @__PURE__ */ f.jsx("p", { className: "error", role: "alert", children: "Playback failed. Nothing was skipped." })
          ] })
        ] })
      ] }),
      Mt.length === 0 && /* @__PURE__ */ f.jsx("p", { className: "warning", children: "No connected speakers are available. Connect a speaker, then select it to play a playlist." }),
      /* @__PURE__ */ f.jsxs("section", { className: "neu-surface", "aria-label": "Your playlists", "aria-busy": G, children: [
        /* @__PURE__ */ f.jsx("h2", { children: "Your playlists" }),
        /* @__PURE__ */ f.jsxs("div", { className: "library-body", children: [
          G && /* @__PURE__ */ f.jsx("p", { className: "library-message", children: "Loading playlists..." }),
          !G && !ye && X && !X.records.some((u) => u.kind === "custom") && !X.records.some(Wu) && /* @__PURE__ */ f.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ f.jsx("h3", { children: "Your library is empty" }),
            /* @__PURE__ */ f.jsx("p", { children: "Create a playlist or browse Home Assistant media to save a playlist reference." })
          ] }),
          !G && /* @__PURE__ */ f.jsx("ul", { "aria-label": "Your playlists", children: (X?.records ?? []).filter(lf).map((u) => /* @__PURE__ */ f.jsxs("li", { children: [
            /* @__PURE__ */ f.jsx(ao, { className: "media-icon", size: 24, "aria-hidden": "true" }),
            /* @__PURE__ */ f.jsxs("div", { className: "media-detail", children: [
              /* @__PURE__ */ f.jsx("span", { className: "media-title", children: u.name }),
              /* @__PURE__ */ f.jsxs("span", { className: "metadata", children: [
                u.entries.length,
                " items"
              ] }),
              b[u.record_id] && /* @__PURE__ */ f.jsx("span", { className: "error", role: "alert", children: b[u.record_id] })
            ] }),
            /* @__PURE__ */ f.jsxs("div", { className: "row-actions", children: [
              /* @__PURE__ */ f.jsx(
                "button",
                {
                  className: "neu-button primary-button",
                  type: "button",
                  "aria-label": `Play playlist ${u.name}`,
                  ref: (v) => {
                    v ? On.current.set(u.record_id, v) : On.current.delete(u.record_id);
                  },
                  disabled: !J || !je || u.entries.length === 0 || G || !!U,
                  onClick: (v) => Ml(u, v.currentTarget),
                  children: U === u.record_id ? "Preparing..." : "Play playlist"
                }
              ),
              /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "button", ref: (v) => {
                v ? Cl.current.set(u.record_id, v) : Cl.current.delete(u.record_id);
              }, disabled: !J || !!ke || ie || !!Q, onClick: () => di(u), children: "Edit playlist" }),
              /* @__PURE__ */ f.jsx(
                "button",
                {
                  className: "neu-button destructive-button",
                  type: "button",
                  disabled: !J || !!ke || ie || !!Q,
                  onClick: (v) => yr(u, v.currentTarget),
                  children: "Delete playlist"
                }
              )
            ] })
          ] }, u.record_id)) }),
          !ie && !Q && /* @__PURE__ */ f.jsx(
            "button",
            {
              className: "neu-button primary-button",
              type: "button",
              disabled: !J || !X || !!ye || G || Le,
              ref: Nl,
              onClick: fo,
              children: "Create playlist"
            }
          ),
          (ie || Q) && !Te && /* @__PURE__ */ f.jsxs("form", { className: "playlist-form", onSubmit: (u) => {
            Yr(u);
          }, children: [
            /* @__PURE__ */ f.jsx("label", { htmlFor: "playlist-name", children: "Playlist name" }),
            /* @__PURE__ */ f.jsx(
              "input",
              {
                id: "playlist-name",
                className: "neu-inset",
                type: "text",
                value: dt,
                onChange: (u) => {
                  Je(u.target.value), ce("");
                },
                disabled: Le
              }
            ),
            /* @__PURE__ */ f.jsx("h3", { children: "Playlist entries" }),
            /* @__PURE__ */ f.jsxs("ol", { className: "playlist-entries", "aria-label": "Playlist entries", "aria-busy": Le, children: [
              Ne.length === 0 && /* @__PURE__ */ f.jsx("li", { className: "empty-entry", children: "No media added yet. Add media to build this playlist, or save it as an empty draft." }),
              Ne.map((u, v) => {
                const N = Ye[v], _ = u.title || "Media item", L = (O, oe) => {
                  const Ue = Br.current.get(N) ?? {};
                  oe ? Ue[O] = oe : delete Ue[O], Br.current.set(N, Ue);
                };
                return /* @__PURE__ */ f.jsxs("li", { children: [
                  /* @__PURE__ */ f.jsx(ao, { className: "media-icon", size: 24, "aria-hidden": "true" }),
                  /* @__PURE__ */ f.jsxs("div", { className: "media-detail", children: [
                    /* @__PURE__ */ f.jsx("span", { className: "media-title", title: _, children: _ }),
                    /* @__PURE__ */ f.jsx("span", { className: "metadata", children: u.media_class ?? u.media_content_type ?? "Home Assistant media" }),
                    /* @__PURE__ */ f.jsx("span", { className: "metadata", children: It(`entry:${N}`) })
                  ] }),
                  /* @__PURE__ */ f.jsxs("div", { className: "row-actions entry-actions", children: [
                    /* @__PURE__ */ f.jsx(
                      "button",
                      {
                        className: "neu-button",
                        type: "button",
                        disabled: !J || Pn.has(`entry:${N}`),
                        onClick: () => {
                          ci(`entry:${N}`, u.media_content_id);
                        },
                        children: Pn.has(`entry:${N}`) ? "Checking availability..." : "Check availability"
                      }
                    ),
                    /* @__PURE__ */ f.jsx(
                      "button",
                      {
                        className: "neu-button icon-button",
                        type: "button",
                        "aria-label": "Move entry up",
                        title: "Move entry up",
                        ref: (O) => L("up", O),
                        disabled: Le || v === 0,
                        onClick: () => wr(v, -1),
                        children: /* @__PURE__ */ f.jsx(Zd, { size: 18, "aria-hidden": "true" })
                      }
                    ),
                    /* @__PURE__ */ f.jsx(
                      "button",
                      {
                        className: "neu-button icon-button",
                        type: "button",
                        "aria-label": "Move entry down",
                        title: "Move entry down",
                        ref: (O) => L("down", O),
                        disabled: Le || v === Ne.length - 1,
                        onClick: () => wr(v, 1),
                        children: /* @__PURE__ */ f.jsx(Xd, { size: 18, "aria-hidden": "true" })
                      }
                    ),
                    /* @__PURE__ */ f.jsx(
                      "button",
                      {
                        className: "neu-button",
                        type: "button",
                        "aria-label": `Remove ${_}`,
                        disabled: Le,
                        ref: (O) => L("remove", O),
                        onClick: () => mi(v),
                        children: "Remove media item"
                      }
                    )
                  ] })
                ] }, N);
              })
            ] }),
            /* @__PURE__ */ f.jsxs("div", { className: "row-actions editor-actions", children: [
              /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "button", ref: Wr, disabled: !J || Le, onClick: () => {
                De(!0), de("browse"), !Me && !Be && Zt({ path: [] });
              }, children: "Add media" }),
              /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "submit", disabled: !J || Le || ln, children: Le ? "Saving..." : ie ? "Save playlist" : "Save changes" }),
              /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "button", disabled: Le, onClick: (u) => fi(u.currentTarget), children: ie ? "Discard draft" : "Stop editing" })
            ] }),
            qe && /* @__PURE__ */ f.jsx("p", { className: "error", role: "alert", children: qe })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("section", { className: "neu-surface provider-library", "aria-label": "Saved Home Assistant playlists", "aria-busy": G, children: [
        /* @__PURE__ */ f.jsx("h2", { children: "Saved Home Assistant playlists" }),
        /* @__PURE__ */ f.jsxs("div", { className: "provider-library-body", children: [
          G && /* @__PURE__ */ f.jsx("p", { className: "library-message", children: "Loading saved playlists..." }),
          !G && !ye && X && !X.records.some(Wu) && /* @__PURE__ */ f.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ f.jsx("p", { children: "No Home Assistant playlists saved. Browse media to save a playlist reference." }),
            /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "button", disabled: !J, onClick: An, children: "Browse media" })
          ] }),
          !G && /* @__PURE__ */ f.jsx("ul", { "aria-label": "Saved Home Assistant playlists", children: (X?.records ?? []).filter(Wu).map((u) => /* @__PURE__ */ f.jsxs("li", { children: [
            /* @__PURE__ */ f.jsx(ao, { className: "media-icon", size: 24, "aria-hidden": "true" }),
            /* @__PURE__ */ f.jsxs("div", { className: "media-detail", children: [
              /* @__PURE__ */ f.jsx("span", { className: "media-title provider-title", title: u.name, children: u.name }),
              /* @__PURE__ */ f.jsx("span", { className: "metadata", children: "Home Assistant playlist" }),
              /* @__PURE__ */ f.jsx("span", { className: "metadata", children: "Provider contents are managed by Home Assistant." }),
              /* @__PURE__ */ f.jsx("span", { className: "metadata", children: It(`provider:${u.record_id}`) }),
              b[u.record_id] && /* @__PURE__ */ f.jsx("span", { className: "error", role: "alert", children: b[u.record_id] }),
              Nn === u.record_id ? /* @__PURE__ */ f.jsxs("form", { className: "provider-rename-form", onSubmit: (v) => {
                v.preventDefault(), pi(u);
              }, children: [
                /* @__PURE__ */ f.jsx("label", { htmlFor: `shortcut-name-${u.record_id}`, children: "Shortcut name" }),
                /* @__PURE__ */ f.jsx(
                  "input",
                  {
                    id: `shortcut-name-${u.record_id}`,
                    ref: ir,
                    className: "neu-inset",
                    value: yl,
                    onChange: (v) => {
                      an(v.target.value), St("");
                    },
                    disabled: Vt
                  }
                ),
                /* @__PURE__ */ f.jsxs("div", { className: "row-actions", children: [
                  /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "submit", disabled: !J || Vt, children: Vt ? "Saving..." : "Save shortcut name" }),
                  /* @__PURE__ */ f.jsx(
                    "button",
                    {
                      className: "neu-button",
                      type: "button",
                      disabled: Vt,
                      onClick: () => Tl(u.record_id),
                      children: "Cancel rename"
                    }
                  )
                ] }),
                jn && /* @__PURE__ */ f.jsx("p", { className: "error", role: "alert", children: jn })
              ] }) : /* @__PURE__ */ f.jsxs("div", { className: "row-actions provider-actions", children: [
                /* @__PURE__ */ f.jsx(
                  "button",
                  {
                    className: "neu-button primary-button",
                    type: "button",
                    "aria-label": `Play playlist ${u.name}`,
                    ref: (v) => {
                      v ? On.current.set(u.record_id, v) : On.current.delete(u.record_id);
                    },
                    disabled: !J || !je || !!U,
                    onClick: (v) => Ml(u, v.currentTarget),
                    children: U === u.record_id ? "Preparing..." : "Play playlist"
                  }
                ),
                /* @__PURE__ */ f.jsx(
                  "button",
                  {
                    className: "neu-button",
                    type: "button",
                    disabled: !J || Pn.has(`provider:${u.record_id}`),
                    onClick: () => {
                      ci(`provider:${u.record_id}`, u.media_content_id);
                    },
                    children: Pn.has(`provider:${u.record_id}`) ? "Checking availability..." : "Check availability"
                  }
                ),
                /* @__PURE__ */ f.jsx(
                  "button",
                  {
                    className: "neu-button",
                    type: "button",
                    ref: (v) => {
                      v ? pe.current.set(u.record_id, v) : pe.current.delete(u.record_id);
                    },
                    disabled: !J || !!xt || !!Nn,
                    onClick: () => Kr(u),
                    children: "Rename shortcut"
                  }
                ),
                /* @__PURE__ */ f.jsx(
                  "button",
                  {
                    className: "neu-button destructive-button",
                    type: "button",
                    ref: (v) => {
                      v ? ui.current.set(u.record_id, v) : ui.current.delete(u.record_id);
                    },
                    disabled: !J || !!xt || !!Nn,
                    onClick: (v) => gr(u, v.currentTarget),
                    children: "Remove shortcut"
                  }
                )
              ] })
            ] })
          ] }, u.record_id)) })
        ] })
      ] })
    ] }) : /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      !Te && Ae && !je && /* @__PURE__ */ f.jsxs("p", { className: "warning", children: [
        Kt,
        " is unavailable. Select a connected speaker to play media."
      ] }),
      !J && /* @__PURE__ */ f.jsx("p", { role: "alert", children: "Your Home Assistant session is unavailable." }),
      zn && /* @__PURE__ */ f.jsxs("div", { className: "error", role: "alert", children: [
        /* @__PURE__ */ f.jsx("p", { children: zn }),
        ar && /* @__PURE__ */ f.jsx(
          "button",
          {
            className: "neu-button",
            disabled: !J || Be || Ie,
            onClick: () => {
              Zt(ar);
            },
            children: ar.query !== void 0 ? "Retry search" : ar.item ? `Retry opening ${ar.item.title}` : "Retry media sources"
          }
        )
      ] }),
      Tn && /* @__PURE__ */ f.jsxs("div", { className: "error", role: "alert", children: [
        /* @__PURE__ */ f.jsx("p", { children: Tn }),
        Mn && Mn.target === Ae && /* @__PURE__ */ f.jsxs(
          "button",
          {
            className: "neu-button",
            disabled: !je || Be || Ie,
            onClick: () => {
              vn(Mn.item, Mn.target);
            },
            children: [
              "Retry ",
              Mn.item.title,
              " on ",
              Kt
            ]
          }
        )
      ] }),
      /* @__PURE__ */ f.jsx("p", { className: "status", role: "status", "aria-live": "polite", "aria-atomic": "true", children: Be ? "Loading media sources..." : se || ur }),
      /* @__PURE__ */ f.jsxs("nav", { className: "catalog-path", "aria-label": "Catalog path", children: [
        kt.map((u, v) => /* @__PURE__ */ f.jsx(
          "button",
          {
            className: "neu-button",
            disabled: Ie,
            onClick: () => Bn(v),
            title: u.title,
            children: u.title
          },
          `${u.media_content_id}-${v}`
        )),
        /* @__PURE__ */ f.jsx("span", { "aria-current": "page", title: Me?.title, children: Me?.title ?? "Media sources" })
      ] }),
      /* @__PURE__ */ f.jsxs("section", { className: "neu-surface", "aria-label": Me?.title ?? "Media sources", "aria-busy": Be, children: [
        /* @__PURE__ */ f.jsx("h2", { children: Me?.title ?? "Media sources" }),
        Me?.can_search && /* @__PURE__ */ f.jsxs("form", { className: "catalog-search", role: "search", onSubmit: (u) => {
          u.preventDefault(), dn.trim() && !Be && Zt({ item: Me, path: kt, query: dn.trim() });
        }, children: [
          /* @__PURE__ */ f.jsxs("label", { className: "search-control", children: [
            "Search media",
            /* @__PURE__ */ f.jsx(
              "input",
              {
                className: "neu-inset",
                type: "search",
                value: dn,
                onChange: (u) => Dn(u.target.value),
                disabled: !J || Be || Ie
              }
            )
          ] }),
          /* @__PURE__ */ f.jsx("button", { className: "neu-button icon-button", type: "submit", "aria-label": "Search", title: "Search", disabled: !dn.trim() || !J || Be || Ie, children: /* @__PURE__ */ f.jsx(ef, { size: 20, "aria-hidden": "true" }) }),
          so && /* @__PURE__ */ f.jsx(
            "button",
            {
              className: "neu-button",
              type: "button",
              disabled: Be || Ie,
              onClick: () => {
                Zt({ item: Me, path: kt });
              },
              children: "Clear search"
            }
          )
        ] }),
        /* @__PURE__ */ f.jsxs("div", { className: "catalog-body", children: [
          Me && !Be && !Me.children?.length && (Te ? /* @__PURE__ */ f.jsx("div", { className: "empty-state", children: /* @__PURE__ */ f.jsx("p", { children: "No playable audio media are available in this Home Assistant source." }) }) : /* @__PURE__ */ f.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ f.jsx("h3", { children: "No audio sources are available" }),
            /* @__PURE__ */ f.jsx("p", { children: "Home Assistant did not return a playable audio source. Check the media provider and try again." })
          ] })),
          /* @__PURE__ */ f.jsx("ul", { "aria-label": "Catalog items", children: (Me?.children ?? []).map((u) => /* @__PURE__ */ f.jsxs("li", { "aria-current": co?.media_content_id === u.media_content_id ? "true" : void 0, children: [
            pc(u.thumbnail) ? /* @__PURE__ */ f.jsx("img", { className: "thumbnail", src: pc(u.thumbnail), alt: "", loading: "lazy", referrerPolicy: "no-referrer" }) : /* @__PURE__ */ f.jsx(ao, { className: "media-icon", size: 24, "aria-hidden": "true" }),
            /* @__PURE__ */ f.jsxs("div", { className: "media-detail", children: [
              /* @__PURE__ */ f.jsx("span", { className: "media-title", title: u.title, children: u.title }),
              /* @__PURE__ */ f.jsx("span", { className: "metadata", title: u.media_content_type, children: u.media_class ?? u.media_content_type }),
              !u.can_play && !u.can_expand && /* @__PURE__ */ f.jsx("span", { className: "metadata", children: uf })
            ] }),
            /* @__PURE__ */ f.jsxs("div", { className: "row-actions", children: [
              u.can_expand && /* @__PURE__ */ f.jsx(
                "button",
                {
                  className: "neu-button icon-button",
                  "aria-label": `Open ${u.title}`,
                  title: `Open ${u.title}`,
                  ref: (v) => {
                    v ? El.current.set(u.media_content_id, v) : El.current.delete(u.media_content_id);
                  },
                  disabled: Be || Ie || !J || !u.media_content_id.startsWith("media-source://"),
                  onClick: () => {
                    Zt({ item: u, path: Me ? [...kt, Me] : [] });
                  },
                  children: /* @__PURE__ */ f.jsx(Jd, { size: 20, "aria-hidden": "true" })
                }
              ),
              Te && u.can_play && (u.media_content_type.toLowerCase().startsWith("audio/") || ["music", "track", "episode"].includes(u.media_class?.toLowerCase() ?? "")) && /* @__PURE__ */ f.jsx(
                "button",
                {
                  className: "neu-button",
                  "aria-label": `Add media ${u.title}`,
                  disabled: Be || Ie || !J,
                  onClick: () => Dl(u),
                  children: "Add media"
                }
              ),
              !Te && fc(u) && (rr === u.media_content_id ? /* @__PURE__ */ f.jsxs("form", { className: "provider-rename-form", onSubmit: (v) => {
                v.preventDefault(), Ll(u, on);
              }, children: [
                /* @__PURE__ */ f.jsx("label", { htmlFor: `provider-save-name-${u.media_content_id}`, children: "Shortcut name" }),
                /* @__PURE__ */ f.jsx(
                  "input",
                  {
                    id: `provider-save-name-${u.media_content_id}`,
                    ref: vl,
                    className: "neu-inset",
                    value: on,
                    onChange: (v) => {
                      un(v.target.value), Dt((N) => {
                        const _ = { ...N };
                        return delete _[u.media_content_id], _;
                      });
                    },
                    disabled: Ht.has(u.media_content_id)
                  }
                ),
                /* @__PURE__ */ f.jsxs("div", { className: "row-actions", children: [
                  /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "submit", disabled: !J || Ht.has(u.media_content_id), children: Ht.has(u.media_content_id) ? "Saving..." : "Save shortcut" }),
                  /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "button", disabled: Ht.has(u.media_content_id), onClick: () => {
                    Wt(""), un(""), Dt((v) => {
                      const N = { ...v };
                      return delete N[u.media_content_id], N;
                    });
                  }, children: "Cancel" })
                ] })
              ] }) : /* @__PURE__ */ f.jsx(
                "button",
                {
                  className: "neu-button",
                  type: "button",
                  "aria-label": `Save to library ${u.title}`,
                  disabled: !J || Be || Ie || Ht.has(u.media_content_id) || !!X?.records.some((v) => v.kind === "provider" && v.media_content_id === u.media_content_id),
                  onClick: () => mo(u),
                  children: Ht.has(u.media_content_id) ? "Saving..." : X?.records.some((v) => v.kind === "provider" && v.media_content_id === u.media_content_id) ? "Saved to library" : "Save to library"
                }
              )),
              Mr[u.media_content_id] && /* @__PURE__ */ f.jsx("p", { className: "error", role: "alert", children: Mr[u.media_content_id] }),
              !Te && u.can_play && /* @__PURE__ */ f.jsxs(
                "button",
                {
                  className: "neu-button",
                  "aria-label": `Play ${u.title}`,
                  disabled: !je || Be || Ie || !u.media_content_id.startsWith("media-source://"),
                  onClick: () => {
                    vn(u);
                  },
                  children: [
                    /* @__PURE__ */ f.jsx(bd, { size: 18, "aria-hidden": "true" }),
                    "Play"
                  ]
                }
              )
            ] })
          ] }, u.media_content_id)) })
        ] })
      ] })
    ] }),
    Re && /* @__PURE__ */ f.jsxs(
      "dialog",
      {
        ref: ft,
        "aria-modal": "true",
        "aria-labelledby": "delete-playlist-heading",
        className: "confirmation-dialog",
        onKeyDown: hn,
        onCancel: (u) => {
          u.preventDefault(), ke || at();
        },
        children: [
          /* @__PURE__ */ f.jsxs("h2", { id: "delete-playlist-heading", children: [
            "Delete playlist: ",
            Re.name
          ] }),
          /* @__PURE__ */ f.jsxs("p", { children: [
            "Delete “",
            Re.name,
            "” from your BL-HAOS library? Its saved entries will be removed. This cannot be undone."
          ] }),
          ue && /* @__PURE__ */ f.jsx("p", { className: "error", role: "alert", children: ue }),
          /* @__PURE__ */ f.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "button", ref: ai, disabled: !!ke, onClick: at, children: "Keep playlist" }),
            /* @__PURE__ */ f.jsx("button", { className: "neu-button destructive-button", type: "button", disabled: !!ke, onClick: () => {
              po();
            }, children: ke ? "Deleting playlist..." : "Delete playlist" })
          ] })
        ]
      }
    ),
    re && /* @__PURE__ */ f.jsxs(
      "dialog",
      {
        ref: jl,
        "aria-modal": "true",
        "aria-labelledby": "remove-shortcut-heading",
        className: "confirmation-dialog",
        onKeyDown: hn,
        onCancel: (u) => {
          u.preventDefault(), xt || at();
        },
        children: [
          /* @__PURE__ */ f.jsxs("h2", { id: "remove-shortcut-heading", children: [
            "Remove shortcut: ",
            re.name
          ] }),
          /* @__PURE__ */ f.jsxs("p", { children: [
            "Remove “",
            re.name,
            "” from your BL-HAOS library? The Home Assistant playlist itself will not be changed."
          ] }),
          tr && /* @__PURE__ */ f.jsx("p", { className: "error", role: "alert", children: tr }),
          /* @__PURE__ */ f.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "button", ref: si, disabled: !!xt, onClick: at, children: "Keep shortcut" }),
            /* @__PURE__ */ f.jsx("button", { className: "neu-button destructive-button", type: "button", disabled: !!xt, onClick: () => {
              Jt();
            }, children: xt ? "Removing shortcut..." : "Remove shortcut" })
          ] })
        ]
      }
    ),
    I && /* @__PURE__ */ f.jsxs(
      "dialog",
      {
        ref: ut,
        "aria-modal": "true",
        "aria-labelledby": "discard-changes-heading",
        className: "confirmation-dialog",
        onKeyDown: hn,
        onCancel: (u) => {
          u.preventDefault(), at();
        },
        children: [
          /* @__PURE__ */ f.jsx("h2", { id: "discard-changes-heading", children: "Discard changes" }),
          /* @__PURE__ */ f.jsxs("p", { children: [
            "Discard unsaved changes to “",
            Q?.name || dt || "this playlist",
            "”? The saved playlist will remain unchanged."
          ] }),
          /* @__PURE__ */ f.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "button", ref: cr, onClick: () => {
              Hr.current = !1, s(!1);
            }, children: "Keep editing" }),
            /* @__PURE__ */ f.jsx("button", { className: "neu-button destructive-button", type: "button", onClick: () => {
              const u = Hr.current;
              Hr.current = !1, s(!1), mn(), ee.current = u;
            }, children: "Discard changes" })
          ] })
        ]
      }
    ),
    g && /* @__PURE__ */ f.jsxs(
      "dialog",
      {
        ref: Pl,
        "aria-modal": "true",
        "aria-labelledby": "replace-queue-heading",
        className: "confirmation-dialog",
        onKeyDown: hn,
        onCancel: (u) => {
          u.preventDefault(), U || at();
        },
        children: [
          /* @__PURE__ */ f.jsx("h2", { id: "replace-queue-heading", children: "Replace queue" }),
          /* @__PURE__ */ f.jsxs("p", { children: [
            "Replace queue: Stop the current queue on ",
            Kt,
            " and play “",
            g.name,
            "”?"
          ] }),
          U && /* @__PURE__ */ f.jsxs("p", { role: "status", "aria-live": "polite", "aria-atomic": "true", children: [
            "Preparing “",
            g.name,
            "” for ",
            Kt,
            "…"
          ] }),
          b[g.record_id] && /* @__PURE__ */ f.jsx("p", { className: "error", role: "alert", children: b[g.record_id] }),
          /* @__PURE__ */ f.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ f.jsx("button", { className: "neu-button", type: "button", ref: dr, disabled: !!U, onClick: at, children: "Keep current queue" }),
            /* @__PURE__ */ f.jsx(
              "button",
              {
                className: "neu-button primary-button",
                type: "button",
                disabled: !je || !!U,
                onClick: () => {
                  nt(g);
                },
                children: U ? "Preparing..." : "Replace queue"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const sf = `
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
class cf extends HTMLElement {
  constructor() {
    super();
    const W = this.attachShadow({ mode: "open" }), y = document.createElement("style");
    y.textContent = sf, this.mount = document.createElement("div"), W.append(y, this.mount);
  }
  set hass(W) {
    this.suppliedHass = W, this.render();
  }
  get hass() {
    return this.suppliedHass;
  }
  connectedCallback() {
    this.root = Kd.createRoot(this.mount), this.render();
  }
  disconnectedCallback() {
    this.root?.unmount(), this.root = void 0;
  }
  render() {
    this.root?.render(/* @__PURE__ */ f.jsx(af, { hass: this.suppliedHass }));
  }
}
customElements.get("bl-haos-media-panel") || customElements.define("bl-haos-media-panel", cf);
export {
  af as MediaPanel,
  cf as MediaPanelElement
};
