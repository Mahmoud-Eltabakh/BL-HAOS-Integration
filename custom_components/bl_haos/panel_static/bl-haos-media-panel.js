var Fa = { exports: {} }, li = {}, Ba = { exports: {} }, ee = {};
var nc;
function Bd() {
  if (nc) return ee;
  nc = 1;
  var g = /* @__PURE__ */ Symbol.for("react.element"), A = /* @__PURE__ */ Symbol.for("react.portal"), v = /* @__PURE__ */ Symbol.for("react.fragment"), pe = /* @__PURE__ */ Symbol.for("react.strict_mode"), oe = /* @__PURE__ */ Symbol.for("react.profiler"), me = /* @__PURE__ */ Symbol.for("react.provider"), he = /* @__PURE__ */ Symbol.for("react.context"), I = /* @__PURE__ */ Symbol.for("react.forward_ref"), H = /* @__PURE__ */ Symbol.for("react.suspense"), q = /* @__PURE__ */ Symbol.for("react.memo"), ye = /* @__PURE__ */ Symbol.for("react.lazy"), Z = Symbol.iterator;
  function J(c) {
    return c === null || typeof c != "object" ? null : (c = Z && c[Z] || c["@@iterator"], typeof c == "function" ? c : null);
  }
  var Me = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, K = Object.assign, W = {};
  function re(c, x, M) {
    this.props = c, this.context = x, this.refs = W, this.updater = M || Me;
  }
  re.prototype.isReactComponent = {}, re.prototype.setState = function(c, x) {
    if (typeof c != "object" && typeof c != "function" && c != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, c, x, "setState");
  }, re.prototype.forceUpdate = function(c) {
    this.updater.enqueueForceUpdate(this, c, "forceUpdate");
  };
  function je() {
  }
  je.prototype = re.prototype;
  function $e(c, x, M) {
    this.props = c, this.context = x, this.refs = W, this.updater = M || Me;
  }
  var Oe = $e.prototype = new je();
  Oe.constructor = $e, K(Oe, re.prototype), Oe.isPureReactComponent = !0;
  var ce = Array.isArray, we = Object.prototype.hasOwnProperty, xe = { current: null }, N = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Q(c, x, M) {
    var V, Y = {}, X = null, ne = null;
    if (x != null) for (V in x.ref !== void 0 && (ne = x.ref), x.key !== void 0 && (X = "" + x.key), x) we.call(x, V) && !N.hasOwnProperty(V) && (Y[V] = x[V]);
    var le = arguments.length - 2;
    if (le === 1) Y.children = M;
    else if (1 < le) {
      for (var te = Array(le), Xe = 0; Xe < le; Xe++) te[Xe] = arguments[Xe + 2];
      Y.children = te;
    }
    if (c && c.defaultProps) for (V in le = c.defaultProps, le) Y[V] === void 0 && (Y[V] = le[V]);
    return { $$typeof: g, type: c, key: X, ref: ne, props: Y, _owner: xe.current };
  }
  function ge(c, x) {
    return { $$typeof: g, type: c.type, key: x, ref: c.ref, props: c.props, _owner: c._owner };
  }
  function ae(c) {
    return typeof c == "object" && c !== null && c.$$typeof === g;
  }
  function Ue(c) {
    var x = { "=": "=0", ":": "=2" };
    return "$" + c.replace(/[=:]/g, function(M) {
      return x[M];
    });
  }
  var pt = /\/+/g;
  function at(c, x) {
    return typeof c == "object" && c !== null && c.key != null ? Ue("" + c.key) : x.toString(36);
  }
  function Ye(c, x, M, V, Y) {
    var X = typeof c;
    (X === "undefined" || X === "boolean") && (c = null);
    var ne = !1;
    if (c === null) ne = !0;
    else switch (X) {
      case "string":
      case "number":
        ne = !0;
        break;
      case "object":
        switch (c.$$typeof) {
          case g:
          case A:
            ne = !0;
        }
    }
    if (ne) return ne = c, Y = Y(ne), c = V === "" ? "." + at(ne, 0) : V, ce(Y) ? (M = "", c != null && (M = c.replace(pt, "$&/") + "/"), Ye(Y, x, M, "", function(Xe) {
      return Xe;
    })) : Y != null && (ae(Y) && (Y = ge(Y, M + (!Y.key || ne && ne.key === Y.key ? "" : ("" + Y.key).replace(pt, "$&/") + "/") + c)), x.push(Y)), 1;
    if (ne = 0, V = V === "" ? "." : V + ":", ce(c)) for (var le = 0; le < c.length; le++) {
      X = c[le];
      var te = V + at(X, le);
      ne += Ye(X, x, M, te, Y);
    }
    else if (te = J(c), typeof te == "function") for (c = te.call(c), le = 0; !(X = c.next()).done; ) X = X.value, te = V + at(X, le++), ne += Ye(X, x, M, te, Y);
    else if (X === "object") throw x = String(c), Error("Objects are not valid as a React child (found: " + (x === "[object Object]" ? "object with keys {" + Object.keys(c).join(", ") + "}" : x) + "). If you meant to render a collection of children, use an array instead.");
    return ne;
  }
  function qe(c, x, M) {
    if (c == null) return c;
    var V = [], Y = 0;
    return Ye(c, V, "", "", function(X) {
      return x.call(M, X, Y++);
    }), V;
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
  var se = { current: null }, P = { transition: null }, F = { ReactCurrentDispatcher: se, ReactCurrentBatchConfig: P, ReactCurrentOwner: xe };
  return ee.Children = { map: qe, forEach: function(c, x, M) {
    qe(c, function() {
      x.apply(this, arguments);
    }, M);
  }, count: function(c) {
    var x = 0;
    return qe(c, function() {
      x++;
    }), x;
  }, toArray: function(c) {
    return qe(c, function(x) {
      return x;
    }) || [];
  }, only: function(c) {
    if (!ae(c)) throw Error("React.Children.only expected to receive a single React element child.");
    return c;
  } }, ee.Component = re, ee.Fragment = v, ee.Profiler = oe, ee.PureComponent = $e, ee.StrictMode = pe, ee.Suspense = H, ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = F, ee.cloneElement = function(c, x, M) {
    if (c == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + c + ".");
    var V = K({}, c.props), Y = c.key, X = c.ref, ne = c._owner;
    if (x != null) {
      if (x.ref !== void 0 && (X = x.ref, ne = xe.current), x.key !== void 0 && (Y = "" + x.key), c.type && c.type.defaultProps) var le = c.type.defaultProps;
      for (te in x) we.call(x, te) && !N.hasOwnProperty(te) && (V[te] = x[te] === void 0 && le !== void 0 ? le[te] : x[te]);
    }
    var te = arguments.length - 2;
    if (te === 1) V.children = M;
    else if (1 < te) {
      le = Array(te);
      for (var Xe = 0; Xe < te; Xe++) le[Xe] = arguments[Xe + 2];
      V.children = le;
    }
    return { $$typeof: g, type: c.type, key: Y, ref: X, props: V, _owner: ne };
  }, ee.createContext = function(c) {
    return c = { $$typeof: he, _currentValue: c, _currentValue2: c, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, c.Provider = { $$typeof: me, _context: c }, c.Consumer = c;
  }, ee.createElement = Q, ee.createFactory = function(c) {
    var x = Q.bind(null, c);
    return x.type = c, x;
  }, ee.createRef = function() {
    return { current: null };
  }, ee.forwardRef = function(c) {
    return { $$typeof: I, render: c };
  }, ee.isValidElement = ae, ee.lazy = function(c) {
    return { $$typeof: ye, _payload: { _status: -1, _result: c }, _init: Pe };
  }, ee.memo = function(c, x) {
    return { $$typeof: q, type: c, compare: x === void 0 ? null : x };
  }, ee.startTransition = function(c) {
    var x = P.transition;
    P.transition = {};
    try {
      c();
    } finally {
      P.transition = x;
    }
  }, ee.unstable_act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, ee.useCallback = function(c, x) {
    return se.current.useCallback(c, x);
  }, ee.useContext = function(c) {
    return se.current.useContext(c);
  }, ee.useDebugValue = function() {
  }, ee.useDeferredValue = function(c) {
    return se.current.useDeferredValue(c);
  }, ee.useEffect = function(c, x) {
    return se.current.useEffect(c, x);
  }, ee.useId = function() {
    return se.current.useId();
  }, ee.useImperativeHandle = function(c, x, M) {
    return se.current.useImperativeHandle(c, x, M);
  }, ee.useInsertionEffect = function(c, x) {
    return se.current.useInsertionEffect(c, x);
  }, ee.useLayoutEffect = function(c, x) {
    return se.current.useLayoutEffect(c, x);
  }, ee.useMemo = function(c, x) {
    return se.current.useMemo(c, x);
  }, ee.useReducer = function(c, x, M) {
    return se.current.useReducer(c, x, M);
  }, ee.useRef = function(c) {
    return se.current.useRef(c);
  }, ee.useState = function(c) {
    return se.current.useState(c);
  }, ee.useSyncExternalStore = function(c, x, M) {
    return se.current.useSyncExternalStore(c, x, M);
  }, ee.useTransition = function() {
    return se.current.useTransition();
  }, ee.version = "18.2.0", ee;
}
var rc;
function ba() {
  return rc || (rc = 1, Ba.exports = Bd()), Ba.exports;
}
var lc;
function $d() {
  if (lc) return li;
  lc = 1;
  var g = ba(), A = /* @__PURE__ */ Symbol.for("react.element"), v = /* @__PURE__ */ Symbol.for("react.fragment"), pe = Object.prototype.hasOwnProperty, oe = g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, me = { key: !0, ref: !0, __self: !0, __source: !0 };
  function he(I, H, q) {
    var ye, Z = {}, J = null, Me = null;
    q !== void 0 && (J = "" + q), H.key !== void 0 && (J = "" + H.key), H.ref !== void 0 && (Me = H.ref);
    for (ye in H) pe.call(H, ye) && !me.hasOwnProperty(ye) && (Z[ye] = H[ye]);
    if (I && I.defaultProps) for (ye in H = I.defaultProps, H) Z[ye] === void 0 && (Z[ye] = H[ye]);
    return { $$typeof: A, type: I, key: J, ref: Me, props: Z, _owner: oe.current };
  }
  return li.Fragment = v, li.jsx = he, li.jsxs = he, li;
}
var ic;
function Ud() {
  return ic || (ic = 1, Fa.exports = $d()), Fa.exports;
}
var u = Ud(), w = ba(), ao = {}, $a = { exports: {} }, xt = {}, Ua = { exports: {} }, Ha = {};
var oc;
function Hd() {
  return oc || (oc = 1, (function(g) {
    function A(P, F) {
      var c = P.length;
      P.push(F);
      e: for (; 0 < c; ) {
        var x = c - 1 >>> 1, M = P[x];
        if (0 < oe(M, F)) P[x] = F, P[c] = M, c = x;
        else break e;
      }
    }
    function v(P) {
      return P.length === 0 ? null : P[0];
    }
    function pe(P) {
      if (P.length === 0) return null;
      var F = P[0], c = P.pop();
      if (c !== F) {
        P[0] = c;
        e: for (var x = 0, M = P.length, V = M >>> 1; x < V; ) {
          var Y = 2 * (x + 1) - 1, X = P[Y], ne = Y + 1, le = P[ne];
          if (0 > oe(X, c)) ne < M && 0 > oe(le, X) ? (P[x] = le, P[ne] = c, x = ne) : (P[x] = X, P[Y] = c, x = Y);
          else if (ne < M && 0 > oe(le, c)) P[x] = le, P[ne] = c, x = ne;
          else break e;
        }
      }
      return F;
    }
    function oe(P, F) {
      var c = P.sortIndex - F.sortIndex;
      return c !== 0 ? c : P.id - F.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var me = performance;
      g.unstable_now = function() {
        return me.now();
      };
    } else {
      var he = Date, I = he.now();
      g.unstable_now = function() {
        return he.now() - I;
      };
    }
    var H = [], q = [], ye = 1, Z = null, J = 3, Me = !1, K = !1, W = !1, re = typeof setTimeout == "function" ? setTimeout : null, je = typeof clearTimeout == "function" ? clearTimeout : null, $e = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Oe(P) {
      for (var F = v(q); F !== null; ) {
        if (F.callback === null) pe(q);
        else if (F.startTime <= P) pe(q), F.sortIndex = F.expirationTime, A(H, F);
        else break;
        F = v(q);
      }
    }
    function ce(P) {
      if (W = !1, Oe(P), !K) if (v(H) !== null) K = !0, Pe(we);
      else {
        var F = v(q);
        F !== null && se(ce, F.startTime - P);
      }
    }
    function we(P, F) {
      K = !1, W && (W = !1, je(Q), Q = -1), Me = !0;
      var c = J;
      try {
        for (Oe(F), Z = v(H); Z !== null && (!(Z.expirationTime > F) || P && !Ue()); ) {
          var x = Z.callback;
          if (typeof x == "function") {
            Z.callback = null, J = Z.priorityLevel;
            var M = x(Z.expirationTime <= F);
            F = g.unstable_now(), typeof M == "function" ? Z.callback = M : Z === v(H) && pe(H), Oe(F);
          } else pe(H);
          Z = v(H);
        }
        if (Z !== null) var V = !0;
        else {
          var Y = v(q);
          Y !== null && se(ce, Y.startTime - F), V = !1;
        }
        return V;
      } finally {
        Z = null, J = c, Me = !1;
      }
    }
    var xe = !1, N = null, Q = -1, ge = 5, ae = -1;
    function Ue() {
      return !(g.unstable_now() - ae < ge);
    }
    function pt() {
      if (N !== null) {
        var P = g.unstable_now();
        ae = P;
        var F = !0;
        try {
          F = N(!0, P);
        } finally {
          F ? at() : (xe = !1, N = null);
        }
      } else xe = !1;
    }
    var at;
    if (typeof $e == "function") at = function() {
      $e(pt);
    };
    else if (typeof MessageChannel < "u") {
      var Ye = new MessageChannel(), qe = Ye.port2;
      Ye.port1.onmessage = pt, at = function() {
        qe.postMessage(null);
      };
    } else at = function() {
      re(pt, 0);
    };
    function Pe(P) {
      N = P, xe || (xe = !0, at());
    }
    function se(P, F) {
      Q = re(function() {
        P(g.unstable_now());
      }, F);
    }
    g.unstable_IdlePriority = 5, g.unstable_ImmediatePriority = 1, g.unstable_LowPriority = 4, g.unstable_NormalPriority = 3, g.unstable_Profiling = null, g.unstable_UserBlockingPriority = 2, g.unstable_cancelCallback = function(P) {
      P.callback = null;
    }, g.unstable_continueExecution = function() {
      K || Me || (K = !0, Pe(we));
    }, g.unstable_forceFrameRate = function(P) {
      0 > P || 125 < P ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ge = 0 < P ? Math.floor(1e3 / P) : 5;
    }, g.unstable_getCurrentPriorityLevel = function() {
      return J;
    }, g.unstable_getFirstCallbackNode = function() {
      return v(H);
    }, g.unstable_next = function(P) {
      switch (J) {
        case 1:
        case 2:
        case 3:
          var F = 3;
          break;
        default:
          F = J;
      }
      var c = J;
      J = F;
      try {
        return P();
      } finally {
        J = c;
      }
    }, g.unstable_pauseExecution = function() {
    }, g.unstable_requestPaint = function() {
    }, g.unstable_runWithPriority = function(P, F) {
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
        return F();
      } finally {
        J = c;
      }
    }, g.unstable_scheduleCallback = function(P, F, c) {
      var x = g.unstable_now();
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
      return M = c + M, P = { id: ye++, callback: F, priorityLevel: P, startTime: c, expirationTime: M, sortIndex: -1 }, c > x ? (P.sortIndex = c, A(q, P), v(H) === null && P === v(q) && (W ? (je(Q), Q = -1) : W = !0, se(ce, c - x))) : (P.sortIndex = M, A(H, P), K || Me || (K = !0, Pe(we))), P;
    }, g.unstable_shouldYield = Ue, g.unstable_wrapCallback = function(P) {
      var F = J;
      return function() {
        var c = J;
        J = F;
        try {
          return P.apply(this, arguments);
        } finally {
          J = c;
        }
      };
    };
  })(Ha)), Ha;
}
var ac;
function Wd() {
  return ac || (ac = 1, Ua.exports = Hd()), Ua.exports;
}
var sc;
function bd() {
  if (sc) return xt;
  sc = 1;
  var g = ba(), A = Wd();
  function v(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var pe = /* @__PURE__ */ new Set(), oe = {};
  function me(e, t) {
    he(e, t), he(e + "Capture", t);
  }
  function he(e, t) {
    for (oe[e] = t, e = 0; e < t.length; e++) pe.add(t[e]);
  }
  var I = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), H = Object.prototype.hasOwnProperty, q = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, ye = {}, Z = {};
  function J(e) {
    return H.call(Z, e) ? !0 : H.call(ye, e) ? !1 : q.test(e) ? Z[e] = !0 : (ye[e] = !0, !1);
  }
  function Me(e, t, n, r) {
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
    if (t === null || typeof t > "u" || Me(e, t, n, r)) return !0;
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
  function W(e, t, n, r, l, i, o) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = o;
  }
  var re = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    re[e] = new W(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    re[t] = new W(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    re[e] = new W(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    re[e] = new W(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    re[e] = new W(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    re[e] = new W(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    re[e] = new W(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    re[e] = new W(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    re[e] = new W(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var je = /[\-:]([a-z])/g;
  function $e(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      je,
      $e
    );
    re[t] = new W(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(je, $e);
    re[t] = new W(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(je, $e);
    re[t] = new W(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    re[e] = new W(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), re.xlinkHref = new W("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    re[e] = new W(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Oe(e, t, n, r) {
    var l = re.hasOwnProperty(t) ? re[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (K(t, n, l, r) && (n = null), r || l === null ? J(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ce = g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, we = /* @__PURE__ */ Symbol.for("react.element"), xe = /* @__PURE__ */ Symbol.for("react.portal"), N = /* @__PURE__ */ Symbol.for("react.fragment"), Q = /* @__PURE__ */ Symbol.for("react.strict_mode"), ge = /* @__PURE__ */ Symbol.for("react.profiler"), ae = /* @__PURE__ */ Symbol.for("react.provider"), Ue = /* @__PURE__ */ Symbol.for("react.context"), pt = /* @__PURE__ */ Symbol.for("react.forward_ref"), at = /* @__PURE__ */ Symbol.for("react.suspense"), Ye = /* @__PURE__ */ Symbol.for("react.suspense_list"), qe = /* @__PURE__ */ Symbol.for("react.memo"), Pe = /* @__PURE__ */ Symbol.for("react.lazy"), se = /* @__PURE__ */ Symbol.for("react.offscreen"), P = Symbol.iterator;
  function F(e) {
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
  var V = !1;
  function Y(e, t) {
    if (!e || V) return "";
    V = !0;
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
`), o = l.length - 1, s = i.length - 1; 1 <= o && 0 <= s && l[o] !== i[s]; ) s--;
        for (; 1 <= o && 0 <= s; o--, s--) if (l[o] !== i[s]) {
          if (o !== 1 || s !== 1)
            do
              if (o--, s--, 0 > s || l[o] !== i[s]) {
                var d = `
` + l[o].replace(" at new ", " at ");
                return e.displayName && d.includes("<anonymous>") && (d = d.replace("<anonymous>", e.displayName)), d;
              }
            while (1 <= o && 0 <= s);
          break;
        }
      }
    } finally {
      V = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? M(e) : "";
  }
  function X(e) {
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
  function ne(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case N:
        return "Fragment";
      case xe:
        return "Portal";
      case ge:
        return "Profiler";
      case Q:
        return "StrictMode";
      case at:
        return "Suspense";
      case Ye:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Ue:
        return (e.displayName || "Context") + ".Consumer";
      case ae:
        return (e._context.displayName || "Context") + ".Provider";
      case pt:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case qe:
        return t = e.displayName || null, t !== null ? t : ne(e.type) || "Memo";
      case Pe:
        t = e._payload, e = e._init;
        try {
          return ne(e(t));
        } catch {
        }
    }
    return null;
  }
  function le(e) {
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
        return ne(t);
      case 8:
        return t === Q ? "StrictMode" : "Mode";
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
  function te(e) {
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
  function Xe(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function jn(e) {
    var t = Xe(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  function kt(e) {
    e._valueTracker || (e._valueTracker = jn(e));
  }
  function Ir(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = Xe(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function nr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function an(e, t) {
    var n = t.checked;
    return c({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Mt(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = te(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Or(e, t) {
    t = t.checked, t != null && Oe(e, "checked", t, !1);
  }
  function It(e, t) {
    Or(e, t);
    var n = te(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Fr(e, t.type, n) : t.hasOwnProperty("defaultValue") && Fr(e, t.type, te(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Ar(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Fr(e, t, n) {
    (t !== "number" || nr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var mt = Array.isArray;
  function Yt(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + te(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Pn(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(v(91));
    return c({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function ml(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(v(92));
        if (mt(n)) {
          if (1 < n.length) throw Error(v(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: te(n) };
  }
  function Rn(e, t) {
    var n = te(t.value), r = te(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function hl(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Ln(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function zn(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Ln(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var rr, Tn = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (rr = rr || document.createElement("div"), rr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = rr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
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
  var sn = {
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
  Object.keys(sn).forEach(function(e) {
    oi.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), sn[t] = sn[e];
    });
  });
  function qt(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || sn.hasOwnProperty(e) && sn[e] ? ("" + t).trim() : t + "px";
  }
  function vl(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = qt(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var yl = c({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function un(e, t) {
    if (t) {
      if (yl[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(v(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(v(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(v(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(v(62));
    }
  }
  function lr(e, t) {
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
  var ir = null;
  function cn(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Ae = null, Xt = null, et = null;
  function Br(e) {
    if (e = Wl(e)) {
      if (typeof Ae != "function") throw Error(v(280));
      var t = e.stateNode;
      t && (t = Si(t), Ae(e.stateNode, e.type, t));
    }
  }
  function st(e) {
    Xt ? et ? et.push(e) : et = [e] : Xt = e;
  }
  function gl() {
    if (Xt) {
      var e = Xt, t = et;
      if (et = Xt = null, Br(e), t) for (e = 0; e < t.length; e++) Br(t[e]);
    }
  }
  function Gt(e, t) {
    return e(t);
  }
  function wl() {
  }
  var Fe = !1;
  function Dn(e, t, n) {
    if (Fe) return e(t, n);
    Fe = !0;
    try {
      return Gt(e, t, n);
    } finally {
      Fe = !1, (Xt !== null || et !== null) && (wl(), gl());
    }
  }
  function ze(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = Si(n);
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
  var or = !1;
  if (I) try {
    var Mn = {};
    Object.defineProperty(Mn, "passive", { get: function() {
      or = !0;
    } }), window.addEventListener("test", Mn, Mn), window.removeEventListener("test", Mn, Mn);
  } catch {
    or = !1;
  }
  function $r(e, t, n, r, l, i, o, s, d) {
    var h = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, h);
    } catch (S) {
      this.onError(S);
    }
  }
  var In = !1, Nt = null, Ur = !1, dn = null, Hr = { onError: function(e) {
    In = !0, Nt = e;
  } };
  function Wr(e, t, n, r, l, i, o, s, d) {
    In = !1, Nt = null, $r.apply(Hr, arguments);
  }
  function so(e, t, n, r, l, i, o, s, d) {
    if (Wr.apply(this, arguments), In) {
      if (In) {
        var h = Nt;
        In = !1, Nt = null;
      } else throw Error(v(198));
      Ur || (Ur = !0, dn = h);
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
  function On(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function ar(e) {
    if (At(e) !== e) throw Error(v(188));
  }
  function sr(e) {
    var t = e.alternate;
    if (!t) {
      if (t = At(e), t === null) throw Error(v(188));
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
          if (i === n) return ar(l), e;
          if (i === r) return ar(l), t;
          i = i.sibling;
        }
        throw Error(v(188));
      }
      if (n.return !== r.return) n = l, r = i;
      else {
        for (var o = !1, s = l.child; s; ) {
          if (s === n) {
            o = !0, n = l, r = i;
            break;
          }
          if (s === r) {
            o = !0, r = l, n = i;
            break;
          }
          s = s.sibling;
        }
        if (!o) {
          for (s = i.child; s; ) {
            if (s === n) {
              o = !0, n = i, r = l;
              break;
            }
            if (s === r) {
              o = !0, r = i, n = l;
              break;
            }
            s = s.sibling;
          }
          if (!o) throw Error(v(189));
        }
      }
      if (n.alternate !== r) throw Error(v(190));
    }
    if (n.tag !== 3) throw Error(v(188));
    return n.stateNode.current === n ? e : t;
  }
  function An(e) {
    return e = sr(e), e !== null ? ai(e) : null;
  }
  function ai(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = ai(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var xl = A.unstable_scheduleCallback, ur = A.unstable_cancelCallback, kl = A.unstable_shouldYield, si = A.unstable_requestPaint, Se = A.unstable_now, Sl = A.unstable_getCurrentPriorityLevel, cr = A.unstable_ImmediatePriority, _l = A.unstable_UserBlockingPriority, fn = A.unstable_NormalPriority, Cl = A.unstable_LowPriority, dr = A.unstable_IdlePriority, pn = null, St = null;
  function uo(e) {
    if (St && typeof St.onCommitFiberRoot == "function") try {
      St.onCommitFiberRoot(pn, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var ut = Math.clz32 ? Math.clz32 : jl, El = Math.log, Nl = Math.LN2;
  function jl(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (El(e) / Nl | 0) | 0;
  }
  var fr = 64, pr = 4194304;
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
  function mr(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, i = e.pingedLanes, o = n & 268435455;
    if (o !== 0) {
      var s = o & ~l;
      s !== 0 ? r = Fn(s) : (i &= o, i !== 0 && (r = Fn(i)));
    } else o = n & ~l, o !== 0 ? r = Fn(o) : i !== 0 && (r = Fn(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, i = t & -t, l >= i || l === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - ut(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function ui(e, t) {
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
  function Ft(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var o = 31 - ut(i), s = 1 << o, d = l[o];
      d === -1 ? ((s & n) === 0 || (s & r) !== 0) && (l[o] = ui(s, t)) : d <= t && (e.expiredLanes |= s), i &= ~s;
    }
  }
  function mn(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function Pl() {
    var e = fr;
    return fr <<= 1, (fr & 4194240) === 0 && (fr = 64), e;
  }
  function Bt(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function jt(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - ut(t), e[t] = n;
  }
  function G(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - ut(n), i = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~i;
    }
  }
  function hn(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - ut(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var de = 0;
  function hr(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var vr, Zt, yr, Ge, Rl, br = !1, ie = [], $t = null, tt = null, Te = null, _e = /* @__PURE__ */ new Map(), vn = /* @__PURE__ */ new Map(), Ut = [], ci = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Jt(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        $t = null;
        break;
      case "dragenter":
      case "dragleave":
        tt = null;
        break;
      case "mouseover":
      case "mouseout":
        Te = null;
        break;
      case "pointerover":
      case "pointerout":
        _e.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        vn.delete(t.pointerId);
    }
  }
  function Bn(e, t, n, r, l, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [l] }, t !== null && (t = Wl(t), t !== null && Zt(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function co(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return $t = Bn($t, e, t, n, r, l), !0;
      case "dragenter":
        return tt = Bn(tt, e, t, n, r, l), !0;
      case "mouseover":
        return Te = Bn(Te, e, t, n, r, l), !0;
      case "pointerover":
        var i = l.pointerId;
        return _e.set(i, Bn(_e.get(i) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return i = l.pointerId, vn.set(i, Bn(vn.get(i) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function di(e) {
    var t = Sr(e.target);
    if (t !== null) {
      var n = At(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = On(n), t !== null) {
            e.blockedOn = t, Rl(e.priority, function() {
              yr(n);
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
  function $n(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = zl(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        ir = r, n.target.dispatchEvent(r), ir = null;
      } else return t = Wl(n), t !== null && Zt(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function fi(e, t, n) {
    $n(e) && n.delete(t);
  }
  function fo() {
    br = !1, $t !== null && $n($t) && ($t = null), tt !== null && $n(tt) && (tt = null), Te !== null && $n(Te) && (Te = null), _e.forEach(fi), vn.forEach(fi);
  }
  function gr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, br || (br = !0, A.unstable_scheduleCallback(A.unstable_NormalPriority, fo)));
  }
  function wr(e) {
    function t(l) {
      return gr(l, e);
    }
    if (0 < ie.length) {
      gr(ie[0], e);
      for (var n = 1; n < ie.length; n++) {
        var r = ie[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for ($t !== null && gr($t, e), tt !== null && gr(tt, e), Te !== null && gr(Te, e), _e.forEach(t), vn.forEach(t), n = 0; n < Ut.length; n++) r = Ut[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Ut.length && (n = Ut[0], n.blockedOn === null); ) di(n), n.blockedOn === null && Ut.shift();
  }
  var ct = ce.ReactCurrentBatchConfig, yn = !0;
  function po(e, t, n, r) {
    var l = de, i = ct.transition;
    ct.transition = null;
    try {
      de = 1, Ll(e, t, n, r);
    } finally {
      de = l, ct.transition = i;
    }
  }
  function mo(e, t, n, r) {
    var l = de, i = ct.transition;
    ct.transition = null;
    try {
      de = 4, Ll(e, t, n, r);
    } finally {
      de = l, ct.transition = i;
    }
  }
  function Ll(e, t, n, r) {
    if (yn) {
      var l = zl(e, t, n, r);
      if (l === null) Po(e, t, r, Vr, n), Jt(e, r);
      else if (co(l, e, t, n, r)) r.stopPropagation();
      else if (Jt(e, r), t & 4 && -1 < ci.indexOf(e)) {
        for (; l !== null; ) {
          var i = Wl(l);
          if (i !== null && vr(i), i = zl(e, t, n, r), i === null && Po(e, t, r, Vr, n), i === l) break;
          l = i;
        }
        l !== null && r.stopPropagation();
      } else Po(e, t, r, null, n);
    }
  }
  var Vr = null;
  function zl(e, t, n, r) {
    if (Vr = null, e = cn(r), e = Sr(e), e !== null) if (t = At(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = On(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Vr = e, null;
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
        switch (Sl()) {
          case cr:
            return 1;
          case _l:
            return 4;
          case fn:
          case Cl:
            return 16;
          case dr:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var en = null, Tl = null, xr = null;
  function mi() {
    if (xr) return xr;
    var e, t = Tl, n = t.length, r, l = "value" in en ? en.value : en.textContent, i = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var o = n - e;
    for (r = 1; r <= o && t[n - r] === l[i - r]; r++) ;
    return xr = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Qr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Un() {
    return !0;
  }
  function Dl() {
    return !1;
  }
  function nt(e) {
    function t(n, r, l, i, o) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = i, this.target = o, this.currentTarget = null;
      for (var s in e) e.hasOwnProperty(s) && (n = e[s], this[s] = n ? n(i) : i[s]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Un : Dl, this.isPropagationStopped = Dl, this;
    }
    return c(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Un);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Un);
    }, persist: function() {
    }, isPersistent: Un }), t;
  }
  var gn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, a = nt(gn), y = c({}, gn, { view: 0, detail: 0 }), j = nt(y), C, T, B, ve = c({}, y, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: yo, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== B && (B && e.type === "mousemove" ? (C = e.screenX - B.screenX, T = e.screenY - B.screenY) : T = C = 0, B = e), C);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : T;
  } }), He = nt(ve), ho = c({}, ve, { dataTransfer: 0 }), kr = nt(ho), hc = c({}, y, { relatedTarget: 0 }), vo = nt(hc), vc = c({}, gn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), yc = nt(vc), gc = c({}, gn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), wc = nt(gc), xc = c({}, gn, { data: 0 }), Va = nt(xc), kc = {
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
  }, _c = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Cc(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = _c[e]) ? !!t[e] : !1;
  }
  function yo() {
    return Cc;
  }
  var Ec = c({}, y, { key: function(e) {
    if (e.key) {
      var t = kc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Qr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Sc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: yo, charCode: function(e) {
    return e.type === "keypress" ? Qr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Qr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Nc = nt(Ec), jc = c({}, ve, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Qa = nt(jc), Pc = c({}, y, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: yo }), Rc = nt(Pc), Lc = c({}, gn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), zc = nt(Lc), Tc = c({}, ve, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Dc = nt(Tc), Mc = [9, 13, 27, 32], go = I && "CompositionEvent" in window, Ml = null;
  I && "documentMode" in document && (Ml = document.documentMode);
  var Ic = I && "TextEvent" in window && !Ml, Ka = I && (!go || Ml && 8 < Ml && 11 >= Ml), Ya = " ", qa = !1;
  function Xa(e, t) {
    switch (e) {
      case "keyup":
        return Mc.indexOf(t.keyCode) !== -1;
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
  function Ga(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Kr = !1;
  function Oc(e, t) {
    switch (e) {
      case "compositionend":
        return Ga(t);
      case "keypress":
        return t.which !== 32 ? null : (qa = !0, Ya);
      case "textInput":
        return e = t.data, e === Ya && qa ? null : e;
      default:
        return null;
    }
  }
  function Ac(e, t) {
    if (Kr) return e === "compositionend" || !go && Xa(e, t) ? (e = mi(), xr = Tl = en = null, Kr = !1, e) : null;
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
        return Ka && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Fc = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Za(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Fc[e.type] : t === "textarea";
  }
  function Ja(e, t, n, r) {
    st(r), t = wi(t, "onChange"), 0 < t.length && (n = new a("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var Il = null, Ol = null;
  function Bc(e) {
    ys(e, 0);
  }
  function hi(e) {
    var t = Zr(e);
    if (Ir(t)) return e;
  }
  function $c(e, t) {
    if (e === "change") return t;
  }
  var es = !1;
  if (I) {
    var wo;
    if (I) {
      var xo = "oninput" in document;
      if (!xo) {
        var ts = document.createElement("div");
        ts.setAttribute("oninput", "return;"), xo = typeof ts.oninput == "function";
      }
      wo = xo;
    } else wo = !1;
    es = wo && (!document.documentMode || 9 < document.documentMode);
  }
  function ns() {
    Il && (Il.detachEvent("onpropertychange", rs), Ol = Il = null);
  }
  function rs(e) {
    if (e.propertyName === "value" && hi(Ol)) {
      var t = [];
      Ja(t, Ol, e, cn(e)), Dn(Bc, t);
    }
  }
  function Uc(e, t, n) {
    e === "focusin" ? (ns(), Il = t, Ol = n, Il.attachEvent("onpropertychange", rs)) : e === "focusout" && ns();
  }
  function Hc(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return hi(Ol);
  }
  function Wc(e, t) {
    if (e === "click") return hi(t);
  }
  function bc(e, t) {
    if (e === "input" || e === "change") return hi(t);
  }
  function Vc(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Ht = typeof Object.is == "function" ? Object.is : Vc;
  function Al(e, t) {
    if (Ht(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!H.call(t, l) || !Ht(e[l], t[l])) return !1;
    }
    return !0;
  }
  function ls(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function is(e, t) {
    var n = ls(e);
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
      n = ls(n);
    }
  }
  function os(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? os(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function as() {
    for (var e = window, t = nr(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = nr(e.document);
    }
    return t;
  }
  function ko(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Qc(e) {
    var t = as(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && os(n.ownerDocument.documentElement, n)) {
      if (r !== null && ko(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, i = Math.min(r.start, l);
          r = r.end === void 0 ? i : Math.min(r.end, l), !e.extend && i > r && (l = r, r = i, i = l), l = is(n, i);
          var o = is(
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
  var Kc = I && "documentMode" in document && 11 >= document.documentMode, Yr = null, So = null, Fl = null, _o = !1;
  function ss(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    _o || Yr == null || Yr !== nr(r) || (r = Yr, "selectionStart" in r && ko(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), Fl && Al(Fl, r) || (Fl = r, r = wi(So, "onSelect"), 0 < r.length && (t = new a("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Yr)));
  }
  function vi(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var qr = { animationend: vi("Animation", "AnimationEnd"), animationiteration: vi("Animation", "AnimationIteration"), animationstart: vi("Animation", "AnimationStart"), transitionend: vi("Transition", "TransitionEnd") }, Co = {}, us = {};
  I && (us = document.createElement("div").style, "AnimationEvent" in window || (delete qr.animationend.animation, delete qr.animationiteration.animation, delete qr.animationstart.animation), "TransitionEvent" in window || delete qr.transitionend.transition);
  function yi(e) {
    if (Co[e]) return Co[e];
    if (!qr[e]) return e;
    var t = qr[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in us) return Co[e] = t[n];
    return e;
  }
  var cs = yi("animationend"), ds = yi("animationiteration"), fs = yi("animationstart"), ps = yi("transitionend"), ms = /* @__PURE__ */ new Map(), hs = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Hn(e, t) {
    ms.set(e, t), me(t, [e]);
  }
  for (var Eo = 0; Eo < hs.length; Eo++) {
    var No = hs[Eo], Yc = No.toLowerCase(), qc = No[0].toUpperCase() + No.slice(1);
    Hn(Yc, "on" + qc);
  }
  Hn(cs, "onAnimationEnd"), Hn(ds, "onAnimationIteration"), Hn(fs, "onAnimationStart"), Hn("dblclick", "onDoubleClick"), Hn("focusin", "onFocus"), Hn("focusout", "onBlur"), Hn(ps, "onTransitionEnd"), he("onMouseEnter", ["mouseout", "mouseover"]), he("onMouseLeave", ["mouseout", "mouseover"]), he("onPointerEnter", ["pointerout", "pointerover"]), he("onPointerLeave", ["pointerout", "pointerover"]), me("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), me("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), me("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), me("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), me("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), me("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Bl = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Xc = new Set("cancel close invalid load scroll toggle".split(" ").concat(Bl));
  function vs(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, so(r, t, void 0, e), e.currentTarget = null;
  }
  function ys(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var o = r.length - 1; 0 <= o; o--) {
          var s = r[o], d = s.instance, h = s.currentTarget;
          if (s = s.listener, d !== i && l.isPropagationStopped()) break e;
          vs(l, s, h), i = d;
        }
        else for (o = 0; o < r.length; o++) {
          if (s = r[o], d = s.instance, h = s.currentTarget, s = s.listener, d !== i && l.isPropagationStopped()) break e;
          vs(l, s, h), i = d;
        }
      }
    }
    if (Ur) throw e = dn, Ur = !1, dn = null, e;
  }
  function Ce(e, t) {
    var n = t[Mo];
    n === void 0 && (n = t[Mo] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (gs(t, e, 2, !1), n.add(r));
  }
  function jo(e, t, n) {
    var r = 0;
    t && (r |= 4), gs(n, e, r, t);
  }
  var gi = "_reactListening" + Math.random().toString(36).slice(2);
  function $l(e) {
    if (!e[gi]) {
      e[gi] = !0, pe.forEach(function(n) {
        n !== "selectionchange" && (Xc.has(n) || jo(n, !1, e), jo(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[gi] || (t[gi] = !0, jo("selectionchange", !1, t));
    }
  }
  function gs(e, t, n, r) {
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
    n = l.bind(null, t, n, e), l = void 0, !or || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function Po(e, t, n, r, l) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var s = r.stateNode.containerInfo;
        if (s === l || s.nodeType === 8 && s.parentNode === l) break;
        if (o === 4) for (o = r.return; o !== null; ) {
          var d = o.tag;
          if ((d === 3 || d === 4) && (d = o.stateNode.containerInfo, d === l || d.nodeType === 8 && d.parentNode === l)) return;
          o = o.return;
        }
        for (; s !== null; ) {
          if (o = Sr(s), o === null) return;
          if (d = o.tag, d === 5 || d === 6) {
            r = i = o;
            continue e;
          }
          s = s.parentNode;
        }
      }
      r = r.return;
    }
    Dn(function() {
      var h = i, S = cn(n), _ = [];
      e: {
        var k = ms.get(e);
        if (k !== void 0) {
          var R = a, z = e;
          switch (e) {
            case "keypress":
              if (Qr(n) === 0) break e;
            case "keydown":
            case "keyup":
              R = Nc;
              break;
            case "focusin":
              z = "focus", R = vo;
              break;
            case "focusout":
              z = "blur", R = vo;
              break;
            case "beforeblur":
            case "afterblur":
              R = vo;
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
              R = He;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              R = kr;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              R = Rc;
              break;
            case cs:
            case ds:
            case fs:
              R = yc;
              break;
            case ps:
              R = zc;
              break;
            case "scroll":
              R = j;
              break;
            case "wheel":
              R = Dc;
              break;
            case "copy":
            case "cut":
            case "paste":
              R = wc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              R = Qa;
          }
          var D = (t & 4) !== 0, Ie = !D && e === "scroll", p = D ? k !== null ? k + "Capture" : null : k;
          D = [];
          for (var f = h, m; f !== null; ) {
            m = f;
            var E = m.stateNode;
            if (m.tag === 5 && E !== null && (m = E, p !== null && (E = ze(f, p), E != null && D.push(Ul(f, E, m)))), Ie) break;
            f = f.return;
          }
          0 < D.length && (k = new R(k, z, null, n, S), _.push({ event: k, listeners: D }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (k = e === "mouseover" || e === "pointerover", R = e === "mouseout" || e === "pointerout", k && n !== ir && (z = n.relatedTarget || n.fromElement) && (Sr(z) || z[wn])) break e;
          if ((R || k) && (k = S.window === S ? S : (k = S.ownerDocument) ? k.defaultView || k.parentWindow : window, R ? (z = n.relatedTarget || n.toElement, R = h, z = z ? Sr(z) : null, z !== null && (Ie = At(z), z !== Ie || z.tag !== 5 && z.tag !== 6) && (z = null)) : (R = null, z = h), R !== z)) {
            if (D = He, E = "onMouseLeave", p = "onMouseEnter", f = "mouse", (e === "pointerout" || e === "pointerover") && (D = Qa, E = "onPointerLeave", p = "onPointerEnter", f = "pointer"), Ie = R == null ? k : Zr(R), m = z == null ? k : Zr(z), k = new D(E, f + "leave", R, n, S), k.target = Ie, k.relatedTarget = m, E = null, Sr(S) === h && (D = new D(p, f + "enter", z, n, S), D.target = m, D.relatedTarget = Ie, E = D), Ie = E, R && z) t: {
              for (D = R, p = z, f = 0, m = D; m; m = Xr(m)) f++;
              for (m = 0, E = p; E; E = Xr(E)) m++;
              for (; 0 < f - m; ) D = Xr(D), f--;
              for (; 0 < m - f; ) p = Xr(p), m--;
              for (; f--; ) {
                if (D === p || p !== null && D === p.alternate) break t;
                D = Xr(D), p = Xr(p);
              }
              D = null;
            }
            else D = null;
            R !== null && ws(_, k, R, D, !1), z !== null && Ie !== null && ws(_, Ie, z, D, !0);
          }
        }
        e: {
          if (k = h ? Zr(h) : window, R = k.nodeName && k.nodeName.toLowerCase(), R === "select" || R === "input" && k.type === "file") var O = $c;
          else if (Za(k)) if (es) O = bc;
          else {
            O = Hc;
            var $ = Uc;
          }
          else (R = k.nodeName) && R.toLowerCase() === "input" && (k.type === "checkbox" || k.type === "radio") && (O = Wc);
          if (O && (O = O(e, h))) {
            Ja(_, O, n, S);
            break e;
          }
          $ && $(e, k, h), e === "focusout" && ($ = k._wrapperState) && $.controlled && k.type === "number" && Fr(k, "number", k.value);
        }
        switch ($ = h ? Zr(h) : window, e) {
          case "focusin":
            (Za($) || $.contentEditable === "true") && (Yr = $, So = h, Fl = null);
            break;
          case "focusout":
            Fl = So = Yr = null;
            break;
          case "mousedown":
            _o = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            _o = !1, ss(_, n, S);
            break;
          case "selectionchange":
            if (Kc) break;
          case "keydown":
          case "keyup":
            ss(_, n, S);
        }
        var U;
        if (go) e: {
          switch (e) {
            case "compositionstart":
              var b = "onCompositionStart";
              break e;
            case "compositionend":
              b = "onCompositionEnd";
              break e;
            case "compositionupdate":
              b = "onCompositionUpdate";
              break e;
          }
          b = void 0;
        }
        else Kr ? Xa(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
        b && (Ka && n.locale !== "ko" && (Kr || b !== "onCompositionStart" ? b === "onCompositionEnd" && Kr && (U = mi()) : (en = S, Tl = "value" in en ? en.value : en.textContent, Kr = !0)), $ = wi(h, b), 0 < $.length && (b = new Va(b, e, null, n, S), _.push({ event: b, listeners: $ }), U ? b.data = U : (U = Ga(n), U !== null && (b.data = U)))), (U = Ic ? Oc(e, n) : Ac(e, n)) && (h = wi(h, "onBeforeInput"), 0 < h.length && (S = new Va("onBeforeInput", "beforeinput", null, n, S), _.push({ event: S, listeners: h }), S.data = U));
      }
      ys(_, t);
    });
  }
  function Ul(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function wi(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, i = l.stateNode;
      l.tag === 5 && i !== null && (l = i, i = ze(e, n), i != null && r.unshift(Ul(e, i, l)), i = ze(e, t), i != null && r.push(Ul(e, i, l))), e = e.return;
    }
    return r;
  }
  function Xr(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function ws(e, t, n, r, l) {
    for (var i = t._reactName, o = []; n !== null && n !== r; ) {
      var s = n, d = s.alternate, h = s.stateNode;
      if (d !== null && d === r) break;
      s.tag === 5 && h !== null && (s = h, l ? (d = ze(n, i), d != null && o.unshift(Ul(n, d, s))) : l || (d = ze(n, i), d != null && o.push(Ul(n, d, s)))), n = n.return;
    }
    o.length !== 0 && e.push({ event: t, listeners: o });
  }
  var Gc = /\r\n?/g, Zc = /\u0000|\uFFFD/g;
  function xs(e) {
    return (typeof e == "string" ? e : "" + e).replace(Gc, `
`).replace(Zc, "");
  }
  function xi(e, t, n) {
    if (t = xs(t), xs(e) !== t && n) throw Error(v(425));
  }
  function ki() {
  }
  var Ro = null, Lo = null;
  function zo(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var To = typeof setTimeout == "function" ? setTimeout : void 0, Jc = typeof clearTimeout == "function" ? clearTimeout : void 0, ks = typeof Promise == "function" ? Promise : void 0, ed = typeof queueMicrotask == "function" ? queueMicrotask : typeof ks < "u" ? function(e) {
    return ks.resolve(null).then(e).catch(td);
  } : To;
  function td(e) {
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
          e.removeChild(l), wr(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    wr(t);
  }
  function Wn(e) {
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
  function Ss(e) {
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
  var Gr = Math.random().toString(36).slice(2), tn = "__reactFiber$" + Gr, Hl = "__reactProps$" + Gr, wn = "__reactContainer$" + Gr, Mo = "__reactEvents$" + Gr, nd = "__reactListeners$" + Gr, rd = "__reactHandles$" + Gr;
  function Sr(e) {
    var t = e[tn];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[wn] || n[tn]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Ss(e); e !== null; ) {
          if (n = e[tn]) return n;
          e = Ss(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function Wl(e) {
    return e = e[tn] || e[wn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Zr(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(v(33));
  }
  function Si(e) {
    return e[Hl] || null;
  }
  var Io = [], Jr = -1;
  function bn(e) {
    return { current: e };
  }
  function Ee(e) {
    0 > Jr || (e.current = Io[Jr], Io[Jr] = null, Jr--);
  }
  function ke(e, t) {
    Jr++, Io[Jr] = e.current, e.current = t;
  }
  var Vn = {}, rt = bn(Vn), ht = bn(!1), _r = Vn;
  function el(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Vn;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, i;
    for (i in n) l[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function vt(e) {
    return e = e.childContextTypes, e != null;
  }
  function _i() {
    Ee(ht), Ee(rt);
  }
  function _s(e, t, n) {
    if (rt.current !== Vn) throw Error(v(168));
    ke(rt, t), ke(ht, n);
  }
  function Cs(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(v(108, le(e) || "Unknown", l));
    return c({}, n, r);
  }
  function Ci(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Vn, _r = rt.current, ke(rt, e), ke(ht, ht.current), !0;
  }
  function Es(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(v(169));
    n ? (e = Cs(e, t, _r), r.__reactInternalMemoizedMergedChildContext = e, Ee(ht), Ee(rt), ke(rt, e)) : Ee(ht), ke(ht, n);
  }
  var xn = null, Ei = !1, Oo = !1;
  function Ns(e) {
    xn === null ? xn = [e] : xn.push(e);
  }
  function ld(e) {
    Ei = !0, Ns(e);
  }
  function Qn() {
    if (!Oo && xn !== null) {
      Oo = !0;
      var e = 0, t = de;
      try {
        var n = xn;
        for (de = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        xn = null, Ei = !1;
      } catch (l) {
        throw xn !== null && (xn = xn.slice(e + 1)), xl(cr, Qn), l;
      } finally {
        de = t, Oo = !1;
      }
    }
    return null;
  }
  var tl = [], nl = 0, Ni = null, ji = 0, Pt = [], Rt = 0, Cr = null, kn = 1, Sn = "";
  function Er(e, t) {
    tl[nl++] = ji, tl[nl++] = Ni, Ni = e, ji = t;
  }
  function js(e, t, n) {
    Pt[Rt++] = kn, Pt[Rt++] = Sn, Pt[Rt++] = Cr, Cr = e;
    var r = kn;
    e = Sn;
    var l = 32 - ut(r) - 1;
    r &= ~(1 << l), n += 1;
    var i = 32 - ut(t) + l;
    if (30 < i) {
      var o = l - l % 5;
      i = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, kn = 1 << 32 - ut(t) + l | n << l | r, Sn = i + e;
    } else kn = 1 << i | n << l | r, Sn = e;
  }
  function Ao(e) {
    e.return !== null && (Er(e, 1), js(e, 1, 0));
  }
  function Fo(e) {
    for (; e === Ni; ) Ni = tl[--nl], tl[nl] = null, ji = tl[--nl], tl[nl] = null;
    for (; e === Cr; ) Cr = Pt[--Rt], Pt[Rt] = null, Sn = Pt[--Rt], Pt[Rt] = null, kn = Pt[--Rt], Pt[Rt] = null;
  }
  var _t = null, Ct = null, Ne = !1, Wt = null;
  function Ps(e, t) {
    var n = Dt(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function Rs(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, _t = e, Ct = Wn(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, _t = e, Ct = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = Cr !== null ? { id: kn, overflow: Sn } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = Dt(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, _t = e, Ct = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Bo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function $o(e) {
    if (Ne) {
      var t = Ct;
      if (t) {
        var n = t;
        if (!Rs(e, t)) {
          if (Bo(e)) throw Error(v(418));
          t = Wn(n.nextSibling);
          var r = _t;
          t && Rs(e, t) ? Ps(r, n) : (e.flags = e.flags & -4097 | 2, Ne = !1, _t = e);
        }
      } else {
        if (Bo(e)) throw Error(v(418));
        e.flags = e.flags & -4097 | 2, Ne = !1, _t = e;
      }
    }
  }
  function Ls(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    _t = e;
  }
  function Pi(e) {
    if (e !== _t) return !1;
    if (!Ne) return Ls(e), Ne = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !zo(e.type, e.memoizedProps)), t && (t = Ct)) {
      if (Bo(e)) throw zs(), Error(v(418));
      for (; t; ) Ps(e, t), t = Wn(t.nextSibling);
    }
    if (Ls(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(v(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                Ct = Wn(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        Ct = null;
      }
    } else Ct = _t ? Wn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function zs() {
    for (var e = Ct; e; ) e = Wn(e.nextSibling);
  }
  function rl() {
    Ct = _t = null, Ne = !1;
  }
  function Uo(e) {
    Wt === null ? Wt = [e] : Wt.push(e);
  }
  var id = ce.ReactCurrentBatchConfig;
  function bt(e, t) {
    if (e && e.defaultProps) {
      t = c({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  var Ri = bn(null), Li = null, ll = null, Ho = null;
  function Wo() {
    Ho = ll = Li = null;
  }
  function bo(e) {
    var t = Ri.current;
    Ee(Ri), e._currentValue = t;
  }
  function Vo(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function il(e, t) {
    Li = e, Ho = ll = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (yt = !0), e.firstContext = null);
  }
  function Lt(e) {
    var t = e._currentValue;
    if (Ho !== e) if (e = { context: e, memoizedValue: t, next: null }, ll === null) {
      if (Li === null) throw Error(v(308));
      ll = e, Li.dependencies = { lanes: 0, firstContext: e };
    } else ll = ll.next = e;
    return t;
  }
  var Nr = null;
  function Qo(e) {
    Nr === null ? Nr = [e] : Nr.push(e);
  }
  function Ts(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Qo(t)) : (n.next = l.next, l.next = n), t.interleaved = n, _n(e, r);
  }
  function _n(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Kn = !1;
  function Ko(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Ds(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Cn(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Yn(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (ue & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, _n(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Qo(r)) : (t.next = l.next, l.next = t), r.interleaved = t, _n(e, n);
  }
  function zi(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, hn(e, n);
    }
  }
  function Ms(e, t) {
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
    Kn = !1;
    var i = l.firstBaseUpdate, o = l.lastBaseUpdate, s = l.shared.pending;
    if (s !== null) {
      l.shared.pending = null;
      var d = s, h = d.next;
      d.next = null, o === null ? i = h : o.next = h, o = d;
      var S = e.alternate;
      S !== null && (S = S.updateQueue, s = S.lastBaseUpdate, s !== o && (s === null ? S.firstBaseUpdate = h : s.next = h, S.lastBaseUpdate = d));
    }
    if (i !== null) {
      var _ = l.baseState;
      o = 0, S = h = d = null, s = i;
      do {
        var k = s.lane, R = s.eventTime;
        if ((r & k) === k) {
          S !== null && (S = S.next = {
            eventTime: R,
            lane: 0,
            tag: s.tag,
            payload: s.payload,
            callback: s.callback,
            next: null
          });
          e: {
            var z = e, D = s;
            switch (k = t, R = n, D.tag) {
              case 1:
                if (z = D.payload, typeof z == "function") {
                  _ = z.call(R, _, k);
                  break e;
                }
                _ = z;
                break e;
              case 3:
                z.flags = z.flags & -65537 | 128;
              case 0:
                if (z = D.payload, k = typeof z == "function" ? z.call(R, _, k) : z, k == null) break e;
                _ = c({}, _, k);
                break e;
              case 2:
                Kn = !0;
            }
          }
          s.callback !== null && s.lane !== 0 && (e.flags |= 64, k = l.effects, k === null ? l.effects = [s] : k.push(s));
        } else R = { eventTime: R, lane: k, tag: s.tag, payload: s.payload, callback: s.callback, next: null }, S === null ? (h = S = R, d = _) : S = S.next = R, o |= k;
        if (s = s.next, s === null) {
          if (s = l.shared.pending, s === null) break;
          k = s, s = k.next, k.next = null, l.lastBaseUpdate = k, l.shared.pending = null;
        }
      } while (!0);
      if (S === null && (d = _), l.baseState = d, l.firstBaseUpdate = h, l.lastBaseUpdate = S, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          o |= l.lane, l = l.next;
        while (l !== t);
      } else i === null && (l.shared.lanes = 0);
      Rr |= o, e.lanes = o, e.memoizedState = _;
    }
  }
  function Is(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(v(191, l));
        l.call(r);
      }
    }
  }
  var Os = new g.Component().refs;
  function Yo(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : c({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Di = { isMounted: function(e) {
    return (e = e._reactInternals) ? At(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = ft(), l = Zn(e), i = Cn(r, l);
    i.payload = t, n != null && (i.callback = n), t = Yn(e, i, l), t !== null && (Kt(t, e, l, r), zi(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = ft(), l = Zn(e), i = Cn(r, l);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Yn(e, i, l), t !== null && (Kt(t, e, l, r), zi(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = ft(), r = Zn(e), l = Cn(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Yn(e, l, r), t !== null && (Kt(t, e, r, n), zi(t, e, r));
  } };
  function As(e, t, n, r, l, i, o) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, o) : t.prototype && t.prototype.isPureReactComponent ? !Al(n, r) || !Al(l, i) : !0;
  }
  function Fs(e, t, n) {
    var r = !1, l = Vn, i = t.contextType;
    return typeof i == "object" && i !== null ? i = Lt(i) : (l = vt(t) ? _r : rt.current, r = t.contextTypes, i = (r = r != null) ? el(e, l) : Vn), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Di, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function Bs(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Di.enqueueReplaceState(t, t.state, null);
  }
  function qo(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = Os, Ko(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? l.context = Lt(i) : (i = vt(t) ? _r : rt.current, l.context = el(e, i)), l.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (Yo(e, t, i, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && Di.enqueueReplaceState(l, l.state, null), Ti(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function bl(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(v(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(v(147, e));
        var l = r, i = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(o) {
          var s = l.refs;
          s === Os && (s = l.refs = {}), o === null ? delete s[i] : s[i] = o;
        }, t._stringRef = i, t);
      }
      if (typeof e != "string") throw Error(v(284));
      if (!n._owner) throw Error(v(290, e));
    }
    return e;
  }
  function Mi(e, t) {
    throw e = Object.prototype.toString.call(t), Error(v(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function $s(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Us(e) {
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
      return p = er(p, f), p.index = 0, p.sibling = null, p;
    }
    function i(p, f, m) {
      return p.index = m, e ? (m = p.alternate, m !== null ? (m = m.index, m < f ? (p.flags |= 2, f) : m) : (p.flags |= 2, f)) : (p.flags |= 1048576, f);
    }
    function o(p) {
      return e && p.alternate === null && (p.flags |= 2), p;
    }
    function s(p, f, m, E) {
      return f === null || f.tag !== 6 ? (f = Ta(m, p.mode, E), f.return = p, f) : (f = l(f, m), f.return = p, f);
    }
    function d(p, f, m, E) {
      var O = m.type;
      return O === N ? S(p, f, m.props.children, E, m.key) : f !== null && (f.elementType === O || typeof O == "object" && O !== null && O.$$typeof === Pe && $s(O) === f.type) ? (E = l(f, m.props), E.ref = bl(p, f, m), E.return = p, E) : (E = Ji(m.type, m.key, m.props, null, p.mode, E), E.ref = bl(p, f, m), E.return = p, E);
    }
    function h(p, f, m, E) {
      return f === null || f.tag !== 4 || f.stateNode.containerInfo !== m.containerInfo || f.stateNode.implementation !== m.implementation ? (f = Da(m, p.mode, E), f.return = p, f) : (f = l(f, m.children || []), f.return = p, f);
    }
    function S(p, f, m, E, O) {
      return f === null || f.tag !== 7 ? (f = Dr(m, p.mode, E, O), f.return = p, f) : (f = l(f, m), f.return = p, f);
    }
    function _(p, f, m) {
      if (typeof f == "string" && f !== "" || typeof f == "number") return f = Ta("" + f, p.mode, m), f.return = p, f;
      if (typeof f == "object" && f !== null) {
        switch (f.$$typeof) {
          case we:
            return m = Ji(f.type, f.key, f.props, null, p.mode, m), m.ref = bl(p, null, f), m.return = p, m;
          case xe:
            return f = Da(f, p.mode, m), f.return = p, f;
          case Pe:
            var E = f._init;
            return _(p, E(f._payload), m);
        }
        if (mt(f) || F(f)) return f = Dr(f, p.mode, m, null), f.return = p, f;
        Mi(p, f);
      }
      return null;
    }
    function k(p, f, m, E) {
      var O = f !== null ? f.key : null;
      if (typeof m == "string" && m !== "" || typeof m == "number") return O !== null ? null : s(p, f, "" + m, E);
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case we:
            return m.key === O ? d(p, f, m, E) : null;
          case xe:
            return m.key === O ? h(p, f, m, E) : null;
          case Pe:
            return O = m._init, k(
              p,
              f,
              O(m._payload),
              E
            );
        }
        if (mt(m) || F(m)) return O !== null ? null : S(p, f, m, E, null);
        Mi(p, m);
      }
      return null;
    }
    function R(p, f, m, E, O) {
      if (typeof E == "string" && E !== "" || typeof E == "number") return p = p.get(m) || null, s(f, p, "" + E, O);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case we:
            return p = p.get(E.key === null ? m : E.key) || null, d(f, p, E, O);
          case xe:
            return p = p.get(E.key === null ? m : E.key) || null, h(f, p, E, O);
          case Pe:
            var $ = E._init;
            return R(p, f, m, $(E._payload), O);
        }
        if (mt(E) || F(E)) return p = p.get(m) || null, S(f, p, E, O, null);
        Mi(f, E);
      }
      return null;
    }
    function z(p, f, m, E) {
      for (var O = null, $ = null, U = f, b = f = 0, Ke = null; U !== null && b < m.length; b++) {
        U.index > b ? (Ke = U, U = null) : Ke = U.sibling;
        var fe = k(p, U, m[b], E);
        if (fe === null) {
          U === null && (U = Ke);
          break;
        }
        e && U && fe.alternate === null && t(p, U), f = i(fe, f, b), $ === null ? O = fe : $.sibling = fe, $ = fe, U = Ke;
      }
      if (b === m.length) return n(p, U), Ne && Er(p, b), O;
      if (U === null) {
        for (; b < m.length; b++) U = _(p, m[b], E), U !== null && (f = i(U, f, b), $ === null ? O = U : $.sibling = U, $ = U);
        return Ne && Er(p, b), O;
      }
      for (U = r(p, U); b < m.length; b++) Ke = R(U, p, b, m[b], E), Ke !== null && (e && Ke.alternate !== null && U.delete(Ke.key === null ? b : Ke.key), f = i(Ke, f, b), $ === null ? O = Ke : $.sibling = Ke, $ = Ke);
      return e && U.forEach(function(tr) {
        return t(p, tr);
      }), Ne && Er(p, b), O;
    }
    function D(p, f, m, E) {
      var O = F(m);
      if (typeof O != "function") throw Error(v(150));
      if (m = O.call(m), m == null) throw Error(v(151));
      for (var $ = O = null, U = f, b = f = 0, Ke = null, fe = m.next(); U !== null && !fe.done; b++, fe = m.next()) {
        U.index > b ? (Ke = U, U = null) : Ke = U.sibling;
        var tr = k(p, U, fe.value, E);
        if (tr === null) {
          U === null && (U = Ke);
          break;
        }
        e && U && tr.alternate === null && t(p, U), f = i(tr, f, b), $ === null ? O = tr : $.sibling = tr, $ = tr, U = Ke;
      }
      if (fe.done) return n(
        p,
        U
      ), Ne && Er(p, b), O;
      if (U === null) {
        for (; !fe.done; b++, fe = m.next()) fe = _(p, fe.value, E), fe !== null && (f = i(fe, f, b), $ === null ? O = fe : $.sibling = fe, $ = fe);
        return Ne && Er(p, b), O;
      }
      for (U = r(p, U); !fe.done; b++, fe = m.next()) fe = R(U, p, b, fe.value, E), fe !== null && (e && fe.alternate !== null && U.delete(fe.key === null ? b : fe.key), f = i(fe, f, b), $ === null ? O = fe : $.sibling = fe, $ = fe);
      return e && U.forEach(function(Fd) {
        return t(p, Fd);
      }), Ne && Er(p, b), O;
    }
    function Ie(p, f, m, E) {
      if (typeof m == "object" && m !== null && m.type === N && m.key === null && (m = m.props.children), typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case we:
            e: {
              for (var O = m.key, $ = f; $ !== null; ) {
                if ($.key === O) {
                  if (O = m.type, O === N) {
                    if ($.tag === 7) {
                      n(p, $.sibling), f = l($, m.props.children), f.return = p, p = f;
                      break e;
                    }
                  } else if ($.elementType === O || typeof O == "object" && O !== null && O.$$typeof === Pe && $s(O) === $.type) {
                    n(p, $.sibling), f = l($, m.props), f.ref = bl(p, $, m), f.return = p, p = f;
                    break e;
                  }
                  n(p, $);
                  break;
                } else t(p, $);
                $ = $.sibling;
              }
              m.type === N ? (f = Dr(m.props.children, p.mode, E, m.key), f.return = p, p = f) : (E = Ji(m.type, m.key, m.props, null, p.mode, E), E.ref = bl(p, f, m), E.return = p, p = E);
            }
            return o(p);
          case xe:
            e: {
              for ($ = m.key; f !== null; ) {
                if (f.key === $) if (f.tag === 4 && f.stateNode.containerInfo === m.containerInfo && f.stateNode.implementation === m.implementation) {
                  n(p, f.sibling), f = l(f, m.children || []), f.return = p, p = f;
                  break e;
                } else {
                  n(p, f);
                  break;
                }
                else t(p, f);
                f = f.sibling;
              }
              f = Da(m, p.mode, E), f.return = p, p = f;
            }
            return o(p);
          case Pe:
            return $ = m._init, Ie(p, f, $(m._payload), E);
        }
        if (mt(m)) return z(p, f, m, E);
        if (F(m)) return D(p, f, m, E);
        Mi(p, m);
      }
      return typeof m == "string" && m !== "" || typeof m == "number" ? (m = "" + m, f !== null && f.tag === 6 ? (n(p, f.sibling), f = l(f, m), f.return = p, p = f) : (n(p, f), f = Ta(m, p.mode, E), f.return = p, p = f), o(p)) : n(p, f);
    }
    return Ie;
  }
  var ol = Us(!0), Hs = Us(!1), Vl = {}, nn = bn(Vl), Ql = bn(Vl), Kl = bn(Vl);
  function jr(e) {
    if (e === Vl) throw Error(v(174));
    return e;
  }
  function Xo(e, t) {
    switch (ke(Kl, t), ke(Ql, e), ke(nn, Vl), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : zn(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = zn(t, e);
    }
    Ee(nn), ke(nn, t);
  }
  function al() {
    Ee(nn), Ee(Ql), Ee(Kl);
  }
  function Ws(e) {
    jr(Kl.current);
    var t = jr(nn.current), n = zn(t, e.type);
    t !== n && (ke(Ql, e), ke(nn, n));
  }
  function Go(e) {
    Ql.current === e && (Ee(nn), Ee(Ql));
  }
  var Re = bn(0);
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
  var Zo = [];
  function Jo() {
    for (var e = 0; e < Zo.length; e++) Zo[e]._workInProgressVersionPrimary = null;
    Zo.length = 0;
  }
  var Oi = ce.ReactCurrentDispatcher, ea = ce.ReactCurrentBatchConfig, Pr = 0, Le = null, We = null, Ve = null, Ai = !1, Yl = !1, ql = 0, od = 0;
  function lt() {
    throw Error(v(321));
  }
  function ta(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!Ht(e[n], t[n])) return !1;
    return !0;
  }
  function na(e, t, n, r, l, i) {
    if (Pr = i, Le = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Oi.current = e === null || e.memoizedState === null ? cd : dd, e = n(r, l), Yl) {
      i = 0;
      do {
        if (Yl = !1, ql = 0, 25 <= i) throw Error(v(301));
        i += 1, Ve = We = null, t.updateQueue = null, Oi.current = fd, e = n(r, l);
      } while (Yl);
    }
    if (Oi.current = $i, t = We !== null && We.next !== null, Pr = 0, Ve = We = Le = null, Ai = !1, t) throw Error(v(300));
    return e;
  }
  function ra() {
    var e = ql !== 0;
    return ql = 0, e;
  }
  function rn() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Ve === null ? Le.memoizedState = Ve = e : Ve = Ve.next = e, Ve;
  }
  function zt() {
    if (We === null) {
      var e = Le.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = We.next;
    var t = Ve === null ? Le.memoizedState : Ve.next;
    if (t !== null) Ve = t, We = e;
    else {
      if (e === null) throw Error(v(310));
      We = e, e = { memoizedState: We.memoizedState, baseState: We.baseState, baseQueue: We.baseQueue, queue: We.queue, next: null }, Ve === null ? Le.memoizedState = Ve = e : Ve = Ve.next = e;
    }
    return Ve;
  }
  function Xl(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function la(e) {
    var t = zt(), n = t.queue;
    if (n === null) throw Error(v(311));
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
      var s = o = null, d = null, h = i;
      do {
        var S = h.lane;
        if ((Pr & S) === S) d !== null && (d = d.next = { lane: 0, action: h.action, hasEagerState: h.hasEagerState, eagerState: h.eagerState, next: null }), r = h.hasEagerState ? h.eagerState : e(r, h.action);
        else {
          var _ = {
            lane: S,
            action: h.action,
            hasEagerState: h.hasEagerState,
            eagerState: h.eagerState,
            next: null
          };
          d === null ? (s = d = _, o = r) : d = d.next = _, Le.lanes |= S, Rr |= S;
        }
        h = h.next;
      } while (h !== null && h !== i);
      d === null ? o = r : d.next = s, Ht(r, t.memoizedState) || (yt = !0), t.memoizedState = r, t.baseState = o, t.baseQueue = d, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        i = l.lane, Le.lanes |= i, Rr |= i, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function ia(e) {
    var t = zt(), n = t.queue;
    if (n === null) throw Error(v(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, i = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var o = l = l.next;
      do
        i = e(i, o.action), o = o.next;
      while (o !== l);
      Ht(i, t.memoizedState) || (yt = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
    }
    return [i, r];
  }
  function bs() {
  }
  function Vs(e, t) {
    var n = Le, r = zt(), l = t(), i = !Ht(r.memoizedState, l);
    if (i && (r.memoizedState = l, yt = !0), r = r.queue, oa(Ys.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || Ve !== null && Ve.memoizedState.tag & 1) {
      if (n.flags |= 2048, Gl(9, Ks.bind(null, n, r, l, t), void 0, null), Qe === null) throw Error(v(349));
      (Pr & 30) !== 0 || Qs(n, t, l);
    }
    return l;
  }
  function Qs(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Le.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Le.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Ks(e, t, n, r) {
    t.value = n, t.getSnapshot = r, qs(t) && Xs(e);
  }
  function Ys(e, t, n) {
    return n(function() {
      qs(t) && Xs(e);
    });
  }
  function qs(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Ht(e, n);
    } catch {
      return !0;
    }
  }
  function Xs(e) {
    var t = _n(e, 1);
    t !== null && Kt(t, e, 1, -1);
  }
  function Gs(e) {
    var t = rn();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xl, lastRenderedState: e }, t.queue = e, e = e.dispatch = ud.bind(null, Le, e), [t.memoizedState, e];
  }
  function Gl(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Le.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Le.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Zs() {
    return zt().memoizedState;
  }
  function Fi(e, t, n, r) {
    var l = rn();
    Le.flags |= e, l.memoizedState = Gl(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function Bi(e, t, n, r) {
    var l = zt();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (We !== null) {
      var o = We.memoizedState;
      if (i = o.destroy, r !== null && ta(r, o.deps)) {
        l.memoizedState = Gl(t, n, i, r);
        return;
      }
    }
    Le.flags |= e, l.memoizedState = Gl(1 | t, n, i, r);
  }
  function Js(e, t) {
    return Fi(8390656, 8, e, t);
  }
  function oa(e, t) {
    return Bi(2048, 8, e, t);
  }
  function eu(e, t) {
    return Bi(4, 2, e, t);
  }
  function tu(e, t) {
    return Bi(4, 4, e, t);
  }
  function nu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function ru(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Bi(4, 4, nu.bind(null, t, e), n);
  }
  function aa() {
  }
  function lu(e, t) {
    var n = zt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && ta(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function iu(e, t) {
    var n = zt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && ta(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function ou(e, t, n) {
    return (Pr & 21) === 0 ? (e.baseState && (e.baseState = !1, yt = !0), e.memoizedState = n) : (Ht(n, t) || (n = Pl(), Le.lanes |= n, Rr |= n, e.baseState = !0), t);
  }
  function ad(e, t) {
    var n = de;
    de = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = ea.transition;
    ea.transition = {};
    try {
      e(!1), t();
    } finally {
      de = n, ea.transition = r;
    }
  }
  function au() {
    return zt().memoizedState;
  }
  function sd(e, t, n) {
    var r = Zn(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, su(e)) uu(t, n);
    else if (n = Ts(e, t, n, r), n !== null) {
      var l = ft();
      Kt(n, e, r, l), cu(n, t, r);
    }
  }
  function ud(e, t, n) {
    var r = Zn(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (su(e)) uu(t, l);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var o = t.lastRenderedState, s = i(o, n);
        if (l.hasEagerState = !0, l.eagerState = s, Ht(s, o)) {
          var d = t.interleaved;
          d === null ? (l.next = l, Qo(t)) : (l.next = d.next, d.next = l), t.interleaved = l;
          return;
        }
      } catch {
      }
      n = Ts(e, t, l, r), n !== null && (l = ft(), Kt(n, e, r, l), cu(n, t, r));
    }
  }
  function su(e) {
    var t = e.alternate;
    return e === Le || t !== null && t === Le;
  }
  function uu(e, t) {
    Yl = Ai = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function cu(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, hn(e, n);
    }
  }
  var $i = { readContext: Lt, useCallback: lt, useContext: lt, useEffect: lt, useImperativeHandle: lt, useInsertionEffect: lt, useLayoutEffect: lt, useMemo: lt, useReducer: lt, useRef: lt, useState: lt, useDebugValue: lt, useDeferredValue: lt, useTransition: lt, useMutableSource: lt, useSyncExternalStore: lt, useId: lt, unstable_isNewReconciler: !1 }, cd = { readContext: Lt, useCallback: function(e, t) {
    return rn().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: Lt, useEffect: Js, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Fi(
      4194308,
      4,
      nu.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return Fi(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return Fi(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = rn();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = rn();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = sd.bind(null, Le, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = rn();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Gs, useDebugValue: aa, useDeferredValue: function(e) {
    return rn().memoizedState = e;
  }, useTransition: function() {
    var e = Gs(!1), t = e[0];
    return e = ad.bind(null, e[1]), rn().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = Le, l = rn();
    if (Ne) {
      if (n === void 0) throw Error(v(407));
      n = n();
    } else {
      if (n = t(), Qe === null) throw Error(v(349));
      (Pr & 30) !== 0 || Qs(r, t, n);
    }
    l.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return l.queue = i, Js(Ys.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, Gl(9, Ks.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = rn(), t = Qe.identifierPrefix;
    if (Ne) {
      var n = Sn, r = kn;
      n = (r & ~(1 << 32 - ut(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = ql++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = od++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, dd = {
    readContext: Lt,
    useCallback: lu,
    useContext: Lt,
    useEffect: oa,
    useImperativeHandle: ru,
    useInsertionEffect: eu,
    useLayoutEffect: tu,
    useMemo: iu,
    useReducer: la,
    useRef: Zs,
    useState: function() {
      return la(Xl);
    },
    useDebugValue: aa,
    useDeferredValue: function(e) {
      var t = zt();
      return ou(t, We.memoizedState, e);
    },
    useTransition: function() {
      var e = la(Xl)[0], t = zt().memoizedState;
      return [e, t];
    },
    useMutableSource: bs,
    useSyncExternalStore: Vs,
    useId: au,
    unstable_isNewReconciler: !1
  }, fd = { readContext: Lt, useCallback: lu, useContext: Lt, useEffect: oa, useImperativeHandle: ru, useInsertionEffect: eu, useLayoutEffect: tu, useMemo: iu, useReducer: ia, useRef: Zs, useState: function() {
    return ia(Xl);
  }, useDebugValue: aa, useDeferredValue: function(e) {
    var t = zt();
    return We === null ? t.memoizedState = e : ou(t, We.memoizedState, e);
  }, useTransition: function() {
    var e = ia(Xl)[0], t = zt().memoizedState;
    return [e, t];
  }, useMutableSource: bs, useSyncExternalStore: Vs, useId: au, unstable_isNewReconciler: !1 };
  function sl(e, t) {
    try {
      var n = "", r = t;
      do
        n += X(r), r = r.return;
      while (r);
      var l = n;
    } catch (i) {
      l = `
Error generating stack: ` + i.message + `
` + i.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function sa(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function ua(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var pd = typeof WeakMap == "function" ? WeakMap : Map;
  function du(e, t, n) {
    n = Cn(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Ki || (Ki = !0, Ca = r), ua(e, t);
    }, n;
  }
  function fu(e, t, n) {
    n = Cn(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        ua(e, t);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
      ua(e, t), typeof r != "function" && (Xn === null ? Xn = /* @__PURE__ */ new Set([this]) : Xn.add(this));
      var o = t.stack;
      this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
    }), n;
  }
  function pu(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new pd();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = jd.bind(null, e, t, n), t.then(e, e));
  }
  function mu(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function hu(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Cn(-1, 1), t.tag = 2, Yn(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var md = ce.ReactCurrentOwner, yt = !1;
  function dt(e, t, n, r) {
    t.child = e === null ? Hs(t, null, n, r) : ol(t, e.child, n, r);
  }
  function vu(e, t, n, r, l) {
    n = n.render;
    var i = t.ref;
    return il(t, l), r = na(e, t, n, r, i, l), n = ra(), e !== null && !yt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, En(e, t, l)) : (Ne && n && Ao(t), t.flags |= 1, dt(e, t, r, l), t.child);
  }
  function yu(e, t, n, r, l) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !za(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, gu(e, t, i, r, l)) : (e = Ji(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & l) === 0) {
      var o = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : Al, n(o, r) && e.ref === t.ref) return En(e, t, l);
    }
    return t.flags |= 1, e = er(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function gu(e, t, n, r, l) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (Al(i, r) && e.ref === t.ref) if (yt = !1, t.pendingProps = r = i, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (yt = !0);
      else return t.lanes = e.lanes, En(e, t, l);
    }
    return ca(e, t, n, r, l);
  }
  function wu(e, t, n) {
    var r = t.pendingProps, l = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, ke(cl, Et), Et |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, ke(cl, Et), Et |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, ke(cl, Et), Et |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, ke(cl, Et), Et |= r;
    return dt(e, t, l, n), t.child;
  }
  function xu(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function ca(e, t, n, r, l) {
    var i = vt(n) ? _r : rt.current;
    return i = el(t, i), il(t, l), n = na(e, t, n, r, i, l), r = ra(), e !== null && !yt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, En(e, t, l)) : (Ne && r && Ao(t), t.flags |= 1, dt(e, t, n, l), t.child);
  }
  function ku(e, t, n, r, l) {
    if (vt(n)) {
      var i = !0;
      Ci(t);
    } else i = !1;
    if (il(t, l), t.stateNode === null) Hi(e, t), Fs(t, n, r), qo(t, n, r, l), r = !0;
    else if (e === null) {
      var o = t.stateNode, s = t.memoizedProps;
      o.props = s;
      var d = o.context, h = n.contextType;
      typeof h == "object" && h !== null ? h = Lt(h) : (h = vt(n) ? _r : rt.current, h = el(t, h));
      var S = n.getDerivedStateFromProps, _ = typeof S == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      _ || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (s !== r || d !== h) && Bs(t, o, r, h), Kn = !1;
      var k = t.memoizedState;
      o.state = k, Ti(t, r, o, l), d = t.memoizedState, s !== r || k !== d || ht.current || Kn ? (typeof S == "function" && (Yo(t, n, S, r), d = t.memoizedState), (s = Kn || As(t, n, s, r, k, d, h)) ? (_ || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = d), o.props = r, o.state = d, o.context = h, r = s) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      o = t.stateNode, Ds(e, t), s = t.memoizedProps, h = t.type === t.elementType ? s : bt(t.type, s), o.props = h, _ = t.pendingProps, k = o.context, d = n.contextType, typeof d == "object" && d !== null ? d = Lt(d) : (d = vt(n) ? _r : rt.current, d = el(t, d));
      var R = n.getDerivedStateFromProps;
      (S = typeof R == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (s !== _ || k !== d) && Bs(t, o, r, d), Kn = !1, k = t.memoizedState, o.state = k, Ti(t, r, o, l);
      var z = t.memoizedState;
      s !== _ || k !== z || ht.current || Kn ? (typeof R == "function" && (Yo(t, n, R, r), z = t.memoizedState), (h = Kn || As(t, n, h, r, k, z, d) || !1) ? (S || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, z, d), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, z, d)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || s === e.memoizedProps && k === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && k === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = z), o.props = r, o.state = z, o.context = d, r = h) : (typeof o.componentDidUpdate != "function" || s === e.memoizedProps && k === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && k === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return da(e, t, n, r, i, l);
  }
  function da(e, t, n, r, l, i) {
    xu(e, t);
    var o = (t.flags & 128) !== 0;
    if (!r && !o) return l && Es(t, n, !1), En(e, t, i);
    r = t.stateNode, md.current = t;
    var s = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && o ? (t.child = ol(t, e.child, null, i), t.child = ol(t, null, s, i)) : dt(e, t, s, i), t.memoizedState = r.state, l && Es(t, n, !0), t.child;
  }
  function Su(e) {
    var t = e.stateNode;
    t.pendingContext ? _s(e, t.pendingContext, t.pendingContext !== t.context) : t.context && _s(e, t.context, !1), Xo(e, t.containerInfo);
  }
  function _u(e, t, n, r, l) {
    return rl(), Uo(l), t.flags |= 256, dt(e, t, n, r), t.child;
  }
  var fa = { dehydrated: null, treeContext: null, retryLane: 0 };
  function pa(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Cu(e, t, n) {
    var r = t.pendingProps, l = Re.current, i = !1, o = (t.flags & 128) !== 0, s;
    if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), s ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), ke(Re, l & 1), e === null)
      return $o(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (o = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, o = { mode: "hidden", children: o }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = o) : i = eo(o, r, 0, null), e = Dr(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = pa(n), t.memoizedState = fa, e) : ma(t, o));
    if (l = e.memoizedState, l !== null && (s = l.dehydrated, s !== null)) return hd(e, t, o, r, s, l, n);
    if (i) {
      i = r.fallback, o = t.mode, l = e.child, s = l.sibling;
      var d = { mode: "hidden", children: r.children };
      return (o & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = d, t.deletions = null) : (r = er(l, d), r.subtreeFlags = l.subtreeFlags & 14680064), s !== null ? i = er(s, i) : (i = Dr(i, o, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, o = e.child.memoizedState, o = o === null ? pa(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, i.memoizedState = o, i.childLanes = e.childLanes & ~n, t.memoizedState = fa, r;
    }
    return i = e.child, e = i.sibling, r = er(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ma(e, t) {
    return t = eo({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Ui(e, t, n, r) {
    return r !== null && Uo(r), ol(t, e.child, null, n), e = ma(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function hd(e, t, n, r, l, i, o) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = sa(Error(v(422))), Ui(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, l = t.mode, r = eo({ mode: "visible", children: r.children }, l, 0, null), i = Dr(i, l, o, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && ol(t, e.child, null, o), t.child.memoizedState = pa(o), t.memoizedState = fa, i);
    if ((t.mode & 1) === 0) return Ui(e, t, o, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var s = r.dgst;
      return r = s, i = Error(v(419)), r = sa(i, r, void 0), Ui(e, t, o, r);
    }
    if (s = (o & e.childLanes) !== 0, yt || s) {
      if (r = Qe, r !== null) {
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
        l = (l & (r.suspendedLanes | o)) !== 0 ? 0 : l, l !== 0 && l !== i.retryLane && (i.retryLane = l, _n(e, l), Kt(r, e, l, -1));
      }
      return La(), r = sa(Error(v(421))), Ui(e, t, o, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Pd.bind(null, e), l._reactRetry = t, null) : (e = i.treeContext, Ct = Wn(l.nextSibling), _t = t, Ne = !0, Wt = null, e !== null && (Pt[Rt++] = kn, Pt[Rt++] = Sn, Pt[Rt++] = Cr, kn = e.id, Sn = e.overflow, Cr = t), t = ma(t, r.children), t.flags |= 4096, t);
  }
  function Eu(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Vo(e.return, t, n);
  }
  function ha(e, t, n, r, l) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = l);
  }
  function Nu(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, i = r.tail;
    if (dt(e, t, r.children, n), r = Re.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Eu(e, n, t);
        else if (e.tag === 19) Eu(e, n, t);
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
    if (ke(Re, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && Ii(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), ha(t, !1, l, n, i);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && Ii(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        ha(t, !0, n, null, i);
        break;
      case "together":
        ha(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Hi(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function En(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), Rr |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(v(153));
    if (t.child !== null) {
      for (e = t.child, n = er(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = er(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function vd(e, t, n) {
    switch (t.tag) {
      case 3:
        Su(t), rl();
        break;
      case 5:
        Ws(t);
        break;
      case 1:
        vt(t.type) && Ci(t);
        break;
      case 4:
        Xo(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        ke(Ri, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (ke(Re, Re.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Cu(e, t, n) : (ke(Re, Re.current & 1), e = En(e, t, n), e !== null ? e.sibling : null);
        ke(Re, Re.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return Nu(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), ke(Re, Re.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, wu(e, t, n);
    }
    return En(e, t, n);
  }
  var ju, va, Pu, Ru;
  ju = function(e, t) {
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
  }, va = function() {
  }, Pu = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, jr(nn.current);
      var i = null;
      switch (n) {
        case "input":
          l = an(e, l), r = an(e, r), i = [];
          break;
        case "select":
          l = c({}, l, { value: void 0 }), r = c({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          l = Pn(e, l), r = Pn(e, r), i = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = ki);
      }
      un(n, r);
      var o;
      n = null;
      for (h in l) if (!r.hasOwnProperty(h) && l.hasOwnProperty(h) && l[h] != null) if (h === "style") {
        var s = l[h];
        for (o in s) s.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
      } else h !== "dangerouslySetInnerHTML" && h !== "children" && h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && h !== "autoFocus" && (oe.hasOwnProperty(h) ? i || (i = []) : (i = i || []).push(h, null));
      for (h in r) {
        var d = r[h];
        if (s = l?.[h], r.hasOwnProperty(h) && d !== s && (d != null || s != null)) if (h === "style") if (s) {
          for (o in s) !s.hasOwnProperty(o) || d && d.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
          for (o in d) d.hasOwnProperty(o) && s[o] !== d[o] && (n || (n = {}), n[o] = d[o]);
        } else n || (i || (i = []), i.push(
          h,
          n
        )), n = d;
        else h === "dangerouslySetInnerHTML" ? (d = d ? d.__html : void 0, s = s ? s.__html : void 0, d != null && s !== d && (i = i || []).push(h, d)) : h === "children" ? typeof d != "string" && typeof d != "number" || (i = i || []).push(h, "" + d) : h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && (oe.hasOwnProperty(h) ? (d != null && h === "onScroll" && Ce("scroll", e), i || s === d || (i = [])) : (i = i || []).push(h, d));
      }
      n && (i = i || []).push("style", n);
      var h = i;
      (t.updateQueue = h) && (t.flags |= 4);
    }
  }, Ru = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function Zl(e, t) {
    if (!Ne) switch (e.tailMode) {
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
  function yd(e, t, n) {
    var r = t.pendingProps;
    switch (Fo(t), t.tag) {
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
        return vt(t.type) && _i(), it(t), null;
      case 3:
        return r = t.stateNode, al(), Ee(ht), Ee(rt), Jo(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (Pi(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Wt !== null && (ja(Wt), Wt = null))), va(e, t), it(t), null;
      case 5:
        Go(t);
        var l = jr(Kl.current);
        if (n = t.type, e !== null && t.stateNode != null) Pu(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(v(166));
            return it(t), null;
          }
          if (e = jr(nn.current), Pi(t)) {
            r = t.stateNode, n = t.type;
            var i = t.memoizedProps;
            switch (r[tn] = t, r[Hl] = i, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                Ce("cancel", r), Ce("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ce("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < Bl.length; l++) Ce(Bl[l], r);
                break;
              case "source":
                Ce("error", r);
                break;
              case "img":
              case "image":
              case "link":
                Ce(
                  "error",
                  r
                ), Ce("load", r);
                break;
              case "details":
                Ce("toggle", r);
                break;
              case "input":
                Mt(r, i), Ce("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, Ce("invalid", r);
                break;
              case "textarea":
                ml(r, i), Ce("invalid", r);
            }
            un(n, i), l = null;
            for (var o in i) if (i.hasOwnProperty(o)) {
              var s = i[o];
              o === "children" ? typeof s == "string" ? r.textContent !== s && (i.suppressHydrationWarning !== !0 && xi(r.textContent, s, e), l = ["children", s]) : typeof s == "number" && r.textContent !== "" + s && (i.suppressHydrationWarning !== !0 && xi(
                r.textContent,
                s,
                e
              ), l = ["children", "" + s]) : oe.hasOwnProperty(o) && s != null && o === "onScroll" && Ce("scroll", r);
            }
            switch (n) {
              case "input":
                kt(r), Ar(r, i, !0);
                break;
              case "textarea":
                kt(r), hl(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = ki);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Ln(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = !0 : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[tn] = t, e[Hl] = r, ju(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (o = lr(n, r), n) {
                case "dialog":
                  Ce("cancel", e), Ce("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ce("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < Bl.length; l++) Ce(Bl[l], e);
                  l = r;
                  break;
                case "source":
                  Ce("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  Ce(
                    "error",
                    e
                  ), Ce("load", e), l = r;
                  break;
                case "details":
                  Ce("toggle", e), l = r;
                  break;
                case "input":
                  Mt(e, r), l = an(e, r), Ce("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = c({}, r, { value: void 0 }), Ce("invalid", e);
                  break;
                case "textarea":
                  ml(e, r), l = Pn(e, r), Ce("invalid", e);
                  break;
                default:
                  l = r;
              }
              un(n, l), s = l;
              for (i in s) if (s.hasOwnProperty(i)) {
                var d = s[i];
                i === "style" ? vl(e, d) : i === "dangerouslySetInnerHTML" ? (d = d ? d.__html : void 0, d != null && Tn(e, d)) : i === "children" ? typeof d == "string" ? (n !== "textarea" || d !== "") && Ot(e, d) : typeof d == "number" && Ot(e, "" + d) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (oe.hasOwnProperty(i) ? d != null && i === "onScroll" && Ce("scroll", e) : d != null && Oe(e, i, d, o));
              }
              switch (n) {
                case "input":
                  kt(e), Ar(e, r, !1);
                  break;
                case "textarea":
                  kt(e), hl(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + te(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? Yt(e, !!r.multiple, i, !1) : r.defaultValue != null && Yt(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = ki);
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
        if (e && t.stateNode != null) Ru(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(v(166));
          if (n = jr(Kl.current), jr(nn.current), Pi(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[tn] = t, (i = r.nodeValue !== n) && (e = _t, e !== null)) switch (e.tag) {
              case 3:
                xi(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && xi(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            i && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[tn] = t, t.stateNode = r;
        }
        return it(t), null;
      case 13:
        if (Ee(Re), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (Ne && Ct !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) zs(), rl(), t.flags |= 98560, i = !1;
          else if (i = Pi(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(v(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(v(317));
              i[tn] = t;
            } else rl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            it(t), i = !1;
          } else Wt !== null && (ja(Wt), Wt = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Re.current & 1) !== 0 ? be === 0 && (be = 3) : La())), t.updateQueue !== null && (t.flags |= 4), it(t), null);
      case 4:
        return al(), va(e, t), e === null && $l(t.stateNode.containerInfo), it(t), null;
      case 10:
        return bo(t.type._context), it(t), null;
      case 17:
        return vt(t.type) && _i(), it(t), null;
      case 19:
        if (Ee(Re), i = t.memoizedState, i === null) return it(t), null;
        if (r = (t.flags & 128) !== 0, o = i.rendering, o === null) if (r) Zl(i, !1);
        else {
          if (be !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (o = Ii(e), o !== null) {
              for (t.flags |= 128, Zl(i, !1), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, o = i.alternate, o === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = o.childLanes, i.lanes = o.lanes, i.child = o.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = o.memoizedProps, i.memoizedState = o.memoizedState, i.updateQueue = o.updateQueue, i.type = o.type, e = o.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return ke(Re, Re.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && Se() > dl && (t.flags |= 128, r = !0, Zl(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = Ii(o), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), Zl(i, !0), i.tail === null && i.tailMode === "hidden" && !o.alternate && !Ne) return it(t), null;
          } else 2 * Se() - i.renderingStartTime > dl && n !== 1073741824 && (t.flags |= 128, r = !0, Zl(i, !1), t.lanes = 4194304);
          i.isBackwards ? (o.sibling = t.child, t.child = o) : (n = i.last, n !== null ? n.sibling = o : t.child = o, i.last = o);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = Se(), t.sibling = null, n = Re.current, ke(Re, r ? n & 1 | 2 : n & 1), t) : (it(t), null);
      case 22:
      case 23:
        return Ra(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (Et & 1073741824) !== 0 && (it(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : it(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(v(156, t.tag));
  }
  function gd(e, t) {
    switch (Fo(t), t.tag) {
      case 1:
        return vt(t.type) && _i(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return al(), Ee(ht), Ee(rt), Jo(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Go(t), null;
      case 13:
        if (Ee(Re), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(v(340));
          rl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return Ee(Re), null;
      case 4:
        return al(), null;
      case 10:
        return bo(t.type._context), null;
      case 22:
      case 23:
        return Ra(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Wi = !1, ot = !1, wd = typeof WeakSet == "function" ? WeakSet : Set, L = null;
  function ul(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      De(e, t, r);
    }
    else n.current = null;
  }
  function ya(e, t, n) {
    try {
      n();
    } catch (r) {
      De(e, t, r);
    }
  }
  var Lu = !1;
  function xd(e, t) {
    if (Ro = yn, e = as(), ko(e)) {
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
          var o = 0, s = -1, d = -1, h = 0, S = 0, _ = e, k = null;
          t: for (; ; ) {
            for (var R; _ !== n || l !== 0 && _.nodeType !== 3 || (s = o + l), _ !== i || r !== 0 && _.nodeType !== 3 || (d = o + r), _.nodeType === 3 && (o += _.nodeValue.length), (R = _.firstChild) !== null; )
              k = _, _ = R;
            for (; ; ) {
              if (_ === e) break t;
              if (k === n && ++h === l && (s = o), k === i && ++S === r && (d = o), (R = _.nextSibling) !== null) break;
              _ = k, k = _.parentNode;
            }
            _ = R;
          }
          n = s === -1 || d === -1 ? null : { start: s, end: d };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Lo = { focusedElem: e, selectionRange: n }, yn = !1, L = t; L !== null; ) if (t = L, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, L = e;
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
              var D = z.memoizedProps, Ie = z.memoizedState, p = t.stateNode, f = p.getSnapshotBeforeUpdate(t.elementType === t.type ? D : bt(t.type, D), Ie);
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
            throw Error(v(163));
        }
      } catch (E) {
        De(t, t.return, E);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, L = e;
        break;
      }
      L = t.return;
    }
    return z = Lu, Lu = !1, z;
  }
  function Jl(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var i = l.destroy;
          l.destroy = void 0, i !== void 0 && ya(t, n, i);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function bi(e, t) {
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
  function ga(e) {
    var t = e.ref;
    if (t !== null) {
      var n = e.stateNode;
      e.tag, e = n, typeof t == "function" ? t(e) : t.current = e;
    }
  }
  function zu(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, zu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[tn], delete t[Hl], delete t[Mo], delete t[nd], delete t[rd])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Tu(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Du(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Tu(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function wa(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = ki));
    else if (r !== 4 && (e = e.child, e !== null)) for (wa(e, t, n), e = e.sibling; e !== null; ) wa(e, t, n), e = e.sibling;
  }
  function xa(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (xa(e, t, n), e = e.sibling; e !== null; ) xa(e, t, n), e = e.sibling;
  }
  var Ze = null, Vt = !1;
  function qn(e, t, n) {
    for (n = n.child; n !== null; ) Mu(e, t, n), n = n.sibling;
  }
  function Mu(e, t, n) {
    if (St && typeof St.onCommitFiberUnmount == "function") try {
      St.onCommitFiberUnmount(pn, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        ot || ul(n, t);
      case 6:
        var r = Ze, l = Vt;
        Ze = null, qn(e, t, n), Ze = r, Vt = l, Ze !== null && (Vt ? (e = Ze, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Ze.removeChild(n.stateNode));
        break;
      case 18:
        Ze !== null && (Vt ? (e = Ze, n = n.stateNode, e.nodeType === 8 ? Do(e.parentNode, n) : e.nodeType === 1 && Do(e, n), wr(e)) : Do(Ze, n.stateNode));
        break;
      case 4:
        r = Ze, l = Vt, Ze = n.stateNode.containerInfo, Vt = !0, qn(e, t, n), Ze = r, Vt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!ot && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var i = l, o = i.destroy;
            i = i.tag, o !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && ya(n, t, o), l = l.next;
          } while (l !== r);
        }
        qn(e, t, n);
        break;
      case 1:
        if (!ot && (ul(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (s) {
          De(n, t, s);
        }
        qn(e, t, n);
        break;
      case 21:
        qn(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (ot = (r = ot) || n.memoizedState !== null, qn(e, t, n), ot = r) : qn(e, t, n);
        break;
      default:
        qn(e, t, n);
    }
  }
  function Iu(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new wd()), t.forEach(function(r) {
        var l = Rd.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function Qt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var i = e, o = t, s = o;
        e: for (; s !== null; ) {
          switch (s.tag) {
            case 5:
              Ze = s.stateNode, Vt = !1;
              break e;
            case 3:
              Ze = s.stateNode.containerInfo, Vt = !0;
              break e;
            case 4:
              Ze = s.stateNode.containerInfo, Vt = !0;
              break e;
          }
          s = s.return;
        }
        if (Ze === null) throw Error(v(160));
        Mu(i, o, l), Ze = null, Vt = !1;
        var d = l.alternate;
        d !== null && (d.return = null), l.return = null;
      } catch (h) {
        De(l, t, h);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Ou(t, e), t = t.sibling;
  }
  function Ou(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Qt(t, e), ln(e), r & 4) {
          try {
            Jl(3, e, e.return), bi(3, e);
          } catch (D) {
            De(e, e.return, D);
          }
          try {
            Jl(5, e, e.return);
          } catch (D) {
            De(e, e.return, D);
          }
        }
        break;
      case 1:
        Qt(t, e), ln(e), r & 512 && n !== null && ul(n, n.return);
        break;
      case 5:
        if (Qt(t, e), ln(e), r & 512 && n !== null && ul(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Ot(l, "");
          } catch (D) {
            De(e, e.return, D);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var i = e.memoizedProps, o = n !== null ? n.memoizedProps : i, s = e.type, d = e.updateQueue;
          if (e.updateQueue = null, d !== null) try {
            s === "input" && i.type === "radio" && i.name != null && Or(l, i), lr(s, o);
            var h = lr(s, i);
            for (o = 0; o < d.length; o += 2) {
              var S = d[o], _ = d[o + 1];
              S === "style" ? vl(l, _) : S === "dangerouslySetInnerHTML" ? Tn(l, _) : S === "children" ? Ot(l, _) : Oe(l, S, _, h);
            }
            switch (s) {
              case "input":
                It(l, i);
                break;
              case "textarea":
                Rn(l, i);
                break;
              case "select":
                var k = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!i.multiple;
                var R = i.value;
                R != null ? Yt(l, !!i.multiple, R, !1) : k !== !!i.multiple && (i.defaultValue != null ? Yt(
                  l,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : Yt(l, !!i.multiple, i.multiple ? [] : "", !1));
            }
            l[Hl] = i;
          } catch (D) {
            De(e, e.return, D);
          }
        }
        break;
      case 6:
        if (Qt(t, e), ln(e), r & 4) {
          if (e.stateNode === null) throw Error(v(162));
          l = e.stateNode, i = e.memoizedProps;
          try {
            l.nodeValue = i;
          } catch (D) {
            De(e, e.return, D);
          }
        }
        break;
      case 3:
        if (Qt(t, e), ln(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          wr(t.containerInfo);
        } catch (D) {
          De(e, e.return, D);
        }
        break;
      case 4:
        Qt(t, e), ln(e);
        break;
      case 13:
        Qt(t, e), ln(e), l = e.child, l.flags & 8192 && (i = l.memoizedState !== null, l.stateNode.isHidden = i, !i || l.alternate !== null && l.alternate.memoizedState !== null || (_a = Se())), r & 4 && Iu(e);
        break;
      case 22:
        if (S = n !== null && n.memoizedState !== null, e.mode & 1 ? (ot = (h = ot) || S, Qt(t, e), ot = h) : Qt(t, e), ln(e), r & 8192) {
          if (h = e.memoizedState !== null, (e.stateNode.isHidden = h) && !S && (e.mode & 1) !== 0) for (L = e, S = e.child; S !== null; ) {
            for (_ = L = S; L !== null; ) {
              switch (k = L, R = k.child, k.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Jl(4, k, k.return);
                  break;
                case 1:
                  ul(k, k.return);
                  var z = k.stateNode;
                  if (typeof z.componentWillUnmount == "function") {
                    r = k, n = k.return;
                    try {
                      t = r, z.props = t.memoizedProps, z.state = t.memoizedState, z.componentWillUnmount();
                    } catch (D) {
                      De(r, n, D);
                    }
                  }
                  break;
                case 5:
                  ul(k, k.return);
                  break;
                case 22:
                  if (k.memoizedState !== null) {
                    Bu(_);
                    continue;
                  }
              }
              R !== null ? (R.return = k, L = R) : Bu(_);
            }
            S = S.sibling;
          }
          e: for (S = null, _ = e; ; ) {
            if (_.tag === 5) {
              if (S === null) {
                S = _;
                try {
                  l = _.stateNode, h ? (i = l.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (s = _.stateNode, d = _.memoizedProps.style, o = d != null && d.hasOwnProperty("display") ? d.display : null, s.style.display = qt("display", o));
                } catch (D) {
                  De(e, e.return, D);
                }
              }
            } else if (_.tag === 6) {
              if (S === null) try {
                _.stateNode.nodeValue = h ? "" : _.memoizedProps;
              } catch (D) {
                De(e, e.return, D);
              }
            } else if ((_.tag !== 22 && _.tag !== 23 || _.memoizedState === null || _ === e) && _.child !== null) {
              _.child.return = _, _ = _.child;
              continue;
            }
            if (_ === e) break e;
            for (; _.sibling === null; ) {
              if (_.return === null || _.return === e) break e;
              S === _ && (S = null), _ = _.return;
            }
            S === _ && (S = null), _.sibling.return = _.return, _ = _.sibling;
          }
        }
        break;
      case 19:
        Qt(t, e), ln(e), r & 4 && Iu(e);
        break;
      case 21:
        break;
      default:
        Qt(
          t,
          e
        ), ln(e);
    }
  }
  function ln(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (Tu(n)) {
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
            r.flags & 32 && (Ot(l, ""), r.flags &= -33);
            var i = Du(e);
            xa(e, i, l);
            break;
          case 3:
          case 4:
            var o = r.stateNode.containerInfo, s = Du(e);
            wa(e, s, o);
            break;
          default:
            throw Error(v(161));
        }
      } catch (d) {
        De(e, e.return, d);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function kd(e, t, n) {
    L = e, Au(e);
  }
  function Au(e, t, n) {
    for (var r = (e.mode & 1) !== 0; L !== null; ) {
      var l = L, i = l.child;
      if (l.tag === 22 && r) {
        var o = l.memoizedState !== null || Wi;
        if (!o) {
          var s = l.alternate, d = s !== null && s.memoizedState !== null || ot;
          s = Wi;
          var h = ot;
          if (Wi = o, (ot = d) && !h) for (L = l; L !== null; ) o = L, d = o.child, o.tag === 22 && o.memoizedState !== null ? $u(l) : d !== null ? (d.return = o, L = d) : $u(l);
          for (; i !== null; ) L = i, Au(i), i = i.sibling;
          L = l, Wi = s, ot = h;
        }
        Fu(e);
      } else (l.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = l, L = i) : Fu(e);
    }
  }
  function Fu(e) {
    for (; L !== null; ) {
      var t = L;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              ot || bi(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !ot) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : bt(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var i = t.updateQueue;
              i !== null && Is(t, i, r);
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
                Is(t, o, n);
              }
              break;
            case 5:
              var s = t.stateNode;
              if (n === null && t.flags & 4) {
                n = s;
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
                  var S = h.memoizedState;
                  if (S !== null) {
                    var _ = S.dehydrated;
                    _ !== null && wr(_);
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
          ot || t.flags & 512 && ga(t);
        } catch (k) {
          De(t, t.return, k);
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
  function $u(e) {
    for (; L !== null; ) {
      var t = L;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              bi(4, t);
            } catch (d) {
              De(t, n, d);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (d) {
                De(t, l, d);
              }
            }
            var i = t.return;
            try {
              ga(t);
            } catch (d) {
              De(t, i, d);
            }
            break;
          case 5:
            var o = t.return;
            try {
              ga(t);
            } catch (d) {
              De(t, o, d);
            }
        }
      } catch (d) {
        De(t, t.return, d);
      }
      if (t === e) {
        L = null;
        break;
      }
      var s = t.sibling;
      if (s !== null) {
        s.return = t.return, L = s;
        break;
      }
      L = t.return;
    }
  }
  var Sd = Math.ceil, Vi = ce.ReactCurrentDispatcher, ka = ce.ReactCurrentOwner, Tt = ce.ReactCurrentBatchConfig, ue = 0, Qe = null, Be = null, Je = 0, Et = 0, cl = bn(0), be = 0, ei = null, Rr = 0, Qi = 0, Sa = 0, ti = null, gt = null, _a = 0, dl = 1 / 0, Nn = null, Ki = !1, Ca = null, Xn = null, Yi = !1, Gn = null, qi = 0, ni = 0, Ea = null, Xi = -1, Gi = 0;
  function ft() {
    return (ue & 6) !== 0 ? Se() : Xi !== -1 ? Xi : Xi = Se();
  }
  function Zn(e) {
    return (e.mode & 1) === 0 ? 1 : (ue & 2) !== 0 && Je !== 0 ? Je & -Je : id.transition !== null ? (Gi === 0 && (Gi = Pl()), Gi) : (e = de, e !== 0 || (e = window.event, e = e === void 0 ? 16 : pi(e.type)), e);
  }
  function Kt(e, t, n, r) {
    if (50 < ni) throw ni = 0, Ea = null, Error(v(185));
    jt(e, n, r), ((ue & 2) === 0 || e !== Qe) && (e === Qe && ((ue & 2) === 0 && (Qi |= n), be === 4 && Jn(e, Je)), wt(e, r), n === 1 && ue === 0 && (t.mode & 1) === 0 && (dl = Se() + 500, Ei && Qn()));
  }
  function wt(e, t) {
    var n = e.callbackNode;
    Ft(e, t);
    var r = mr(e, e === Qe ? Je : 0);
    if (r === 0) n !== null && ur(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && ur(n), t === 1) e.tag === 0 ? ld(Hu.bind(null, e)) : Ns(Hu.bind(null, e)), ed(function() {
        (ue & 6) === 0 && Qn();
      }), n = null;
      else {
        switch (hr(r)) {
          case 1:
            n = cr;
            break;
          case 4:
            n = _l;
            break;
          case 16:
            n = fn;
            break;
          case 536870912:
            n = dr;
            break;
          default:
            n = fn;
        }
        n = Xu(n, Uu.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Uu(e, t) {
    if (Xi = -1, Gi = 0, (ue & 6) !== 0) throw Error(v(327));
    var n = e.callbackNode;
    if (fl() && e.callbackNode !== n) return null;
    var r = mr(e, e === Qe ? Je : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Zi(e, r);
    else {
      t = r;
      var l = ue;
      ue |= 2;
      var i = bu();
      (Qe !== e || Je !== t) && (Nn = null, dl = Se() + 500, zr(e, t));
      do
        try {
          Ed();
          break;
        } catch (s) {
          Wu(e, s);
        }
      while (!0);
      Wo(), Vi.current = i, ue = l, Be !== null ? t = 0 : (Qe = null, Je = 0, t = be);
    }
    if (t !== 0) {
      if (t === 2 && (l = mn(e), l !== 0 && (r = l, t = Na(e, l))), t === 1) throw n = ei, zr(e, 0), Jn(e, r), wt(e, Se()), n;
      if (t === 6) Jn(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !_d(l) && (t = Zi(e, r), t === 2 && (i = mn(e), i !== 0 && (r = i, t = Na(e, i))), t === 1)) throw n = ei, zr(e, 0), Jn(e, r), wt(e, Se()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(v(345));
          case 2:
            Tr(e, gt, Nn);
            break;
          case 3:
            if (Jn(e, r), (r & 130023424) === r && (t = _a + 500 - Se(), 10 < t)) {
              if (mr(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                ft(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = To(Tr.bind(null, e, gt, Nn), t);
              break;
            }
            Tr(e, gt, Nn);
            break;
          case 4:
            if (Jn(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var o = 31 - ut(r);
              i = 1 << o, o = t[o], o > l && (l = o), r &= ~i;
            }
            if (r = l, r = Se() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Sd(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = To(Tr.bind(null, e, gt, Nn), r);
              break;
            }
            Tr(e, gt, Nn);
            break;
          case 5:
            Tr(e, gt, Nn);
            break;
          default:
            throw Error(v(329));
        }
      }
    }
    return wt(e, Se()), e.callbackNode === n ? Uu.bind(null, e) : null;
  }
  function Na(e, t) {
    var n = ti;
    return e.current.memoizedState.isDehydrated && (zr(e, t).flags |= 256), e = Zi(e, t), e !== 2 && (t = gt, gt = n, t !== null && ja(t)), e;
  }
  function ja(e) {
    gt === null ? gt = e : gt.push.apply(gt, e);
  }
  function _d(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var l = n[r], i = l.getSnapshot;
          l = l.value;
          try {
            if (!Ht(i(), l)) return !1;
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
  function Jn(e, t) {
    for (t &= ~Sa, t &= ~Qi, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - ut(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Hu(e) {
    if ((ue & 6) !== 0) throw Error(v(327));
    fl();
    var t = mr(e, 0);
    if ((t & 1) === 0) return wt(e, Se()), null;
    var n = Zi(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = mn(e);
      r !== 0 && (t = r, n = Na(e, r));
    }
    if (n === 1) throw n = ei, zr(e, 0), Jn(e, t), wt(e, Se()), n;
    if (n === 6) throw Error(v(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, Tr(e, gt, Nn), wt(e, Se()), null;
  }
  function Pa(e, t) {
    var n = ue;
    ue |= 1;
    try {
      return e(t);
    } finally {
      ue = n, ue === 0 && (dl = Se() + 500, Ei && Qn());
    }
  }
  function Lr(e) {
    Gn !== null && Gn.tag === 0 && (ue & 6) === 0 && fl();
    var t = ue;
    ue |= 1;
    var n = Tt.transition, r = de;
    try {
      if (Tt.transition = null, de = 1, e) return e();
    } finally {
      de = r, Tt.transition = n, ue = t, (ue & 6) === 0 && Qn();
    }
  }
  function Ra() {
    Et = cl.current, Ee(cl);
  }
  function zr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Jc(n)), Be !== null) for (n = Be.return; n !== null; ) {
      var r = n;
      switch (Fo(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && _i();
          break;
        case 3:
          al(), Ee(ht), Ee(rt), Jo();
          break;
        case 5:
          Go(r);
          break;
        case 4:
          al();
          break;
        case 13:
          Ee(Re);
          break;
        case 19:
          Ee(Re);
          break;
        case 10:
          bo(r.type._context);
          break;
        case 22:
        case 23:
          Ra();
      }
      n = n.return;
    }
    if (Qe = e, Be = e = er(e.current, null), Je = Et = t, be = 0, ei = null, Sa = Qi = Rr = 0, gt = ti = null, Nr !== null) {
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
  function Wu(e, t) {
    do {
      var n = Be;
      try {
        if (Wo(), Oi.current = $i, Ai) {
          for (var r = Le.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          Ai = !1;
        }
        if (Pr = 0, Ve = We = Le = null, Yl = !1, ql = 0, ka.current = null, n === null || n.return === null) {
          be = 1, ei = t, Be = null;
          break;
        }
        e: {
          var i = e, o = n.return, s = n, d = t;
          if (t = Je, s.flags |= 32768, d !== null && typeof d == "object" && typeof d.then == "function") {
            var h = d, S = s, _ = S.tag;
            if ((S.mode & 1) === 0 && (_ === 0 || _ === 11 || _ === 15)) {
              var k = S.alternate;
              k ? (S.updateQueue = k.updateQueue, S.memoizedState = k.memoizedState, S.lanes = k.lanes) : (S.updateQueue = null, S.memoizedState = null);
            }
            var R = mu(o);
            if (R !== null) {
              R.flags &= -257, hu(R, o, s, i, t), R.mode & 1 && pu(i, h, t), t = R, d = h;
              var z = t.updateQueue;
              if (z === null) {
                var D = /* @__PURE__ */ new Set();
                D.add(d), t.updateQueue = D;
              } else z.add(d);
              break e;
            } else {
              if ((t & 1) === 0) {
                pu(i, h, t), La();
                break e;
              }
              d = Error(v(426));
            }
          } else if (Ne && s.mode & 1) {
            var Ie = mu(o);
            if (Ie !== null) {
              (Ie.flags & 65536) === 0 && (Ie.flags |= 256), hu(Ie, o, s, i, t), Uo(sl(d, s));
              break e;
            }
          }
          i = d = sl(d, s), be !== 4 && (be = 2), ti === null ? ti = [i] : ti.push(i), i = o;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var p = du(i, d, t);
                Ms(i, p);
                break e;
              case 1:
                s = d;
                var f = i.type, m = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof f.getDerivedStateFromError == "function" || m !== null && typeof m.componentDidCatch == "function" && (Xn === null || !Xn.has(m)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var E = fu(i, s, t);
                  Ms(i, E);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        Qu(n);
      } catch (O) {
        t = O, Be === n && n !== null && (Be = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function bu() {
    var e = Vi.current;
    return Vi.current = $i, e === null ? $i : e;
  }
  function La() {
    (be === 0 || be === 3 || be === 2) && (be = 4), Qe === null || (Rr & 268435455) === 0 && (Qi & 268435455) === 0 || Jn(Qe, Je);
  }
  function Zi(e, t) {
    var n = ue;
    ue |= 2;
    var r = bu();
    (Qe !== e || Je !== t) && (Nn = null, zr(e, t));
    do
      try {
        Cd();
        break;
      } catch (l) {
        Wu(e, l);
      }
    while (!0);
    if (Wo(), ue = n, Vi.current = r, Be !== null) throw Error(v(261));
    return Qe = null, Je = 0, be;
  }
  function Cd() {
    for (; Be !== null; ) Vu(Be);
  }
  function Ed() {
    for (; Be !== null && !kl(); ) Vu(Be);
  }
  function Vu(e) {
    var t = qu(e.alternate, e, Et);
    e.memoizedProps = e.pendingProps, t === null ? Qu(e) : Be = t, ka.current = null;
  }
  function Qu(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = yd(n, t, Et), n !== null) {
          Be = n;
          return;
        }
      } else {
        if (n = gd(n, t), n !== null) {
          n.flags &= 32767, Be = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          be = 6, Be = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Be = t;
        return;
      }
      Be = t = e;
    } while (t !== null);
    be === 0 && (be = 5);
  }
  function Tr(e, t, n) {
    var r = de, l = Tt.transition;
    try {
      Tt.transition = null, de = 1, Nd(e, t, n, r);
    } finally {
      Tt.transition = l, de = r;
    }
    return null;
  }
  function Nd(e, t, n, r) {
    do
      fl();
    while (Gn !== null);
    if ((ue & 6) !== 0) throw Error(v(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(v(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = n.lanes | n.childLanes;
    if (G(e, i), e === Qe && (Be = Qe = null, Je = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Yi || (Yi = !0, Xu(fn, function() {
      return fl(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = Tt.transition, Tt.transition = null;
      var o = de;
      de = 1;
      var s = ue;
      ue |= 4, ka.current = null, xd(e, n), Ou(n, e), Qc(Lo), yn = !!Ro, Lo = Ro = null, e.current = n, kd(n), si(), ue = s, de = o, Tt.transition = i;
    } else e.current = n;
    if (Yi && (Yi = !1, Gn = e, qi = l), i = e.pendingLanes, i === 0 && (Xn = null), uo(n.stateNode), wt(e, Se()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Ki) throw Ki = !1, e = Ca, Ca = null, e;
    return (qi & 1) !== 0 && e.tag !== 0 && fl(), i = e.pendingLanes, (i & 1) !== 0 ? e === Ea ? ni++ : (ni = 0, Ea = e) : ni = 0, Qn(), null;
  }
  function fl() {
    if (Gn !== null) {
      var e = hr(qi), t = Tt.transition, n = de;
      try {
        if (Tt.transition = null, de = 16 > e ? 16 : e, Gn === null) var r = !1;
        else {
          if (e = Gn, Gn = null, qi = 0, (ue & 6) !== 0) throw Error(v(331));
          var l = ue;
          for (ue |= 4, L = e.current; L !== null; ) {
            var i = L, o = i.child;
            if ((L.flags & 16) !== 0) {
              var s = i.deletions;
              if (s !== null) {
                for (var d = 0; d < s.length; d++) {
                  var h = s[d];
                  for (L = h; L !== null; ) {
                    var S = L;
                    switch (S.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Jl(8, S, i);
                    }
                    var _ = S.child;
                    if (_ !== null) _.return = S, L = _;
                    else for (; L !== null; ) {
                      S = L;
                      var k = S.sibling, R = S.return;
                      if (zu(S), S === h) {
                        L = null;
                        break;
                      }
                      if (k !== null) {
                        k.return = R, L = k;
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
                      var Ie = D.sibling;
                      D.sibling = null, D = Ie;
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
                  Jl(9, i, i.return);
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
              if (s = L, (s.flags & 2048) !== 0) try {
                switch (s.tag) {
                  case 0:
                  case 11:
                  case 15:
                    bi(9, s);
                }
              } catch (O) {
                De(s, s.return, O);
              }
              if (s === o) {
                L = null;
                break e;
              }
              var E = s.sibling;
              if (E !== null) {
                E.return = s.return, L = E;
                break e;
              }
              L = s.return;
            }
          }
          if (ue = l, Qn(), St && typeof St.onPostCommitFiberRoot == "function") try {
            St.onPostCommitFiberRoot(pn, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        de = n, Tt.transition = t;
      }
    }
    return !1;
  }
  function Ku(e, t, n) {
    t = sl(n, t), t = du(e, t, 1), e = Yn(e, t, 1), t = ft(), e !== null && (jt(e, 1, t), wt(e, t));
  }
  function De(e, t, n) {
    if (e.tag === 3) Ku(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Ku(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Xn === null || !Xn.has(r))) {
          e = sl(n, e), e = fu(t, e, 1), t = Yn(t, e, 1), e = ft(), t !== null && (jt(t, 1, e), wt(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function jd(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = ft(), e.pingedLanes |= e.suspendedLanes & n, Qe === e && (Je & n) === n && (be === 4 || be === 3 && (Je & 130023424) === Je && 500 > Se() - _a ? zr(e, 0) : Sa |= n), wt(e, t);
  }
  function Yu(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = pr, pr <<= 1, (pr & 130023424) === 0 && (pr = 4194304)));
    var n = ft();
    e = _n(e, t), e !== null && (jt(e, t, n), wt(e, n));
  }
  function Pd(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Yu(e, n);
  }
  function Rd(e, t) {
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
    r !== null && r.delete(t), Yu(e, n);
  }
  var qu;
  qu = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || ht.current) yt = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return yt = !1, vd(e, t, n);
      yt = (e.flags & 131072) !== 0;
    }
    else yt = !1, Ne && (t.flags & 1048576) !== 0 && js(t, ji, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Hi(e, t), e = t.pendingProps;
        var l = el(t, rt.current);
        il(t, n), l = na(null, t, r, e, l, n);
        var i = ra();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, vt(r) ? (i = !0, Ci(t)) : i = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Ko(t), l.updater = Di, t.stateNode = l, l._reactInternals = t, qo(t, r, e, n), t = da(null, t, r, !0, i, n)) : (t.tag = 0, Ne && i && Ao(t), dt(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Hi(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = zd(r), e = bt(r, e), l) {
            case 0:
              t = ca(null, t, r, e, n);
              break e;
            case 1:
              t = ku(null, t, r, e, n);
              break e;
            case 11:
              t = vu(null, t, r, e, n);
              break e;
            case 14:
              t = yu(null, t, r, bt(r.type, e), n);
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
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : bt(r, l), ca(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : bt(r, l), ku(e, t, r, l, n);
      case 3:
        e: {
          if (Su(t), e === null) throw Error(v(387));
          r = t.pendingProps, i = t.memoizedState, l = i.element, Ds(e, t), Ti(t, r, null, n);
          var o = t.memoizedState;
          if (r = o.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            l = sl(Error(v(423)), t), t = _u(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = sl(Error(v(424)), t), t = _u(e, t, r, n, l);
            break e;
          } else for (Ct = Wn(t.stateNode.containerInfo.firstChild), _t = t, Ne = !0, Wt = null, n = Hs(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (rl(), r === l) {
              t = En(e, t, n);
              break e;
            }
            dt(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Ws(t), e === null && $o(t), r = t.type, l = t.pendingProps, i = e !== null ? e.memoizedProps : null, o = l.children, zo(r, l) ? o = null : i !== null && zo(r, i) && (t.flags |= 32), xu(e, t), dt(e, t, o, n), t.child;
      case 6:
        return e === null && $o(t), null;
      case 13:
        return Cu(e, t, n);
      case 4:
        return Xo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = ol(t, null, r, n) : dt(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : bt(r, l), vu(e, t, r, l, n);
      case 7:
        return dt(e, t, t.pendingProps, n), t.child;
      case 8:
        return dt(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return dt(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, i = t.memoizedProps, o = l.value, ke(Ri, r._currentValue), r._currentValue = o, i !== null) if (Ht(i.value, o)) {
            if (i.children === l.children && !ht.current) {
              t = En(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var s = i.dependencies;
            if (s !== null) {
              o = i.child;
              for (var d = s.firstContext; d !== null; ) {
                if (d.context === r) {
                  if (i.tag === 1) {
                    d = Cn(-1, n & -n), d.tag = 2;
                    var h = i.updateQueue;
                    if (h !== null) {
                      h = h.shared;
                      var S = h.pending;
                      S === null ? d.next = d : (d.next = S.next, S.next = d), h.pending = d;
                    }
                  }
                  i.lanes |= n, d = i.alternate, d !== null && (d.lanes |= n), Vo(
                    i.return,
                    n,
                    t
                  ), s.lanes |= n;
                  break;
                }
                d = d.next;
              }
            } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (o = i.return, o === null) throw Error(v(341));
              o.lanes |= n, s = o.alternate, s !== null && (s.lanes |= n), Vo(o, n, t), o = i.sibling;
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
          dt(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, il(t, n), l = Lt(l), r = r(l), t.flags |= 1, dt(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = bt(r, t.pendingProps), l = bt(r.type, l), yu(e, t, r, l, n);
      case 15:
        return gu(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : bt(r, l), Hi(e, t), t.tag = 1, vt(r) ? (e = !0, Ci(t)) : e = !1, il(t, n), Fs(t, r, l), qo(t, r, l, n), da(null, t, r, !0, e, n);
      case 19:
        return Nu(e, t, n);
      case 22:
        return wu(e, t, n);
    }
    throw Error(v(156, t.tag));
  };
  function Xu(e, t) {
    return xl(e, t);
  }
  function Ld(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Dt(e, t, n, r) {
    return new Ld(e, t, n, r);
  }
  function za(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function zd(e) {
    if (typeof e == "function") return za(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === pt) return 11;
      if (e === qe) return 14;
    }
    return 2;
  }
  function er(e, t) {
    var n = e.alternate;
    return n === null ? (n = Dt(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Ji(e, t, n, r, l, i) {
    var o = 2;
    if (r = e, typeof e == "function") za(e) && (o = 1);
    else if (typeof e == "string") o = 5;
    else e: switch (e) {
      case N:
        return Dr(n.children, l, i, t);
      case Q:
        o = 8, l |= 8;
        break;
      case ge:
        return e = Dt(12, n, t, l | 2), e.elementType = ge, e.lanes = i, e;
      case at:
        return e = Dt(13, n, t, l), e.elementType = at, e.lanes = i, e;
      case Ye:
        return e = Dt(19, n, t, l), e.elementType = Ye, e.lanes = i, e;
      case se:
        return eo(n, l, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case ae:
            o = 10;
            break e;
          case Ue:
            o = 9;
            break e;
          case pt:
            o = 11;
            break e;
          case qe:
            o = 14;
            break e;
          case Pe:
            o = 16, r = null;
            break e;
        }
        throw Error(v(130, e == null ? e : typeof e, ""));
    }
    return t = Dt(o, n, t, l), t.elementType = e, t.type = r, t.lanes = i, t;
  }
  function Dr(e, t, n, r) {
    return e = Dt(7, e, r, t), e.lanes = n, e;
  }
  function eo(e, t, n, r) {
    return e = Dt(22, e, r, t), e.elementType = se, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Ta(e, t, n) {
    return e = Dt(6, e, null, t), e.lanes = n, e;
  }
  function Da(e, t, n) {
    return t = Dt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Td(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Bt(0), this.expirationTimes = Bt(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Bt(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Ma(e, t, n, r, l, i, o, s, d) {
    return e = new Td(e, t, n, s, d), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = Dt(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Ko(i), e;
  }
  function Dd(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: xe, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Gu(e) {
    if (!e) return Vn;
    e = e._reactInternals;
    e: {
      if (At(e) !== e || e.tag !== 1) throw Error(v(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (vt(t.type)) {
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
      if (vt(n)) return Cs(e, n, t);
    }
    return t;
  }
  function Zu(e, t, n, r, l, i, o, s, d) {
    return e = Ma(n, r, !0, e, l, i, o, s, d), e.context = Gu(null), n = e.current, r = ft(), l = Zn(n), i = Cn(r, l), i.callback = t ?? null, Yn(n, i, l), e.current.lanes = l, jt(e, l, r), wt(e, r), e;
  }
  function to(e, t, n, r) {
    var l = t.current, i = ft(), o = Zn(l);
    return n = Gu(n), t.context === null ? t.context = n : t.pendingContext = n, t = Cn(i, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Yn(l, t, o), e !== null && (Kt(e, l, o, i), zi(e, l, o)), o;
  }
  function no(e) {
    return e = e.current, e.child ? (e.child.tag === 5, e.child.stateNode) : null;
  }
  function Ju(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Ia(e, t) {
    Ju(e, t), (e = e.alternate) && Ju(e, t);
  }
  function Md() {
    return null;
  }
  var ec = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Oa(e) {
    this._internalRoot = e;
  }
  ro.prototype.render = Oa.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(v(409));
    to(e, t, null, null);
  }, ro.prototype.unmount = Oa.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Lr(function() {
        to(null, e, null, null);
      }), t[wn] = null;
    }
  };
  function ro(e) {
    this._internalRoot = e;
  }
  ro.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Ge();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Ut.length && t !== 0 && t < Ut[n].priority; n++) ;
      Ut.splice(n, 0, e), n === 0 && di(e);
    }
  };
  function Aa(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function lo(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function tc() {
  }
  function Id(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var h = no(o);
          i.call(h);
        };
      }
      var o = Zu(t, r, e, 0, null, !1, !1, "", tc);
      return e._reactRootContainer = o, e[wn] = o.current, $l(e.nodeType === 8 ? e.parentNode : e), Lr(), o;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var s = r;
      r = function() {
        var h = no(d);
        s.call(h);
      };
    }
    var d = Ma(e, 0, !1, null, null, !1, !1, "", tc);
    return e._reactRootContainer = d, e[wn] = d.current, $l(e.nodeType === 8 ? e.parentNode : e), Lr(function() {
      to(t, d, n, r);
    }), d;
  }
  function io(e, t, n, r, l) {
    var i = n._reactRootContainer;
    if (i) {
      var o = i;
      if (typeof l == "function") {
        var s = l;
        l = function() {
          var d = no(o);
          s.call(d);
        };
      }
      to(t, o, e, l);
    } else o = Id(n, t, e, l, r);
    return no(o);
  }
  vr = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Fn(t.pendingLanes);
          n !== 0 && (hn(t, n | 1), wt(t, Se()), (ue & 6) === 0 && (dl = Se() + 500, Qn()));
        }
        break;
      case 13:
        Lr(function() {
          var r = _n(e, 1);
          if (r !== null) {
            var l = ft();
            Kt(r, e, 1, l);
          }
        }), Ia(e, 1);
    }
  }, Zt = function(e) {
    if (e.tag === 13) {
      var t = _n(e, 134217728);
      if (t !== null) {
        var n = ft();
        Kt(t, e, 134217728, n);
      }
      Ia(e, 134217728);
    }
  }, yr = function(e) {
    if (e.tag === 13) {
      var t = Zn(e), n = _n(e, t);
      if (n !== null) {
        var r = ft();
        Kt(n, e, t, r);
      }
      Ia(e, t);
    }
  }, Ge = function() {
    return de;
  }, Rl = function(e, t) {
    var n = de;
    try {
      return de = e, t();
    } finally {
      de = n;
    }
  }, Ae = function(e, t, n) {
    switch (t) {
      case "input":
        if (It(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = Si(r);
              if (!l) throw Error(v(90));
              Ir(r), It(r, l);
            }
          }
        }
        break;
      case "textarea":
        Rn(e, n);
        break;
      case "select":
        t = n.value, t != null && Yt(e, !!n.multiple, t, !1);
    }
  }, Gt = Pa, wl = Lr;
  var Od = { usingClientEntryPoint: !1, Events: [Wl, Zr, Si, st, gl, Pa] }, ri = { findFiberByHostInstance: Sr, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" }, Ad = { bundleType: ri.bundleType, version: ri.version, rendererPackageName: ri.rendererPackageName, rendererConfig: ri.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ce.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = An(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: ri.findFiberByHostInstance || Md, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var oo = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!oo.isDisabled && oo.supportsFiber) try {
      pn = oo.inject(Ad), St = oo;
    } catch {
    }
  }
  return xt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Od, xt.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Aa(t)) throw Error(v(200));
    return Dd(e, t, null, n);
  }, xt.createRoot = function(e, t) {
    if (!Aa(e)) throw Error(v(299));
    var n = !1, r = "", l = ec;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Ma(e, 1, !1, null, null, n, !1, r, l), e[wn] = t.current, $l(e.nodeType === 8 ? e.parentNode : e), new Oa(t);
  }, xt.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(v(188)) : (e = Object.keys(e).join(","), Error(v(268, e)));
    return e = An(t), e = e === null ? null : e.stateNode, e;
  }, xt.flushSync = function(e) {
    return Lr(e);
  }, xt.hydrate = function(e, t, n) {
    if (!lo(t)) throw Error(v(200));
    return io(null, e, t, !0, n);
  }, xt.hydrateRoot = function(e, t, n) {
    if (!Aa(e)) throw Error(v(405));
    var r = n != null && n.hydratedSources || null, l = !1, i = "", o = ec;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = Zu(t, null, e, 1, n ?? null, l, !1, i, o), e[wn] = t.current, $l(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new ro(t);
  }, xt.render = function(e, t, n) {
    if (!lo(t)) throw Error(v(200));
    return io(null, e, t, !1, n);
  }, xt.unmountComponentAtNode = function(e) {
    if (!lo(e)) throw Error(v(40));
    return e._reactRootContainer ? (Lr(function() {
      io(null, null, e, !1, function() {
        e._reactRootContainer = null, e[wn] = null;
      });
    }), !0) : !1;
  }, xt.unstable_batchedUpdates = Pa, xt.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!lo(n)) throw Error(v(200));
    if (e == null || e._reactInternals === void 0) throw Error(v(38));
    return io(e, t, n, !1, r);
  }, xt.version = "18.2.0-next-9e3b772b8-20220608", xt;
}
var uc;
function Vd() {
  if (uc) return $a.exports;
  uc = 1;
  function g() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(g);
      } catch (A) {
        console.error(A);
      }
  }
  return g(), $a.exports = bd(), $a.exports;
}
var cc;
function Qd() {
  if (cc) return ao;
  cc = 1;
  var g = Vd();
  return ao.createRoot = g.createRoot, ao.hydrateRoot = g.hydrateRoot, ao;
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
const qd = (g) => g.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().trim(), Mr = (g, A) => {
  const v = w.forwardRef(
    ({
      color: pe = "currentColor",
      size: oe = 24,
      strokeWidth: me = 2,
      absoluteStrokeWidth: he,
      className: I = "",
      children: H,
      ...q
    }, ye) => w.createElement(
      "svg",
      {
        ref: ye,
        ...Yd,
        width: oe,
        height: oe,
        stroke: pe,
        strokeWidth: he ? Number(me) * 24 / Number(oe) : me,
        className: ["lucide", `lucide-${qd(g)}`, I].join(" "),
        ...q
      },
      [
        ...A.map(([Z, J]) => w.createElement(Z, J)),
        ...Array.isArray(H) ? H : [H]
      ]
    )
  );
  return v.displayName = `${g}`, v;
};
const Xd = Mr("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Gd = Mr("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
const Zd = Mr("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
const Jd = Mr("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
const ii = Mr("Music2", [
  ["circle", { cx: "8", cy: "18", r: "4", key: "1fc0mg" }],
  ["path", { d: "M12 18V2l7 4", key: "g04rme" }]
]);
const ef = Mr("Play", [
  ["polygon", { points: "5 3 19 12 5 21 5 3", key: "191637" }]
]);
const tf = Mr("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]), dc = ["auto", "sbc", "sbc_xq", "aac", "aptx", "aptx_hd", "ldac"], nf = ["trace", "debug", "info", "notice", "warning", "error", "fatal"];
function rf({ hass: g }) {
  const [A, v] = w.useState([]), [pe, oe] = w.useState([]), [me, he] = w.useState({}), [I, H] = w.useState(!1), [q, ye] = w.useState(""), [Z, J] = w.useState(""), [Me, K] = w.useState("0000"), [W, re] = w.useState({}), [je, $e] = w.useState(""), Oe = w.useCallback(async () => {
    if (g)
      try {
        const [N, Q, ge] = await Promise.all([
          g.callWS({ type: "bl_haos/speakers/devices" }),
          g.callWS({ type: "bl_haos/speakers/settings/get" }),
          g.callWS({ type: "bl_haos/speakers/adapters/list" })
        ]);
        v(Array.isArray(N) ? N : []), he(Q && typeof Q == "object" ? Q : {}), oe(Array.isArray(ge) ? ge : []);
      } catch {
        ye("Bluetooth action failed");
      }
  }, [g]);
  w.useEffect(() => {
    Oe();
  }, [Oe]);
  const ce = async (N, Q) => {
    if (g) {
      H(!0), ye(""), J("");
      try {
        await Q(), J(N), await Oe();
      } catch {
        ye("Bluetooth action failed");
      } finally {
        H(!1);
      }
    }
  }, we = (N, Q) => ce("Speaker settings saved.", () => g.callWS({ type: "bl_haos/speakers/settings/update", address: N, ...Q })), xe = (N) => ce("System settings saved.", () => g.callWS({ type: "bl_haos/speakers/system-settings/update", ...N }));
  return g ? /* @__PURE__ */ u.jsxs("section", { className: "speaker-management", "aria-label": "Speaker management", "aria-busy": I, children: [
    /* @__PURE__ */ u.jsxs("header", { children: [
      /* @__PURE__ */ u.jsx("h2", { children: "Speakers" }),
      /* @__PURE__ */ u.jsx(
        "button",
        {
          className: "neu-button",
          type: "button",
          disabled: I,
          onClick: () => {
            ce("Scan started.", () => g.callWS({ type: "bl_haos/speakers/scan", start: !0 }));
          },
          children: "Scan"
        }
      ),
      /* @__PURE__ */ u.jsx(
        "button",
        {
          className: "neu-button",
          type: "button",
          disabled: I,
          onClick: () => {
            ce("Scan stopped.", () => g.callWS({ type: "bl_haos/speakers/scan", start: !1 }));
          },
          children: "Stop scan"
        }
      )
    ] }),
    q && /* @__PURE__ */ u.jsx("p", { className: "error", role: "alert", children: q }),
    /* @__PURE__ */ u.jsx("p", { role: "status", "aria-live": "polite", children: Z }),
    /* @__PURE__ */ u.jsxs("label", { children: [
      "Pairing PIN ",
      /* @__PURE__ */ u.jsx("input", { "aria-label": "Pairing PIN", value: Me, onChange: (N) => K(N.target.value) })
    ] }),
    /* @__PURE__ */ u.jsx("ul", { "aria-label": "Bluetooth devices", children: A.map((N) => {
      const Q = me.speakers?.[N.address] ?? {};
      return /* @__PURE__ */ u.jsxs("li", { className: "neu-surface", children: [
        /* @__PURE__ */ u.jsx("h3", { children: N.name || N.address }),
        /* @__PURE__ */ u.jsxs("p", { children: [
          N.address,
          " · ",
          N.connected ? "Connected" : N.paired ? "Paired" : "Discovered"
        ] }),
        !N.paired && /* @__PURE__ */ u.jsx(
          "button",
          {
            className: "neu-button",
            type: "button",
            disabled: I,
            onClick: () => {
              ce("Pairing requested.", () => g.callWS({ type: "bl_haos/speakers/pair", address: N.address, pin: Me }));
            },
            children: "Pair"
          }
        ),
        N.paired && (N.connected ? /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", disabled: I, onClick: () => {
          ce("Speaker disconnected.", () => g.callWS({ type: "bl_haos/speakers/disconnect", address: N.address }));
        }, children: "Disconnect" }) : /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", disabled: I, onClick: () => {
          ce("Speaker connected.", () => g.callWS({ type: "bl_haos/speakers/connect", address: N.address }));
        }, children: "Connect" })),
        N.paired && /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
          /* @__PURE__ */ u.jsxs("label", { children: [
            "Rename ",
            /* @__PURE__ */ u.jsx(
              "input",
              {
                "aria-label": `Rename ${N.name || N.address}`,
                value: W[N.address] ?? Q.custom_alias ?? "",
                onChange: (ge) => re((ae) => ({ ...ae, [N.address]: ge.target.value }))
              }
            )
          ] }),
          /* @__PURE__ */ u.jsx(
            "button",
            {
              className: "neu-button",
              type: "button",
              disabled: I,
              onClick: () => {
                we(N.address, { custom_alias: W[N.address] ?? Q.custom_alias ?? "" });
              },
              children: "Save name"
            }
          ),
          /* @__PURE__ */ u.jsxs("label", { children: [
            /* @__PURE__ */ u.jsx(
              "input",
              {
                type: "checkbox",
                "aria-label": `Auto-reconnect ${N.name || N.address}`,
                checked: Q.auto_reconnect ?? !0,
                onChange: (ge) => {
                  we(N.address, { auto_reconnect: ge.target.checked });
                }
              }
            ),
            " Auto-reconnect"
          ] }),
          /* @__PURE__ */ u.jsxs("label", { children: [
            "Preferred adapter ",
            /* @__PURE__ */ u.jsx(
              "input",
              {
                "aria-label": `Preferred adapter ${N.name || N.address}`,
                value: Q.preferred_adapter ?? "",
                onChange: (ge) => he((ae) => ({ ...ae, speakers: { ...ae.speakers, [N.address]: { ...Q, preferred_adapter: ge.target.value } } }))
              }
            )
          ] }),
          /* @__PURE__ */ u.jsxs("label", { children: [
            "Default volume ",
            /* @__PURE__ */ u.jsx(
              "input",
              {
                type: "number",
                min: "0",
                max: "100",
                "aria-label": `Default volume ${N.name || N.address}`,
                value: Q.default_volume ?? 50,
                onChange: (ge) => he((ae) => ({ ...ae, speakers: { ...ae.speakers, [N.address]: { ...Q, default_volume: Number(ge.target.value) } } }))
              }
            )
          ] }),
          /* @__PURE__ */ u.jsxs("label", { children: [
            "Codec override ",
            /* @__PURE__ */ u.jsxs(
              "select",
              {
                "aria-label": `Codec override ${N.name || N.address}`,
                value: Q.codec_override ?? "",
                onChange: (ge) => {
                  we(N.address, { codec_override: ge.target.value || null });
                },
                children: [
                  /* @__PURE__ */ u.jsx("option", { value: "", children: "Default" }),
                  dc.map((ge) => /* @__PURE__ */ u.jsx("option", { value: ge, children: ge }, ge))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", disabled: I, onClick: () => {
            we(N.address, {
              custom_alias: W[N.address] ?? Q.custom_alias ?? "",
              auto_reconnect: Q.auto_reconnect ?? !0,
              preferred_adapter: Q.preferred_adapter ?? null,
              default_volume: Q.default_volume ?? 50,
              codec_override: Q.codec_override ?? null
            });
          }, children: "Save speaker settings" }),
          /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", disabled: I, onClick: () => $e(N.address), children: "Remove" })
        ] })
      ] }, N.address);
    }) }),
    /* @__PURE__ */ u.jsxs("section", { className: "neu-surface", "aria-label": "Bluetooth adapters", children: [
      /* @__PURE__ */ u.jsx("h3", { children: "Adapters" }),
      pe.map((N) => /* @__PURE__ */ u.jsxs("label", { children: [
        /* @__PURE__ */ u.jsx(
          "input",
          {
            type: "checkbox",
            "aria-label": `Adapter power ${N.interface}`,
            checked: N.powered,
            disabled: I,
            onChange: (Q) => {
              ce("Adapter updated.", () => g.callWS({ type: "bl_haos/speakers/adapters/power", adapter_name: N.interface, powered: Q.target.checked }));
            }
          }
        ),
        N.interface,
        " powered"
      ] }, N.interface))
    ] }),
    /* @__PURE__ */ u.jsxs("section", { className: "neu-surface", "aria-label": "System settings", children: [
      /* @__PURE__ */ u.jsx("h3", { children: "System settings" }),
      /* @__PURE__ */ u.jsxs("label", { children: [
        "Log level ",
        /* @__PURE__ */ u.jsx(
          "select",
          {
            "aria-label": "Log level",
            value: me.log_level ?? "info",
            disabled: I,
            onChange: (N) => {
              xe({ log_level: N.target.value });
            },
            children: nf.map((N) => /* @__PURE__ */ u.jsx("option", { children: N }, N))
          }
        )
      ] }),
      /* @__PURE__ */ u.jsxs("label", { children: [
        "Default codec ",
        /* @__PURE__ */ u.jsx(
          "select",
          {
            "aria-label": "Default codec",
            value: me.default_codec ?? "auto",
            disabled: I,
            onChange: (N) => {
              xe({ default_codec: N.target.value });
            },
            children: dc.map((N) => /* @__PURE__ */ u.jsx("option", { children: N }, N))
          }
        )
      ] }),
      /* @__PURE__ */ u.jsxs("label", { children: [
        /* @__PURE__ */ u.jsx(
          "input",
          {
            type: "checkbox",
            "aria-label": "Global auto-reconnect",
            checked: me.auto_reconnect_enabled ?? !0,
            disabled: I,
            onChange: (N) => {
              xe({ auto_reconnect_enabled: N.target.checked });
            }
          }
        ),
        " Global auto-reconnect"
      ] })
    ] }),
    je && /* @__PURE__ */ u.jsxs("dialog", { open: !0, "aria-modal": "true", "aria-label": "Confirm speaker removal", children: [
      /* @__PURE__ */ u.jsx("p", { children: "Remove this speaker?" }),
      /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", onClick: () => $e(""), children: "Cancel" }),
      /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", disabled: I, onClick: () => {
        const N = je;
        $e(""), ce("Speaker removed.", () => g.callWS({ type: "bl_haos/speakers/remove", address: N }));
      }, children: "Confirm remove" })
    ] })
  ] }) : /* @__PURE__ */ u.jsx("section", { className: "neu-surface", children: /* @__PURE__ */ u.jsx("p", { role: "alert", children: "Home Assistant is unavailable." }) });
}
function lf(g) {
  const A = g?.attributes.queue;
  return A && typeof A == "object" ? A : void 0;
}
function of(g) {
  return g?.status === "playing" || g?.status === "paused" || g?.status === "failed";
}
function fc() {
  if (typeof crypto.randomUUID == "function") return crypto.randomUUID();
  const g = crypto.getRandomValues(new Uint8Array(16));
  g[6] = g[6] & 15 | 64, g[8] = g[8] & 63 | 128;
  const A = Array.from(g, (v) => v.toString(16).padStart(2, "0")).join("");
  return `${A.slice(0, 8)}-${A.slice(8, 12)}-${A.slice(12, 16)}-${A.slice(16, 20)}-${A.slice(20)}`;
}
function pc(g) {
  if (typeof g != "number" || !Number.isFinite(g) || g < 0) return "Time unavailable";
  const A = Math.floor(g);
  return `${Math.floor(A / 60)}:${String(A % 60).padStart(2, "0")}`;
}
function pl(g) {
  return g.entity_id.startsWith("media_player.") && typeof g.attributes.bluetooth_address == "string" && /^(?:[0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(g.attributes.bluetooth_address) && typeof g.attributes.adapter == "string" && g.attributes.adapter.trim().length > 0 && ["idle", "playing", "paused"].includes(g.state);
}
function on(g) {
  return typeof g.attributes.friendly_name == "string" ? g.attributes.friendly_name : g.entity_id;
}
function af(g) {
  return g.kind === "custom";
}
function Wa(g) {
  return g.kind === "provider";
}
function mc(g) {
  return g.media_class?.toLowerCase() === "playlist" || g.media_content_type.toLowerCase().includes("playlist");
}
function sf(g) {
  if (!(!g?.startsWith("/") || g.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(g)))
    try {
      const A = "https://ha.invalid", v = new URL(g, A);
      if (v.origin !== A || v.protocol !== "https:" || v.username || v.password) return;
      const pe = `${v.pathname}${v.search}${v.hash}`;
      return pe.startsWith("//") ? void 0 : pe;
    } catch {
      return;
    }
}
function uf({ hass: g, thumbnail: A }) {
  const v = sf(A), pe = g?.connection, oe = pe?.connected, me = g?.user.id, he = g?.fetchWithAuth, [I, H] = w.useState();
  w.useEffect(() => {
    if (!v || !pe || !oe || !me || !he) return;
    const ye = new AbortController();
    let Z = !0, J;
    const Me = { path: v, connection: pe, userId: me, fetchWithAuth: he };
    return (async () => {
      try {
        const K = await he(v, { signal: ye.signal, redirect: "error" });
        if (!K.ok) throw new Error("Artwork request failed");
        const W = await K.blob();
        if (!W.type.startsWith("image/") || !W.size) throw new Error("Invalid artwork response");
        if (!Z) return;
        J = URL.createObjectURL(W), H({ ...Me, url: J, failed: !1 });
      } catch {
        Z && !ye.signal.aborted && H({ ...Me, failed: !0 });
      }
    })(), () => {
      Z = !1, ye.abort(), J && URL.revokeObjectURL(J);
    };
  }, [v, pe, oe, me, he]);
  const q = oe && I?.path === v && I?.connection === pe && I?.userId === me && I?.fetchWithAuth === he ? I : void 0;
  return q?.url && !q.failed ? /* @__PURE__ */ u.jsx(
    "img",
    {
      className: "thumbnail",
      src: q.url,
      alt: "",
      loading: "lazy",
      referrerPolicy: "no-referrer",
      onError: () => H({ ...q, failed: !0 })
    }
  ) : v && (!he || q?.failed) ? /* @__PURE__ */ u.jsx("span", { className: "media-icon", role: "img", "aria-label": "Artwork unavailable", title: "Artwork unavailable", children: /* @__PURE__ */ u.jsx(ii, { size: 24, "aria-hidden": "true" }) }) : /* @__PURE__ */ u.jsx(ii, { className: "media-icon", size: 24, "aria-hidden": "true" });
}
const cf = "Your Home Assistant session cannot access this media source. Reconnect or ask an administrator for access, then try again.", df = "This source cannot play audio on a BL-HAOS speaker. Choose an audio item or provider playlist.";
function ff({ hass: g, initialView: A = "library" }) {
  const v = w.useRef(A), [pe, oe] = w.useState(A), [me, he] = w.useState("media"), [I, H] = w.useState(), [q, ye] = w.useState(!1), [Z, J] = w.useState(""), [Me, K] = w.useState(""), [W, re] = w.useState(!1), [je, $e] = w.useState(), [Oe, ce] = w.useState(""), [we, xe] = w.useState([]), [N, Q] = w.useState([]), [ge, ae] = w.useState(""), [Ue, pt] = w.useState(!1), [at, Ye] = w.useState(!1), [qe, Pe] = w.useState(!1), [se, P] = w.useState(), [F, c] = w.useState(), [x, M] = w.useState(!1), [V, Y] = w.useState(), [X, ne] = w.useState(""), [le, te] = w.useState({}), [Xe, jn] = w.useState(""), [kt, Ir] = w.useState(""), [nr, an] = w.useState(""), [Mt, Or] = w.useState(""), [It, Ar] = w.useState(() => /* @__PURE__ */ new Set()), [Fr, mt] = w.useState({}), [Yt, Pn] = w.useState(""), [ml, Rn] = w.useState(""), hl = w.useRef(null), [Ln, zn] = w.useState(""), [rr, Tn] = w.useState(""), [Ot, sn] = w.useState(!1), [oi, qt] = w.useState(""), [vl, yl] = w.useState({}), [un, lr] = w.useState(() => /* @__PURE__ */ new Set()), ir = w.useRef(null), cn = w.useRef(""), [Ae, Xt] = w.useState(), [et, Br] = w.useState([]), [st, gl] = w.useState(""), [Gt, wl] = w.useState(""), [Fe, Dn] = w.useState(!1), [ze, or] = w.useState(!1), [Mn, $r] = w.useState(""), [In, Nt] = w.useState(""), [Ur, dn] = w.useState(""), [Hr, Wr] = w.useState(""), [so, At] = w.useState(!1), [On, ar] = w.useState(), [sr, An] = w.useState(), [ai, xl] = w.useState(), ur = w.useRef(""), kl = w.useRef(!1), si = w.useRef(null), Se = w.useRef(/* @__PURE__ */ new Map()), Sl = w.useRef(/* @__PURE__ */ new Map()), cr = w.useRef(/* @__PURE__ */ new Map()), _l = w.useRef(/* @__PURE__ */ new Map()), fn = w.useRef(/* @__PURE__ */ new Map()), Cl = w.useRef(/* @__PURE__ */ new Map()), dr = w.useRef(), pn = w.useRef(), St = w.useRef(null), uo = w.useRef(null), ut = w.useRef(null), El = w.useRef(null), Nl = w.useRef(null), jl = w.useRef(null), fr = w.useRef(null), pr = w.useRef(null), Fn = w.useRef(null), mr = w.useRef(null), ui = w.useRef(null), Ft = w.useRef(null), mn = w.useRef({ name: "", entries: [] }), Pl = w.useRef(null), Bt = w.useRef(0), jt = w.useRef(0), G = w.useRef(0), hn = w.useRef(""), de = w.useRef(0), hr = w.useRef(/* @__PURE__ */ new Set()), vr = w.useRef(/* @__PURE__ */ new Set()), Zt = w.useRef(0), yr = w.useRef(!1), Ge = w.useRef(g);
  Ge.current = g;
  const Rl = g?.connection, br = g?.user?.id, ie = !!(Rl?.connected && br), $t = Object.values(g?.states ?? {}).filter(pl), tt = g?.states[st], Te = ie && tt !== void 0 && pl(tt), _e = lf(tt);
  async function vn() {
    const a = Ge.current;
    if (!a?.connection.connected || !a.user?.id) {
      ye(!1);
      return;
    }
    const y = ++jt.current;
    ye(!0), J("");
    try {
      const j = await a.callWS({ type: "bl_haos/playlist_library/list" });
      jt.current === y && H(j);
    } catch {
      jt.current === y && J("Couldn't load your library. Reconnect Home Assistant, then select Retry loading.");
    } finally {
      jt.current === y && ye(!1);
    }
  }
  function Ut(a) {
    return un.has(a) ? "Checking availability..." : vl[a] === "available" ? "Available in Home Assistant" : vl[a] === "unavailable" ? "Unavailable in Home Assistant." : "Not checked";
  }
  async function ci(a, y) {
    const j = Ge.current;
    if (!j?.connection.connected || !j.user?.id || !y.startsWith("media-source://") || vr.current.has(a)) return;
    const C = G.current;
    vr.current.add(a), lr((T) => new Set(T).add(a)), K("Checking availability...");
    try {
      if (await j.callWS({ type: "media_source/browse_media", media_content_id: y }), G.current !== C) return;
      yl((T) => ({ ...T, [a]: "available" })), K("Available in Home Assistant.");
    } catch {
      if (G.current !== C) return;
      yl((T) => ({ ...T, [a]: "unavailable" })), K("Unavailable in Home Assistant.");
    } finally {
      G.current === C && (vr.current.delete(a), lr((T) => {
        const B = new Set(T);
        return B.delete(a), B;
      }));
    }
  }
  w.useLayoutEffect(() => {
    const a = Ge.current;
    if (G.current++, ++Bt.current, jt.current++, Zt.current++, yr.current = !1, Xt(void 0), Br([]), oe(v.current), H(void 0), J(""), K(""), re(!1), $e(void 0), ce(""), xe([]), Q([]), ae(""), pt(!1), Ye(!1), Pe(!1), P(void 0), c(void 0), M(!1), Y(void 0), ne(""), te({}), jn(""), Ir(""), an(""), Or(""), Ar(/* @__PURE__ */ new Set()), hr.current.clear(), mt({}), zn(""), Tn(""), sn(!1), qt(""), yl({}), lr(/* @__PURE__ */ new Set()), vr.current.clear(), Pn(""), Rn(""), cn.current = "", hn.current = "", gl(""), wl(""), or(!1), dn(""), ar(void 0), An(void 0), xl(void 0), Wr(""), At(!1), Dn(ie), $r(""), Nt(""), !(!a || !ie))
      return Dn(!1), v.current === "browse" ? Jt({ path: [] }, !0) : vn(), () => {
        G.current++, Bt.current++, jt.current++, Zt.current++;
      };
  }, [Rl, br, ie]), w.useLayoutEffect(() => {
    ur.current ? (Se.current.get(ur.current)?.focus(), ur.current = "") : kl.current && (si.current?.focus(), kl.current = !1);
  }, [Ae]), w.useLayoutEffect(() => {
    const a = dr.current;
    if (!a) return;
    dr.current = void 0;
    const y = Cl.current.get(a.key);
    a.action === "down" && y?.down && !y.down.disabled ? y.down.focus() : a.action === "up" && y?.up && !y.up.disabled ? y.up.focus() : y?.remove ? y.remove.focus() : Pl.current?.focus();
  }, [N]), w.useLayoutEffect(() => {
    const a = V ? jl.current : se ? ut.current : F ? El.current : x ? Nl.current : void 0, y = [ut.current, El.current, Nl.current, jl.current];
    a && !a.open && (typeof a.showModal == "function" ? a.showModal() : a.setAttribute("open", ""));
    for (const j of y)
      !j?.open || j === a || (typeof j.close == "function" ? j.close() : j.removeAttribute("open"));
  }, [se, F, x, V]), w.useLayoutEffect(() => {
    V ? mr.current?.focus() : se ? fr.current?.focus() : F ? pr.current?.focus() : x ? Fn.current?.focus() : Ft.current?.isConnected && Ft.current.focus(), !se && !F && !x && !V && (Ft.current = null);
  }, [se, F, x, V]), w.useLayoutEffect(() => {
    const a = pn.current;
    a && (pn.current = void 0, a === "create" ? St.current?.focus() : Sl.current.get(a)?.focus());
  }, [I, W, je, se, x]), w.useLayoutEffect(() => {
    if (Yt && hl.current?.focus(), Ln) {
      ir.current?.focus();
      return;
    }
    const a = cn.current;
    a && (cn.current = "", cr.current.get(a)?.focus());
  }, [Yt, Ln, I]);
  async function Jt(a, y = !1) {
    const j = Ge.current, { item: C, path: T, query: B } = a;
    if (!j?.connection.connected || !j.user?.id || ze && !y || C && (!C.media_content_id.startsWith("media-source://") || (B === void 0 ? !C.can_expand : !C.can_search))) return;
    const ve = ++Bt.current;
    Dn(!0), $r(""), Nt(""), dn(""), ar(void 0), An(void 0);
    try {
      const He = await j.callWS(B !== void 0 && C ? { type: "media_source/search_media", media_content_id: C.media_content_id, search_query: B } : { type: "media_source/browse_media", ...C ? { media_content_id: C.media_content_id } : {} });
      if (Bt.current !== ve) return;
      C && B === void 0 && (kl.current = !0), Br(T), Xt("result" in He && C ? { ...C, children: He.result } : He), At(B !== void 0), B === void 0 && Wr("");
    } catch {
      Bt.current === ve && ($r(cf), ar(a));
    } finally {
      Bt.current === ve && Dn(!1);
    }
  }
  function Bn() {
    oe("browse"), (W || je) && Pe(!0), !Ae && !Fe && Jt({ path: [] });
  }
  function co() {
    hn.current = fc(), ce(""), xe([]), Q([]), mn.current = { name: "", entries: [] }, ae(""), Ye(!1), $e(void 0), re(!0), Pe(!1), oe("library");
  }
  function di(a) {
    $e(a), re(!1), ce(a.name), xe(a.entries.map((y) => ({ ...y }))), Q(a.entries.map(() => `entry-${de.current++}`)), mn.current = { name: a.name, entries: a.entries.map((y) => ({ ...y })) }, ae(""), Ye(!1), Pe(!1), oe("library");
  }
  function $n() {
    const a = je?.record_id ?? (W ? "create" : "");
    a && (pn.current = a), re(!1), $e(void 0), ce(""), xe([]), Q([]), ae(""), Ye(!1), Pe(!1), mn.current = { name: "", entries: [] }, hn.current = "", oe("library");
  }
  function fi() {
    return Oe !== mn.current.name || JSON.stringify(we) !== JSON.stringify(mn.current.entries);
  }
  function fo(a) {
    if (Ft.current = a, fi()) {
      M(!0);
      return;
    }
    $n();
  }
  function gr(a, y) {
    Ft.current = y, jn(""), P(a);
  }
  function wr(a, y) {
    Ft.current = y, an(""), c(a);
  }
  function ct() {
    P(void 0), c(void 0), M(!1), Y(void 0), jn(""), an("");
  }
  function yn(a) {
    if (a.key === "Escape" && !kt && !Mt && !X) {
      a.preventDefault(), ct();
      return;
    }
    if (a.key !== "Tab") return;
    const y = Array.from(a.currentTarget.querySelectorAll("button:not(:disabled)"));
    if (!y.length) return;
    const j = y[0], C = y[y.length - 1];
    a.shiftKey && document.activeElement === j ? (a.preventDefault(), C.focus()) : !a.shiftKey && document.activeElement === C && (a.preventDefault(), j.focus());
  }
  async function po() {
    const a = Ge.current, y = se;
    if (!y || !a?.connection.connected || !a.user?.id || kt) return;
    const j = G.current;
    Ir(y.record_id), jn(""), K("Deleting playlist...");
    try {
      const C = await a.callWS({
        type: "bl_haos/playlist_library/delete_custom",
        record_id: y.record_id,
        revision: I?.revision ?? 0
      });
      if (G.current !== j) return;
      const T = C, ve = (I?.records ?? []).filter((kr) => kr.kind === "custom").findIndex((kr) => kr.record_id === y.record_id), He = T.records.filter((kr) => kr.kind === "custom"), ho = He[Math.min(Math.max(ve, 0), He.length - 1)];
      pn.current = ho?.record_id ?? "create", Ft.current = null, H(T), P(void 0), K("Playlist deleted.");
    } catch (C) {
      if (G.current !== j) return;
      const T = C instanceof Error ? C.message : "";
      if (/Playlist library changed/i.test(T)) {
        jn(`Couldn't delete “${y.name}” right now. It remains in your library. Select Delete playlist to try again, or Keep playlist.`);
        try {
          const B = await a.callWS({ type: "bl_haos/playlist_library/list" });
          G.current === j && H(B);
        } catch {
        }
      } else
        jn(`Couldn't delete “${y.name}” right now. It remains in your library. Select Delete playlist to try again, or Keep playlist.`);
      G.current === j && K("");
    } finally {
      G.current === j && Ir("");
    }
  }
  function mo(a) {
    Pn(a.media_content_id), Rn(a.title), mt((y) => {
      const j = { ...y };
      return delete j[a.media_content_id], j;
    });
  }
  async function Ll(a, y) {
    const j = Ge.current, C = a.media_content_id, T = y.trim();
    if (!T) {
      mt((ve) => ({ ...ve, [C]: "Enter a shortcut name before saving." }));
      return;
    }
    if (new TextEncoder().encode(T).length > 128) {
      mt((ve) => ({
        ...ve,
        [C]: "Shortcut names must be at most 128 UTF-8 bytes. Enter a shorter name."
      }));
      return;
    }
    if (!j?.connection.connected || !j.user?.id || !mc(a) || It.has(C) || hr.current.has(C) || !C.startsWith("media-source://")) return;
    const B = G.current;
    hr.current.add(C), Ar((ve) => new Set(ve).add(C)), mt((ve) => {
      const He = { ...ve };
      return delete He[C], He;
    }), K(`Saving “${T}” to your library...`);
    try {
      const ve = await j.callWS({
        type: "bl_haos/playlist_library/save_provider",
        media_content_id: C,
        name: T,
        ...a.title ? { title: a.title } : {},
        ...a.media_class ? { media_class: a.media_class } : {},
        ...a.media_content_type ? { media_content_type: a.media_content_type } : {}
      });
      if (G.current !== B) return;
      H(ve), Pn(""), Rn(""), K("Playlist saved to your library.");
    } catch {
      G.current === B && (mt((ve) => ({
        ...ve,
        [C]: `Couldn't save “${T}” to your library right now. Nothing was added. Select Save shortcut to try again, or cancel to return to Browse media.`
      })), K(""));
    } finally {
      G.current === B && (hr.current.delete(C), Ar((ve) => {
        const He = new Set(ve);
        return He.delete(C), He;
      }));
    }
  }
  function Vr(a) {
    zn(a.record_id), Tn(a.name), qt("");
  }
  function zl(a) {
    cn.current = a, zn(""), Tn(""), qt("");
  }
  async function pi(a) {
    const y = Ge.current, j = rr.trim();
    if (!j) {
      qt("Enter a shortcut name before saving.");
      return;
    }
    if (!y?.connection.connected || !y.user?.id || Ot) return;
    const C = G.current;
    sn(!0), qt(""), K("Saving shortcut name...");
    try {
      const T = await y.callWS({
        type: "bl_haos/playlist_library/rename_provider",
        record_id: a.record_id,
        name: j,
        revision: I?.revision ?? 0
      });
      if (G.current !== C) return;
      H(T), cn.current = a.record_id, zn(""), Tn(""), K("Shortcut name saved.");
    } catch (T) {
      if (G.current !== C) return;
      if (qt(T instanceof Error && /invalid_format|Invalid playlist record/i.test(T.message) ? "Shortcut names must be non-empty and at most 128 UTF-8 bytes. Enter a shorter name, then save again." : `Couldn't rename “${a.name}” right now. Your local name is still here. Select Save shortcut name to try again.`), ir.current?.focus(), T instanceof Error && /Playlist library changed/i.test(T.message))
        try {
          const B = await y.callWS({ type: "bl_haos/playlist_library/list" });
          G.current === C && H(B);
        } catch {
        }
      G.current === C && K("");
    } finally {
      G.current === C && sn(!1);
    }
  }
  async function en() {
    const a = Ge.current, y = F;
    if (!y || !a?.connection.connected || !a.user?.id || Mt) return;
    const j = G.current;
    Or(y.record_id), an(""), K("Removing shortcut...");
    try {
      const C = await a.callWS({
        type: "bl_haos/playlist_library/delete_provider",
        record_id: y.record_id,
        revision: I?.revision ?? 0
      });
      if (G.current !== j) return;
      H(C), Ft.current = ui.current, c(void 0), K("Shortcut removed. The Home Assistant playlist is unchanged.");
    } catch (C) {
      if (G.current !== j) return;
      if (an(`Couldn't remove “${y.name}” right now. The shortcut remains in your library, and the Home Assistant playlist is unchanged. Select Remove shortcut to try again, or Keep shortcut.`), C instanceof Error && /Playlist library changed/i.test(C.message))
        try {
          const T = await a.callWS({ type: "bl_haos/playlist_library/list" });
          G.current === j && H(T);
        } catch {
        }
      G.current === j && K("");
    } finally {
      G.current === j && Or("");
    }
  }
  function Tl(a) {
    if (!a.can_play || !a.media_content_id.startsWith("media-source://")) return;
    const y = a.media_class?.toLowerCase();
    if (!(a.media_content_type.toLowerCase().startsWith("audio/") || ["music", "track", "episode"].includes(y ?? ""))) return;
    const C = {
      media_content_id: a.media_content_id,
      title: a.title,
      ...a.media_class ? { media_class: a.media_class } : {},
      media_content_type: a.media_content_type
    };
    xe((T) => [...T, C]), Q((T) => [...T, `entry-${de.current++}`]), ae(""), Pe(!1), oe("library");
  }
  function xr(a, y) {
    const j = a + y;
    if (j < 0 || j >= we.length) return;
    const C = [...we], T = [...N];
    [C[a], C[j]] = [C[j], C[a]], [T[a], T[j]] = [T[j], T[a]], dr.current = { key: N[a], action: y === 1 ? "down" : "up" }, xe(C), Q(T), ae("");
    const B = we[a].title || "Media item";
    K(`Moved ${B} to position ${j + 1} of ${we.length}.`);
  }
  function mi(a) {
    const y = we.filter((T, B) => B !== a), j = N.filter((T, B) => B !== a), C = Math.min(a, j.length - 1);
    dr.current = C >= 0 ? { key: j[C], action: "remove" } : { key: "", action: "remove" }, xe(y), Q(j), ae("");
  }
  async function Qr(a) {
    a.preventDefault();
    const y = Ge.current, j = Oe.trim();
    if (!j) {
      ae("Enter a playlist name before saving.");
      return;
    }
    if (!y?.connection.connected || !y.user?.id || Ue) return;
    const C = G.current;
    W && (hn.current ||= fc()), pt(!0), ae(""), K(W ? "Saving playlist..." : "Saving changes...");
    try {
      const T = await y.callWS({
        type: W ? "bl_haos/playlist_library/save_custom" : "bl_haos/playlist_library/update_custom",
        record_id: W ? hn.current : je.record_id,
        name: j,
        entries: we,
        revision: I?.revision ?? 0
      });
      if (G.current !== C) return;
      H(T), $n(), K(W ? "Playlist saved." : "Changes saved.");
    } catch (T) {
      if (G.current !== C) return;
      const B = T instanceof Error ? T.message : "";
      if (/Playlist library changed/i.test(B)) {
        Ye(!0), ae("This playlist changed in Home Assistant. Your edits are still here. The newer saved version was kept; stop editing and reopen the playlist to review it.");
        try {
          const ve = await y.callWS({ type: "bl_haos/playlist_library/list" });
          G.current === C && H(ve);
        } catch {
        }
      } else /not found/i.test(B) ? ae("The selected playlist or a media item couldn't be matched. Return to Your playlists and select Edit playlist on the intended row; for an affected media item, remove it or add it again from Browse media. Your valid draft data is still here.") : /invalid_format|Invalid playlist record/i.test(B) ? ae("This playlist has details that can't be saved yet. Review the playlist name and entries, correct any marked fields, then select Save playlist or Save changes. Your valid draft data is still here.") : ae(W ? "Couldn't save this playlist right now. Your draft is still here. Select Save playlist to try again, or Discard draft to leave without saving." : `Couldn't save changes to “${je?.name ?? j}” right now. Your edits are still here. Select Save changes to try again, or Stop editing to leave without saving.`);
      G.current === C && K("");
    } finally {
      G.current === C && pt(!1);
    }
  }
  function Un(a = et.length - 1) {
    const y = et[a];
    !y || ze || (Bt.current++, ur.current = Ae?.media_content_id ?? "", Xt(y), Br(et.slice(0, a)), Dn(!1), At(!1), Wr(""), ar(void 0), $r(""), Nt(""));
  }
  function Dl(a, y) {
    if (!(!ie || !Te || q || ze || X || a.kind === "custom" && a.entries.length === 0)) {
      if (te((j) => {
        const C = { ...j };
        return delete C[a.record_id], C;
      }), of(_e)) {
        Ft.current = y, Y(a);
        return;
      }
      nt(a);
    }
  }
  async function nt(a) {
    const y = Ge.current, j = st, C = y?.states[j];
    if (!y?.connection.connected || !y.user?.id || !C || !pl(C) || !j || X) return;
    const T = G.current;
    ne(a.record_id), K(`Preparing “${a.name}” for ${on(C)}…`);
    try {
      if (await y.callWS({
        type: "bl_haos/playlist_library/start",
        record_id: a.record_id,
        entity_id: j
      }), G.current !== T) return;
      const B = Ge.current?.states[j];
      if (!B || !pl(B)) {
        te((ve) => ({
          ...ve,
          [a.record_id]: `Couldn't confirm “${a.name}” started on ${on(C)}. Check the current queue before trying again.`
        })), K("");
        return;
      }
      K(`Queue updated on ${on(B)}.`), Y(void 0);
    } catch {
      G.current === T && (te((B) => ({
        ...B,
        [a.record_id]: `Couldn't confirm “${a.name}” started on ${on(C)}. Check the current queue before trying again.`
      })), K(""));
    } finally {
      G.current === T && ne("");
    }
  }
  async function gn(a, y = st) {
    const j = Ge.current, C = j?.states[y];
    if (!j?.connection.connected || !j.user?.id || !C || !pl(C) || !a.can_play || y !== st || Fe || !a.media_content_id.startsWith("media-source://") || yr.current) return;
    const T = ++Zt.current;
    yr.current = !0, or(!0), Nt(""), dn(""), xl(a), An(void 0);
    try {
      if (await j.callService("media_player", "play_media", {
        media_content_id: a.media_content_id,
        media_content_type: a.media_content_type
      }, { entity_id: C.entity_id }), Zt.current !== T) return;
      const B = Ge.current?.states[C.entity_id];
      B && pl(B) ? dn(`Starting playback on ${on(B)}`) : Nt("The selected speaker is unavailable. Select a connected speaker to play media.");
    } catch {
      Zt.current === T && (Nt(`Home Assistant could not play this item on ${on(C)}. Check the provider access and speaker connection, then try again.`), An({ item: a, target: C.entity_id }));
    } finally {
      Zt.current === T && (yr.current = !1, or(!1));
    }
  }
  return /* @__PURE__ */ u.jsxs("main", { className: "neu-page card-layout", onKeyDown: (a) => {
    pe === "browse" && a.key === "Escape" && et.length && !ze && (a.preventDefault(), Un());
  }, children: [
    /* @__PURE__ */ u.jsxs("header", { className: "catalog-header", children: [
      /* @__PURE__ */ u.jsxs("div", { className: "catalog-heading", children: [
        pe === "browse" && /* @__PURE__ */ u.jsx(
          "button",
          {
            className: "neu-button icon-button",
            "aria-label": "Back",
            title: "Back",
            ref: si,
            disabled: et.length === 0 || ze,
            onClick: () => Un(),
            children: /* @__PURE__ */ u.jsx(Gd, { size: 20, "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ u.jsxs("div", { children: [
          /* @__PURE__ */ u.jsx("p", { className: "eyebrow", children: "BL-HAOS" }),
          /* @__PURE__ */ u.jsx("h1", { children: pe === "library" ? "Media Library" : "Media Catalog" })
        ] })
      ] }),
      /* @__PURE__ */ u.jsxs("div", { className: "target-control", children: [
        /* @__PURE__ */ u.jsx("label", { htmlFor: "catalog-target", children: "Play on" }),
        /* @__PURE__ */ u.jsxs(
          "select",
          {
            id: "catalog-target",
            className: "neu-inset",
            value: st,
            disabled: !ie || ze || !!X,
            onChange: (a) => {
              gl(a.target.value);
              const y = g?.states[a.target.value];
              wl(y ? on(y) : ""), dn(""), K(""), An(void 0), Nt(""), te({});
            },
            children: [
              /* @__PURE__ */ u.jsx("option", { value: "", children: "Select a connected speaker" }),
              st && !Te && /* @__PURE__ */ u.jsxs("option", { value: st, disabled: !0, children: [
                Gt,
                " (unavailable)"
              ] }),
              $t.map((a) => /* @__PURE__ */ u.jsx("option", { value: a.entity_id, children: on(a) }, a.entity_id))
            ]
          }
        ),
        st && /* @__PURE__ */ u.jsx("span", { className: "selected-target", title: Te && tt ? on(tt) : Gt, children: Te && tt ? on(tt) : Gt })
      ] })
    ] }),
    /* @__PURE__ */ u.jsxs("nav", { className: "view-toggle", "aria-label": "Media views", children: [
      /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", ref: uo, "aria-pressed": me === "media" && pe === "library", onClick: () => {
        he("media"), Pe(!1), oe("library"), !I && !q && !Z && vn();
      }, children: "Library" }),
      /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", ref: ui, "aria-pressed": me === "media" && pe === "browse", onClick: () => {
        he("media"), Bn();
      }, children: "Browse media" }),
      /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", "aria-pressed": me === "speakers", onClick: () => he("speakers"), children: "Speakers" })
    ] }),
    me === "speakers" ? /* @__PURE__ */ u.jsx(rf, { hass: g }) : pe === "library" ? /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
      !ie && /* @__PURE__ */ u.jsx("p", { role: "alert", children: "Your Home Assistant session is unavailable." }),
      Z && /* @__PURE__ */ u.jsxs("div", { className: "error", role: "alert", children: [
        /* @__PURE__ */ u.jsx("p", { children: Z }),
        /* @__PURE__ */ u.jsx("button", { className: "neu-button", disabled: !ie || q, onClick: () => {
          vn();
        }, children: "Retry loading" })
      ] }),
      /* @__PURE__ */ u.jsx("p", { className: "status", role: "status", "aria-live": "polite", "aria-atomic": "true", children: q ? "Loading playlists..." : Me }),
      /* @__PURE__ */ u.jsxs("section", { className: "neu-surface queue-summary", "aria-label": "Playback queue", children: [
        /* @__PURE__ */ u.jsx("h2", { children: "Playback queue" }),
        /* @__PURE__ */ u.jsxs("div", { className: "queue-summary-body", "aria-live": "polite", "aria-atomic": "true", children: [
          !st && /* @__PURE__ */ u.jsx("p", { children: "No active queue. Select a connected speaker to view playback." }),
          st && !Te && /* @__PURE__ */ u.jsx("p", { children: "Speaker disconnected. The queue was stopped. Select a connected speaker to start a playlist." }),
          Te && !_e && /* @__PURE__ */ u.jsx("p", { children: "No active queue" }),
          Te && _e && /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
            /* @__PURE__ */ u.jsx("p", { className: "queue-playlist", children: _e.status === "completed" ? "Playlist complete" : _e.playlist ?? "Playback queue" }),
            /* @__PURE__ */ u.jsx("p", { children: _e.title ?? "Current item unavailable" }),
            _e.artist && /* @__PURE__ */ u.jsx("p", { className: "metadata", children: _e.artist }),
            typeof _e.index == "number" && typeof _e.count == "number" && /* @__PURE__ */ u.jsxs("p", { children: [
              "Item ",
              _e.index,
              " of ",
              _e.count
            ] }),
            /* @__PURE__ */ u.jsxs("p", { children: [
              pc(_e.position),
              " / ",
              pc(_e.duration)
            ] }),
            /* @__PURE__ */ u.jsxs("p", { className: "metadata", children: [
              _e.status ?? "Status unavailable",
              _e.shuffle ? " · Shuffle on" : "",
              _e.repeat ? ` · Repeat ${_e.repeat}` : ""
            ] }),
            _e.error && /* @__PURE__ */ u.jsx("p", { className: "error", role: "alert", children: "Playback failed. Nothing was skipped." })
          ] })
        ] })
      ] }),
      $t.length === 0 && /* @__PURE__ */ u.jsx("p", { className: "warning", children: "No connected speakers are available. Connect a speaker, then select it to play a playlist." }),
      /* @__PURE__ */ u.jsxs("section", { className: "neu-surface", "aria-label": "Your playlists", "aria-busy": q, children: [
        /* @__PURE__ */ u.jsx("h2", { children: "Your playlists" }),
        /* @__PURE__ */ u.jsxs("div", { className: "library-body", children: [
          q && /* @__PURE__ */ u.jsx("p", { className: "library-message", children: "Loading playlists..." }),
          !q && !Z && I && !I.records.some((a) => a.kind === "custom") && !I.records.some(Wa) && /* @__PURE__ */ u.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ u.jsx("h3", { children: "Your library is empty" }),
            /* @__PURE__ */ u.jsx("p", { children: "Create a playlist or browse Home Assistant media to save a playlist reference." })
          ] }),
          !q && /* @__PURE__ */ u.jsx("ul", { "aria-label": "Your playlists", children: (I?.records ?? []).filter(af).map((a) => /* @__PURE__ */ u.jsxs("li", { children: [
            /* @__PURE__ */ u.jsx(ii, { className: "media-icon", size: 24, "aria-hidden": "true" }),
            /* @__PURE__ */ u.jsxs("div", { className: "media-detail", children: [
              /* @__PURE__ */ u.jsx("span", { className: "media-title", children: a.name }),
              /* @__PURE__ */ u.jsxs("span", { className: "metadata", children: [
                a.entries.length,
                " items"
              ] }),
              le[a.record_id] && /* @__PURE__ */ u.jsx("span", { className: "error", role: "alert", children: le[a.record_id] })
            ] }),
            /* @__PURE__ */ u.jsxs("div", { className: "row-actions", children: [
              /* @__PURE__ */ u.jsx(
                "button",
                {
                  className: "neu-button primary-button",
                  type: "button",
                  "aria-label": `Play playlist ${a.name}`,
                  ref: (y) => {
                    y ? fn.current.set(a.record_id, y) : fn.current.delete(a.record_id);
                  },
                  disabled: !ie || !Te || a.entries.length === 0 || q || !!X,
                  onClick: (y) => Dl(a, y.currentTarget),
                  children: X === a.record_id ? "Preparing..." : "Play playlist"
                }
              ),
              /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", ref: (y) => {
                y ? Sl.current.set(a.record_id, y) : Sl.current.delete(a.record_id);
              }, disabled: !ie || !!kt || W || !!je, onClick: () => di(a), children: "Edit playlist" }),
              /* @__PURE__ */ u.jsx(
                "button",
                {
                  className: "neu-button destructive-button",
                  type: "button",
                  disabled: !ie || !!kt || W || !!je,
                  onClick: (y) => gr(a, y.currentTarget),
                  children: "Delete playlist"
                }
              )
            ] })
          ] }, a.record_id)) }),
          !W && !je && /* @__PURE__ */ u.jsx(
            "button",
            {
              className: "neu-button primary-button",
              type: "button",
              disabled: !ie || !I || !!Z || q || Ue,
              ref: St,
              onClick: co,
              children: "Create playlist"
            }
          ),
          (W || je) && !qe && /* @__PURE__ */ u.jsxs("form", { className: "playlist-form", onSubmit: (a) => {
            Qr(a);
          }, children: [
            /* @__PURE__ */ u.jsx("label", { htmlFor: "playlist-name", children: "Playlist name" }),
            /* @__PURE__ */ u.jsx(
              "input",
              {
                id: "playlist-name",
                className: "neu-inset",
                type: "text",
                value: Oe,
                onChange: (a) => {
                  ce(a.target.value), ae("");
                },
                disabled: Ue
              }
            ),
            /* @__PURE__ */ u.jsx("h3", { children: "Playlist entries" }),
            /* @__PURE__ */ u.jsxs("ol", { className: "playlist-entries", "aria-label": "Playlist entries", "aria-busy": Ue, children: [
              we.length === 0 && /* @__PURE__ */ u.jsx("li", { className: "empty-entry", children: "No media added yet. Add media to build this playlist, or save it as an empty draft." }),
              we.map((a, y) => {
                const j = N[y], C = a.title || "Media item", T = (B, ve) => {
                  const He = Cl.current.get(j) ?? {};
                  ve ? He[B] = ve : delete He[B], Cl.current.set(j, He);
                };
                return /* @__PURE__ */ u.jsxs("li", { children: [
                  /* @__PURE__ */ u.jsx(ii, { className: "media-icon", size: 24, "aria-hidden": "true" }),
                  /* @__PURE__ */ u.jsxs("div", { className: "media-detail", children: [
                    /* @__PURE__ */ u.jsx("span", { className: "media-title", title: C, children: C }),
                    /* @__PURE__ */ u.jsx("span", { className: "metadata", children: a.media_class ?? a.media_content_type ?? "Home Assistant media" }),
                    /* @__PURE__ */ u.jsx("span", { className: "metadata", children: Ut(`entry:${j}`) })
                  ] }),
                  /* @__PURE__ */ u.jsxs("div", { className: "row-actions entry-actions", children: [
                    /* @__PURE__ */ u.jsx(
                      "button",
                      {
                        className: "neu-button",
                        type: "button",
                        disabled: !ie || un.has(`entry:${j}`),
                        onClick: () => {
                          ci(`entry:${j}`, a.media_content_id);
                        },
                        children: un.has(`entry:${j}`) ? "Checking availability..." : "Check availability"
                      }
                    ),
                    /* @__PURE__ */ u.jsx(
                      "button",
                      {
                        className: "neu-button icon-button",
                        type: "button",
                        "aria-label": "Move entry up",
                        title: "Move entry up",
                        ref: (B) => T("up", B),
                        disabled: Ue || y === 0,
                        onClick: () => xr(y, -1),
                        children: /* @__PURE__ */ u.jsx(Zd, { size: 18, "aria-hidden": "true" })
                      }
                    ),
                    /* @__PURE__ */ u.jsx(
                      "button",
                      {
                        className: "neu-button icon-button",
                        type: "button",
                        "aria-label": "Move entry down",
                        title: "Move entry down",
                        ref: (B) => T("down", B),
                        disabled: Ue || y === we.length - 1,
                        onClick: () => xr(y, 1),
                        children: /* @__PURE__ */ u.jsx(Xd, { size: 18, "aria-hidden": "true" })
                      }
                    ),
                    /* @__PURE__ */ u.jsx(
                      "button",
                      {
                        className: "neu-button",
                        type: "button",
                        "aria-label": `Remove ${C}`,
                        disabled: Ue,
                        ref: (B) => T("remove", B),
                        onClick: () => mi(y),
                        children: "Remove media item"
                      }
                    )
                  ] })
                ] }, j);
              })
            ] }),
            /* @__PURE__ */ u.jsxs("div", { className: "row-actions editor-actions", children: [
              /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", ref: Pl, disabled: !ie || Ue, onClick: () => {
                Pe(!0), oe("browse"), !Ae && !Fe && Jt({ path: [] });
              }, children: "Add media" }),
              /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "submit", disabled: !ie || Ue || at, children: Ue ? "Saving..." : W ? "Save playlist" : "Save changes" }),
              /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", disabled: Ue, onClick: (a) => fo(a.currentTarget), children: W ? "Discard draft" : "Stop editing" })
            ] }),
            ge && /* @__PURE__ */ u.jsx("p", { className: "error", role: "alert", children: ge })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ u.jsxs("section", { className: "neu-surface provider-library", "aria-label": "Saved Home Assistant playlists", "aria-busy": q, children: [
        /* @__PURE__ */ u.jsx("h2", { children: "Saved Home Assistant playlists" }),
        /* @__PURE__ */ u.jsxs("div", { className: "provider-library-body", children: [
          q && /* @__PURE__ */ u.jsx("p", { className: "library-message", children: "Loading saved playlists..." }),
          !q && !Z && I && !I.records.some(Wa) && /* @__PURE__ */ u.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ u.jsx("p", { children: "No Home Assistant playlists saved. Browse media to save a playlist reference." }),
            /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", disabled: !ie, onClick: Bn, children: "Browse media" })
          ] }),
          !q && /* @__PURE__ */ u.jsx("ul", { "aria-label": "Saved Home Assistant playlists", children: (I?.records ?? []).filter(Wa).map((a) => /* @__PURE__ */ u.jsxs("li", { children: [
            /* @__PURE__ */ u.jsx(ii, { className: "media-icon", size: 24, "aria-hidden": "true" }),
            /* @__PURE__ */ u.jsxs("div", { className: "media-detail", children: [
              /* @__PURE__ */ u.jsx("span", { className: "media-title provider-title", title: a.name, children: a.name }),
              /* @__PURE__ */ u.jsx("span", { className: "metadata", children: "Home Assistant playlist" }),
              /* @__PURE__ */ u.jsx("span", { className: "metadata", children: "Provider contents are managed by Home Assistant." }),
              /* @__PURE__ */ u.jsx("span", { className: "metadata", children: Ut(`provider:${a.record_id}`) }),
              le[a.record_id] && /* @__PURE__ */ u.jsx("span", { className: "error", role: "alert", children: le[a.record_id] }),
              Ln === a.record_id ? /* @__PURE__ */ u.jsxs("form", { className: "provider-rename-form", onSubmit: (y) => {
                y.preventDefault(), pi(a);
              }, children: [
                /* @__PURE__ */ u.jsx("label", { htmlFor: `shortcut-name-${a.record_id}`, children: "Shortcut name" }),
                /* @__PURE__ */ u.jsx(
                  "input",
                  {
                    id: `shortcut-name-${a.record_id}`,
                    ref: ir,
                    className: "neu-inset",
                    value: rr,
                    onChange: (y) => {
                      Tn(y.target.value), qt("");
                    },
                    disabled: Ot
                  }
                ),
                /* @__PURE__ */ u.jsxs("div", { className: "row-actions", children: [
                  /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "submit", disabled: !ie || Ot, children: Ot ? "Saving..." : "Save shortcut name" }),
                  /* @__PURE__ */ u.jsx(
                    "button",
                    {
                      className: "neu-button",
                      type: "button",
                      disabled: Ot,
                      onClick: () => zl(a.record_id),
                      children: "Cancel rename"
                    }
                  )
                ] }),
                oi && /* @__PURE__ */ u.jsx("p", { className: "error", role: "alert", children: oi })
              ] }) : /* @__PURE__ */ u.jsxs("div", { className: "row-actions provider-actions", children: [
                /* @__PURE__ */ u.jsx(
                  "button",
                  {
                    className: "neu-button primary-button",
                    type: "button",
                    "aria-label": `Play playlist ${a.name}`,
                    ref: (y) => {
                      y ? fn.current.set(a.record_id, y) : fn.current.delete(a.record_id);
                    },
                    disabled: !ie || !Te || !!X,
                    onClick: (y) => Dl(a, y.currentTarget),
                    children: X === a.record_id ? "Preparing..." : "Play playlist"
                  }
                ),
                /* @__PURE__ */ u.jsx(
                  "button",
                  {
                    className: "neu-button",
                    type: "button",
                    disabled: !ie || un.has(`provider:${a.record_id}`),
                    onClick: () => {
                      ci(`provider:${a.record_id}`, a.media_content_id);
                    },
                    children: un.has(`provider:${a.record_id}`) ? "Checking availability..." : "Check availability"
                  }
                ),
                /* @__PURE__ */ u.jsx(
                  "button",
                  {
                    className: "neu-button",
                    type: "button",
                    ref: (y) => {
                      y ? cr.current.set(a.record_id, y) : cr.current.delete(a.record_id);
                    },
                    disabled: !ie || !!Mt || !!Ln,
                    onClick: () => Vr(a),
                    children: "Rename shortcut"
                  }
                ),
                /* @__PURE__ */ u.jsx(
                  "button",
                  {
                    className: "neu-button destructive-button",
                    type: "button",
                    ref: (y) => {
                      y ? _l.current.set(a.record_id, y) : _l.current.delete(a.record_id);
                    },
                    disabled: !ie || !!Mt || !!Ln,
                    onClick: (y) => wr(a, y.currentTarget),
                    children: "Remove shortcut"
                  }
                )
              ] })
            ] })
          ] }, a.record_id)) })
        ] })
      ] })
    ] }) : /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
      !qe && st && !Te && /* @__PURE__ */ u.jsxs("p", { className: "warning", children: [
        Gt,
        " is unavailable. Select a connected speaker to play media."
      ] }),
      !ie && /* @__PURE__ */ u.jsx("p", { role: "alert", children: "Your Home Assistant session is unavailable." }),
      Mn && /* @__PURE__ */ u.jsxs("div", { className: "error", role: "alert", children: [
        /* @__PURE__ */ u.jsx("p", { children: Mn }),
        On && /* @__PURE__ */ u.jsx(
          "button",
          {
            className: "neu-button",
            disabled: !ie || Fe || ze,
            onClick: () => {
              Jt(On);
            },
            children: On.query !== void 0 ? "Retry search" : On.item ? `Retry opening ${On.item.title}` : "Retry media sources"
          }
        )
      ] }),
      In && /* @__PURE__ */ u.jsxs("div", { className: "error", role: "alert", children: [
        /* @__PURE__ */ u.jsx("p", { children: In }),
        sr && sr.target === st && /* @__PURE__ */ u.jsxs(
          "button",
          {
            className: "neu-button",
            disabled: !Te || Fe || ze,
            onClick: () => {
              gn(sr.item, sr.target);
            },
            children: [
              "Retry ",
              sr.item.title,
              " on ",
              Gt
            ]
          }
        )
      ] }),
      /* @__PURE__ */ u.jsx("p", { className: "status", role: "status", "aria-live": "polite", "aria-atomic": "true", children: Fe ? "Loading media sources..." : Me || Ur }),
      /* @__PURE__ */ u.jsxs("nav", { className: "catalog-path", "aria-label": "Catalog path", children: [
        et.map((a, y) => /* @__PURE__ */ u.jsx(
          "button",
          {
            className: "neu-button",
            disabled: ze,
            onClick: () => Un(y),
            title: a.title,
            children: a.title
          },
          `${a.media_content_id}-${y}`
        )),
        /* @__PURE__ */ u.jsx("span", { "aria-current": "page", title: Ae?.title, children: Ae?.title ?? "Media sources" })
      ] }),
      /* @__PURE__ */ u.jsxs("section", { className: "neu-surface", "aria-label": Ae?.title ?? "Media sources", "aria-busy": Fe, children: [
        /* @__PURE__ */ u.jsx("h2", { children: Ae?.title ?? "Media sources" }),
        Ae?.can_search && /* @__PURE__ */ u.jsxs("form", { className: "catalog-search", role: "search", onSubmit: (a) => {
          a.preventDefault(), Hr.trim() && !Fe && Jt({ item: Ae, path: et, query: Hr.trim() });
        }, children: [
          /* @__PURE__ */ u.jsxs("label", { className: "search-control", children: [
            "Search media",
            /* @__PURE__ */ u.jsx(
              "input",
              {
                className: "neu-inset",
                type: "search",
                value: Hr,
                onChange: (a) => Wr(a.target.value),
                disabled: !ie || Fe || ze
              }
            )
          ] }),
          /* @__PURE__ */ u.jsx("button", { className: "neu-button icon-button", type: "submit", "aria-label": "Search", title: "Search", disabled: !Hr.trim() || !ie || Fe || ze, children: /* @__PURE__ */ u.jsx(tf, { size: 20, "aria-hidden": "true" }) }),
          so && /* @__PURE__ */ u.jsx(
            "button",
            {
              className: "neu-button",
              type: "button",
              disabled: Fe || ze,
              onClick: () => {
                Jt({ item: Ae, path: et });
              },
              children: "Clear search"
            }
          )
        ] }),
        /* @__PURE__ */ u.jsxs("div", { className: "catalog-body", children: [
          Ae && !Fe && !Ae.children?.length && (qe ? /* @__PURE__ */ u.jsx("div", { className: "empty-state", children: /* @__PURE__ */ u.jsx("p", { children: "No playable audio media are available in this Home Assistant source." }) }) : /* @__PURE__ */ u.jsxs("div", { className: "empty-state", children: [
            /* @__PURE__ */ u.jsx("h3", { children: "No audio sources are available" }),
            /* @__PURE__ */ u.jsx("p", { children: "Home Assistant did not return a playable audio source. Check the media provider and try again." })
          ] })),
          /* @__PURE__ */ u.jsx("ul", { "aria-label": "Catalog items", children: (Ae?.children ?? []).map((a) => /* @__PURE__ */ u.jsxs("li", { "aria-current": ai?.media_content_id === a.media_content_id ? "true" : void 0, children: [
            /* @__PURE__ */ u.jsx(uf, { hass: g, thumbnail: a.thumbnail }),
            /* @__PURE__ */ u.jsxs("div", { className: "media-detail", children: [
              /* @__PURE__ */ u.jsx("span", { className: "media-title", title: a.title, children: a.title }),
              /* @__PURE__ */ u.jsx("span", { className: "metadata", title: a.media_content_type, children: a.media_class ?? a.media_content_type }),
              !a.can_play && !a.can_expand && /* @__PURE__ */ u.jsx("span", { className: "metadata", children: df })
            ] }),
            /* @__PURE__ */ u.jsxs("div", { className: "row-actions", children: [
              a.can_expand && /* @__PURE__ */ u.jsx(
                "button",
                {
                  className: "neu-button icon-button",
                  "aria-label": `Open ${a.title}`,
                  title: `Open ${a.title}`,
                  ref: (y) => {
                    y ? Se.current.set(a.media_content_id, y) : Se.current.delete(a.media_content_id);
                  },
                  disabled: Fe || ze || !ie || !a.media_content_id.startsWith("media-source://"),
                  onClick: () => {
                    Jt({ item: a, path: Ae ? [...et, Ae] : [] });
                  },
                  children: /* @__PURE__ */ u.jsx(Jd, { size: 20, "aria-hidden": "true" })
                }
              ),
              qe && a.can_play && (a.media_content_type.toLowerCase().startsWith("audio/") || ["music", "track", "episode"].includes(a.media_class?.toLowerCase() ?? "")) && /* @__PURE__ */ u.jsx(
                "button",
                {
                  className: "neu-button",
                  "aria-label": `Add media ${a.title}`,
                  disabled: Fe || ze || !ie,
                  onClick: () => Tl(a),
                  children: "Add media"
                }
              ),
              !qe && mc(a) && (Yt === a.media_content_id ? /* @__PURE__ */ u.jsxs("form", { className: "provider-rename-form", onSubmit: (y) => {
                y.preventDefault(), Ll(a, ml);
              }, children: [
                /* @__PURE__ */ u.jsx("label", { htmlFor: `provider-save-name-${a.media_content_id}`, children: "Shortcut name" }),
                /* @__PURE__ */ u.jsx(
                  "input",
                  {
                    id: `provider-save-name-${a.media_content_id}`,
                    ref: hl,
                    className: "neu-inset",
                    value: ml,
                    onChange: (y) => {
                      Rn(y.target.value), mt((j) => {
                        const C = { ...j };
                        return delete C[a.media_content_id], C;
                      });
                    },
                    disabled: It.has(a.media_content_id)
                  }
                ),
                /* @__PURE__ */ u.jsxs("div", { className: "row-actions", children: [
                  /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "submit", disabled: !ie || It.has(a.media_content_id), children: It.has(a.media_content_id) ? "Saving..." : "Save shortcut" }),
                  /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", disabled: It.has(a.media_content_id), onClick: () => {
                    Pn(""), Rn(""), mt((y) => {
                      const j = { ...y };
                      return delete j[a.media_content_id], j;
                    });
                  }, children: "Cancel" })
                ] })
              ] }) : /* @__PURE__ */ u.jsx(
                "button",
                {
                  className: "neu-button",
                  type: "button",
                  "aria-label": `Save to library ${a.title}`,
                  disabled: !ie || Fe || ze || It.has(a.media_content_id) || !!I?.records.some((y) => y.kind === "provider" && y.media_content_id === a.media_content_id),
                  onClick: () => mo(a),
                  children: It.has(a.media_content_id) ? "Saving..." : I?.records.some((y) => y.kind === "provider" && y.media_content_id === a.media_content_id) ? "Saved to library" : "Save to library"
                }
              )),
              Fr[a.media_content_id] && /* @__PURE__ */ u.jsx("p", { className: "error", role: "alert", children: Fr[a.media_content_id] }),
              !qe && a.can_play && /* @__PURE__ */ u.jsxs(
                "button",
                {
                  className: "neu-button",
                  "aria-label": `Play ${a.title}`,
                  disabled: !Te || Fe || ze || !a.media_content_id.startsWith("media-source://"),
                  onClick: () => {
                    gn(a);
                  },
                  children: [
                    /* @__PURE__ */ u.jsx(ef, { size: 18, "aria-hidden": "true" }),
                    "Play"
                  ]
                }
              )
            ] })
          ] }, a.media_content_id)) })
        ] })
      ] })
    ] }),
    se && /* @__PURE__ */ u.jsxs(
      "dialog",
      {
        ref: ut,
        "aria-modal": "true",
        "aria-labelledby": "delete-playlist-heading",
        className: "confirmation-dialog",
        onKeyDown: yn,
        onCancel: (a) => {
          a.preventDefault(), kt || ct();
        },
        children: [
          /* @__PURE__ */ u.jsxs("h2", { id: "delete-playlist-heading", children: [
            "Delete playlist: ",
            se.name
          ] }),
          /* @__PURE__ */ u.jsxs("p", { children: [
            "Delete “",
            se.name,
            "” from your BL-HAOS library? Its saved entries will be removed. This cannot be undone."
          ] }),
          Xe && /* @__PURE__ */ u.jsx("p", { className: "error", role: "alert", children: Xe }),
          /* @__PURE__ */ u.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", ref: fr, disabled: !!kt, onClick: ct, children: "Keep playlist" }),
            /* @__PURE__ */ u.jsx("button", { className: "neu-button destructive-button", type: "button", disabled: !!kt, onClick: () => {
              po();
            }, children: kt ? "Deleting playlist..." : "Delete playlist" })
          ] })
        ]
      }
    ),
    F && /* @__PURE__ */ u.jsxs(
      "dialog",
      {
        ref: El,
        "aria-modal": "true",
        "aria-labelledby": "remove-shortcut-heading",
        className: "confirmation-dialog",
        onKeyDown: yn,
        onCancel: (a) => {
          a.preventDefault(), Mt || ct();
        },
        children: [
          /* @__PURE__ */ u.jsxs("h2", { id: "remove-shortcut-heading", children: [
            "Remove shortcut: ",
            F.name
          ] }),
          /* @__PURE__ */ u.jsxs("p", { children: [
            "Remove “",
            F.name,
            "” from your BL-HAOS library? The Home Assistant playlist itself will not be changed."
          ] }),
          nr && /* @__PURE__ */ u.jsx("p", { className: "error", role: "alert", children: nr }),
          /* @__PURE__ */ u.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", ref: pr, disabled: !!Mt, onClick: ct, children: "Keep shortcut" }),
            /* @__PURE__ */ u.jsx("button", { className: "neu-button destructive-button", type: "button", disabled: !!Mt, onClick: () => {
              en();
            }, children: Mt ? "Removing shortcut..." : "Remove shortcut" })
          ] })
        ]
      }
    ),
    x && /* @__PURE__ */ u.jsxs(
      "dialog",
      {
        ref: Nl,
        "aria-modal": "true",
        "aria-labelledby": "discard-changes-heading",
        className: "confirmation-dialog",
        onKeyDown: yn,
        onCancel: (a) => {
          a.preventDefault(), ct();
        },
        children: [
          /* @__PURE__ */ u.jsx("h2", { id: "discard-changes-heading", children: "Discard changes" }),
          /* @__PURE__ */ u.jsxs("p", { children: [
            "Discard unsaved changes to “",
            je?.name || Oe || "this playlist",
            "”? The saved playlist will remain unchanged."
          ] }),
          /* @__PURE__ */ u.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", ref: Fn, onClick: () => M(!1), children: "Keep editing" }),
            /* @__PURE__ */ u.jsx("button", { className: "neu-button destructive-button", type: "button", onClick: () => {
              M(!1), $n();
            }, children: "Discard changes" })
          ] })
        ]
      }
    ),
    V && /* @__PURE__ */ u.jsxs(
      "dialog",
      {
        ref: jl,
        "aria-modal": "true",
        "aria-labelledby": "replace-queue-heading",
        className: "confirmation-dialog",
        onKeyDown: yn,
        onCancel: (a) => {
          a.preventDefault(), X || ct();
        },
        children: [
          /* @__PURE__ */ u.jsx("h2", { id: "replace-queue-heading", children: "Replace queue" }),
          /* @__PURE__ */ u.jsxs("p", { children: [
            "Replace queue: Stop the current queue on ",
            Gt,
            " and play “",
            V.name,
            "”?"
          ] }),
          X && /* @__PURE__ */ u.jsxs("p", { role: "status", "aria-live": "polite", "aria-atomic": "true", children: [
            "Preparing “",
            V.name,
            "” for ",
            Gt,
            "…"
          ] }),
          le[V.record_id] && /* @__PURE__ */ u.jsx("p", { className: "error", role: "alert", children: le[V.record_id] }),
          /* @__PURE__ */ u.jsxs("div", { className: "row-actions", children: [
            /* @__PURE__ */ u.jsx("button", { className: "neu-button", type: "button", ref: mr, disabled: !!X, onClick: ct, children: "Keep current queue" }),
            /* @__PURE__ */ u.jsx(
              "button",
              {
                className: "neu-button primary-button",
                type: "button",
                disabled: !Te || !!X,
                onClick: () => {
                  nt(V);
                },
                children: X ? "Preparing..." : "Replace queue"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const pf = `
:host { display:block; width:100%; min-width:0; height:auto; container-type:inline-size;
  --neu-page:var(--primary-background-color,#f5f6f7);
  --neu-surface:var(--ha-card-background,var(--card-background-color,#fff));
  --neu-raised:var(--secondary-background-color,#f0f2f5);
  --neu-deep:var(--input-fill-color,var(--secondary-background-color,#f0f2f5));
  --neu-text:var(--primary-text-color,#202124);
  --neu-muted:var(--secondary-text-color,#5f6368);
  --neu-border:var(--divider-color,rgba(0,0,0,.14));
  --neu-accent:var(--primary-color,#1565c0);
  --neu-error:var(--error-color,#b3261e);
  --neu-warning:var(--warning-color,#8a4b08);
  --neu-success:var(--success-color,#176b42);
  font-family:var(--paper-font-body1_-_font-family,Roboto,"Noto",sans-serif);
  font-size:14px; line-height:1.45; color:var(--neu-text); letter-spacing:0; }
* { box-sizing:border-box; }
.neu-page { width:100%; min-width:0; max-width:none; min-height:0; padding:clamp(16px,3cqw,24px);
  background:var(--neu-page); display:flex; flex-direction:column; gap:16px; }
.catalog-header { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.catalog-heading { display:flex; align-items:center; gap:12px; min-width:0; }
.catalog-header > * { min-width:0; }
.selected-target { font-size:16px; font-weight:600; line-height:1.3; overflow-wrap:anywhere; color:var(--neu-text); }
.catalog-path { display:flex; flex-wrap:wrap; align-items:center; gap:8px; min-width:0; overflow-wrap:anywhere; }
.view-toggle { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,112px),1fr)); gap:8px; width:100%; }
.view-toggle > button { min-width:0; }
.view-toggle [aria-pressed="true"] { color:var(--neu-text); border-color:var(--neu-accent); font-weight:600; }
.catalog-path button { min-width:44px; max-width:100%; overflow-wrap:anywhere; text-align:left; }
.catalog-path [aria-current] { color:var(--neu-text); font-weight:600; }
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
.playlist-form { display:grid; gap:12px; width:100%; max-width:none; }
.playlist-form h3 { margin:16px 0 0; font-size:16px; font-weight:600; line-height:1.2; }
.playlist-entries { min-width:0; max-height:40vh; overflow-y:auto; overscroll-behavior:contain; border:1px solid var(--neu-border); border-radius:12px; }
.playlist-entries li { grid-template-columns:48px minmax(0,1fr) auto; }
.playlist-entries .empty-entry { display:block; min-height:80px; padding:24px 16px; color:var(--neu-muted); }
.entry-actions { flex-wrap:wrap; }
.editor-actions { flex-wrap:wrap; }
.provider-rename-form { display:grid; gap:8px; width:100%; }
.provider-actions { flex-wrap:wrap; }
.media-title.provider-title { display:block; overflow:visible; overflow-wrap:anywhere; -webkit-line-clamp:unset; -webkit-box-orient:unset; }
.neu-button.primary-button { background:var(--neu-surface); border:2px solid var(--neu-accent); color:var(--neu-text); font-weight:600; }
.destructive-button { color:var(--neu-error); }
.confirmation-dialog { width:min(560px,calc(100% - 32px)); max-height:calc(100vh - 32px); overflow:auto;
  padding:24px; color:var(--neu-text); background:var(--neu-surface); border:1px solid var(--neu-border);
  border-radius:16px; box-shadow:0 12px 36px rgba(0,0,0,.2); }
.neu-page.card-layout .confirmation-dialog { max-height:min(90vh,640px); }
.confirmation-dialog::backdrop { background:rgba(0,0,0,.45); }
.confirmation-dialog h2 { padding:0 0 16px; border:0; }
.confirmation-dialog p { line-height:1.5; overflow-wrap:anywhere; }
.confirmation-dialog .row-actions { justify-content:flex-end; flex-wrap:wrap; margin-top:24px; }
.empty-state { padding:24px 16px; }
.empty-state h3 { font-size:16px; font-weight:600; margin:0; }
.empty-state p { line-height:1.5; }
li[aria-current="true"] { background:color-mix(in srgb,var(--neu-accent) 9%,var(--neu-surface)); border-inline-start:3px solid var(--neu-accent); }
h1 { font-size:24px; font-weight:600; line-height:1.2; margin:4px 0 0; }
h2 { font-size:16px; font-weight:600; line-height:1.2; margin:0; padding:24px 16px; border-bottom:1px solid var(--neu-border); flex-shrink:0; overflow-wrap:anywhere; }
.eyebrow,.metadata { color:var(--neu-muted); font-size:12px; font-weight:400; line-height:1.5; margin:0; }
.target-control { display:grid; gap:8px; width:min(320px,100%); max-width:100%; flex-shrink:1; }
select,button,input,a { font:inherit; color:inherit; min-width:0; min-height:44px; border-radius:10px; }
input,select,.neu-inset { background:var(--neu-surface); border:1px solid var(--neu-border); }
input,select { padding:8px 12px; accent-color:var(--neu-accent); }
.neu-inset { width:100%; padding:8px 12px; background:var(--neu-deep); }
.neu-button { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:8px 16px;
  background:var(--neu-raised); border:1px solid var(--neu-border); cursor:pointer;
  transition:background-color 150ms,border-color 150ms,color 150ms; max-width:100%; overflow-wrap:anywhere; }
.neu-button:hover:not(:disabled) { background:color-mix(in srgb,var(--neu-accent) 10%,var(--neu-surface)); border-color:var(--neu-accent); }
button:disabled,select:disabled,input:disabled { color:var(--neu-muted); opacity:1; cursor:not-allowed; }
.neu-button.primary-button:disabled { color:var(--neu-muted); background:var(--secondary-background-color,var(--neu-raised)); border-color:var(--neu-border); }
.icon-button { width:44px; height:44px; padding:0; flex-shrink:0; }
.neu-surface { display:flex; flex-direction:column; min-width:0; flex:1; overflow:hidden; background:var(--neu-surface);
  border:1px solid var(--neu-border); border-radius:16px; box-shadow:0 2px 8px rgba(0,0,0,.08); }
ul { list-style:none; padding:0; margin:0; }
li { display:grid; grid-template-columns:48px minmax(0,1fr) auto; align-items:center; gap:16px; padding:16px; min-width:0; min-height:80px; border-bottom:1px solid var(--neu-border); }
li:last-child { border-bottom:0; }
.thumbnail { width:48px; height:48px; object-fit:cover; border-radius:4px; }
.media-icon { justify-self:center; color:var(--neu-muted); }
.media-detail { display:grid; gap:4px; min-width:0; overflow-wrap:anywhere; }
.media-title { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.5; }
.row-actions { display:flex; gap:8px; }
.status { min-height:18px; margin:0; font-size:12px; line-height:1.5; color:var(--neu-success); overflow-wrap:anywhere; }
.error,.warning { padding:16px 0; overflow-wrap:anywhere; line-height:1.5; }
.error { color:var(--neu-error); } .warning { color:var(--neu-warning); }
.neu-surface > p { margin:24px 16px; }
.speaker-management { display:grid; gap:16px; min-width:0; }
.speaker-management > header { display:flex; align-items:center; flex-wrap:wrap; gap:8px; padding:0 0 12px; border-bottom:1px solid var(--neu-border); }
.speaker-management > header h2 { flex:1 1 100%; padding:0; border:0; }
.speaker-management > label { display:grid; gap:8px; max-width:100%; }
.speaker-management > [role="status"]:empty { display:none; }
.speaker-management > ul { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr)); align-items:start; gap:12px; }
.speaker-management > ul > li.neu-surface { display:grid; grid-template-columns:minmax(0,1fr); align-content:start; gap:10px; padding:16px; border:1px solid var(--neu-border); }
.speaker-management > ul > li > h3,.speaker-management > ul > li > p { min-width:0; margin:0; overflow-wrap:anywhere; }
.speaker-management > ul > li > h3 { font-size:16px; line-height:1.35; }
.speaker-management > ul > li > label,.speaker-management > .neu-surface > label { display:flex; align-items:center; flex-wrap:wrap; gap:8px; min-width:0; }
.speaker-management > ul > li > label:not(:has(input[type="checkbox"])) { display:grid; grid-template-columns:minmax(0,1fr); }
.speaker-management > .neu-surface { display:grid; gap:12px; padding:16px; }
.speaker-management > .neu-surface > h3 { margin:0; font-size:16px; line-height:1.35; }
input[type="checkbox"] { width:44px; height:44px; min-width:44px; padding:0; margin:0; }
:focus-visible { outline:2px solid var(--neu-accent); outline-offset:2px; }
@container (max-width:640px) {
  .neu-page { padding:16px; gap:12px; }
  .catalog-header { align-items:stretch; flex-direction:column; }
  .target-control { width:100%; }
  li { grid-template-columns:40px minmax(0,1fr); gap:8px 12px; padding:12px; }
  .row-actions { grid-column:2; flex-wrap:wrap; }
  .playlist-entries li { grid-template-columns:40px minmax(0,1fr); }
  .playlist-entries .entry-actions { grid-column:2; }
  .catalog-search { padding:12px; }
}
@media(max-width:640px) {
  .neu-page { padding:16px; gap:12px; }
  .catalog-header { align-items:stretch; flex-direction:column; }
  .target-control { width:100%; }
  li { grid-template-columns:40px minmax(0,1fr); gap:8px 12px; padding:12px; }
  .row-actions { grid-column:2; flex-wrap:wrap; }
  .playlist-entries li { grid-template-columns:40px minmax(0,1fr); }
  .playlist-entries .entry-actions { grid-column:2; }
  .catalog-search { padding:12px; }
}
@media(prefers-reduced-motion:reduce) { * { transition:none !important; } }
`;
class mf extends HTMLElement {
  constructor() {
    super(), this.initialView = "library";
    const A = this.attachShadow({ mode: "open" }), v = document.createElement("style");
    v.textContent = pf, this.mount = document.createElement("div"), A.append(v, this.mount);
  }
  set hass(A) {
    this.suppliedHass = A, this.render();
  }
  get hass() {
    return this.suppliedHass;
  }
  connectedCallback() {
    this.classList.add("card-layout"), !this.root && (this.root = Kd.createRoot(this.mount), this.render());
  }
  disconnectedCallback() {
    this.root?.unmount(), this.root = void 0;
  }
  render() {
    this.root?.render(/* @__PURE__ */ u.jsx(ff, { hass: this.suppliedHass, initialView: this.initialView }));
  }
}
class hf extends mf {
  constructor() {
    super();
  }
  setConfig(A) {
    if (!A || typeof A != "object" || Array.isArray(A))
      throw new Error("BL-HAOS Media card configuration must be an object");
    const v = A;
    if (v.type !== "custom:bl-haos-media-card")
      throw new Error("BL-HAOS Media card type must be custom:bl-haos-media-card");
    if (v.initial_view !== void 0 && v.initial_view !== "library" && v.initial_view !== "browse")
      throw new Error('BL-HAOS Media card initial_view must be "library" or "browse"');
    this.config = {
      type: "custom:bl-haos-media-card",
      initial_view: v.initial_view
    }, this.initialView = this.config.initial_view ?? "library", this.render();
  }
  getCardSize() {
    return 8;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }
  static getStubConfig() {
    return {};
  }
}
customElements.get("bl-haos-media-card") || customElements.define("bl-haos-media-card", hf);
if (typeof window < "u") {
  const g = window.customCards ?? (window.customCards = []);
  g.some((A) => A.type === "bl-haos-media-card") || g.push({
    type: "bl-haos-media-card",
    name: "BL-HAOS Media",
    description: "Browse media, manage playlists, and control connected BL-HAOS speakers.",
    preview: !1,
    documentationURL: "https://github.com/Mahmoud-Eltabakh/BL-HAOS/blob/main/modules/integration/README.md"
  });
}
export {
  hf as MediaCardElement,
  ff as MediaPanel
};
