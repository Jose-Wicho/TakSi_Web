/**
 * jsPDF AutoTable plugin v2.0.37
 * Copyright (c) 2014 Simon Bengtsson, https://github.com/simonbengtsson/jsPDF-AutoTable
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 *
 * @preserve
 */
! function (t, e) {
	"object" == typeof exports && "undefined" != typeof module ? e(require("jspdf")) : "function" == typeof define && define.amd ? define(["jspdf"], e) : e(t.jsPDF)
}(this, function (t) {
	"use strict";

	function e() {
		return {
			theme: "striped",
			styles: {},
			headerStyles: {},
			bodyStyles: {},
			alternateRowStyles: {},
			columnStyles: {},
			startY: !1,
			margin: 40,
			pageBreak: "auto",
			tableWidth: "auto",
			createdHeaderCell: function (t, e) {},
			createdCell: function (t, e) {},
			drawHeaderRow: function (t, e) {},
			drawRow: function (t, e) {},
			drawHeaderCell: function (t, e) {},
			drawCell: function (t, e) {},
			beforePageContent: function (t) {},
			afterPageContent: function (t) {},
			afterPageAdd: function (t) {}
		}
	}

	function n() {
		return {
			cellPadding: 5,
			fontSize: 10,
			font: "helvetica",
			lineColor: 200,
			lineWidth: 0,
			fontStyle: "normal",
			overflow: "ellipsize",
			fillColor: !1,
			textColor: 20,
			halign: "left",
			valign: "top",
			rowHeight: 20,
			columnWidth: "auto"
		}
	}

	function r(t) {
		return t && "object" == typeof t && "default" in t ? t.default : t
	}

	function o(t, e) {
		return e = {
			exports: {}
		}, t(e, e.exports), e.exports
	}

	function i(t, e, n) {
		t && "object" === ("undefined" == typeof t ? "undefined" : v(t)) || console.error("The headers should be an object or array, is: " + ("undefined" == typeof t ? "undefined" : v(t))), e && "object" === ("undefined" == typeof e ? "undefined" : v(e)) || console.error("The data should be an object or array, is: " + ("undefined" == typeof e ? "undefined" : v(e))), n && "object" !== ("undefined" == typeof n ? "undefined" : v(n)) && console.error("The data should be an object or array, is: " + ("undefined" == typeof e ? "undefined" : v(e))), Array.prototype.forEach || console.error("The current browser does not support Array.prototype.forEach which is required for jsPDF-AutoTable. You can try polyfilling it by including this script https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill")
	}

	function f(t, e) {
		yr = new x;
		var n = /\r\n|\r|\n/g,
			r = new j(t);
		r.index = -1;
		var o = W.styles([P[hr.theme].table, P[hr.theme].header]);
		r.styles = Object.assign({}, o, hr.styles, hr.headerStyles), t.forEach(function (t, e) {
			var o = e;
			"object" === ("undefined" == typeof t ? "undefined" : v(t)) && (e = "undefined" != typeof t.dataKey ? t.dataKey : t.key), "undefined" != typeof t.width && console.error("Use of deprecated option: column.width, use column.styles.columnWidth instead.");
			var i = new S(e, o);
			i.styles = hr.columnStyles[i.dataKey] || {}, yr.columns.push(i);
			var f = new O;
			f.raw = "object" === ("undefined" == typeof t ? "undefined" : v(t)) ? t.title : t, f.styles = Object.assign({}, r.styles), f.text = "" + f.raw, f.contentWidth = 2 * f.styles.cellPadding + b(f.text, f.styles), f.text = f.text.split(n), r.cells[e] = f, hr.createdHeaderCell(f, {
				column: i,
				row: r,
				settings: hr
			})
		}), yr.headerRow = r, e.forEach(function (t, e) {
			var r = new j(t),
				o = e % 2 === 0,
				i = W.styles([P[hr.theme].table, o ? P[hr.theme].alternateRow : {}]),
				f = Object.assign({}, hr.styles, hr.bodyStyles, o ? hr.alternateRowStyles : {});
			r.styles = Object.assign({}, i, f), r.index = e, yr.columns.forEach(function (e) {
				var o = new O;
				o.raw = t[e.dataKey], o.styles = Object.assign({}, r.styles, e.styles), o.text = "undefined" != typeof o.raw ? "" + o.raw : "", r.cells[e.dataKey] = o, hr.createdCell(o, p({
					column: e,
					row: r
				})), o.contentWidth = 2 * o.styles.cellPadding + b(o.text, o.styles), o.text = o.text.split(n)
			}), yr.rows.push(r)
		})
	}

	function a(t, e) {
		var n = 0;
		yr.columns.forEach(function (t) {
			t.contentWidth = yr.headerRow.cells[t.dataKey].contentWidth, yr.rows.forEach(function (e) {
				var n = e.cells[t.dataKey].contentWidth;
				n > t.contentWidth && (t.contentWidth = n)
			}), t.width = t.contentWidth, n += t.contentWidth
		}), yr.contentWidth = n;
		var r = e - hr.margin.left - hr.margin.right,
			o = r;
		"number" == typeof hr.tableWidth ? o = hr.tableWidth : "wrap" === hr.tableWidth && (o = yr.contentWidth), yr.width = o < r ? o : r;
		var i = [],
			f = 0,
			a = yr.width / yr.columns.length,
			c = 0;
		yr.columns.forEach(function (t) {
			var e = W.styles([P[hr.theme].table, hr.styles, t.styles]);
			"wrap" === e.columnWidth ? t.width = t.contentWidth : "number" == typeof e.columnWidth ? t.width = e.columnWidth : ("auto" === e.columnWidth, t.contentWidth <= a && yr.contentWidth > yr.width ? t.width = t.contentWidth : (i.push(t), f += t.contentWidth, t.width = 0)), c += t.width
		}), u(i, c, f, a), yr.height = 0;
		var l = yr.rows.concat(yr.headerRow);
		l.forEach(function (e, n) {
			var r = 0;
			yr.columns.forEach(function (n) {
				var o = e.cells[n.dataKey];
				y(o.styles);
				var i = n.width - 2 * o.styles.cellPadding;
				if ("linebreak" === o.styles.overflow) try {
					o.text = t.splitTextToSize(o.text, i + 1, {
						fontSize: o.styles.fontSize
					})
				} catch (e) {
					if (!(e instanceof TypeError && Array.isArray(o.text))) throw e;
					o.text = t.splitTextToSize(o.text.join(" "), i + 1, {
						fontSize: o.styles.fontSize
					})
				} else "ellipsize" === o.styles.overflow ? o.text = g(o.text, i, o.styles) : "visible" === o.styles.overflow || ("hidden" === o.styles.overflow ? o.text = g(o.text, i, o.styles, "") : "function" == typeof o.styles.overflow ? o.text = o.styles.overflow(o.text, i) : console.error("Unrecognized overflow type: " + o.styles.overflow));
				var f = Array.isArray(o.text) ? o.text.length - 1 : 0;
				f > r && (r = f)
			}), e.heightStyle = e.styles.rowHeight, e.height = e.heightStyle + r * e.styles.fontSize * z, yr.height += e.height
		})
	}

	function u(t, e, n, r) {
		for (var o = yr.width - e - n, i = 0; i < t.length; i++) {
			var f = t[i],
				a = f.contentWidth / n,
				c = f.contentWidth + o * a < r;
			if (o < 0 && c) {
				t.splice(i, 1), n -= f.contentWidth, f.width = r, e += f.width, u(t, e, n, r);
				break
			}
			f.width = f.contentWidth + o * a
		}
	}

	function c(t) {
		hr.afterPageContent(p()), t(), hr.afterPageAdd(p()), yr.pageCount++, dr = {
			x: hr.margin.left,
			y: hr.margin.top
		}, hr.beforePageContent(p()), hr.drawHeaderRow(yr.headerRow, p({
			row: yr.headerRow
		})) !== !1 && d(yr.headerRow, hr.drawHeaderCell)
	}

	function l(t) {
		var e = dr.y + t + hr.margin.bottom;
		return e >= sr.internal.pageSize.height
	}

	function s(t) {
		yr.rows.forEach(function (e, n) {
			if (l(e.height)) {
				c(t)
			}
			e.y = dr.y, hr.drawRow(e, p({
				row: e
			})) !== !1 && d(e, hr.drawCell)
		})
	}

	function d(t, e) {
		dr.x = hr.margin.left;
		for (var n = 0; n < yr.columns.length; n++) {
			var r = yr.columns[n],
				o = t.cells[r.dataKey];
			if (o) {
				y(o.styles), o.x = dr.x, o.y = dr.y, o.height = t.height, o.width = r.width, "top" === o.styles.valign ? o.textPos.y = dr.y + o.styles.cellPadding : "bottom" === o.styles.valign ? o.textPos.y = dr.y + t.height - o.styles.cellPadding : o.textPos.y = dr.y + t.height / 2, "right" === o.styles.halign ? o.textPos.x = o.x + o.width - o.styles.cellPadding : "center" === o.styles.halign ? o.textPos.x = o.x + o.width / 2 : o.textPos.x = o.x + o.styles.cellPadding;
				var i = p({
					column: r,
					row: t
				});
				if (e(o, i) !== !1) {
					var f = h(o.styles);
					f && sr.rect(o.x, o.y, o.width, o.height, f), sr.autoTableText(o.text, o.textPos.x, o.textPos.y, {
						halign: o.styles.halign,
						valign: o.styles.valign
					})
				}
				dr.x += o.width
			}
		}
		dr.y += t.height
	}

	function h(t) {
		var e = t.lineWidth > 0,
			n = t.fillColor !== !1;
		return e && n ? "DF" : e ? "S" : !!n && "F"
	}

	function y(t) {
		var e = {
			fillColor: sr.setFillColor,
			textColor: sr.setTextColor,
			fontStyle: sr.setFontStyle,
			lineColor: sr.setDrawColor,
			lineWidth: sr.setLineWidth,
			font: sr.setFont,
			fontSize: sr.setFontSize
		};
		Object.keys(e).forEach(function (n) {
			var r = t[n],
				o = e[n];
			"undefined" != typeof r && (r.constructor === Array ? o.apply(this, r) : o(r))
		})
	}

	function p(t) {
		return Object.assign({
			pageCount: yr.pageCount,
			settings: hr,
			table: yr,
			doc: sr,
			cursor: dr
		}, t || {})
	}

	function b(t, e) {
		y(e);
		var n = sr.getStringUnitWidth(t);
		return n * e.fontSize
	}

	function g(t, e, n, r) {
		if (r = "undefined" != typeof r ? r : "...", Array.isArray(t)) return t.forEach(function (o, i) {
			t[i] = g(o, e, n, r)
		}), t;
		if (e >= b(t, n)) return t;
		for (; e < b(t + r, n) && !(t.length < 2);) t = t.substring(0, t.length - 1);
		return t.trim() + r
	}
	t = "default" in t ? t.default : t;
	var v = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
			return typeof t
		} : function (t) {
			return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t
		},
		w = function (t, e) {
			if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
		},
		m = function () {
			function t(t, e) {
				for (var n = 0; n < e.length; n++) {
					var r = e[n];
					r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
				}
			}
			return function (e, n, r) {
				return n && t(e.prototype, n), r && t(e, r), e
			}
		}(),
		x = function t() {
			w(this, t), this.height = 0, this.width = 0, this.contentWidth = 0, this.rows = [], this.columns = [], this.headerRow = null, this.settings = {}, this.pageCount = 1
		},
		j = function t(e) {
			w(this, t), this.raw = e || {}, this.index = 0, this.styles = {}, this.cells = {}, this.height = 0, this.y = 0
		},
		O = function t(e) {
			w(this, t), this.raw = e, this.styles = {}, this.text = "", this.contentWidth = 0, this.textPos = {}, this.height = 0, this.width = 0, this.x = 0, this.y = 0
		},
		S = function t(e, n) {
			w(this, t), this.dataKey = e, this.index = n, this.options = {}, this.styles = {}, this.contentWidth = 0, this.width = 0, this.x = 0
		},
		z = 1.15,
		P = {
			striped: {
				table: {
					fillColor: 255,
					textColor: 80,
					fontStyle: "normal"
				},
				header: {
					textColor: 255,
					fillColor: [41, 128, 185],
					rowHeight: 23,
					fontStyle: "bold"
				},
				body: {},
				alternateRow: {
					fillColor: 245
				}
			},
			grid: {
				table: {
					fillColor: 255,
					textColor: 80,
					fontStyle: "normal",
					lineWidth: .1
				},
				header: {
					textColor: 255,
					fillColor: [26, 188, 156],
					rowHeight: 23,
					fontStyle: "bold",
					lineWidth: 0
				},
				body: {},
				alternateRow: {}
			},
			plain: {
				header: {
					fontStyle: "bold"
				}
			}
		},
		W = function () {
			function t() {
				w(this, t)
			}
			return m(t, null, [{
				key: "initSettings",
				value: function (t) {
					var n = Object.assign({}, e(), t);
					"undefined" != typeof n.extendWidth && (n.tableWidth = n.extendWidth ? "auto" : "wrap", console.error("Use of deprecated option: extendWidth, use tableWidth instead.")), "undefined" != typeof n.margins && ("undefined" == typeof n.margin && (n.margin = n.margins), console.error("Use of deprecated option: margins, use margin instead.")), [["padding", "cellPadding"], ["lineHeight", "rowHeight"], "fontSize", "overflow"].forEach(function (t) {
						var e = "string" == typeof t ? t : t[0],
							r = "string" == typeof t ? t : t[1];
						"undefined" != typeof n[e] && ("undefined" == typeof n.styles[r] && (n.styles[r] = n[e]), console.error("Use of deprecated option: " + e + ", use the style " + r + " instead."))
					});
					var r = n.margin;
					return n.margin = {}, "number" == typeof r.horizontal && (r.right = r.horizontal, r.left = r.horizontal), "number" == typeof r.vertical && (r.top = r.vertical, r.bottom = r.vertical), ["top", "right", "bottom", "left"].forEach(function (t, e) {
						if ("number" == typeof r) n.margin[t] = r;
						else {
							var o = Array.isArray(r) ? e : t;
							n.margin[t] = "number" == typeof r[o] ? r[o] : 40
						}
					}), n
				}
			}, {
				key: "styles",
				value: function (t) {
					return t.unshift(n()), t.unshift({}), Object.assign.apply(this, t)
				}
			}]), t
		}(),
		E = o(function (t) {
			var e = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
			"number" == typeof __g && (__g = e)
		}),
		C = r(E),
		A = Object.freeze({
			default: C
		}),
		T = o(function (t) {
			var e = {}.hasOwnProperty;
			t.exports = function (t, n) {
				return e.call(t, n)
			}
		}),
		k = r(T),
		F = Object.freeze({
			default: k
		}),
		_ = o(function (t) {
			t.exports = function (t) {
				try {
					return !!t()
				} catch (t) {
					return !0
				}
			}
		}),
		R = r(_),
		K = Object.freeze({
			default: R
		}),
		I = o(function (t) {
			t.exports = !r(K)(function () {
				return 7 != Object.defineProperty({}, "a", {
					get: function () {
						return 7
					}
				}).a
			})
		}),
		H = r(I),
		N = Object.freeze({
			default: H
		}),
		M = o(function (t) {
			var e = t.exports = {
				version: "2.4.0"
			};
			"number" == typeof __e && (__e = e)
		}),
		U = r(M),
		Y = M.version,
		D = Object.freeze({
			default: U,
			version: Y
		}),
		B = o(function (t) {
			t.exports = function (t) {
				return "object" == typeof t ? null !== t : "function" == typeof t
			}
		}),
		J = r(B),
		q = Object.freeze({
			default: J
		}),
		G = o(function (t) {
			var e = r(q);
			t.exports = function (t) {
				if (!e(t)) throw TypeError(t + " is not an object!");
				return t
			}
		}),
		L = r(G),
		Q = Object.freeze({
			default: L
		}),
		V = o(function (t) {
			var e = r(q),
				n = r(A).document,
				o = e(n) && e(n.createElement);
			t.exports = function (t) {
				return o ? n.createElement(t) : {}
			}
		}),
		X = r(V),
		Z = Object.freeze({
			default: X
		}),
		$ = o(function (t) {
			t.exports = !r(N) && !r(K)(function () {
				return 7 != Object.defineProperty(r(Z)("div"), "a", {
					get: function () {
						return 7
					}
				}).a
			})
		}),
		tt = r($),
		et = Object.freeze({
			default: tt
		}),
		nt = o(function (t) {
			var e = r(q);
			t.exports = function (t, n) {
				if (!e(t)) return t;
				var r, o;
				if (n && "function" == typeof (r = t.toString) && !e(o = r.call(t))) return o;
				if ("function" == typeof (r = t.valueOf) && !e(o = r.call(t))) return o;
				if (!n && "function" == typeof (r = t.toString) && !e(o = r.call(t))) return o;
				throw TypeError("Can't convert object to primitive value")
			}
		}),
		rt = r(nt),
		ot = Object.freeze({
			default: rt
		}),
		it = o(function (t, e) {
			var n = r(Q),
				o = r(et),
				i = r(ot),
				f = Object.defineProperty;
			e.f = r(N) ? Object.defineProperty : function (t, e, r) {
				if (n(t), e = i(e, !0), n(r), o) try {
					return f(t, e, r)
				} catch (t) {}
				if ("get" in r || "set" in r) throw TypeError("Accessors not supported!");
				return "value" in r && (t[e] = r.value), t
			}
		}),
		ft = r(it),
		at = it.f,
		ut = Object.freeze({
			default: ft,
			f: at
		}),
		ct = o(function (t) {
			t.exports = function (t, e) {
				return {
					enumerable: !(1 & t),
					configurable: !(2 & t),
					writable: !(4 & t),
					value: e
				}
			}
		}),
		lt = r(ct),
		st = Object.freeze({
			default: lt
		}),
		dt = o(function (t) {
			var e = r(ut),
				n = r(st);
			t.exports = r(N) ? function (t, r, o) {
				return e.f(t, r, n(1, o))
			} : function (t, e, n) {
				return t[e] = n, t
			}
		}),
		ht = r(dt),
		yt = Object.freeze({
			default: ht
		}),
		pt = o(function (t) {
			var e = 0,
				n = Math.random();
			t.exports = function (t) {
				return "Symbol(".concat(void 0 === t ? "" : t, ")_", (++e + n).toString(36))
			}
		}),
		bt = r(pt),
		gt = Object.freeze({
			default: bt
		}),
		vt = o(function (t) {
			var e = r(A),
				n = r(yt),
				o = r(F),
				i = r(gt)("src"),
				f = "toString",
				a = Function[f],
				u = ("" + a).split(f);
			r(D).inspectSource = function (t) {
				return a.call(t)
			}, (t.exports = function (t, r, f, a) {
				var c = "function" == typeof f;
				c && (o(f, "name") || n(f, "name", r)), t[r] !== f && (c && (o(f, i) || n(f, i, t[r] ? "" + t[r] : u.join(String(r)))), t === e ? t[r] = f : a ? t[r] ? t[r] = f : n(t, r, f) : (delete t[r], n(t, r, f)))
			})(Function.prototype, f, function () {
				return "function" == typeof this && this[i] || a.call(this)
			})
		}),
		wt = r(vt),
		mt = Object.freeze({
			default: wt
		}),
		xt = o(function (t) {
			t.exports = function (t) {
				if ("function" != typeof t) throw TypeError(t + " is not a function!");
				return t
			}
		}),
		jt = r(xt),
		Ot = Object.freeze({
			default: jt
		}),
		St = o(function (t) {
			var e = r(Ot);
			t.exports = function (t, n, r) {
				if (e(t), void 0 === n) return t;
				switch (r) {
					case 1:
						return function (e) {
							return t.call(n, e)
						};
					case 2:
						return function (e, r) {
							return t.call(n, e, r)
						};
					case 3:
						return function (e, r, o) {
							return t.call(n, e, r, o)
						}
				}
				return function () {
					return t.apply(n, arguments)
				}
			}
		}),
		zt = r(St),
		Pt = Object.freeze({
			default: zt
		}),
		Wt = o(function (t) {
			var e = r(A),
				n = r(D),
				o = r(yt),
				i = r(mt),
				f = r(Pt),
				a = "prototype",
				u = function (t, r, c) {
					var l, s, d, h, y = t & u.F,
						p = t & u.G,
						b = t & u.S,
						g = t & u.P,
						v = t & u.B,
						w = p ? e : b ? e[r] || (e[r] = {}) : (e[r] || {})[a],
						m = p ? n : n[r] || (n[r] = {}),
						x = m[a] || (m[a] = {});
					p && (c = r);
					for (l in c) s = !y && w && void 0 !== w[l], d = (s ? w : c)[l], h = v && s ? f(d, e) : g && "function" == typeof d ? f(Function.call, d) : d, w && i(w, l, d, t & u.U), m[l] != d && o(m, l, h), g && x[l] != d && (x[l] = d)
				};
			e.core = n, u.F = 1, u.G = 2, u.S = 4, u.P = 8, u.B = 16, u.W = 32, u.U = 64, u.R = 128, t.exports = u
		}),
		Et = r(Wt),
		Ct = Object.freeze({
			default: Et
		}),
		At = o(function (t) {
			var e = r(gt)("meta"),
				n = r(q),
				o = r(F),
				i = r(ut).f,
				f = 0,
				a = Object.isExtensible || function () {
					return !0
				},
				u = !r(K)(function () {
					return a(Object.preventExtensions({}))
				}),
				c = function (t) {
					i(t, e, {
						value: {
							i: "O" + ++f,
							w: {}
						}
					})
				},
				l = function (t, r) {
					if (!n(t)) return "symbol" == typeof t ? t : ("string" == typeof t ? "S" : "P") + t;
					if (!o(t, e)) {
						if (!a(t)) return "F";
						if (!r) return "E";
						c(t)
					}
					return t[e].i
				},
				s = function (t, n) {
					if (!o(t, e)) {
						if (!a(t)) return !0;
						if (!n) return !1;
						c(t)
					}
					return t[e].w
				},
				d = function (t) {
					return u && h.NEED && a(t) && !o(t, e) && c(t), t
				},
				h = t.exports = {
					KEY: e,
					NEED: !1,
					fastKey: l,
					getWeak: s,
					onFreeze: d
				}
		}),
		Tt = r(At),
		kt = At.KEY,
		Ft = At.NEED,
		_t = At.fastKey,
		Rt = At.getWeak,
		Kt = At.onFreeze,
		It = Object.freeze({
			default: Tt,
			KEY: kt,
			NEED: Ft,
			fastKey: _t,
			getWeak: Rt,
			onFreeze: Kt
		}),
		Ht = o(function (t) {
			var e = r(A),
				n = "__core-js_shared__",
				o = e[n] || (e[n] = {});
			t.exports = function (t) {
				return o[t] || (o[t] = {})
			}
		}),
		Nt = r(Ht),
		Mt = Object.freeze({
			default: Nt
		}),
		Ut = o(function (t) {
			var e = r(Mt)("wks"),
				n = r(gt),
				o = r(A).Symbol,
				i = "function" == typeof o,
				f = t.exports = function (t) {
					return e[t] || (e[t] = i && o[t] || (i ? o : n)("Symbol." + t))
				};
			f.store = e
		}),
		Yt = r(Ut),
		Dt = Object.freeze({
			default: Yt
		}),
		Bt = o(function (t) {
			var e = r(ut).f,
				n = r(F),
				o = r(Dt)("toStringTag");
			t.exports = function (t, r, i) {
				t && !n(t = i ? t : t.prototype, o) && e(t, o, {
					configurable: !0,
					value: r
				})
			}
		}),
		Jt = r(Bt),
		qt = Object.freeze({
			default: Jt
		}),
		Gt = o(function (t, e) {
			e.f = r(Dt)
		}),
		Lt = r(Gt),
		Qt = Gt.f,
		Vt = Object.freeze({
			default: Lt,
			f: Qt
		}),
		Xt = o(function (t) {
			t.exports = !1
		}),
		Zt = r(Xt),
		$t = Object.freeze({
			default: Zt
		}),
		te = o(function (t) {
			var e = r(A),
				n = r(D),
				o = r($t),
				i = r(Vt),
				f = r(ut).f;
			t.exports = function (t) {
				var r = n.Symbol || (n.Symbol = o ? {} : e.Symbol || {});
				"_" == t.charAt(0) || t in r || f(r, t, {
					value: i.f(t)
				})
			}
		}),
		ee = r(te),
		ne = Object.freeze({
			default: ee
		}),
		re = o(function (t) {
			var e = {}.toString;
			t.exports = function (t) {
				return e.call(t).slice(8, -1)
			}
		}),
		oe = r(re),
		ie = Object.freeze({
			default: oe
		}),
		fe = o(function (t) {
			var e = r(ie);
			t.exports = Object("z").propertyIsEnumerable(0) ? Object : function (t) {
				return "String" == e(t) ? t.split("") : Object(t)
			}
		}),
		ae = r(fe),
		ue = Object.freeze({
			default: ae
		}),
		ce = o(function (t) {
			t.exports = function (t) {
				if (void 0 == t) throw TypeError("Can't call method on  " + t);
				return t
			}
		}),
		le = r(ce),
		se = Object.freeze({
			default: le
		}),
		de = o(function (t) {
			var e = r(ue),
				n = r(se);
			t.exports = function (t) {
				return e(n(t))
			}
		}),
		he = r(de),
		ye = Object.freeze({
			default: he
		}),
		pe = o(function (t) {
			var e = Math.ceil,
				n = Math.floor;
			t.exports = function (t) {
				return isNaN(t = +t) ? 0 : (t > 0 ? n : e)(t)
			}
		}),
		be = r(pe),
		ge = Object.freeze({
			default: be
		}),
		ve = o(function (t) {
			var e = r(ge),
				n = Math.min;
			t.exports = function (t) {
				return t > 0 ? n(e(t), 9007199254740991) : 0
			}
		}),
		we = r(ve),
		me = Object.freeze({
			default: we
		}),
		xe = o(function (t) {
			var e = r(ge),
				n = Math.max,
				o = Math.min;
			t.exports = function (t, r) {
				return t = e(t), t < 0 ? n(t + r, 0) : o(t, r)
			}
		}),
		je = r(xe),
		Oe = Object.freeze({
			default: je
		}),
		Se = o(function (t) {
			var e = r(ye),
				n = r(me),
				o = r(Oe);
			t.exports = function (t) {
				return function (r, i, f) {
					var a, u = e(r),
						c = n(u.length),
						l = o(f, c);
					if (t && i != i) {
						for (; c > l;)
							if (a = u[l++], a != a) return !0
					} else
						for (; c > l; l++)
							if ((t || l in u) && u[l] === i) return t || l || 0;
					return !t && -1
				}
			}
		}),
		ze = r(Se),
		Pe = Object.freeze({
			default: ze
		}),
		We = o(function (t) {
			var e = r(Mt)("keys"),
				n = r(gt);
			t.exports = function (t) {
				return e[t] || (e[t] = n(t))
			}
		}),
		Ee = r(We),
		Ce = Object.freeze({
			default: Ee
		}),
		Ae = o(function (t) {
			var e = r(F),
				n = r(ye),
				o = r(Pe)(!1),
				i = r(Ce)("IE_PROTO");
			t.exports = function (t, r) {
				var f, a = n(t),
					u = 0,
					c = [];
				for (f in a) f != i && e(a, f) && c.push(f);
				for (; r.length > u;) e(a, f = r[u++]) && (~o(c, f) || c.push(f));
				return c
			}
		}),
		Te = r(Ae),
		ke = Object.freeze({
			default: Te
		}),
		Fe = o(function (t) {
			t.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
		}),
		_e = r(Fe),
		Re = Object.freeze({
			default: _e
		}),
		Ke = o(function (t) {
			var e = r(ke),
				n = r(Re);
			t.exports = Object.keys || function (t) {
				return e(t, n)
			}
		}),
		Ie = r(Ke),
		He = Object.freeze({
			default: Ie
		}),
		Ne = o(function (t) {
			var e = r(He),
				n = r(ye);
			t.exports = function (t, r) {
				for (var o, i = n(t), f = e(i), a = f.length, u = 0; a > u;)
					if (i[o = f[u++]] === r) return o
			}
		}),
		Me = r(Ne),
		Ue = Object.freeze({
			default: Me
		}),
		Ye = o(function (t, e) {
			e.f = Object.getOwnPropertySymbols
		}),
		De = r(Ye),
		Be = Ye.f,
		Je = Object.freeze({
			default: De,
			f: Be
		}),
		qe = o(function (t, e) {
			e.f = {}.propertyIsEnumerable
		}),
		Ge = r(qe),
		Le = qe.f,
		Qe = Object.freeze({
			default: Ge,
			f: Le
		}),
		Ve = o(function (t) {
			var e = r(He),
				n = r(Je),
				o = r(Qe);
			t.exports = function (t) {
				var r = e(t),
					i = n.f;
				if (i)
					for (var f, a = i(t), u = o.f, c = 0; a.length > c;) u.call(t, f = a[c++]) && r.push(f);
				return r
			}
		}),
		Xe = r(Ve),
		Ze = Object.freeze({
			default: Xe
		}),
		$e = o(function (t) {
			var e = r(ie);
			t.exports = Array.isArray || function (t) {
				return "Array" == e(t)
			}
		}),
		tn = r($e),
		en = Object.freeze({
			default: tn
		}),
		nn = o(function (t) {
			var e = r(ut),
				n = r(Q),
				o = r(He);
			t.exports = r(N) ? Object.defineProperties : function (t, r) {
				n(t);
				for (var i, f = o(r), a = f.length, u = 0; a > u;) e.f(t, i = f[u++], r[i]);
				return t
			}
		}),
		rn = r(nn),
		on = Object.freeze({
			default: rn
		}),
		fn = o(function (t) {
			t.exports = r(A).document && document.documentElement
		}),
		an = r(fn),
		un = Object.freeze({
			default: an
		}),
		cn = o(function (t) {
			var e = r(Q),
				n = r(on),
				o = r(Re),
				i = r(Ce)("IE_PROTO"),
				f = function () {},
				a = "prototype",
				u = function () {
					var t, e = r(Z)("iframe"),
						n = o.length,
						i = "<",
						f = ">";
					for (e.style.display = "none", r(un).appendChild(e), e.src = "javascript:", t = e.contentWindow.document, t.open(), t.write(i + "script" + f + "document.F=Object" + i + "/script" + f), t.close(), u = t.F; n--;) delete u[a][o[n]];
					return u()
				};
			t.exports = Object.create || function (t, r) {
				var o;
				return null !== t ? (f[a] = e(t), o = new f, f[a] = null, o[i] = t) : o = u(), void 0 === r ? o : n(o, r)
			}
		}),
		ln = r(cn),
		sn = Object.freeze({
			default: ln
		}),
		dn = o(function (t, e) {
			var n = r(ke),
				o = r(Re).concat("length", "prototype");
			e.f = Object.getOwnPropertyNames || function (t) {
				return n(t, o)
			}
		}),
		hn = r(dn),
		yn = dn.f,
		pn = Object.freeze({
			default: hn,
			f: yn
		}),
		bn = o(function (t) {
			var e = r(ye),
				n = r(pn).f,
				o = {}.toString,
				i = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [],
				f = function (t) {
					try {
						return n(t)
					} catch (t) {
						return i.slice()
					}
				};
			t.exports.f = function (t) {
				return i && "[object Window]" == o.call(t) ? f(t) : n(e(t))
			}
		}),
		gn = r(bn),
		vn = bn.f,
		wn = Object.freeze({
			default: gn,
			f: vn
		}),
		mn = o(function (t, e) {
			var n = r(Qe),
				o = r(st),
				i = r(ye),
				f = r(ot),
				a = r(F),
				u = r(et),
				c = Object.getOwnPropertyDescriptor;
			e.f = r(N) ? c : function (t, e) {
				if (t = i(t), e = f(e, !0), u) try {
					return c(t, e)
				} catch (t) {}
				if (a(t, e)) return o(!n.f.call(t, e), t[e])
			}
		}),
		xn = r(mn),
		jn = mn.f,
		On = Object.freeze({
			default: xn,
			f: jn
		}),
		Sn = o(function (t) {
			var e = r(A),
				n = r(F),
				o = r(N),
				i = r(Ct),
				f = r(mt),
				a = r(It).KEY,
				u = r(K),
				c = r(Mt),
				l = r(qt),
				s = r(gt),
				d = r(Dt),
				h = r(Vt),
				y = r(ne),
				p = r(Ue),
				b = r(Ze),
				g = r(en),
				v = r(Q),
				w = r(ye),
				m = r(ot),
				x = r(st),
				j = r(sn),
				O = r(wn),
				S = r(On),
				z = r(ut),
				P = r(He),
				W = S.f,
				E = z.f,
				C = O.f,
				T = e.Symbol,
				k = e.JSON,
				_ = k && k.stringify,
				R = "prototype",
				I = d("_hidden"),
				H = d("toPrimitive"),
				M = {}.propertyIsEnumerable,
				U = c("symbol-registry"),
				Y = c("symbols"),
				D = c("op-symbols"),
				B = Object[R],
				J = "function" == typeof T,
				q = e.QObject,
				G = !q || !q[R] || !q[R].findChild,
				L = o && u(function () {
					return 7 != j(E({}, "a", {
						get: function () {
							return E(this, "a", {
								value: 7
							}).a
						}
					})).a
				}) ? function (t, e, n) {
					var r = W(B, e);
					r && delete B[e], E(t, e, n), r && t !== B && E(B, e, r)
				} : E,
				V = function (t) {
					var e = Y[t] = j(T[R]);
					return e._k = t, e
				},
				X = J && "symbol" == typeof T.iterator ? function (t) {
					return "symbol" == typeof t
				} : function (t) {
					return t instanceof T
				},
				Z = function (t, e, r) {
					return t === B && Z(D, e, r), v(t), e = m(e, !0), v(r), n(Y, e) ? (r.enumerable ? (n(t, I) && t[I][e] && (t[I][e] = !1), r = j(r, {
						enumerable: x(0, !1)
					})) : (n(t, I) || E(t, I, x(1, {})), t[I][e] = !0), L(t, e, r)) : E(t, e, r)
				},
				$ = function (t, e) {
					v(t);
					for (var n, r = b(e = w(e)), o = 0, i = r.length; i > o;) Z(t, n = r[o++], e[n]);
					return t
				},
				tt = function (t, e) {
					return void 0 === e ? j(t) : $(j(t), e)
				},
				et = function (t) {
					var e = M.call(this, t = m(t, !0));
					return !(this === B && n(Y, t) && !n(D, t)) && (!(e || !n(this, t) || !n(Y, t) || n(this, I) && this[I][t]) || e)
				},
				nt = function (t, e) {
					if (t = w(t), e = m(e, !0), t !== B || !n(Y, e) || n(D, e)) {
						var r = W(t, e);
						return !r || !n(Y, e) || n(t, I) && t[I][e] || (r.enumerable = !0), r
					}
				},
				rt = function (t) {
					for (var e, r = C(w(t)), o = [], i = 0; r.length > i;) n(Y, e = r[i++]) || e == I || e == a || o.push(e);
					return o
				},
				it = function (t) {
					for (var e, r = t === B, o = C(r ? D : w(t)), i = [], f = 0; o.length > f;) !n(Y, e = o[f++]) || r && !n(B, e) || i.push(Y[e]);
					return i
				};
			J || (T = function () {
				if (this instanceof T) throw TypeError("Symbol is not a constructor!");
				var t = s(arguments.length > 0 ? arguments[0] : void 0),
					e = function (r) {
						this === B && e.call(D, r), n(this, I) && n(this[I], t) && (this[I][t] = !1), L(this, t, x(1, r))
					};
				return o && G && L(B, t, {
					configurable: !0,
					set: e
				}), V(t)
			}, f(T[R], "toString", function () {
				return this._k
			}), S.f = nt, z.f = Z, r(pn).f = O.f = rt, r(Qe).f = et, r(Je).f = it, o && !r($t) && f(B, "propertyIsEnumerable", et, !0), h.f = function (t) {
				return V(d(t))
			}), i(i.G + i.W + i.F * !J, {
				Symbol: T
			});
			for (var ft = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), at = 0; ft.length > at;) d(ft[at++]);
			for (var ft = P(d.store), at = 0; ft.length > at;) y(ft[at++]);
			i(i.S + i.F * !J, "Symbol", {
				for: function (t) {
					return n(U, t += "") ? U[t] : U[t] = T(t)
				},
				keyFor: function (t) {
					if (X(t)) return p(U, t);
					throw TypeError(t + " is not a symbol!")
				},
				useSetter: function () {
					G = !0
				},
				useSimple: function () {
					G = !1
				}
			}), i(i.S + i.F * !J, "Object", {
				create: tt,
				defineProperty: Z,
				defineProperties: $,
				getOwnPropertyDescriptor: nt,
				getOwnPropertyNames: rt,
				getOwnPropertySymbols: it
			}), k && i(i.S + i.F * (!J || u(function () {
				var t = T();
				return "[null]" != _([t]) || "{}" != _({
					a: t
				}) || "{}" != _(Object(t))
			})), "JSON", {
				stringify: function (t) {
					if (void 0 !== t && !X(t)) {
						for (var e, n, r = [t], o = 1; arguments.length > o;) r.push(arguments[o++]);
						return e = r[1], "function" == typeof e && (n = e), !n && g(e) || (e = function (t, e) {
							if (n && (e = n.call(this, t, e)), !X(e)) return e
						}), r[1] = e, _.apply(k, r)
					}
				}
			}), T[R][H] || r(yt)(T[R], H, T[R].valueOf), l(T, "Symbol"), l(Math, "Math", !0), l(e.JSON, "JSON", !0)
		});
	r(Sn);
	var zn = o(function (t) {
			var e = r(ie),
				n = r(Dt)("toStringTag"),
				o = "Arguments" == e(function () {
					return arguments
				}()),
				i = function (t, e) {
					try {
						return t[e]
					} catch (t) {}
				};
			t.exports = function (t) {
				var r, f, a;
				return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof (f = i(r = Object(t), n)) ? f : o ? e(r) : "Object" == (a = e(r)) && "function" == typeof r.callee ? "Arguments" : a
			}
		}),
		Pn = r(zn),
		Wn = Object.freeze({
			default: Pn
		}),
		En = o(function (t) {
			var e = r(Wn),
				n = {};
			n[r(Dt)("toStringTag")] = "z", n + "" != "[object z]" && r(mt)(Object.prototype, "toString", function () {
				return "[object " + e(this) + "]"
			}, !0)
		});
	r(En);
	var Cn = o(function (t) {
		t.exports = r(D).Symbol
	});
	r(Cn);
	var An = o(function (t) {
			var e = r(Dt)("unscopables"),
				n = Array.prototype;
			void 0 == n[e] && r(yt)(n, e, {}), t.exports = function (t) {
				n[e][t] = !0
			}
		}),
		Tn = r(An),
		kn = Object.freeze({
			default: Tn
		}),
		Fn = o(function (t) {
			t.exports = function (t, e) {
				return {
					value: e,
					done: !!t
				}
			}
		}),
		_n = r(Fn),
		Rn = Object.freeze({
			default: _n
		}),
		Kn = o(function (t) {
			t.exports = {}
		}),
		In = r(Kn),
		Hn = Object.freeze({
			default: In
		}),
		Nn = o(function (t) {
			var e = r(sn),
				n = r(st),
				o = r(qt),
				i = {};
			r(yt)(i, r(Dt)("iterator"), function () {
				return this
			}), t.exports = function (t, r, f) {
				t.prototype = e(i, {
					next: n(1, f)
				}), o(t, r + " Iterator")
			}
		}),
		Mn = r(Nn),
		Un = Object.freeze({
			default: Mn
		}),
		Yn = o(function (t) {
			var e = r(se);
			t.exports = function (t) {
				return Object(e(t))
			}
		}),
		Dn = r(Yn),
		Bn = Object.freeze({
			default: Dn
		}),
		Jn = o(function (t) {
			var e = r(F),
				n = r(Bn),
				o = r(Ce)("IE_PROTO"),
				i = Object.prototype;
			t.exports = Object.getPrototypeOf || function (t) {
				return t = n(t), e(t, o) ? t[o] : "function" == typeof t.constructor && t instanceof t.constructor ? t.constructor.prototype : t instanceof Object ? i : null
			}
		}),
		qn = r(Jn),
		Gn = Object.freeze({
			default: qn
		}),
		Ln = o(function (t) {
			var e = r($t),
				n = r(Ct),
				o = r(mt),
				i = r(yt),
				f = r(F),
				a = r(Hn),
				u = r(Un),
				c = r(qt),
				l = r(Gn),
				s = r(Dt)("iterator"),
				d = !([].keys && "next" in [].keys()),
				h = "@@iterator",
				y = "keys",
				p = "values",
				b = function () {
					return this
				};
			t.exports = function (t, r, g, v, w, m, x) {
				u(g, r, v);
				var j, O, S, z = function (t) {
						if (!d && t in C) return C[t];
						switch (t) {
							case y:
								return function () {
									return new g(this, t)
								};
							case p:
								return function () {
									return new g(this, t)
								}
						}
						return function () {
							return new g(this, t)
						}
					},
					P = r + " Iterator",
					W = w == p,
					E = !1,
					C = t.prototype,
					A = C[s] || C[h] || w && C[w],
					T = A || z(w),
					k = w ? W ? z("entries") : T : void 0,
					F = "Array" == r ? C.entries || A : A;
				if (F && (S = l(F.call(new t)), S !== Object.prototype && (c(S, P, !0), e || f(S, s) || i(S, s, b))), W && A && A.name !== p && (E = !0, T = function () {
						return A.call(this)
					}), e && !x || !d && !E && C[s] || i(C, s, T), a[r] = T, a[P] = b, w)
					if (j = {
							values: W ? T : z(p),
							keys: m ? T : z(y),
							entries: k
						}, x)
						for (O in j) O in C || o(C, O, j[O]);
					else n(n.P + n.F * (d || E), r, j);
				return j
			}
		}),
		Qn = r(Ln),
		Vn = Object.freeze({
			default: Qn
		}),
		Xn = o(function (t) {
			var e = r(kn),
				n = r(Rn),
				o = r(Hn),
				i = r(ye);
			t.exports = r(Vn)(Array, "Array", function (t, e) {
				this._t = i(t), this._i = 0, this._k = e
			}, function () {
				var t = this._t,
					e = this._k,
					r = this._i++;
				return !t || r >= t.length ? (this._t = void 0, n(1)) : "keys" == e ? n(0, r) : "values" == e ? n(0, t[r]) : n(0, [r, t[r]])
			}, "values"), o.Arguments = o.Array, e("keys"), e("values"), e("entries")
		});
	r(Xn);
	var Zn = o(function (t) {
		t.exports = r(D).Array.values
	});
	r(Zn);
	var $n = o(function (t) {
			var e = r(He),
				n = r(Je),
				o = r(Qe),
				i = r(Bn),
				f = r(ue),
				a = Object.assign;
			t.exports = !a || r(K)(function () {
				var t = {},
					e = {},
					n = Symbol(),
					r = "abcdefghijklmnopqrst";
				return t[n] = 7, r.split("").forEach(function (t) {
					e[t] = t
				}), 7 != a({}, t)[n] || Object.keys(a({}, e)).join("") != r
			}) ? function (t, r) {
				for (var a = i(t), u = arguments.length, c = 1, l = n.f, s = o.f; u > c;)
					for (var d, h = f(arguments[c++]), y = l ? e(h).concat(l(h)) : e(h), p = y.length, b = 0; p > b;) s.call(h, d = y[b++]) && (a[d] = h[d]);
				return a
			} : a
		}),
		tr = r($n),
		er = Object.freeze({
			default: tr
		}),
		nr = o(function (t) {
			var e = r(Ct);
			e(e.S + e.F, "Object", {
				assign: r(er)
			})
		});
	r(nr);
	var rr = o(function (t) {
		t.exports = r(D).Object.assign
	});
	r(rr);
	var or = o(function (t) {
		var e = r(Ct);
		e(e.S, "Array", {
			isArray: r(en)
		})
	});
	r(or);
	var ir = o(function (t) {
		t.exports = r(D).Array.isArray
	});
	r(ir);
	var fr = o(function (t) {
			var e = r(He),
				n = r(ye),
				o = r(Qe).f;
			t.exports = function (t) {
				return function (r) {
					for (var i, f = n(r), a = e(f), u = a.length, c = 0, l = []; u > c;) o.call(f, i = a[c++]) && l.push(t ? [i, f[i]] : f[i]);
					return l
				}
			}
		}),
		ar = r(fr),
		ur = Object.freeze({
			default: ar
		}),
		cr = o(function (t) {
			var e = r(Ct),
				n = r(ur)(!1);
			e(e.S, "Object", {
				values: function (t) {
					return n(t)
				}
			})
		});
	r(cr);
	var lr = o(function (t) {
		t.exports = r(D).Object.values
	});
	r(lr);
	var sr, dr, hr, yr;
	t.API.autoTable = function (t, e) {
		var n = arguments.length <= 2 || void 0 === arguments[2] ? {} : arguments[2];
		i(t, e, n), sr = this, hr = W.initSettings(n), dr = {
			x: hr.margin.left,
			y: hr.startY === !1 ? hr.margin.top : hr.startY
		};
		var r = {
			textColor: 30,
			fontSize: sr.internal.getFontSize(),
			fontStyle: sr.internal.getFont().fontStyle
		};
		f(t, e), a(this, sr.internal.pageSize.width);
		var o = yr.rows[0] && "auto" === hr.pageBreak ? yr.rows[0].height : 0,
			u = hr.startY + hr.margin.bottom + yr.headerRow.height + o;
		"avoid" === hr.pageBreak && (u += yr.height);
		var c = sr.internal.pageSize.height;
		return ("always" === hr.pageBreak && hr.startY !== !1 || hr.startY !== !1 && u > c) && (this.addPage(this.addPage), dr.y = hr.margin.top), y(r), hr.beforePageContent(p()), hr.drawHeaderRow(yr.headerRow, p({
			row: yr.headerRow
		})) !== !1 && d(yr.headerRow, hr.drawHeaderCell), y(r), s(this.addPage), hr.afterPageContent(p()), y(r), this
	}, t.API.autoTableEndPosY = function () {
		return "undefined" == typeof dr || "undefined" == typeof dr.y ? 0 : dr.y
	}, t.API.autoTableHtmlToJson = function (t, e) {
		e = e || !1;
		for (var n = {}, r = [], o = t.rows[0], i = 0; i < o.cells.length; i++) {
			var f = o.cells[i],
				a = window.getComputedStyle(f);
			(e || "none" !== a.display) && (n[i] = f ? f.textContent.trim() : "")
		}
		for (var u = 1; u < t.rows.length; u++) {
			var c = t.rows[u],
				a = window.getComputedStyle(c);
			if (e || "none" !== a.display) {
				var l = [],
					s = !0,
					d = !1,
					h = void 0;
				try {
					for (var y, p = Object.keys(n)[Symbol.iterator](); !(s = (y = p.next()).done); s = !0) {
						var b = y.value,
							f = c.cells[b],
							g = f ? f.textContent.trim() : "";
						l.push(g)
					}
				} catch (t) {
					d = !0, h = t
				} finally {
					try {
						!s && p.return && p.return()
					} finally {
						if (d) throw h
					}
				}
				r.push(l)
			}
		}
		return {
			columns: Object.values(n),
			rows: r,
			data: r
		}
	}, t.API.autoTableAddPage = function () {
		c(sr.addPage)
	}, t.API.autoTableText = function (t, e, n, r) {
		"number" == typeof e && "number" == typeof n || console.error("The x and y parameters are required. Missing for the text: ", t);
		var o = this.internal.getFontSize() / this.internal.scaleFactor,
			i = z,
			f = /\r\n|\r|\n/g,
			a = null,
			u = 1;
		if ("middle" !== r.valign && "bottom" !== r.valign && "center" !== r.halign && "right" !== r.halign || (a = "string" == typeof t ? t.split(f) : t, u = a.length || 1), n += o * (2 - i), "middle" === r.valign ? n -= u / 2 * o * i : "bottom" === r.valign && (n -= u * o * i), "center" === r.halign || "right" === r.halign) {
			var c = o;
			if ("center" === r.halign && (c *= .5), u >= 1) {
				for (var l = 0; l < a.length; l++) this.text(a[l], e - this.getStringUnitWidth(a[l]) * c, n), n += o;
				return sr
			}
			e -= this.getStringUnitWidth(t) * c
		}
		return this.text(t, e, n), this
	}
});
