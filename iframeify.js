;(function ( $, window, document, undefined ) {

  var pluginName = "iframeify",
  defaults = {
    containerSelector: '.ifr-iframe',
    classPrefix: 'ifr',
    stylesheetClass: false,
    bodyClass: 'ifr-active',
    onWindowResize: false
  },
  globals = {
    breakpoints: false,
    hasSetBreakpoints: false,
    mediaqueries: false,
    hasSetMediaQueries: false,
    mediaQueryRules: false,
    iframes: [],
    stylesheets: [],
    styleClass: 'ifr-styles',
    styleElement: [],
    eventNameSpace: "plugin_" + pluginName,
    plugin: false,
    pluginElement: false,
    onWindowResize: false
  };

  function Plugin( element, options ) {
    this.element = element;
    this.$element = $(element);
    this.options = $.extend( {}, defaults, options) ;
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  $.extend(Plugin.prototype = {

    init: function() {
      var thisPlugin;
      if (this && this.options) {
        thisPlugin = this;
      }
      else if (globals.plugin && globals.plugin.options) {
        thisPlugin = globals.plugin;
      }
      else {
        throw new Error('No plugin object found');
      }
      var classPrefix = thisPlugin.options.classPrefix;
      var pluginPrefixed = "plugin_" + pluginName;
      var $iframes = $(thisPlugin.options.containerSelector);

      globals.iframes = $iframes;
      globals.classPrefix = thisPlugin.options.classPrefix;
      globals.onWindowResize = thisPlugin.options.onWindowResize;
      globals.styleClass = thisPlugin.options.classPrefix + "-styles";
      globals.plugin = thisPlugin;
      globals.pluginElement = this.$element;

      thisPlugin.initStylesheets();
      thisPlugin.setMediaQueries(thisPlugin);

      $.each(globals.iframes, function(i, iframe) {
        var $iframe = $(iframe);
        thisPlugin.initIframe($iframe, thisPlugin);
      });
    },

    initStylesheets: function() {
      var allStyleSheets = document.styleSheets;
      var stylesheetClass = globals.plugin.options.stylesheetClass;
      var selectedStylesheets = allStyleSheets;
      if (stylesheetClass) {
        selectedStylesheets = $.map(allStyleSheets, function( n, i ) {
          var $el = $(n.ownerNode);
          if ($el.hasClass(stylesheetClass)) {
            return n;
          }
        });
      }
      globals.stylesheets = selectedStylesheets;
    },

    initIframe: function($iframe, thisPlugin) {
      var mousedownEvent = 'mousedown.' + globals.eventNameSpace;
      var mousemoveEvent = 'mousemove.' + globals.eventNameSpace;
      var mouseupEvent = 'mouseup.' + globals.eventNameSpace;
      $iframe.off(mousedownEvent).on(mousedownEvent, function(e){
        $(document).off(mousemoveEvent).on(mousemoveEvent, function() {
          thisPlugin.matchMediaQueries($iframe);
        });

        $(document).off(mouseupEvent).on(mouseupEvent, function() {
          $(document).off(mousemoveEvent);
        });
      });
      thisPlugin.matchMediaQueries($iframe);
    },

    setMediaQueries: function(thisPlugin) {
      if (globals.styleElement && globals.styleElement.length < 1) {
        var styleElement = $('<style></style>').addClass(globals.styleClass);
        $(document).find('head').append(styleElement);
        globals.styleElement = styleElement;
      }
      if (globals.hasSetMediaQueries && globals.mediaQueryRules) {
        globals.styleElement.append(globals.mediaQueryRules);
      }
      else if (!globals.hasSetMediaQueries && !globals.mediaQueryRules) {
        var styleSheets = globals.stylesheets;
        var allCss = '';
        if (!globals.breakpoints) {
          globals.breakpoints = {
            ranges: [],
            maxWidth: [],
            minWidth: [],
          };
        }
        if (!globals.mediaqueries) {
          globals.mediaqueries = {};
        }
        $.each(styleSheets, function(i, styleObject) {
          var noOfRules = styleObject.cssRules.length;
          var ruleDeleteIndex = 0;
          var testIndex = 0;
          $.each(styleObject.cssRules, function(r, rule) {
            testIndex++;
            if (rule.media && rule.media[0] && (rule.media[0].indexOf('max-width') > -1 || rule.media[0].indexOf('min-width') > -1)) {
              var newClass = globals.classPrefix + '-ss' + i + "r" + r;
              var newCss = "";
              var newSelector = "." + newClass;
              $.each(rule.cssRules, function(d, cssRule) {
                if (cssRule.selectorText) {
                  var selectors = cssRule.selectorText;
                  var selectorArray = selectors.split(',');
                  var cssText = cssRule.cssText.match(/\{.*\}/);
                  $.each(selectorArray, function(i, selector) {
                    newCss = newCss + " " + newSelector + " " + selector + cssText;
                  });
                }
              });
              allCss = allCss + newCss;
              globals.styleElement.append(newCss);
              var pxVal = rule.media[0].match(/[0-9]+/g);
              pxVal = $.map(pxVal,Number);

              var currentRule = rule;
              var currentRulePosition = r;
              var currentRuleDeletePosition = currentRulePosition - ruleDeleteIndex;
              var currentRoleStylesheet = styleObject;

              globals.mediaqueries[newClass] = {
                maxWidth: false,
                minWidth: false,
                deletedRule: currentRule,
                deletedRulePosition: currentRuleDeletePosition,
                addRulePosition: currentRulePosition,
                deletedFromStylesheet: currentRoleStylesheet,
                px: pxVal,
                class: newClass
              }

              // Max comes first
              if (rule.media[0].indexOf('max-width') > -1 && rule.media[0].indexOf('min-width') > -1) {
                var maxWidth = pxVal[0];
                var minWidth = pxVal[1];
                globals.mediaqueries[newClass].maxWidth = true;
                globals.mediaqueries[newClass].minWidth = true;
                var range = maxWidth + '-' + minWidth;
                if (!globals.breakpoints.ranges[range]) {
                  globals.breakpoints.ranges[range] = {
                    mediaQueries: []
                  };
                }
                globals.breakpoints.ranges[range].mediaQueries.push(globals.mediaqueries[newClass]);
                ruleDeleteIndex++;
              }
              else if (rule.media[0].indexOf('max-width') > -1) {
                globals.mediaqueries[newClass].maxWidth = true;
                var key = pxVal[0];
                if (!globals.breakpoints.maxWidth[key]) {
                  globals.breakpoints.maxWidth[key] = {
                    mediaQueries: []
                  };
                }
                globals.breakpoints.maxWidth[key].mediaQueries.push(globals.mediaqueries[newClass]);
                ruleDeleteIndex++;
              }
              else if (rule.media[0].indexOf('min-width') > -1) {
                globals.mediaqueries[newClass].minWidth = true;
                var key = pxVal[0];
                if (!globals.breakpoints.minWidth[key]) {
                  globals.breakpoints.minWidth[key] = {
                    mediaQueries: []
                  };
                }
                globals.breakpoints.minWidth[key].mediaQueries.push(globals.mediaqueries[newClass]);
                ruleDeleteIndex++;
              }
            }
          });
      });
      globals.mediaQueryRules = allCss;
      globals.hasSetMediaQueries = true;
    }

    $.each(globals.mediaqueries, function(key, obj) {
      if(!obj.hasBeenDeleted) {
        obj.deletedFromStylesheet.deleteRule(obj.deletedRulePosition);
      }
      globals.mediaqueries[key].hasBeenDeleted = true;
    });

    $('body').addClass(globals.plugin.options.bodyClass);
    },
    matchMediaQueries: function($iframe) {
      var iframeWidth = $iframe.width();
      var mediaQueries = [];

      $.each(globals.breakpoints, function(queryType, typeObject) {
        if (queryType == 'maxWidth') {
          for (var key in typeObject) {
            if (iframeWidth <= key) {
              $.each(typeObject[key].mediaQueries, function(k, maxObj) {
                mediaQueries.push(maxObj);
              });
            }
          }
        }
        else if (queryType == 'minWidth') {
          for (var key in typeObject) {
            if (iframeWidth >= key) {
              $.each(typeObject[key].mediaQueries, function(l, minObj) {
                mediaQueries.push(minObj);
              });
            }
          }
        }
        else if (queryType == 'ranges') {
          for (var key in typeObject) {
            var rangeValues = key.split('-');
            var maxWidth = rangeValues[0];
            var minWidth = rangeValues[1];
            if (iframeWidth <= maxWidth && iframeWidth >= minWidth) {
              $.each(typeObject[key].mediaQueries, function(h, rangeObj) {
                mediaQueries.push(rangeObj);
              });
            }
          }
        }
      });

      var classMatch = new RegExp(globals.classPrefix + "\-[a-z0-9]*", 'g');
      var classes = $iframe.attr('class').replace(classMatch, '');
      $iframe.attr('class', classes);

      $.each(mediaQueries, function(r, classObj) {
        var hasBeenDeleted = classObj.hasBeenDeleted;
        var mqClass = classObj.class;
        var mqPx = classObj.px;
        var mqType = classObj.type;
        if (!$iframe.hasClass(mqClass)) {
          $iframe.addClass(mqClass);
        }
      });
      if (globals.onWindowResize) {
        $(window).trigger('resize');
      }
      $(document).trigger(pluginName + '.matchMediaQueries', $iframe);
    },

    unsetQueries: function() {
      $('body').removeClass(globals.plugin.options.bodyClass);
      $.each(globals.mediaqueries, function(key, classObj) {
        var mqClass = key;
        var mqPx = classObj.px;
        var mqType = classObj.type;
        if (classObj['hasBeenDeleted']) {
          classObj.deletedFromStylesheet.insertRule(classObj.deletedRule.cssText, classObj.addRulePosition);
          globals.mediaqueries[key].hasBeenDeleted = false;
          var classMatch = new RegExp(globals.classPrefix + "\-[a-z0-9]*", 'g');
          var classes = globals.iframes.attr('class').replace(classMatch, '');
          globals.iframes.attr('class', classes);
        }
      });
      globals.styleElement.text('');
    },
    resetQueries: function() {
      globals.hasSetMediaQueries = false;
      globals.mediaQueryRules = false;
      globals.mediaqueries = false;
      globals.breakpoints = false;
    },
    destroy: function() {
      globals.plugin.unsetQueries();
      globals.plugin.resetQueries();
      globals.plugin.resetStyle(globals.iframes);
      var mousedownEvent = 'mousedown.' + globals.eventNameSpace;
      var mousemoveEvent = 'mousemove.' + globals.eventNameSpace;
      var mouseupEvent = 'mouseup.' + globals.eventNameSpace;
      globals.iframes.off(mousedownEvent);
      $(document).off(mousemoveEvent);
      $(document).off(mouseupEvent);
    },
    setIframeSize: function(args, target) {
      var predefinedWidth = false;
      var predefinedHeight = false;
      var iframes = globals.iframes;
      if (args) {
        if (args.width) {
          predefinedWidth = args.width;
        }
        if (args.height) {
          predefinedHeight = args.height;
        }
      }
      if (target && target.length > 0 && $(target).is($(globals.plugin.options.containerSelector))) {
        iframes = target;
      }
      if (predefinedWidth || predefinedHeight) {
        $.each(iframes, function(i, iframe) {
          var $iframe = $(iframe);
          if (predefinedWidth) {
            $iframe.width(predefinedWidth);
          }
          if (predefinedHeight) {
            $iframe.height(predefinedHeight);
          }
          globals.plugin.matchMediaQueries($iframe);
        });
      }
    },

    resetIframesSize: function(target) {
      var iframes = globals.iframes;
      if (target && $(target).is($(globals.plugin.options.containerSelector))) {
        iframes = target;
      }
      $.each(iframes, function(i, iframe) {
        var $iframe = $(iframe);
        globals.plugin.resetStyle($iframe);
        globals.plugin.matchMediaQueries($iframe);
      });
    },

    resetStyle: function($els) {
      $.each($els, function(i, el) {
        var $el = $(el);
        $el.attr('style', '');
      })
    },

    resetAttribute: function($els, attr) {
      $.each($els, function (i, el) {
        $el = $(el);
        $el.attr(attr, 'false');
      });
    }
  });

  $.fn[pluginName] = function(options) {
      if (typeof arguments[0] === 'string') {
        var methodName = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        var target = Array.prototype.slice.call(arguments, 2);
        var returnVal;
        this.each(function() {
          if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
            returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args, target);
          } else {
            throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
          }
        });
        if (returnVal !== undefined){
          return returnVal;
        } else {
          return this;
        }
      } else if (typeof options === "object" || !options) {
        return this.each(function() {
          if (!$.data(this, 'plugin_' + pluginName)) {
            $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
          }
        });
      }
    };
})( jQuery, window, document );
