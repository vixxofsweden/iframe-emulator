(function(c, e, n, l) {
    var r = "iframeify", t = {
        containerSelector: ".ifr-iframe",
        classPrefix: "ifr",
        stylesheetClass: false,
        bodyClass: "ifr-active",
        onWindowResize: false
    }, v = {
        breakpoints: {},
        hasSetBreakpoints: false,
        mediaQueryRules: false,
        iframes: [],
        stylesheets: [],
        styleClass: "ifr-styles",
        styleElement: [],
        eventNameSpace: "plugin_" + r,
        plugin: false,
        pluginElement: false,
        onWindowResize: false
    };
    function o(e, i) {
        this.element = e;
        this.$element = c(e);
        this.options = c.extend({}, t, i);
        this._defaults = t;
        this._name = r;
        this.init();
    }
    c.extend(o.prototype = {
        init: function() {
            var s;
            if (this && this.options) {
                s = this;
            } else if (v.plugin && v.plugin.options) {
                s = v.plugin;
            } else {
                throw new Error("No plugin object found");
            }
            var e = s.options.classPrefix;
            var i = "plugin_" + r;
            var t = c(s.options.containerSelector);
            v.iframes = t;
            v.classPrefix = s.options.classPrefix;
            v.onWindowResize = s.options.onWindowResize;
            v.styleClass = s.options.classPrefix + "-styles";
            v.plugin = s;
            v.pluginElement = this.$element;
            s.initStylesheets();
            s.setMediaQueries(s);
            c.each(v.iframes, function(e, i) {
                var t = c(i);
                s.initIframe(t, s);
            });
        },
        initStylesheets: function() {
            var e = n.styleSheets;
            var s = v.plugin.options.stylesheetClass;
            var i = e;
            if (s) {
                i = c.map(e, function(e, i) {
                    var t = c(e.ownerNode);
                    if (t.hasClass(s)) {
                        return e;
                    }
                });
            }
            v.stylesheets = i;
        },
        initIframe: function(i, t) {
            var e = "mousedown." + v.eventNameSpace;
            var s = "mousemove." + v.eventNameSpace;
            var a = "mouseup." + v.eventNameSpace;
            i.off(e).on(e, function(e) {
                c(n).off(s).on(s, function() {
                    t.matchMediaQueries(i);
                });
                c(n).off(a).on(a, function() {
                    c(n).off(s);
                });
            });
            t.matchMediaQueries(i);
        },
        setMediaQueries: function(e) {
            if (v.styleElement && v.styleElement.length < 1) {
                var i = c("<style></style>").addClass(v.styleClass);
                c(n).find("head").append(i);
                v.styleElement = i;
            }
            if (v.hasSetBreakpoints && v.mediaQueryRules) {
                v.styleElement.append(v.mediaQueryRules);
            } else if (!v.hasSetBreakpoints && !v.mediaQueryRules) {
                var t = v.stylesheets;
                var p = "";
                c.each(t, function(u, d) {
                    var e = d.cssRules.length;
                    var h = 0;
                    var m = 0;
                    c.each(d.cssRules, function(e, i) {
                        m++;
                        if (i.media && i.media[0] && (i.media[0].indexOf("max-width") > -1 || i.media[0].indexOf("min-width") > -1)) {
                            var t = v.classPrefix + "-ss" + u + "r" + e;
                            var n = "";
                            var l = "." + t;
                            c.each(i.cssRules, function(e, i) {
                                if (i.selectorText) {
                                    var t = i.selectorText;
                                    var s = t.split(",");
                                    var a = i.cssText.match(/\{.*\}/);
                                    c.each(s, function(e, i) {
                                        n = n + " " + l + " " + i + a;
                                    });
                                }
                            });
                            p = p + n;
                            v.styleElement.append(n);
                            var s = i.media[0].match(/[0-9]+/g);
                            s = c.map(s, Number);
                            var a = i;
                            var r = e;
                            var o = r - h;
                            var f = d;
                            v.breakpoints[t] = {
                                maxWidth: false,
                                minWidth: false,
                                deletedRule: a,
                                deletedRulePosition: o,
                                addRulePosition: r,
                                deletedFromStylesheet: f,
                                px: s
                            };
                            if (i.media[0].indexOf("max-width") > -1 && i.media[0].indexOf("min-width") > -1) {
                                v.breakpoints[t].maxWidth = true;
                                v.breakpoints[t].minWidth = true;
                                h++;
                            } else if (i.media[0].indexOf("max-width") > -1) {
                                v.breakpoints[t].maxWidth = true;
                            } else if (i.media[0].indexOf("min-width") > -1) {
                                v.breakpoints[t].minWidth = true;
                                h++;
                            }
                        }
                    });
                });
                v.mediaQueryRules = p;
                v.hasSetBreakpoints = true;
            }
            c("body").addClass(v.plugin.options.bodyClass);
        },
        matchMediaQueries: function(o) {
            var f = o.width();
            c.each(v.breakpoints, function(e, i) {
                var t = i.hasBeenDeleted;
                var s = e;
                var a = i.px;
                var n = i.type;
                if (i.maxWidth && i.minWidth) {
                    if (!t) {
                        i.deletedFromStylesheet.deleteRule(i.deletedRulePosition);
                    }
                    i.hasBeenDeleted = true;
                    var l = Math.max.apply(null, a);
                    var r = Math.min.apply(null, a);
                    if (f > r && f < l) {
                        if (!o.hasClass(s)) {
                            o.addClass(s);
                        }
                    } else {
                        o.removeClass(s);
                    }
                } else if (i.maxWidth) {
                    if (f < a) {
                        if (!o.hasClass(s)) {
                            o.addClass(s);
                        }
                    } else if (f > a) {
                        o.removeClass(s);
                    }
                } else if (i.minWidth) {
                    if (!t) {
                        i.deletedFromStylesheet.deleteRule(i.deletedRulePosition);
                    }
                    i.hasBeenDeleted = true;
                    if (f > a) {
                        if (!o.hasClass(s)) {
                            o.addClass(s);
                        }
                    } else if (f < a) {
                        o.removeClass(s);
                    }
                }
            });
            if (v.onWindowResize) {
                c(e).trigger("resize");
            }
            c(n).trigger(r + ".matchMediaQueries", o);
        },
        unsetQueries: function() {
            c("body").removeClass(v.plugin.options.bodyClass);
            c.each(v.breakpoints, function(e, i) {
                var t = e;
                var s = i.px;
                var a = i.type;
                if (i["hasBeenDeleted"]) {
                    i.deletedFromStylesheet.insertRule(i.deletedRule.cssText, i.addRulePosition);
                    i["hasBeenDeleted"] = false;
                    v.iframes.removeClass(e);
                }
            });
            v.styleElement.text("");
        },
        resetQueries: function() {
            v.hasSetBreakpoints = false;
            v.mediaQueryRules = false;
            v.breakpoints = {};
        },
        destroy: function() {
            v.plugin.unsetQueries();
            v.plugin.resetQueries();
            v.plugin.resetStyle(v.iframes);
            var e = "mousedown." + v.eventNameSpace;
            var i = "mousemove." + v.eventNameSpace;
            var t = "mouseup." + v.eventNameSpace;
            v.iframes.off(e);
            c(n).off(i);
            c(n).off(t);
        },
        setIframeSize: function(e, i) {
            var s = false;
            var a = false;
            var t = v.iframes;
            if (e) {
                if (e.width) {
                    s = e.width;
                }
                if (e.height) {
                    a = e.height;
                }
            }
            if (i && i.length > 0 && c(i).is(c(v.plugin.options.containerSelector))) {
                t = i;
            }
            if (s || a) {
                c.each(t, function(e, i) {
                    var t = c(i);
                    if (s) {
                        t.width(s);
                    }
                    if (a) {
                        t.height(a);
                    }
                    v.plugin.matchMediaQueries(t);
                });
            }
        },
        resetIframesSize: function(e) {
            var i = v.iframes;
            if (e && c(e).is(c(v.plugin.options.containerSelector))) {
                i = e;
            }
            c.each(i, function(e, i) {
                var t = c(i);
                v.plugin.resetStyle(t);
                v.plugin.matchMediaQueries(t);
            });
        },
        resetStyle: function(e) {
            c.each(e, function(e, i) {
                var t = c(i);
                t.attr("style", "");
            });
        },
        resetAttribute: function(e, t) {
            c.each(e, function(e, i) {
                $el = c(i);
                $el.attr(t, "false");
            });
        }
    });
    c.fn[r] = function(e) {
        if (typeof arguments[0] === "string") {
            var i = arguments[0];
            var t = Array.prototype.slice.call(arguments, 1);
            var s = Array.prototype.slice.call(arguments, 2);
            var a;
            this.each(function() {
                if (c.data(this, "plugin_" + r) && typeof c.data(this, "plugin_" + r)[i] === "function") {
                    a = c.data(this, "plugin_" + r)[i].apply(this, t, s);
                } else {
                    throw new Error("Method " + i + " does not exist on jQuery." + r);
                }
            });
            if (a !== l) {
                return a;
            } else {
                return this;
            }
        } else if (typeof e === "object" || !e) {
            return this.each(function() {
                if (!c.data(this, "plugin_" + r)) {
                    c.data(this, "plugin_" + r, new o(this, e));
                }
            });
        }
    };
})(jQuery, window, document);