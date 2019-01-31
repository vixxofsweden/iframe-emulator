(function(c, e, r, n) {
    var u = "iframeify", t = {
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
        eventNameSpace: "plugin_" + u,
        plugin: false,
        pluginElement: false,
        onWindowResize: false
    };
    function l(e, i) {
        this.element = e;
        this.$element = c(e);
        this.options = c.extend({}, t, i);
        this._defaults = t;
        this._name = u;
        this.init();
    }
    c.extend(l.prototype = {
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
            var i = "plugin_" + u;
            var t = c(s.options.containerSelector);
            v.iframes = t;
            v.classPrefix = s.options.classPrefix;
            v.onWindowResize = s.options.onWindowResize;
            v.styleClass = s.options.classPrefix + "-styles";
            v.plugin = s;
            v.pluginElement = this.$element;
            var a = r.styleSheets;
            var n = a;
            if (s.options.stylesheetClass) {
                var l = s.options.stylesheetClass;
                n = c.map(a, function(e, i) {
                    var t = c(e.ownerNode);
                    if (t.hasClass(l)) {
                        return e;
                    }
                });
            }
            v.stylesheets = n;
            s.setMediaQueries(s);
            c.each(v.iframes, function(e, i) {
                var t = c(i);
                s.initIframe(t, s);
            });
        },
        initIframe: function(i, t) {
            i.on("mousedown." + v.eventNameSpace, function(e) {
                c(r).on("mousemove." + v.eventNameSpace, function() {
                    t.matchMediaQueries(i);
                });
                c(r).on("mouseup." + v.eventNameSpace, function() {
                    c(r).off("mousemove." + v.eventNameSpace);
                });
            });
            t.matchMediaQueries(i);
        },
        setMediaQueries: function(e) {
            if (v.styleElement && v.styleElement.length < 1) {
                var i = c("<style></style>").addClass(v.styleClass);
                c(r).find("head").append(i);
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
            c(r).trigger(u + ".matchMediaQueries", o);
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
    c.fn[u] = function(e) {
        if (typeof arguments[0] === "string") {
            var i = arguments[0];
            var t = Array.prototype.slice.call(arguments, 1);
            var s = Array.prototype.slice.call(arguments, 2);
            var a;
            this.each(function() {
                if (c.data(this, "plugin_" + u) && typeof c.data(this, "plugin_" + u)[i] === "function") {
                    a = c.data(this, "plugin_" + u)[i].apply(this, t, s);
                } else {
                    throw new Error("Method " + i + " does not exist on jQuery." + u);
                }
            });
            if (a !== n) {
                return a;
            } else {
                return this;
            }
        } else if (typeof e === "object" || !e) {
            return this.each(function() {
                if (!c.data(this, "plugin_" + u)) {
                    c.data(this, "plugin_" + u, new l(this, e));
                }
            });
        }
    };
})(jQuery, window, document);