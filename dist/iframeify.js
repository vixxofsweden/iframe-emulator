(function(p, e, r, n) {
    var d = "iframeify", t = {
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
        eventNameSpace: "plugin_" + d,
        plugin: false,
        pluginElement: false,
        onWindowResize: false
    };
    function l(e, i) {
        this.element = e;
        this.$element = p(e);
        this.options = p.extend({}, t, i);
        this._defaults = t;
        this._name = d;
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
            var i = "plugin_" + d;
            var t = p(s.options.containerSelector);
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
                n = p.map(a, function(e, i) {
                    var t = p(e.ownerNode);
                    if (t.hasClass(l)) {
                        return e;
                    }
                });
            }
            v.stylesheets = n;
            s.setMediaQueries(s);
            p.each(v.iframes, function(e, i) {
                var t = p(i);
                s.initIframe(t, s);
            });
        },
        initIframe: function(i, t) {
            i.on("mousedown." + v.eventNameSpace, function(e) {
                p(r).on("mousemove." + v.eventNameSpace, function() {
                    t.matchMediaQueries(i);
                });
                p(r).on("mouseup." + v.eventNameSpace, function() {
                    p(r).off("mousemove." + v.eventNameSpace);
                });
            });
            t.matchMediaQueries(i);
        },
        setMediaQueries: function(e) {
            if (v.styleElement && v.styleElement.length < 1) {
                var i = p("<style></style>").addClass(v.styleClass);
                p(r).find("head").append(i);
                v.styleElement = i;
            }
            if (v.hasSetBreakpoints && v.mediaQueryRules) {
                v.styleElement.append(v.mediaQueryRules);
            } else if (!v.hasSetBreakpoints && !v.mediaQueryRules) {
                var t = v.stylesheets;
                var c = "";
                p.each(t, function(d, u) {
                    var e = u.cssRules.length;
                    var h = 0;
                    var m = 0;
                    p.each(u.cssRules, function(e, i) {
                        m++;
                        if (i.media && i.media[0] && (i.media[0].indexOf("max-width") > -1 || i.media[0].indexOf("min-width") > -1)) {
                            var t = v.classPrefix + "-ss" + d + "r" + e;
                            var n = "";
                            var l = "." + t;
                            p.each(i.cssRules, function(e, i) {
                                if (i.selectorText) {
                                    var t = i.selectorText;
                                    var s = t.split(",");
                                    var a = i.cssText.match(/\{.*\}/);
                                    p.each(s, function(e, i) {
                                        n = n + " " + l + " " + i + a;
                                    });
                                }
                            });
                            c = c + n;
                            v.styleElement.append(n);
                            var s = i.media[0].match(/[0-9]+/g);
                            s = p.map(s, Number);
                            var a = i;
                            var r = e;
                            var o = r - h;
                            var f = u;
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
                v.mediaQueryRules = c;
                v.hasSetBreakpoints = true;
            }
            p("body").addClass(v.plugin.options.bodyClass);
        },
        matchMediaQueries: function(o) {
            var f = o.width();
            p.each(v.breakpoints, function(e, i) {
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
                p(e).trigger("resize");
            }
            p(r).trigger(d + ".matchMediaQueries", o);
        },
        unsetAll: function() {
            p("body").removeClass(v.plugin.options.bodyClass);
            p.each(v.breakpoints, function(e, i) {
                var t = e;
                var s = i.px;
                var a = i.type;
                if (i["hasBeenDeleted"]) {
                    i.deletedFromStylesheet.insertRule(i.deletedRule.cssText, i.addRulePosition);
                    i["hasBeenDeleted"] = false;
                    v.iframes.removeClass(e);
                    v.plugin.resetStyle(v.iframes);
                }
            });
            v.styleElement.text("");
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
            if (i && i.length > 0 && p(i).is(p(v.plugin.options.containerSelector))) {
                t = i;
            }
            if (s || a) {
                p.each(t, function(e, i) {
                    var t = p(i);
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
            if (e && p(e).is(p(v.plugin.options.containerSelector))) {
                i = e;
            }
            p.each(i, function(e, i) {
                var t = p(i);
                v.plugin.resetStyle(t);
                v.plugin.matchMediaQueries(t);
            });
        },
        resetStyle: function(e) {
            p.each(e, function(e, i) {
                var t = p(i);
                t.attr("style", "");
            });
        },
        resetAttribute: function(e, t) {
            p.each(e, function(e, i) {
                $el = p(i);
                $el.attr(t, "false");
            });
        }
    });
    p.fn[d] = function(e) {
        if (typeof arguments[0] === "string") {
            var i = arguments[0];
            var t = Array.prototype.slice.call(arguments, 1);
            var s = Array.prototype.slice.call(arguments, 2);
            var a;
            this.each(function() {
                if (p.data(this, "plugin_" + d) && typeof p.data(this, "plugin_" + d)[i] === "function") {
                    a = p.data(this, "plugin_" + d)[i].apply(this, t, s);
                } else {
                    throw new Error("Method " + i + " does not exist on jQuery." + d);
                }
            });
            if (a !== n) {
                return a;
            } else {
                return this;
            }
        } else if (typeof e === "object" || !e) {
            return this.each(function() {
                if (!p.data(this, "plugin_" + d)) {
                    p.data(this, "plugin_" + d, new l(this, e));
                }
            });
        }
    };
})(jQuery, window, document);