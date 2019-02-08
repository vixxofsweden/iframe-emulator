(function(x, s, n, r) {
    var u = "iframeify", a = {
        containerSelector: ".ifr-iframe",
        classPrefix: "ifr",
        stylesheetClass: false,
        bodyClass: "ifr-active",
        onWindowResize: false
    }, Q = {
        breakpoints: false,
        hasSetBreakpoints: false,
        mediaqueries: false,
        hasSetMediaQueries: false,
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
        this.$element = x(e);
        this.options = x.extend({}, a, i);
        this._defaults = a;
        this._name = u;
        this.init();
    }
    x.extend(l.prototype = {
        init: function() {
            var a;
            if (this && this.options) {
                a = this;
            } else if (Q.plugin && Q.plugin.options) {
                a = Q.plugin;
            } else {
                throw new Error("No plugin object found");
            }
            var e = a.options.classPrefix;
            var i = "plugin_" + u;
            var s = x(a.options.containerSelector);
            Q.iframes = s;
            Q.classPrefix = a.options.classPrefix;
            Q.onWindowResize = a.options.onWindowResize;
            Q.styleClass = a.options.classPrefix + "-styles";
            Q.plugin = a;
            Q.pluginElement = this.$element;
            a.initStylesheets();
            a.setMediaQueries(a);
            x.each(Q.iframes, function(e, i) {
                var s = x(i);
                a.initIframe(s, a);
            });
        },
        initStylesheets: function() {
            var e = n.styleSheets;
            var a = Q.plugin.options.stylesheetClass;
            var i = e;
            if (a) {
                i = x.map(e, function(e, i) {
                    var s = x(e.ownerNode);
                    if (s.hasClass(a)) {
                        return e;
                    }
                });
            }
            Q.stylesheets = i;
        },
        initIframe: function(i, s) {
            var e = "mousedown." + Q.eventNameSpace;
            var a = "mousemove." + Q.eventNameSpace;
            var t = "mouseup." + Q.eventNameSpace;
            i.off(e).on(e, function(e) {
                x(n).off(a).on(a, function() {
                    s.matchMediaQueries(i);
                });
                x(n).off(t).on(t, function() {
                    x(n).off(a);
                });
            });
            s.matchMediaQueries(i);
        },
        setMediaQueries: function(e) {
            if (Q.styleElement && Q.styleElement.length < 1) {
                var i = x("<style></style>").addClass(Q.styleClass);
                x(n).find("head").append(i);
                Q.styleElement = i;
            }
            if (Q.hasSetMediaQueries && Q.mediaQueryRules) {
                Q.styleElement.append(Q.mediaQueryRules);
            } else if (!Q.hasSetMediaQueries && !Q.mediaQueryRules) {
                var s = Q.stylesheets;
                var g = "";
                if (!Q.breakpoints) {
                    Q.breakpoints = {
                        ranges: [],
                        maxWidth: [],
                        minWidth: []
                    };
                }
                if (!Q.mediaqueries) {
                    Q.mediaqueries = {};
                }
                x.each(s, function(c, p) {
                    var e = p.cssRules.length;
                    var v = 0;
                    var y = 0;
                    x.each(p.cssRules, function(e, i) {
                        y++;
                        if (i.media && i.media[0] && (i.media[0].indexOf("max-width") > -1 || i.media[0].indexOf("min-width") > -1)) {
                            var s = Q.classPrefix + "-ss" + c + "r" + e;
                            var n = "";
                            var r = "." + s;
                            x.each(i.cssRules, function(e, i) {
                                if (i.selectorText) {
                                    var s = i.selectorText;
                                    var a = s.split(",");
                                    var t = i.cssText.match(/\{.*\}/);
                                    x.each(a, function(e, i) {
                                        n = n + " " + r + " " + i + t;
                                    });
                                }
                            });
                            g = g + n;
                            Q.styleElement.append(n);
                            var a = i.media[0].match(/[0-9]+/g);
                            a = x.map(a, Number);
                            var t = i;
                            var l = e;
                            var o = l - v;
                            var u = p;
                            Q.mediaqueries[s] = {
                                maxWidth: false,
                                minWidth: false,
                                deletedRule: t,
                                deletedRulePosition: o,
                                addRulePosition: l,
                                deletedFromStylesheet: u,
                                px: a,
                                class: s
                            };
                            if (i.media[0].indexOf("max-width") > -1 && i.media[0].indexOf("min-width") > -1) {
                                var f = a[0];
                                var d = a[1];
                                Q.mediaqueries[s].maxWidth = true;
                                Q.mediaqueries[s].minWidth = true;
                                var m = f + "-" + d;
                                if (!Q.breakpoints.ranges[m]) {
                                    Q.breakpoints.ranges[m] = {
                                        mediaQueries: []
                                    };
                                }
                                Q.breakpoints.ranges[m].mediaQueries.push(Q.mediaqueries[s]);
                                v++;
                            } else if (i.media[0].indexOf("max-width") > -1) {
                                Q.mediaqueries[s].maxWidth = true;
                                var h = a[0];
                                if (!Q.breakpoints.maxWidth[h]) {
                                    Q.breakpoints.maxWidth[h] = {
                                        mediaQueries: []
                                    };
                                }
                                Q.breakpoints.maxWidth[h].mediaQueries.push(Q.mediaqueries[s]);
                                v++;
                            } else if (i.media[0].indexOf("min-width") > -1) {
                                Q.mediaqueries[s].minWidth = true;
                                var h = a[0];
                                if (!Q.breakpoints.minWidth[h]) {
                                    Q.breakpoints.minWidth[h] = {
                                        mediaQueries: []
                                    };
                                }
                                Q.breakpoints.minWidth[h].mediaQueries.push(Q.mediaqueries[s]);
                                v++;
                            }
                        }
                    });
                });
                Q.mediaQueryRules = g;
                Q.hasSetMediaQueries = true;
            }
            x.each(Q.mediaqueries, function(e, i) {
                if (!i.hasBeenDeleted) {
                    i.deletedFromStylesheet.deleteRule(i.deletedRulePosition);
                }
                Q.mediaqueries[e].hasBeenDeleted = true;
            });
            x("body").addClass(Q.plugin.options.bodyClass);
        },
        matchMediaQueries: function(r) {
            var l = r.width();
            var o = [];
            x.each(Q.breakpoints, function(e, i) {
                if (e == "maxWidth") {
                    for (var s in i) {
                        if (l <= s) {
                            x.each(i[s].mediaQueries, function(e, i) {
                                o.push(i);
                            });
                        }
                    }
                } else if (e == "minWidth") {
                    for (var s in i) {
                        if (l >= s) {
                            x.each(i[s].mediaQueries, function(e, i) {
                                o.push(i);
                            });
                        }
                    }
                } else if (e == "ranges") {
                    for (var s in i) {
                        var a = s.split("-");
                        var t = a[0];
                        var n = a[1];
                        if (l <= t && l >= n) {
                            x.each(i[s].mediaQueries, function(e, i) {
                                o.push(i);
                            });
                        }
                    }
                }
            });
            var e = new RegExp(Q.classPrefix + "-[a-z0-9]*", "g");
            var i = r.attr("class").replace(e, "");
            r.attr("class", i);
            x.each(o, function(e, i) {
                var s = i.hasBeenDeleted;
                var a = i.class;
                var t = i.px;
                var n = i.type;
                if (!r.hasClass(a)) {
                    r.addClass(a);
                }
            });
            if (Q.onWindowResize) {
                x(s).trigger("resize");
            }
            x(n).trigger(u + ".matchMediaQueries", r);
        },
        unsetQueries: function() {
            x("body").removeClass(Q.plugin.options.bodyClass);
            x.each(Q.mediaqueries, function(e, i) {
                var s = e;
                var a = i.px;
                var t = i.type;
                if (i["hasBeenDeleted"]) {
                    i.deletedFromStylesheet.insertRule(i.deletedRule.cssText, i.addRulePosition);
                    Q.mediaqueries[e].hasBeenDeleted = false;
                    var n = new RegExp(Q.classPrefix + "-[a-z0-9]*", "g");
                    var r = Q.iframes.attr("class").replace(n, "");
                    Q.iframes.attr("class", r);
                }
            });
            Q.styleElement.text("");
        },
        resetQueries: function() {
            Q.hasSetMediaQueries = false;
            Q.mediaQueryRules = false;
            Q.mediaqueries = false;
            Q.breakpoints = false;
        },
        destroy: function() {
            Q.plugin.unsetQueries();
            Q.plugin.resetQueries();
            Q.plugin.resetStyle(Q.iframes);
            var e = "mousedown." + Q.eventNameSpace;
            var i = "mousemove." + Q.eventNameSpace;
            var s = "mouseup." + Q.eventNameSpace;
            Q.iframes.off(e);
            x(n).off(i);
            x(n).off(s);
        },
        setIframeSize: function(e, i) {
            var a = false;
            var t = false;
            var s = Q.iframes;
            if (e) {
                if (e.width) {
                    a = e.width;
                }
                if (e.height) {
                    t = e.height;
                }
            }
            if (i && i.length > 0 && x(i).is(x(Q.plugin.options.containerSelector))) {
                s = i;
            }
            if (a || t) {
                x.each(s, function(e, i) {
                    var s = x(i);
                    if (a) {
                        s.width(a);
                    }
                    if (t) {
                        s.height(t);
                    }
                    Q.plugin.matchMediaQueries(s);
                });
            }
        },
        resetIframesSize: function(e) {
            var i = Q.iframes;
            if (e && x(e).is(x(Q.plugin.options.containerSelector))) {
                i = e;
            }
            x.each(i, function(e, i) {
                var s = x(i);
                Q.plugin.resetStyle(s);
                Q.plugin.matchMediaQueries(s);
            });
        },
        resetStyle: function(e) {
            x.each(e, function(e, i) {
                var s = x(i);
                s.attr("style", "");
            });
        },
        resetAttribute: function(e, s) {
            x.each(e, function(e, i) {
                $el = x(i);
                $el.attr(s, "false");
            });
        }
    });
    x.fn[u] = function(e) {
        if (typeof arguments[0] === "string") {
            var i = arguments[0];
            var s = Array.prototype.slice.call(arguments, 1);
            var a = Array.prototype.slice.call(arguments, 2);
            var t;
            this.each(function() {
                if (x.data(this, "plugin_" + u) && typeof x.data(this, "plugin_" + u)[i] === "function") {
                    t = x.data(this, "plugin_" + u)[i].apply(this, s, a);
                } else {
                    throw new Error("Method " + i + " does not exist on jQuery." + u);
                }
            });
            if (t !== r) {
                return t;
            } else {
                return this;
            }
        } else if (typeof e === "object" || !e) {
            return this.each(function() {
                if (!x.data(this, "plugin_" + u)) {
                    x.data(this, "plugin_" + u, new l(this, e));
                }
            });
        }
    };
})(jQuery, window, document);