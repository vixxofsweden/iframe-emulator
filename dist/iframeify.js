(function(c, e, r, a) {
    var o = "iframeify", i = {
        containerSelector: ".ifr-iframe",
        classPrefix: "ifr",
        stylesheetClass: false,
        bodyClass: "ifr-active",
        onWindowResize: false
    }, y = {
        breakpoints: {},
        hasSetBreakpoints: false,
        mediaQueryRules: false,
        iframes: [],
        stylesheets: [],
        styleClass: "ifr-styles",
        styleElement: [],
        eventNameSpace: "plugin_" + o,
        plugin: false,
        pluginElement: false,
        onWindowResize: false
    };
    function n(e, t) {
        this.element = e;
        this.$element = c(e);
        this.options = c.extend({}, i, t);
        this._defaults = i;
        this._name = o;
        this.init();
    }
    c.extend(n.prototype = {
        init: function() {
            var s;
            if (this && this.options) {
                s = this;
            } else if (y.plugin && y.plugin.options) {
                s = y.plugin;
            } else {
                throw new Error("No plugin object found");
            }
            var e = s.options.classPrefix;
            var t = "plugin_" + o;
            var i = c(s.options.containerSelector);
            y.iframes = i;
            y.classPrefix = s.options.classPrefix;
            y.onWindowResize = s.options.onWindowResize;
            y.styleClass = s.options.classPrefix + "-styles";
            y.plugin = s;
            y.pluginElement = this.$element;
            var a = r.styleSheets;
            var n = a;
            if (s.options.stylesheetClass) {
                var l = s.options.stylesheetClass;
                n = c.map(a, function(e, t) {
                    var i = c(e.ownerNode);
                    if (i.hasClass(l)) {
                        return e;
                    }
                });
            }
            y.stylesheets = n;
            s.setMediaQueries(s);
            c.each(y.iframes, function(e, t) {
                var i = c(t);
                s.initIframe(i, s);
            });
        },
        initIframe: function(t, i) {
            t.on("mousedown." + y.eventNameSpace, function(e) {
                c(r).on("mousemove." + y.eventNameSpace, function() {
                    i.matchIframeWithMediaQuery(t);
                });
                c(r).on("mouseup." + y.eventNameSpace, function() {
                    c(r).off("mousemove." + y.eventNameSpace);
                });
            });
            i.matchIframeWithMediaQuery(t);
        },
        setMediaQueries: function(e) {
            if (y.styleElement && y.styleElement.length < 1) {
                var t = c("<style></style>").addClass(y.styleClass);
                c(r).find("head").append(t);
                y.styleElement = t;
            }
            if (y.hasSetBreakpoints && y.mediaQueryRules) {
                y.styleElement.append(y.mediaQueryRules);
            } else if (!y.hasSetBreakpoints && !y.mediaQueryRules) {
                var i = y.stylesheets;
                var p = "";
                c.each(i, function(d, u) {
                    var e = u.cssRules.length;
                    var h = 0;
                    var m = 0;
                    c.each(u.cssRules, function(e, t) {
                        m++;
                        if (t.media && t.media[0] && (t.media[0].indexOf("max-width") > -1 || t.media[0].indexOf("min-width") > -1)) {
                            var i = y.classPrefix + "-ss" + d + "r" + e;
                            var s = "";
                            var a = "." + i;
                            c.each(t.cssRules, function(e, t) {
                                s = s + "" + a + " " + t.cssText;
                            });
                            p = p + s;
                            y.styleElement.append(s);
                            var n = t.media[0].match(/[0-9]+/g);
                            n = c.map(n, Number);
                            var l = t;
                            var r = e;
                            var o = r - h;
                            var f = u;
                            y.breakpoints[i] = {
                                maxWidth: false,
                                minWidth: false,
                                deletedRule: l,
                                deletedRulePosition: o,
                                addRulePosition: r,
                                deletedFromStylesheet: f,
                                px: n
                            };
                            if (t.media[0].indexOf("max-width") > -1 && t.media[0].indexOf("min-width") > -1) {
                                y.breakpoints[i].maxWidth = true;
                                y.breakpoints[i].minWidth = true;
                                h++;
                            } else if (t.media[0].indexOf("max-width") > -1) {
                                y.breakpoints[i].maxWidth = true;
                            } else if (t.media[0].indexOf("min-width") > -1) {
                                y.breakpoints[i].minWidth = true;
                                h++;
                            }
                        }
                    });
                });
                y.mediaQueryRules = p;
                y.hasSetBreakpoints = true;
            }
            c("body").addClass(y.plugin.options.bodyClass);
        },
        matchIframeWithMediaQuery: function(o) {
            var f = o.width();
            c.each(y.breakpoints, function(e, t) {
                var i = t.hasBeenDeleted;
                var s = e;
                var a = t.px;
                var n = t.type;
                if (t.maxWidth && t.minWidth) {
                    if (!i) {
                        t.deletedFromStylesheet.deleteRule(t.deletedRulePosition);
                    }
                    t.hasBeenDeleted = true;
                    var l = Math.max.apply(null, a);
                    var r = Math.min.apply(null, a);
                    if (f > r && f < l) {
                        if (!o.hasClass(s)) {
                            o.addClass(s);
                        }
                    } else {
                        o.removeClass(s);
                    }
                } else if (t.maxWidth) {
                    if (f < a) {
                        if (!o.hasClass(s)) {
                            o.addClass(s);
                        }
                    } else if (f > a) {
                        o.removeClass(s);
                    }
                } else if (t.minWidth) {
                    if (!i) {
                        t.deletedFromStylesheet.deleteRule(t.deletedRulePosition);
                    }
                    t.hasBeenDeleted = true;
                    if (f > a) {
                        if (!o.hasClass(s)) {
                            o.addClass(s);
                        }
                    } else if (f < a) {
                        o.removeClass(s);
                    }
                }
            });
            if (y.onWindowResize) {
                c(e).trigger("resize");
            }
        },
        unsetAll: function() {
            c("body").removeClass(y.plugin.options.bodyClass);
            c.each(y.breakpoints, function(e, t) {
                var i = e;
                var s = t.px;
                var a = t.type;
                if (t["hasBeenDeleted"]) {
                    t.deletedFromStylesheet.insertRule(t.deletedRule.cssText, t.addRulePosition);
                    t["hasBeenDeleted"] = false;
                    y.iframes.removeClass(e);
                    y.plugin.resetStyle(y.iframes);
                }
            });
            y.styleElement.text("");
        },
        setIframeSize: function(e) {
            var s = false;
            var a = false;
            if (e) {
                if (e.width) {
                    s = e.width;
                }
                if (e.height) {
                    a = e.height;
                }
            }
            if (s || a) {
                c.each(y.iframes, function(e, t) {
                    var i = c(t);
                    if (s) {
                        i.width(s);
                    }
                    if (a) {
                        i.height(a);
                    }
                    y.plugin.matchIframeWithMediaQuery(i);
                });
            }
        },
        resetIframesSize: function() {
            c.each(y.iframes, function(e, t) {
                var i = c(t);
                y.plugin.resetStyle(i);
                y.plugin.matchIframeWithMediaQuery(i);
            });
        },
        resetStyle: function(e) {
            c.each(e, function(e, t) {
                var i = c(t);
                i.attr("style", "");
            });
        },
        resetAttribute: function(e, i) {
            c.each(e, function(e, t) {
                $el = c(t);
                $el.attr(i, "false");
            });
        }
    });
    c.fn[o] = function(e) {
        if (typeof arguments[0] === "string") {
            var t = arguments[0];
            var i = Array.prototype.slice.call(arguments, 1);
            var s;
            this.each(function() {
                if (c.data(this, "plugin_" + o) && typeof c.data(this, "plugin_" + o)[t] === "function") {
                    s = c.data(this, "plugin_" + o)[t].apply(this, i);
                } else {
                    throw new Error("Method " + t + " does not exist on jQuery." + o);
                }
            });
            if (s !== a) {
                return s;
            } else {
                return this;
            }
        } else if (typeof e === "object" || !e) {
            return this.each(function() {
                if (!c.data(this, "plugin_" + o)) {
                    c.data(this, "plugin_" + o, new n(this, e));
                }
            });
        }
    };
})(jQuery, window, document);