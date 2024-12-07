!function (e) {
    var t = {};
    function n(o) {
        if (t[o])
            return t[o].exports;
        var r = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(r.exports, r, r.exports, n),
            r.l = !0,
            r.exports
    }
    n.m = e,
        n.c = t,
        n.d = function (e, t, o) {
            n.o(e, t) || Object.defineProperty(e, t, {
                enumerable: !0,
                get: o
            })
        }
        ,
        n.r = function (e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }),
                Object.defineProperty(e, "__esModule", {
                    value: !0
                })
        }
        ,
        n.t = function (e, t) {
            if (1 & t && (e = n(e)),
                8 & t)
                return e;
            if (4 & t && "object" == typeof e && e && e.__esModule)
                return e;
            var o = Object.create(null);
            if (n.r(o),
                Object.defineProperty(o, "default", {
                    enumerable: !0,
                    value: e
                }),
                2 & t && "string" != typeof e)
                for (var r in e)
                    n.d(o, r, function (t) {
                        return e[t]
                    }
                        .bind(null, r));
            return o
        }
        ,
        n.n = function (e) {
            var t = e && e.__esModule ? function () {
                return e.default
            }
                : function () {
                    return e
                }
                ;
            return n.d(t, "a", t),
                t
        }
        ,
        n.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
        ,
        n.p = "",
        n(n.s = 8)
}({
    0: function (e, t, n) {
        "use strict";
        function o(e, t) {
            return function (e) {
                if (Array.isArray(e))
                    return e
            }(e) || function (e, t) {
                var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null != n) {
                    var o, r, i = [], c = !0, a = !1;
                    try {
                        for (n = n.call(e); !(c = (o = n.next()).done) && (i.push(o.value),
                            !t || i.length !== t); c = !0)
                            ;
                    } catch (e) {
                        a = !0,
                            r = e
                    } finally {
                        try {
                            c || null == n.return || n.return()
                        } finally {
                            if (a)
                                throw r
                        }
                    }
                    return i
                }
            }(e, t) || r(e, t) || function () {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }
        function r(e, t) {
            if (e) {
                if ("string" == typeof e)
                    return i(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name),
                    "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? i(e, t) : void 0
            }
        }
        function i(e, t) {
            (null == t || t > e.length) && (t = e.length);
            for (var n = 0, o = new Array(t); n < t; n++)
                o[n] = e[n];
            return o
        }
        n.d(t, "b", (function () {
            return a
        }
        ));
        var c = document.querySelectorAll("\n  .page-id-14508 #updateSelfServeUrlBtn,\n  .page-id-20363 #selfServeBtn,\n  .page-id-8420 #updateSelfServeUrlBtn,\n  .page-id-8420 #selfServeBtn,\n  .tr__btn.tr__btn--download,\n  .main-menu__item--right.main-menu__btn,\n  .block--block_37848dafeeed76133caf2d82bf51770c .panel__btns__btn\n");
        t.a = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : c
                , t = a();
            t && e.forEach((function (e) {
                try {
                    var n = e.getAttribute("href");
                    n.includes("?") ? n += "&" + t.substring(1) : n += t,
                        e.setAttribute("href", n)
                } catch (t) {
                    console.error("Error appending UTM parameters to link:", e, t)
                }
            }
            ))
        }
            ;
        var a = function () {
            var e, t = "", n = function (e, t) {
                var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (!n) {
                    if (Array.isArray(e) || (n = r(e))) {
                        n && (e = n);
                        var o = 0
                            , i = function () { };
                        return {
                            s: i,
                            n: function () {
                                return o >= e.length ? {
                                    done: !0
                                } : {
                                    done: !1,
                                    value: e[o++]
                                }
                            },
                            e: function (e) {
                                throw e
                            },
                            f: i
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var c, a = !0, l = !1;
                return {
                    s: function () {
                        n = n.call(e)
                    },
                    n: function () {
                        var e = n.next();
                        return a = e.done,
                            e
                    },
                    e: function (e) {
                        l = !0,
                            c = e
                    },
                    f: function () {
                        try {
                            a || null == n.return || n.return()
                        } finally {
                            if (l)
                                throw c
                        }
                    }
                }
            }(new URLSearchParams(window.location.search).entries());
            try {
                for (n.s(); !(e = n.n()).done;) {
                    var i = o(e.value, 2)
                        , c = i[0]
                        , a = i[1];
                    c.startsWith("utm_") && (t += "".concat(encodeURIComponent(c), "=").concat(encodeURIComponent(a.replace(/[^a-zA-Z0-9]/g, "")), "&"))
                }
            } catch (e) {
                n.e(e)
            } finally {
                n.f()
            }
            return t ? "?" + t.slice(0, -1) : ""
        }
    },
    10: function (e, t, n) {
        (function (e) {
            function t(e) {
                return (t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                }
                    : function (e) {
                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                    }
                )(e)
            }
            !function (n, o) {
                var r = function (e, t, n) {
                    "use strict";
                    var o, r;
                    if (function () {
                        var t, n = {
                            lazyClass: "lazyload",
                            loadedClass: "lazyloaded",
                            loadingClass: "lazyloading",
                            preloadClass: "lazypreload",
                            errorClass: "lazyerror",
                            autosizesClass: "lazyautosizes",
                            fastLoadedClass: "ls-is-cached",
                            iframeLoadMode: 0,
                            srcAttr: "data-src",
                            srcsetAttr: "data-srcset",
                            sizesAttr: "data-sizes",
                            minSize: 40,
                            customMedia: {},
                            init: !0,
                            expFactor: 1.5,
                            hFac: .8,
                            loadMode: 2,
                            loadHidden: !0,
                            ricTimeout: 0,
                            throttleDelay: 125
                        };
                        for (t in r = e.lazySizesConfig || e.lazysizesConfig || {},
                            n)
                            t in r || (r[t] = n[t])
                    }(),
                        !t || !t.getElementsByClassName)
                        return {
                            init: function () { },
                            cfg: r,
                            noSupport: !0
                        };
                    var i, c, a, l, u, s, d, f, m, p, y, v, h, b, g, E, w, S, L, _, A, k, x, C, T, z, I, M, O, B, q, j, N, F, P, R, H, U, D, W, Y, $, V, J = t.documentElement, G = e.HTMLPictureElement, X = e.addEventListener.bind(e), Z = e.setTimeout, K = e.requestAnimationFrame || Z, Q = e.requestIdleCallback, ee = /^picture$/i, te = ["load", "error", "lazyincluded", "_lazyloaded"], ne = {}, oe = Array.prototype.forEach, re = function (e, t) {
                        return ne[t] || (ne[t] = new RegExp("(\\s|^)" + t + "(\\s|$)")),
                            ne[t].test(e.getAttribute("class") || "") && ne[t]
                    }, ie = function (e, t) {
                        re(e, t) || e.setAttribute("class", (e.getAttribute("class") || "").trim() + " " + t)
                    }, ce = function (e, t) {
                        var n;
                        (n = re(e, t)) && e.setAttribute("class", (e.getAttribute("class") || "").replace(n, " "))
                    }, ae = function e(t, n, o) {
                        var r = o ? "addEventListener" : "removeEventListener";
                        o && e(t, n),
                            te.forEach((function (e) {
                                t[r](e, n)
                            }
                            ))
                    }, le = function (e, n, r, i, c) {
                        var a = t.createEvent("Event");
                        return r || (r = {}),
                            r.instance = o,
                            a.initEvent(n, !i, !c),
                            a.detail = r,
                            e.dispatchEvent(a),
                            a
                    }, ue = function (t, n) {
                        var o;
                        !G && (o = e.picturefill || r.pf) ? (n && n.src && !t.getAttribute("srcset") && t.setAttribute("srcset", n.src),
                            o({
                                reevaluate: !0,
                                elements: [t]
                            })) : n && n.src && (t.src = n.src)
                    }, se = function (e, t) {
                        return (getComputedStyle(e, null) || {})[t]
                    }, de = function (e, t, n) {
                        for (n = n || e.offsetWidth; n < r.minSize && t && !e._lazysizesWidth;)
                            n = t.offsetWidth,
                                t = t.parentNode;
                        return n
                    }, fe = (W = [],
                        Y = D = [],
                        $ = function () {
                            var e = Y;
                            for (Y = D.length ? W : D,
                                H = !0,
                                U = !1; e.length;)
                                e.shift()();
                            H = !1
                        }
                        ,
                        V = function (e, n) {
                            H && !n ? e.apply(this, arguments) : (Y.push(e),
                                U || (U = !0,
                                    (t.hidden ? Z : K)($)))
                        }
                        ,
                        V._lsFlush = $,
                        V), me = function (e, t) {
                            return t ? function () {
                                fe(e)
                            }
                                : function () {
                                    var t = this
                                        , n = arguments;
                                    fe((function () {
                                        e.apply(t, n)
                                    }
                                    ))
                                }
                        }, pe = function (e) {
                            var t, o, r = function () {
                                t = null,
                                    e()
                            }, i = function e() {
                                var t = n.now() - o;
                                t < 99 ? Z(e, 99 - t) : (Q || r)(r)
                            };
                            return function () {
                                o = n.now(),
                                    t || (t = Z(i, 99))
                            }
                        }, ye = (w = /^img$/i,
                            S = /^iframe$/i,
                            L = "onscroll" in e && !/(gle|ing)bot/.test(navigator.userAgent),
                            _ = 0,
                            A = 0,
                            k = -1,
                            x = function (e) {
                                A--,
                                    (!e || A < 0 || !e.target) && (A = 0)
                            }
                            ,
                            C = function (e) {
                                return null == E && (E = "hidden" == se(t.body, "visibility")),
                                    E || !("hidden" == se(e.parentNode, "visibility") && "hidden" == se(e, "visibility"))
                            }
                            ,
                            T = function (e, n) {
                                var o, r = e, i = C(e);
                                for (v -= n,
                                    g += n,
                                    h -= n,
                                    b += n; i && (r = r.offsetParent) && r != t.body && r != J;)
                                    (i = (se(r, "opacity") || 1) > 0) && "visible" != se(r, "overflow") && (o = r.getBoundingClientRect(),
                                        i = b > o.left && h < o.right && g > o.top - 1 && v < o.bottom + 1);
                                return i
                            }
                            ,
                            z = function () {
                                var e, n, i, c, a, l, d, m, w, S, x, z, I = o.elements;
                                if ((f = r.loadMode) && A < 8 && (e = I.length)) {
                                    for (n = 0,
                                        k++; n < e; n++)
                                        if (I[n] && !I[n]._lazyRace)
                                            if (!L || o.prematureUnveil && o.prematureUnveil(I[n]))
                                                N(I[n]);
                                            else if ((m = I[n].getAttribute("data-expand")) && (l = 1 * m) || (l = _),
                                                S || (S = !r.expand || r.expand < 1 ? J.clientHeight > 500 && J.clientWidth > 500 ? 500 : 370 : r.expand,
                                                    o._defEx = S,
                                                    x = S * r.expFactor,
                                                    z = r.hFac,
                                                    E = null,
                                                    _ < x && A < 1 && k > 2 && f > 2 && !t.hidden ? (_ = x,
                                                        k = 0) : _ = f > 1 && k > 1 && A < 6 ? S : 0),
                                                w !== l && (p = innerWidth + l * z,
                                                    y = innerHeight + l,
                                                    d = -1 * l,
                                                    w = l),
                                                i = I[n].getBoundingClientRect(),
                                                (g = i.bottom) >= d && (v = i.top) <= y && (b = i.right) >= d * z && (h = i.left) <= p && (g || b || h || v) && (r.loadHidden || C(I[n])) && (s && A < 3 && !m && (f < 3 || k < 4) || T(I[n], l))) {
                                                if (N(I[n]),
                                                    a = !0,
                                                    A > 9)
                                                    break
                                            } else
                                                !a && s && !c && A < 4 && k < 4 && f > 2 && (u[0] || r.preloadAfterLoad) && (u[0] || !m && (g || b || h || v || "auto" != I[n].getAttribute(r.sizesAttr))) && (c = u[0] || I[n]);
                                    c && !a && N(c)
                                }
                            }
                            ,
                            I = function (e) {
                                var t, o = 0, i = r.throttleDelay, c = r.ricTimeout, a = function () {
                                    t = !1,
                                        o = n.now(),
                                        e()
                                }, l = Q && c > 49 ? function () {
                                    Q(a, {
                                        timeout: c
                                    }),
                                        c !== r.ricTimeout && (c = r.ricTimeout)
                                }
                                    : me((function () {
                                        Z(a)
                                    }
                                    ), !0);
                                return function (e) {
                                    var r;
                                    (e = !0 === e) && (c = 33),
                                        t || (t = !0,
                                            (r = i - (n.now() - o)) < 0 && (r = 0),
                                            e || r < 9 ? l() : Z(l, r))
                                }
                            }(z),
                            M = function (e) {
                                var t = e.target;
                                t._lazyCache ? delete t._lazyCache : (x(e),
                                    ie(t, r.loadedClass),
                                    ce(t, r.loadingClass),
                                    ae(t, B),
                                    le(t, "lazyloaded"))
                            }
                            ,
                            O = me(M),
                            B = function (e) {
                                O({
                                    target: e.target
                                })
                            }
                            ,
                            q = function (e) {
                                var t, n = e.getAttribute(r.srcsetAttr);
                                (t = r.customMedia[e.getAttribute("data-media") || e.getAttribute("media")]) && e.setAttribute("media", t),
                                    n && e.setAttribute("srcset", n)
                            }
                            ,
                            j = me((function (e, t, n, o, i) {
                                var c, a, l, u, s, f;
                                (s = le(e, "lazybeforeunveil", t)).defaultPrevented || (o && (n ? ie(e, r.autosizesClass) : e.setAttribute("sizes", o)),
                                    a = e.getAttribute(r.srcsetAttr),
                                    c = e.getAttribute(r.srcAttr),
                                    i && (u = (l = e.parentNode) && ee.test(l.nodeName || "")),
                                    f = t.firesLoad || "src" in e && (a || c || u),
                                    s = {
                                        target: e
                                    },
                                    ie(e, r.loadingClass),
                                    f && (clearTimeout(d),
                                        d = Z(x, 2500),
                                        ae(e, B, !0)),
                                    u && oe.call(l.getElementsByTagName("source"), q),
                                    a ? e.setAttribute("srcset", a) : c && !u && (S.test(e.nodeName) ? function (e, t) {
                                        var n = e.getAttribute("data-load-mode") || r.iframeLoadMode;
                                        0 == n ? e.contentWindow.location.replace(t) : 1 == n && (e.src = t)
                                    }(e, c) : e.src = c),
                                    i && (a || u) && ue(e, {
                                        src: c
                                    })),
                                    e._lazyRace && delete e._lazyRace,
                                    ce(e, r.lazyClass),
                                    fe((function () {
                                        var t = e.complete && e.naturalWidth > 1;
                                        f && !t || (t && ie(e, r.fastLoadedClass),
                                            M(s),
                                            e._lazyCache = !0,
                                            Z((function () {
                                                "_lazyCache" in e && delete e._lazyCache
                                            }
                                            ), 9)),
                                            "lazy" == e.loading && A--
                                    }
                                    ), !0)
                            }
                            )),
                            N = function (e) {
                                if (!e._lazyRace) {
                                    var t, n = w.test(e.nodeName), o = n && (e.getAttribute(r.sizesAttr) || e.getAttribute("sizes")), i = "auto" == o;
                                    (!i && s || !n || !e.getAttribute("src") && !e.srcset || e.complete || re(e, r.errorClass) || !re(e, r.lazyClass)) && (t = le(e, "lazyunveilread").detail,
                                        i && ve.updateElem(e, !0, e.offsetWidth),
                                        e._lazyRace = !0,
                                        A++,
                                        j(e, t, i, o, n))
                                }
                            }
                            ,
                            F = pe((function () {
                                r.loadMode = 3,
                                    I()
                            }
                            )),
                            R = function e() {
                                s || (n.now() - m < 999 ? Z(e, 999) : (s = !0,
                                    r.loadMode = 3,
                                    I(),
                                    X("scroll", P, !0)))
                            }
                            ,
                        {
                            _: function () {
                                m = n.now(),
                                    o.elements = t.getElementsByClassName(r.lazyClass),
                                    u = t.getElementsByClassName(r.lazyClass + " " + r.preloadClass),
                                    X("scroll", I, !0),
                                    X("resize", I, !0),
                                    X("pageshow", (function (e) {
                                        if (e.persisted) {
                                            var n = t.querySelectorAll("." + r.loadingClass);
                                            n.length && n.forEach && K((function () {
                                                n.forEach((function (e) {
                                                    e.complete && N(e)
                                                }
                                                ))
                                            }
                                            ))
                                        }
                                    }
                                    )),
                                    e.MutationObserver ? new MutationObserver(I).observe(J, {
                                        childList: !0,
                                        subtree: !0,
                                        attributes: !0
                                    }) : (J.addEventListener("DOMNodeInserted", I, !0),
                                        J.addEventListener("DOMAttrModified", I, !0),
                                        setInterval(I, 999)),
                                    X("hashchange", I, !0),
                                    ["focus", "mouseover", "click", "load", "transitionend", "animationend"].forEach((function (e) {
                                        t.addEventListener(e, I, !0)
                                    }
                                    )),
                                    /d$|^c/.test(t.readyState) ? R() : (X("load", R),
                                        t.addEventListener("DOMContentLoaded", I),
                                        Z(R, 2e4)),
                                    o.elements.length ? (z(),
                                        fe._lsFlush()) : I()
                            },
                            checkElems: I,
                            unveil: N,
                            _aLSL: P = function () {
                                3 == r.loadMode && (r.loadMode = 2),
                                    F()
                            }
                        }), ve = (c = me((function (e, t, n, o) {
                            var r, i, c;
                            if (e._lazysizesWidth = o,
                                o += "px",
                                e.setAttribute("sizes", o),
                                ee.test(t.nodeName || ""))
                                for (i = 0,
                                    c = (r = t.getElementsByTagName("source")).length; i < c; i++)
                                    r[i].setAttribute("sizes", o);
                            n.detail.dataAttr || ue(e, n.detail)
                        }
                        )),
                            a = function (e, t, n) {
                                var o, r = e.parentNode;
                                r && (n = de(e, r, n),
                                    (o = le(e, "lazybeforesizes", {
                                        width: n,
                                        dataAttr: !!t
                                    })).defaultPrevented || (n = o.detail.width) && n !== e._lazysizesWidth && c(e, r, o, n))
                            }
                            ,
                            l = pe((function () {
                                var e, t = i.length;
                                if (t)
                                    for (e = 0; e < t; e++)
                                        a(i[e])
                            }
                            )),
                        {
                            _: function () {
                                i = t.getElementsByClassName(r.autosizesClass),
                                    X("resize", l)
                            },
                            checkElems: l,
                            updateElem: a
                        }), he = function e() {
                            !e.i && t.getElementsByClassName && (e.i = !0,
                                ve._(),
                                ye._())
                        };
                    return Z((function () {
                        r.init && he()
                    }
                    )),
                        o = {
                            cfg: r,
                            autoSizer: ve,
                            loader: ye,
                            init: he,
                            uP: ue,
                            aC: ie,
                            rC: ce,
                            hC: re,
                            fire: le,
                            gW: de,
                            rAF: fe
                        }
                }(n, n.document, Date);
                n.lazySizes = r,
                    "object" == t(e) && e.exports && (e.exports = r)
            }("undefined" != typeof window ? window : {})
        }
        ).call(this, n(2)(e))
    },
    2: function (e, t) {
        e.exports = function (e) {
            return e.webpackPolyfill || (e.deprecate = function () { }
                ,
                e.paths = [],
                e.children || (e.children = []),
                Object.defineProperty(e, "loaded", {
                    enumerable: !0,
                    get: function () {
                        return e.l
                    }
                }),
                Object.defineProperty(e, "id", {
                    enumerable: !0,
                    get: function () {
                        return e.i
                    }
                }),
                e.webpackPolyfill = 1),
                e
        }
    },
    3: function (e, t, n) {
        "use strict";
        var o = n(0)
            , r = document.getElementById("price-picker-input")
            , i = document.getElementById("users-count")
            , c = document.getElementById("calculator")
            , a = document.getElementById("over-back-btn")
            , l = new URLSearchParams(window.location.search).get("covered_lives")
            , u = 5;
        l && (u = l > 500 ? 500 : l < 5 ? 5 : l);
        var s = 0
            , d = 0;
        t.a = function () {
            v(),
                h(),
                c && (f({
                    target: {
                        value: u
                    }
                }),
                    a && p(),
                    r.addEventListener("input", (function (e) {
                        var t = 0;
                        clearTimeout(t),
                            t = setTimeout((function () {
                                f(e)
                            }
                            ), 250)
                    }
                    )))
        }
            ;
        var f = function (e) {
            u = "" !== e.target.value ? e.target.value : 5,
                fetch("https://api.calm.com/stripe-price-catalog/price?plan=b2b_selfserve_1y&quantity=".concat(u)).then((function (e) {
                    return e.json()
                }
                )).then((function (e) {
                    var t = e.price
                        , n = e.original_price;
                    m(u, t, n),
                        window.dispatchEvent(new Event("pricesfetched"))
                }
                )).catch((function (e) {
                    return console.log("err", e)
                }
                ))
        }
            , m = function (e, t, n) {
                if (e <= 500) {
                    c.classList.remove("over-optional"),
                        c.classList.remove("over-limit"),
                        document.getElementById("price-per-user").innerHTML = y(t / e);
                    var o = document.getElementById("savings-total");
                    d = y((n / e - t / e) * e),
                        o && (o.innerHTML = d);
                    var r = document.getElementById("total-price");
                    s = y(t),
                        r.innerHTML = s,
                        i && (i.textContent = e),
                        e >= 301 && c.classList.add("over-optional")
                } else
                    c.classList.remove("over-optional"),
                        c.classList.add("over-limit")
            }
            , p = function () {
                a.addEventListener("click", (function () {
                    r.value = 500,
                        r.dispatchEvent(new Event("input"))
                }
                ))
            }
            , y = function (e) {
                return (e / 100).toLocaleString(void 0, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
            }
            , v = function () {
                l && (r.setAttribute("default", u),
                    r.setAttribute("value", u))
            }
            , h = function () {
                document.getElementById("teamsNav");
                var e, t = document.getElementById("teamsNext"), n = document.querySelectorAll(".to-step-1"), r = document.getElementById("infobox"), i = document.getElementById("infoboxPrice"), c = document.getElementById("infoboxUsers"), a = document.getElementById("step1"), d = document.getElementById("step2"), f = document.getElementById("step1Copy"), m = document.getElementById("step2Copy"), p = "https://partner.calm.com/teams".concat(Object(o.b)()), y = 0;
                function v() {
                    w(a, "none"),
                        w(d, "block"),
                        w(f, "none"),
                        w(m, "block"),
                        w(r, "flex"),
                        i.textContent = s,
                        c.textContent = u,
                        0 === y ? (MktoForms2.loadForm("//info.calm.com", "541-LYF-023", 1020, (function (t) {
                            document.getElementById("FirstName").focus(),
                                (e = t).onSuccess((function (e) {
                                    return b(e, u),
                                        location.href = p,
                                        !1
                                }
                                ))
                        }
                        )),
                            y++) : (document.getElementById("FirstName") && document.getElementById("FirstName").focus(),
                                e.onSuccess((function (e) {
                                    return b(e, u),
                                        location.href = p,
                                        !1
                                }
                                )))
                }
                t && a && d && (l && l <= 500 && l >= 5 && window.addEventListener("pricesfetched", (function () {
                    v()
                }
                )),
                    t.addEventListener("click", (function () {
                        return v()
                    }
                    ))),
                    n && n.forEach((function (e) {
                        return [e.addEventListener("click", (function () {
                            w(a, "block"),
                                w(d, "none"),
                                w(f, "block"),
                                w(m, "none"),
                                w(r, "none"),
                                document.getElementById("enterprise-pricing") && document.getElementById("enterprise-pricing").scrollIntoView()
                        }
                        ))]
                    }
                    ))
            }
            , b = function (e, t) {
                var n = g(e, t);
                E("teams-user-info", JSON.stringify(n))
            }
            , g = function (e, t) {
                return {
                    firstName: e.FirstName,
                    lastName: e.LastName,
                    workEmail: e.Email,
                    company: e.Company,
                    companySize: e.company_size__c,
                    jobTitle: e.Title,
                    coveredLives: t
                }
            }
            , E = function (e, t) {
                document.cookie = "".concat(e, "=").concat(t, "; expires=2147483647; path=/; domain=.calm.com")
            }
            , w = function (e, t) {
                e.style.display = t
            }
    },
    4: function (e, t, n) {
        var o, r, i, c;
        function a(e) {
            return (a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            }
                : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }
            )(e)
        }
        c = function () {
            return function e(t, n, o) {
                function r(c, a) {
                    if (!n[c]) {
                        if (!t[c]) {
                            if (i)
                                return i(c, !0);
                            var l = new Error("Cannot find module '" + c + "'");
                            throw l.code = "MODULE_NOT_FOUND",
                            l
                        }
                        var u = n[c] = {
                            exports: {}
                        };
                        t[c][0].call(u.exports, (function (e) {
                            return r(t[c][1][e] || e)
                        }
                        ), u, u.exports, e, t, n, o)
                    }
                    return n[c].exports
                }
                for (var i = !1, c = 0; c < o.length; c++)
                    r(o[c]);
                return r
            }({
                1: [function (e, t, n) {
                    "use strict";
                    Object.defineProperty(n, "__esModule", {
                        value: !0
                    }),
                        n.create = n.visible = void 0;
                    var o = function (e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
                            , n = document.createElement("div");
                        return n.innerHTML = e.trim(),
                            !0 === t ? n.children : n.firstChild
                    }
                        , r = function (e, t) {
                            var n = e.children;
                            return 1 === n.length && n[0].tagName === t
                        }
                        , i = function (e) {
                            return null != (e = e || document.querySelector(".basicLightbox")) && !0 === e.ownerDocument.body.contains(e)
                        };
                    n.visible = i,
                        n.create = function (e, t) {
                            var n = function (e, t) {
                                var n = o('\n\t\t<div class="basicLightbox '.concat(t.className, '">\n\t\t\t<div class="basicLightbox__placeholder" role="dialog"></div>\n\t\t</div>\n\t'))
                                    , i = n.querySelector(".basicLightbox__placeholder");
                                e.forEach((function (e) {
                                    return i.appendChild(e)
                                }
                                ));
                                var c = r(i, "IMG")
                                    , a = r(i, "VIDEO")
                                    , l = r(i, "IFRAME");
                                return !0 === c && n.classList.add("basicLightbox--img"),
                                    !0 === a && n.classList.add("basicLightbox--video"),
                                    !0 === l && n.classList.add("basicLightbox--iframe"),
                                    n
                            }(e = function (e) {
                                var t = "string" == typeof e
                                    , n = e instanceof HTMLElement == 1;
                                if (!1 === t && !1 === n)
                                    throw new Error("Content must be a DOM element/node or string");
                                return !0 === t ? Array.from(o(e, !0)) : "TEMPLATE" === e.tagName ? [e.content.cloneNode(!0)] : Array.from(e.children)
                            }(e), t = function () {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                if (null == (e = Object.assign({}, e)).closable && (e.closable = !0),
                                    null == e.className && (e.className = ""),
                                    null == e.onShow && (e.onShow = function () { }
                                    ),
                                    null == e.onClose && (e.onClose = function () { }
                                    ),
                                    "boolean" != typeof e.closable)
                                    throw new Error("Property `closable` must be a boolean");
                                if ("string" != typeof e.className)
                                    throw new Error("Property `className` must be a string");
                                if ("function" != typeof e.onShow)
                                    throw new Error("Property `onShow` must be a function");
                                if ("function" != typeof e.onClose)
                                    throw new Error("Property `onClose` must be a function");
                                return e
                            }(t))
                                , c = function (e) {
                                    return !1 !== t.onClose(a) && function (e, t) {
                                        return e.classList.remove("basicLightbox--visible"),
                                            setTimeout((function () {
                                                return !1 === i(e) || e.parentElement.removeChild(e),
                                                    t()
                                            }
                                            ), 410),
                                            !0
                                    }(n, (function () {
                                        if ("function" == typeof e)
                                            return e(a)
                                    }
                                    ))
                                };
                            !0 === t.closable && n.addEventListener("click", (function (e) {
                                e.target === n && c()
                            }
                            ));
                            var a = {
                                element: function () {
                                    return n
                                },
                                visible: function () {
                                    return i(n)
                                },
                                show: function (e) {
                                    return !1 !== t.onShow(a) && function (e, t) {
                                        return document.body.appendChild(e),
                                            setTimeout((function () {
                                                requestAnimationFrame((function () {
                                                    return e.classList.add("basicLightbox--visible"),
                                                        t()
                                                }
                                                ))
                                            }
                                            ), 10),
                                            !0
                                    }(n, (function () {
                                        if ("function" == typeof e)
                                            return e(a)
                                    }
                                    ))
                                },
                                close: c
                            };
                            return a
                        }
                }
                    , {}]
            }, {}, [1])(1)
        }
            ,
            "object" == a(t) && void 0 !== e ? e.exports = c() : (r = [],
                void 0 === (i = "function" == typeof (o = c) ? o.apply(t, r) : o) || (e.exports = i))
    },
    44: function (e, t, n) {
        "use strict";
        n.r(t),
            n(9),
            n(10);
        var o, r, i = document.getElementById("mainMenu"), c = document.getElementById("hamburger"), a = document.querySelector(".title-bar"), l = document.querySelectorAll(".main-menu__submenu-btn"), u = function () {
            l && (window.innerWidth < 1024 ? l.forEach((function (e) {
                return e.addEventListener("click", s)
            }
            )) : l.forEach((function (e) {
                return e.removeEventListener("click", s)
            }
            )))
        }, s = function (e) {
            var t = e.target.closest(".main-menu__item")
                , n = t.querySelector(".main-menu__submenu");
            t.classList.toggle("link-active"),
                n.classList.toggle("submenu-active"),
                n.style.maxHeight ? n.style.maxHeight = null : n.style.maxHeight = n.scrollHeight + "px"
        }, d = document.getElementsByTagName("HTML")[0], f = document.querySelectorAll(".main-menu__submenu-btn"), m = document.querySelector(".main-menu__wrapper"), p = document.querySelectorAll(".main-menu__megamenu"), y = document.querySelector("main.main"), v = document.querySelector("footer.footer"), h = function (e) {
            var t = e.target.closest(".main-menu__submenu-btn")
                , n = t.parentElement
                , o = t.dataset.menu
                , r = document.getElementById("".concat(o));
            r.classList.contains("megamenu-active") || n.classList.contains("link-active") ? (r.classList.remove("megamenu-active"),
                n.classList.remove("link-active")) : (p.forEach((function (e) {
                    return e.id != o ? e.classList.remove("megamenu-active") : null
                }
                )),
                    f.forEach((function (e) {
                        return e.dataset.menu != o ? e.parentElement.classList.remove("link-active") : null
                    }
                    )),
                    r.classList.add("megamenu-active"),
                    n.classList.add("link-active")),
                b(),
                g()
        }, b = function () {
            var e = !1;
            Array.prototype.slice.call(f).every((function (t) {
                return !t.parentElement.classList.contains("link-active") || (e = !0,
                    !1)
            }
            )),
                e ? m.classList.add("wrapper-bg") : m.classList.remove("wrapper-bg")
        }, g = function () {
            m.classList.value.indexOf("wrapper-bg") ? (y.addEventListener("click", E),
                v.addEventListener("click", E)) : (y.removeEventListener("click", E),
                    v.removeEventListener("click", E))
        }, E = function () {
            p.forEach((function (e) {
                return e.classList.remove("megamenu-active")
            }
            )),
                f.forEach((function (e) {
                    return e.parentElement.classList.remove("link-active")
                }
                )),
                m.classList.remove("wrapper-bg")
        }, w = n(4), S = document.querySelectorAll(".modal-btn"), L = document.getElementsByTagName("HTML")[0], _ = document.querySelector("#demo .demo-block__form-wrapper"), A = document.getElementById("modal"), k = function (e) {
            var t = e.modalType;
            return "video" === t ? C(e) : "creator" === t || "content" === t ? T(e) : "pdf" === t ? z(e) : void ("custom-form" === t ? I(e) : "demo-form" === t && O())
        }, x = function (e) {
            var t = w.create(e, {
                onClose: function () {
                    return window.dispatchEvent(new Event("modalclose"))
                }
            });
            t.show(),
                L.classList.add("modal-open"),
                M(t)
        }, C = function (e) {
            var t = e.content;
            return '<iframe src="'.concat(t, '" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" width="560" height="315"></iframe>')
        }, T = function (e) {
            var t = e.link ? '<a href="'.concat(e.link, '" target="_blank" class="creators__actions__btn btn btn--primary">Learn more</a>') : "";
            return '\n    <div class="creators__modal">\n      <h3>'.concat(e.title, "</h3>\n      <p>").concat(e.content, '</p>\n      <div class="creators__actions">\n        ').concat(t, '\n        <button class="btn btn--secondary creators__actions__close modal-close">Close</button>\n      </div>\n    </div>\n  ')
        }, z = function (e) {
            return '\n    <div class="pdf-modal">\n      <object data="'.concat(e.url, '#toolbar=0&navpanes=0&scrollbar=0" title="').concat(e.title, '" type="application/pdf" width="343" height="400" class="" loading="lazy"></object>\n      <button class="btn btn--primary pdf-modal__btn modal-close-pdf">Download now</button>\n    </div>\n  ')
        }, I = function (e) {
            var t = e.content
                , n = w.create('\n    <div class="custom-form-modal">\n      <div class="form">\n        <style>#mktoForm_'.concat(t, ' button[type="submit"]:after { content: \'').concat(e.button, '\'; }</style>\n        <div class="text-center">\n          ').concat(e.headline ? "<h4>" + e.headline + "</h4>" : "", "\n          ").concat(e.text ? "<p>" + e.text + "</p>" : "", '\n          <span class="loader form-loader"></span>\n        </div>\n        <form id="mktoForm_').concat(t, '"></form>\n      </div>\n    </div>'), {
                    onClose: function () {
                        return window.dispatchEvent(new Event("modalclose"))
                    }
                });
            n.show(),
                L.classList.add("modal-open"),
                M(n),
                MktoForms2 ? MktoForms2.loadForm("//info.calm.com", "541-LYF-023", t, (function (t) {
                    t.onSuccess((function () {
                        return location.href = e.redirect,
                            !1
                    }
                    ))
                }
                )) : console.log("MktoForms hasn't been initialized")
        }, M = function (e) {
            var t = document.querySelector(".modal-close")
                , n = document.querySelector(".modal-close-pdf");
            t && t.addEventListener("click", (function () {
                return e.close()
            }
            )),
                n && n.addEventListener("click", (function () {
                    e.close();
                    var t = document.querySelector("form.mktoForm input");
                    t && (t.focus(),
                        document.querySelector(".form__wrapper").scrollIntoView())
                }
                )),
                window.addEventListener("modalclose", (function () {
                    return L.classList.remove("modal-open")
                }
                ))
        }, O = function () {
            _ && A ? (A.querySelector(".modal__inner").appendChild(_),
                L.classList.add("modal-open"),
                A.classList.add("show-modal"),
                window.addEventListener("click", B, !1)) : window.location = "".concat(window.location.protocol, "//").concat(window.location.host, "/book-a-demo")
        }, B = function e(t) {
            ("demo-form" != t.target.dataset.modalType && !t.target.closest(".modal__inner") || "close-modal" == t.target.closest("button").id) && (document.querySelector("#demo .demo-block__form-col").appendChild(_),
                L.classList.remove("modal-open"),
                A.classList.remove("show-modal"),
                window.removeEventListener("click", e, !1))
        }, q = !!document.querySelector('form[id*="mktoForm"]'), j = function (e) {
            e.forEach((function (e) {
                var t = e.querySelectorAll(".mktoFormCol");
                1 == t.length && (t[0].style.width = "100%")
            }
            ))
        }, N = function (e) {
            e.forEach((function (e) {
                F(e),
                    P(e)
            }
            ))
        }, F = function (e) {
            var t = e.querySelectorAll('input[type="checkbox"]');
            if (1 == t.length) {
                var n = t[0].closest(".mktoFieldWrap");
                n && n.classList.add("checkbox-wrapper")
            } else if (t.length > 1) {
                var o = t[0].closest(".mktoCheckboxList");
                o && o.classList.add("multi-checkbox-wrapper")
            }
        }, P = function (e) {
            var t = e.querySelectorAll("select");
            t.length > 0 && t.forEach((function (e) {
                var t = e.closest(".mktoFormCol");
                t && t.classList.add("select-wrapper")
            }
            ))
        }, R = function (e, t, n) {
            e && n && t && e.addEventListener("change", (function () {
                n.style.display = "none",
                    t.style.display = "none",
                    "CA" === e.value ? n.style.display = "block" : "US" === e.value && (t.style.display = "block")
            }
            ))
        }, H = function (e) {
            for (var t = window.location.search, n = new URLSearchParams(t), o = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"], r = 0; r < o.length; r++)
                e.querySelector('[name="'.concat(o[r], '"]')).value = n.get(o[r]);
            e.querySelector('[name="pageUrl"]').value = window.location.href.split("?")[0]
        }, U = document.getElementsByClassName("accordion__btn"), D = n(5), W = n.n(D), Y = document.getElementById("formWebhook"), $ = function () {
            Y.style.display = "none",
                document.getElementById("failMessage").style.display = "block"
        }, V = function (e) {
            return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;")
        }, J = document.getElementById("cawDropdownBtn"), G = document.getElementById("cawDropdown"), X = n(3), Z = (document.getElementById("usConsent"),
            document.getElementById("generalConsent"),
            sessionStorage.getItem("calm_consent_country"),
            n(0)), K = document.getElementById("selfServeBtn"), Q = document.getElementById("price-picker-input");
        c && c.addEventListener("click", (function () {
            i.classList.toggle("active"),
                c.classList.toggle("is-active"),
                a.classList.toggle("title-bar-bg")
        }
        )),
            u(),
            window.onresize = u,
            f && (window.addEventListener("scroll", (function () {
                0 == (self.pageYOffset ? self.pageYOffset : document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0) ? d.classList.remove("window-scrolled") : d.classList.add("window-scrolled")
            }
            )),
                f.forEach((function () {
                    window.innerWidth >= 1024 ? f.forEach((function (e) {
                        return e.addEventListener("click", h)
                    }
                    )) : f.forEach((function (e) {
                        return e.removeEventListener("click", h)
                    }
                    ))
                }
                ))),
            q && MktoForms2.whenReady((function (e) {
                var t = e.getId()
                    , n = document.querySelectorAll(".mktoFormRow")
                    , o = (document.querySelectorAll("select"),
                        document.querySelectorAll('input[type="checkbox"]'),
                        document.getElementById("flexField3Boolean"))
                    , r = e.getFormElem()[0].parentElement;
                if (j(n),
                    N(n),
                    r) {
                    var i = r.querySelector(".form-loader");
                    i && (i.style.display = "none")
                }
                if (e.getFormElem()[0].addEventListener("change", (function () {
                    j(n),
                        N(n)
                }
                )),
                    o) {
                    var c = o.closest(".mktoFormRow")
                        , a = c.nextElementSibling;
                    o.parentElement.style.marginTop = "-7.5px",
                        c.querySelector(".mktoAsterix").style.display = "none",
                        o.addEventListener("change", (function () {
                            return a.classList.add("col-100")
                        }
                        ))
                }
                1544 === t ? function () {
                    var e = document.querySelector("form#mktoForm_1544");
                    if (e) {
                        var t = e.querySelector('input[name="Email"]');
                        t && (t.placeholder = "Enter your email")
                    }
                }() : 1019 === t && function (e) {
                    var t = document.getElementById("consultantFormsWrapper")
                        , n = document.getElementById("specificClient")
                        , o = document.getElementById("specificConsultantForm");
                    t.style.display = "block",
                        o.style.display = "none",
                        e.style.display = "none",
                        n.addEventListener("change", (function () {
                            "yes" === n.value ? (o.style.display = "block",
                                e.style.display = "none") : "no" === n.value && (o.style.display = "none",
                                    e.style.display = "block")
                        }
                        )),
                        H(o),
                        R(o.querySelector("select#officeCountry"), o.querySelector("select#officeState").closest(".form__input"), o.querySelector("select#officeProvince").closest(".form__input")),
                        R(o.querySelector("select#clientCompanyCountry"), o.querySelector("select#clientCompanyState").closest(".form__input"), o.querySelector("select#clientCompanyProvince").closest(".form__input"))
                }(r)
            }
            )),
            function () {
                var e = window.location.search;
                if (null !== new URLSearchParams(e).get("aliId")) {
                    var t = k({
                        modalType: "content",
                        title: "Success!",
                        content: "You're subscribed."
                    });
                    x(t)
                }
            }(),
            function () {
                if (U)
                    for (o = 0; o < U.length; o++)
                        U[o].addEventListener("click", (function () {
                            this.classList.toggle("active");
                            var e = this.nextElementSibling;
                            e.style.maxHeight ? e.style.maxHeight = null : e.style.maxHeight = e.scrollHeight + "px"
                        }
                        ))
            }(),
            new W.a(".copy-text-btn").on("success", (function (e) {
                e.clearSelection(),
                    function (e) {
                        e.classList.remove("btn--primary"),
                            e.classList.add("btn--secondary"),
                            e.textContent = "Copied!"
                    }(e.trigger)
            }
            )),
            S && (function () {
                var e = window.location.search
                    , t = new URLSearchParams(e)
                    , n = decodeURI(t.get("open_modal"))
                    , o = n ? document.querySelector('[data-content="'.concat(n, '"]')) : null;
                o && (window.onload = function () {
                    scrollTo(o.offsetLeft, o.offsetTop),
                        o.click()
                }
                )
            }(),
                S.forEach((function (e) {
                    e.addEventListener("click", (function () {
                        var t = k(e.dataset);
                        t && x(t)
                    }
                    ))
                }
                ))),
            Y && (r = Y.querySelectorAll("input:not(.btn), select, textarea"),
                Y.addEventListener("submit", (function (e) {
                    e.preventDefault();
                    var t = function () {
                        var e = {};
                        return r.forEach((function (t) {
                            e[t.name] = V(t.value)
                        }
                        )),
                            e
                    }();
                    console.log(t),
                        function () {
                            var e = Y.querySelector('input[type="submit"]');
                            Y.style.pointerEvents = "none",
                                e.setAttribute("disabled", !0)
                        }(),
                        fetch(Y.action, {
                            method: "POST",
                            body: JSON.stringify(t)
                        }).then((function (e) {
                            return e.json()
                        }
                        )).then((function (e) {
                            "success" === e.status ? (Y.style.display = "none",
                                document.getElementById("successMessage").style.display = "block") : $()
                        }
                        )).catch((function (e) {
                            console.log("err", e),
                                $()
                        }
                        ))
                }
                ))),
            J && G && J.addEventListener("click", (function () {
                G.classList.toggle("active"),
                    J.classList.toggle("active")
            }
            )),
            function () {
                var e = navigator.userAgent.toLowerCase()
                    , t = e.includes("firefox")
                    , n = e.indexOf("android") > -1;
                if (t || n) {
                    var o = document.querySelectorAll('[data-modal-type="pdf"]');
                    o && o.forEach((function (e) {
                        return e.style.pointerEvents = "none"
                    }
                    ))
                }
            }(),
            Object(X.a)(),
            window.onload = function () {
                if ("undefined" != typeof amplitude) {
                    var e = document.querySelectorAll("[data-amplitude]")
                        , t = window.location.pathname;
                    e.forEach((function (e) {
                        e.addEventListener("click", (function (n) {
                            var o = e.dataset.amplitude;
                            "" !== o.trim() && amplitude.track("Calm Business : CTA : Clicked", {
                                page_name: t,
                                calm_user_id: null,
                                cta_name: o
                            })
                        }
                        ))
                    }
                    ))
                }
            }
            ,
            function () {
                if (K && Q) {
                    var e = K.href;
                    K.href = "".concat(e, "?covered_lives=5"),
                        Q.addEventListener("input", (function (t) {
                            var n = 0;
                            clearTimeout(n),
                                n = setTimeout((function () {
                                    K.href = "".concat(e, "?covered_lives=").concat(Q.value),
                                        Object(Z.a)([K])
                                }
                                ), 250)
                        }
                        ))
                }
            }(),
            Object(Z.a)()
    },
    5: function (e, t, n) {
        (function (e) {
            var n, o, r, i;
            function c(e) {
                return (c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                }
                    : function (e) {
                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                    }
                )(e)
            }
            /*!
 * clipboard.js v2.0.11
 * https://clipboardjs.com/
 *
 * Licensed MIT © Zeno Rocha
 */
            i = function () {
                return function () {
                    var e = {
                        686: function (e, t, n) {
                            "use strict";
                            n.d(t, {
                                default: function () {
                                    return E
                                }
                            });
                            var o = n(279)
                                , r = n.n(o)
                                , i = n(370)
                                , c = n.n(i)
                                , a = n(817)
                                , l = n.n(a);
                            function u(e) {
                                try {
                                    return document.execCommand(e)
                                } catch (e) {
                                    return !1
                                }
                            }
                            var s = function (e) {
                                var t = l()(e);
                                return u("cut"),
                                    t
                            }
                                , d = function (e, t) {
                                    var n = function (e) {
                                        var t = "rtl" === document.documentElement.getAttribute("dir")
                                            , n = document.createElement("textarea");
                                        n.style.fontSize = "12pt",
                                            n.style.border = "0",
                                            n.style.padding = "0",
                                            n.style.margin = "0",
                                            n.style.position = "absolute",
                                            n.style[t ? "right" : "left"] = "-9999px";
                                        var o = window.pageYOffset || document.documentElement.scrollTop;
                                        return n.style.top = "".concat(o, "px"),
                                            n.setAttribute("readonly", ""),
                                            n.value = e,
                                            n
                                    }(e);
                                    t.container.appendChild(n);
                                    var o = l()(n);
                                    return u("copy"),
                                        n.remove(),
                                        o
                                }
                                , f = function (e) {
                                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
                                        container: document.body
                                    }
                                        , n = "";
                                    return "string" == typeof e ? n = d(e, t) : e instanceof HTMLInputElement && !["text", "search", "url", "tel", "password"].includes(null == e ? void 0 : e.type) ? n = d(e.value, t) : (n = l()(e),
                                        u("copy")),
                                        n
                                };
                            function m(e) {
                                return (m = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                                    return typeof e
                                }
                                    : function (e) {
                                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                                    }
                                )(e)
                            }
                            function p(e) {
                                return (p = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                                    return typeof e
                                }
                                    : function (e) {
                                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                                    }
                                )(e)
                            }
                            function y(e, t) {
                                for (var n = 0; n < t.length; n++) {
                                    var o = t[n];
                                    o.enumerable = o.enumerable || !1,
                                        o.configurable = !0,
                                        "value" in o && (o.writable = !0),
                                        Object.defineProperty(e, o.key, o)
                                }
                            }
                            function v(e, t) {
                                return (v = Object.setPrototypeOf || function (e, t) {
                                    return e.__proto__ = t,
                                        e
                                }
                                )(e, t)
                            }
                            function h(e, t) {
                                return !t || "object" !== p(t) && "function" != typeof t ? function (e) {
                                    if (void 0 === e)
                                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                                    return e
                                }(e) : t
                            }
                            function b(e) {
                                return (b = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                                    return e.__proto__ || Object.getPrototypeOf(e)
                                }
                                )(e)
                            }
                            function g(e, t) {
                                var n = "data-clipboard-".concat(e);
                                if (t.hasAttribute(n))
                                    return t.getAttribute(n)
                            }
                            var E = function (e) {
                                !function (e, t) {
                                    if ("function" != typeof t && null !== t)
                                        throw new TypeError("Super expression must either be null or a function");
                                    e.prototype = Object.create(t && t.prototype, {
                                        constructor: {
                                            value: e,
                                            writable: !0,
                                            configurable: !0
                                        }
                                    }),
                                        t && v(e, t)
                                }(i, e);
                                var t, n, o, r = function (e) {
                                    var t = function () {
                                        if ("undefined" == typeof Reflect || !Reflect.construct)
                                            return !1;
                                        if (Reflect.construct.sham)
                                            return !1;
                                        if ("function" == typeof Proxy)
                                            return !0;
                                        try {
                                            return Date.prototype.toString.call(Reflect.construct(Date, [], (function () { }
                                            ))),
                                                !0
                                        } catch (e) {
                                            return !1
                                        }
                                    }();
                                    return function () {
                                        var n, o = b(e);
                                        if (t) {
                                            var r = b(this).constructor;
                                            n = Reflect.construct(o, arguments, r)
                                        } else
                                            n = o.apply(this, arguments);
                                        return h(this, n)
                                    }
                                }(i);
                                function i(e, t) {
                                    var n;
                                    return function (e, t) {
                                        if (!(e instanceof t))
                                            throw new TypeError("Cannot call a class as a function")
                                    }(this, i),
                                        (n = r.call(this)).resolveOptions(t),
                                        n.listenClick(e),
                                        n
                                }
                                return t = i,
                                    o = [{
                                        key: "copy",
                                        value: function (e) {
                                            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
                                                container: document.body
                                            };
                                            return f(e, t)
                                        }
                                    }, {
                                        key: "cut",
                                        value: function (e) {
                                            return s(e)
                                        }
                                    }, {
                                        key: "isSupported",
                                        value: function () {
                                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ["copy", "cut"]
                                                , t = "string" == typeof e ? [e] : e
                                                , n = !!document.queryCommandSupported;
                                            return t.forEach((function (e) {
                                                n = n && !!document.queryCommandSupported(e)
                                            }
                                            )),
                                                n
                                        }
                                    }],
                                    (n = [{
                                        key: "resolveOptions",
                                        value: function () {
                                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                            this.action = "function" == typeof e.action ? e.action : this.defaultAction,
                                                this.target = "function" == typeof e.target ? e.target : this.defaultTarget,
                                                this.text = "function" == typeof e.text ? e.text : this.defaultText,
                                                this.container = "object" === p(e.container) ? e.container : document.body
                                        }
                                    }, {
                                        key: "listenClick",
                                        value: function (e) {
                                            var t = this;
                                            this.listener = c()(e, "click", (function (e) {
                                                return t.onClick(e)
                                            }
                                            ))
                                        }
                                    }, {
                                        key: "onClick",
                                        value: function (e) {
                                            var t = e.delegateTarget || e.currentTarget
                                                , n = this.action(t) || "copy"
                                                , o = function () {
                                                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
                                                        , t = e.action
                                                        , n = void 0 === t ? "copy" : t
                                                        , o = e.container
                                                        , r = e.target
                                                        , i = e.text;
                                                    if ("copy" !== n && "cut" !== n)
                                                        throw new Error('Invalid "action" value, use either "copy" or "cut"');
                                                    if (void 0 !== r) {
                                                        if (!r || "object" !== m(r) || 1 !== r.nodeType)
                                                            throw new Error('Invalid "target" value, use a valid Element');
                                                        if ("copy" === n && r.hasAttribute("disabled"))
                                                            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                                                        if ("cut" === n && (r.hasAttribute("readonly") || r.hasAttribute("disabled")))
                                                            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes')
                                                    }
                                                    return i ? f(i, {
                                                        container: o
                                                    }) : r ? "cut" === n ? s(r) : f(r, {
                                                        container: o
                                                    }) : void 0
                                                }({
                                                    action: n,
                                                    container: this.container,
                                                    target: this.target(t),
                                                    text: this.text(t)
                                                });
                                            this.emit(o ? "success" : "error", {
                                                action: n,
                                                text: o,
                                                trigger: t,
                                                clearSelection: function () {
                                                    t && t.focus(),
                                                        window.getSelection().removeAllRanges()
                                                }
                                            })
                                        }
                                    }, {
                                        key: "defaultAction",
                                        value: function (e) {
                                            return g("action", e)
                                        }
                                    }, {
                                        key: "defaultTarget",
                                        value: function (e) {
                                            var t = g("target", e);
                                            if (t)
                                                return document.querySelector(t)
                                        }
                                    }, {
                                        key: "defaultText",
                                        value: function (e) {
                                            return g("text", e)
                                        }
                                    }, {
                                        key: "destroy",
                                        value: function () {
                                            this.listener.destroy()
                                        }
                                    }]) && y(t.prototype, n),
                                    o && y(t, o),
                                    i
                            }(r())
                        },
                        828: function (e) {
                            if ("undefined" != typeof Element && !Element.prototype.matches) {
                                var t = Element.prototype;
                                t.matches = t.matchesSelector || t.mozMatchesSelector || t.msMatchesSelector || t.oMatchesSelector || t.webkitMatchesSelector
                            }
                            e.exports = function (e, t) {
                                for (; e && 9 !== e.nodeType;) {
                                    if ("function" == typeof e.matches && e.matches(t))
                                        return e;
                                    e = e.parentNode
                                }
                            }
                        },
                        438: function (e, t, n) {
                            var o = n(828);
                            function r(e, t, n, o, r) {
                                var c = i.apply(this, arguments);
                                return e.addEventListener(n, c, r),
                                {
                                    destroy: function () {
                                        e.removeEventListener(n, c, r)
                                    }
                                }
                            }
                            function i(e, t, n, r) {
                                return function (n) {
                                    n.delegateTarget = o(n.target, t),
                                        n.delegateTarget && r.call(e, n)
                                }
                            }
                            e.exports = function (e, t, n, o, i) {
                                return "function" == typeof e.addEventListener ? r.apply(null, arguments) : "function" == typeof n ? r.bind(null, document).apply(null, arguments) : ("string" == typeof e && (e = document.querySelectorAll(e)),
                                    Array.prototype.map.call(e, (function (e) {
                                        return r(e, t, n, o, i)
                                    }
                                    )))
                            }
                        },
                        879: function (e, t) {
                            t.node = function (e) {
                                return void 0 !== e && e instanceof HTMLElement && 1 === e.nodeType
                            }
                                ,
                                t.nodeList = function (e) {
                                    var n = Object.prototype.toString.call(e);
                                    return void 0 !== e && ("[object NodeList]" === n || "[object HTMLCollection]" === n) && "length" in e && (0 === e.length || t.node(e[0]))
                                }
                                ,
                                t.string = function (e) {
                                    return "string" == typeof e || e instanceof String
                                }
                                ,
                                t.fn = function (e) {
                                    return "[object Function]" === Object.prototype.toString.call(e)
                                }
                        },
                        370: function (e, t, n) {
                            var o = n(879)
                                , r = n(438);
                            e.exports = function (e, t, n) {
                                if (!e && !t && !n)
                                    throw new Error("Missing required arguments");
                                if (!o.string(t))
                                    throw new TypeError("Second argument must be a String");
                                if (!o.fn(n))
                                    throw new TypeError("Third argument must be a Function");
                                if (o.node(e))
                                    return function (e, t, n) {
                                        return e.addEventListener(t, n),
                                        {
                                            destroy: function () {
                                                e.removeEventListener(t, n)
                                            }
                                        }
                                    }(e, t, n);
                                if (o.nodeList(e))
                                    return function (e, t, n) {
                                        return Array.prototype.forEach.call(e, (function (e) {
                                            e.addEventListener(t, n)
                                        }
                                        )),
                                        {
                                            destroy: function () {
                                                Array.prototype.forEach.call(e, (function (e) {
                                                    e.removeEventListener(t, n)
                                                }
                                                ))
                                            }
                                        }
                                    }(e, t, n);
                                if (o.string(e))
                                    return function (e, t, n) {
                                        return r(document.body, e, t, n)
                                    }(e, t, n);
                                throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")
                            }
                        },
                        817: function (e) {
                            e.exports = function (e) {
                                var t;
                                if ("SELECT" === e.nodeName)
                                    e.focus(),
                                        t = e.value;
                                else if ("INPUT" === e.nodeName || "TEXTAREA" === e.nodeName) {
                                    var n = e.hasAttribute("readonly");
                                    n || e.setAttribute("readonly", ""),
                                        e.select(),
                                        e.setSelectionRange(0, e.value.length),
                                        n || e.removeAttribute("readonly"),
                                        t = e.value
                                } else {
                                    e.hasAttribute("contenteditable") && e.focus();
                                    var o = window.getSelection()
                                        , r = document.createRange();
                                    r.selectNodeContents(e),
                                        o.removeAllRanges(),
                                        o.addRange(r),
                                        t = o.toString()
                                }
                                return t
                            }
                        },
                        279: function (e) {
                            function t() { }
                            t.prototype = {
                                on: function (e, t, n) {
                                    var o = this.e || (this.e = {});
                                    return (o[e] || (o[e] = [])).push({
                                        fn: t,
                                        ctx: n
                                    }),
                                        this
                                },
                                once: function (e, t, n) {
                                    var o = this;
                                    function r() {
                                        o.off(e, r),
                                            t.apply(n, arguments)
                                    }
                                    return r._ = t,
                                        this.on(e, r, n)
                                },
                                emit: function (e) {
                                    for (var t = [].slice.call(arguments, 1), n = ((this.e || (this.e = {}))[e] || []).slice(), o = 0, r = n.length; o < r; o++)
                                        n[o].fn.apply(n[o].ctx, t);
                                    return this
                                },
                                off: function (e, t) {
                                    var n = this.e || (this.e = {})
                                        , o = n[e]
                                        , r = [];
                                    if (o && t)
                                        for (var i = 0, c = o.length; i < c; i++)
                                            o[i].fn !== t && o[i].fn._ !== t && r.push(o[i]);
                                    return r.length ? n[e] = r : delete n[e],
                                        this
                                }
                            },
                                e.exports = t,
                                e.exports.TinyEmitter = t
                        }
                    }
                        , t = {};
                    function n(o) {
                        if (t[o])
                            return t[o].exports;
                        var r = t[o] = {
                            exports: {}
                        };
                        return e[o](r, r.exports, n),
                            r.exports
                    }
                    return n.n = function (e) {
                        var t = e && e.__esModule ? function () {
                            return e.default
                        }
                            : function () {
                                return e
                            }
                            ;
                        return n.d(t, {
                            a: t
                        }),
                            t
                    }
                        ,
                        n.d = function (e, t) {
                            for (var o in t)
                                n.o(t, o) && !n.o(e, o) && Object.defineProperty(e, o, {
                                    enumerable: !0,
                                    get: t[o]
                                })
                        }
                        ,
                        n.o = function (e, t) {
                            return Object.prototype.hasOwnProperty.call(e, t)
                        }
                        ,
                        n(686)
                }().default
            }
                ,
                "object" === c(t) && "object" === c(e) ? e.exports = i() : (o = [],
                    void 0 === (r = "function" == typeof (n = i) ? n.apply(t, o) : n) || (e.exports = r))
        }
        ).call(this, n(2)(e))
    },
    8: function (e, t, n) {
        e.exports = n(44)
    },
    9: function (e, t) {
        var n, o, r, i;
        Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector),
            Element.prototype.closest || (Element.prototype.closest = function (e) {
                var t = this;
                do {
                    if (Element.prototype.matches.call(t, e))
                        return t;
                    t = t.parentElement || t.parentNode
                } while (null !== t && 1 === t.nodeType);
                return null
            }
            ),
            window.NodeList && !NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach),
            Array.from || (Array.from = (n = Object.prototype.toString,
                o = function (e) {
                    return "function" == typeof e || "[object Function]" === n.call(e)
                }
                ,
                r = Math.pow(2, 53) - 1,
                i = function (e) {
                    var t = function (e) {
                        var t = Number(e);
                        return isNaN(t) ? 0 : 0 !== t && isFinite(t) ? (t > 0 ? 1 : -1) * Math.floor(Math.abs(t)) : t
                    }(e);
                    return Math.min(Math.max(t, 0), r)
                }
                ,
                function (e) {
                    var t = this
                        , n = Object(e);
                    if (null == e)
                        throw new TypeError("Array.from requires an array-like object - not null or undefined");
                    var r, c = arguments.length > 1 ? arguments[1] : void 0;
                    if (void 0 !== c) {
                        if (!o(c))
                            throw new TypeError("Array.from: when provided, the second argument must be a function");
                        arguments.length > 2 && (r = arguments[2])
                    }
                    for (var a, l = i(n.length), u = o(t) ? Object(new t(l)) : new Array(l), s = 0; s < l;)
                        a = n[s],
                            u[s] = c ? void 0 === r ? c(a, s) : c.call(r, a, s) : a,
                            s += 1;
                    return u.length = l,
                        u
                }
            )),
            "function" != typeof Object.assign && Object.defineProperty(Object, "assign", {
                value: function (e, t) {
                    "use strict";
                    if (null == e)
                        throw new TypeError("Cannot convert undefined or null to object");
                    for (var n = Object(e), o = 1; o < arguments.length; o++) {
                        var r = arguments[o];
                        if (null != r)
                            for (var i in r)
                                Object.prototype.hasOwnProperty.call(r, i) && (n[i] = r[i])
                    }
                    return n
                },
                writable: !0,
                configurable: !0
            })
    }
});