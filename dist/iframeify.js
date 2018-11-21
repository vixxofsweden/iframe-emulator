(function(p, e, r, n) {
    var o = "iframeify", i = {
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
        eventNameSpace: "plugin_" + o,
        plugin: false,
        pluginElement: false,
        onWindowResize: false
    };
    function l(e, t) {
        this.element = e;
        this.$element = p(e);
        this.options = p.extend({}, i, t);
        this._defaults = i;
        this._name = o;
        this.init();
    }
    p.extend(l.prototype = {
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
            var t = "plugin_" + o;
            var i = p(s.options.containerSelector);
            v.iframes = i;
            v.classPrefix = s.options.classPrefix;
            v.onWindowResize = s.options.onWindowResize;
            v.styleClass = s.options.classPrefix + "-styles";
            v.plugin = s;
            v.pluginElement = this.$element;
            var a = r.styleSheets;
            var n = a;
            if (s.options.stylesheetClass) {
                var l = s.options.stylesheetClass;
                n = p.map(a, function(e, t) {
                    var i = p(e.ownerNode);
                    if (i.hasClass(l)) {
                        return e;
                    }
                });
            }
            v.stylesheets = n;
            s.setMediaQueries(s);
            p.each(v.iframes, function(e, t) {
                var i = p(t);
                s.initIframe(i, s);
            });
        },
        initIframe: function(t, i) {
            t.on("mousedown." + v.eventNameSpace, function(e) {
                p(r).on("mousemove." + v.eventNameSpace, function() {
                    i.matchIframeWithMediaQuery(t);
                });
                p(r).on("mouseup." + v.eventNameSpace, function() {
                    p(r).off("mousemove." + v.eventNameSpace);
                });
            });
            i.matchIframeWithMediaQuery(t);
        },
        setMediaQueries: function(e) {
            if (v.styleElement && v.styleElement.length < 1) {
                var t = p("<style></style>").addClass(v.styleClass);
                p(r).find("head").append(t);
                v.styleElement = t;
            }
            if (v.hasSetBreakpoints && v.mediaQueryRules) {
                v.styleElement.append(v.mediaQueryRules);
            } else if (!v.hasSetBreakpoints && !v.mediaQueryRules) {
                var i = v.stylesheets;
                var c = "";
                p.each(i, function(d, u) {
                    var e = u.cssRules.length;
                    var h = 0;
                    var m = 0;
                    p.each(u.cssRules, function(e, t) {
                        m++;
                        if (t.media && t.media[0] && (t.media[0].indexOf("max-width") > -1 || t.media[0].indexOf("min-width") > -1)) {
                            var i = v.classPrefix + "-ss" + d + "r" + e;
                            var n = "";
                            var l = "." + i;
                            p.each(t.cssRules, function(e, t) {
                                if (t.selectorText) {
                                    var i = t.selectorText;
                                    var s = i.split(",");
                                    var a = t.cssText.match(/\{.*\}/);
                                    p.each(s, function(e, t) {
                                        n = n + " " + l + " " + t + a;
                                    });
                                }
                            });
                            c = c + n;
                            v.styleElement.append(n);
                            var s = t.media[0].match(/[0-9]+/g);
                            s = p.map(s, Number);
                            var a = t;
                            var r = e;
                            var o = r - h;
                            var f = u;
                            v.breakpoints[i] = {
                                maxWidth: false,
                                minWidth: false,
                                deletedRule: a,
                                deletedRulePosition: o,
                                addRulePosition: r,
                                deletedFromStylesheet: f,
                                px: s
                            };
                            if (t.media[0].indexOf("max-width") > -1 && t.media[0].indexOf("min-width") > -1) {
                                v.breakpoints[i].maxWidth = true;
                                v.breakpoints[i].minWidth = true;
                                h++;
                            } else if (t.media[0].indexOf("max-width") > -1) {
                                v.breakpoints[i].maxWidth = true;
                            } else if (t.media[0].indexOf("min-width") > -1) {
                                v.breakpoints[i].minWidth = true;
                                h++;
                            }
                        }
                    });
                });
                v.mediaQueryRules = c;
                v.hasSetBreakpoints = true;
            }
            p("body").addClass(v.plugin.options.bodyClass);
        },
        matchIframeWithMediaQuery: function(o) {
            var f = o.width();
            p.each(v.breakpoints, function(e, t) {
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
            if (v.onWindowResize) {
                p(e).trigger("resize");
            }
        },
        unsetAll: function() {
            p("body").removeClass(v.plugin.options.bodyClass);
            p.each(v.breakpoints, function(e, t) {
                var i = e;
                var s = t.px;
                var a = t.type;
                if (t["hasBeenDeleted"]) {
                    t.deletedFromStylesheet.insertRule(t.deletedRule.cssText, t.addRulePosition);
                    t["hasBeenDeleted"] = false;
                    v.iframes.removeClass(e);
                    v.plugin.resetStyle(v.iframes);
                }
            });
            v.styleElement.text("");
        },
        setIframeSize: function(e, t) {
            var s = false;
            var a = false;
            var i = v.iframes;
            if (e) {
                if (e.width) {
                    s = e.width;
                }
                if (e.height) {
                    a = e.height;
                }
            }
            if (t && t.length > 0 && p(t).is(p(v.plugin.options.containerSelector))) {
                i = t;
            }
            if (s || a) {
                p.each(i, function(e, t) {
                    var i = p(t);
                    if (s) {
                        i.width(s);
                    }
                    if (a) {
                        i.height(a);
                    }
                    v.plugin.matchIframeWithMediaQuery(i);
                });
            }
        },
        resetIframesSize: function(e) {
            var t = v.iframes;
            if (e && p(e).is(p(v.plugin.options.containerSelector))) {
                t = e;
            }
            p.each(t, function(e, t) {
                var i = p(t);
                v.plugin.resetStyle(i);
                v.plugin.matchIframeWithMediaQuery(i);
            });
        },
        resetStyle: function(e) {
            p.each(e, function(e, t) {
                var i = p(t);
                i.attr("style", "");
            });
        },
        resetAttribute: function(e, i) {
            p.each(e, function(e, t) {
                $el = p(t);
                $el.attr(i, "false");
            });
        }
    });
    p.fn[o] = function(e) {
        if (typeof arguments[0] === "string") {
            var t = arguments[0];
            var i = Array.prototype.slice.call(arguments, 1);
            var s = Array.prototype.slice.call(arguments, 2);
            var a;
            this.each(function() {
                if (p.data(this, "plugin_" + o) && typeof p.data(this, "plugin_" + o)[t] === "function") {
                    a = p.data(this, "plugin_" + o)[t].apply(this, i, s);
                } else {
                    throw new Error("Method " + t + " does not exist on jQuery." + o);
                }
            });
            if (a !== n) {
                return a;
            } else {
                return this;
            }
        } else if (typeof e === "object" || !e) {
            return this.each(function() {
                if (!p.data(this, "plugin_" + o)) {
                    p.data(this, "plugin_" + o, new l(this, e));
                }
            });
        }
    };
})(jQuery, window, document);