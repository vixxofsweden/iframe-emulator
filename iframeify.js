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
    breakpoints: {},
    hasSetBreakpoints: false,
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

      var allStyleSheets = document.styleSheets;
      var selectedStylesheets = allStyleSheets;
      if (thisPlugin.options.stylesheetClass) {
        var stylesheetClass = thisPlugin.options.stylesheetClass;
        selectedStylesheets = $.map(allStyleSheets, function( n, i ) {
          var $el = $(n.ownerNode);
          if ($el.hasClass(stylesheetClass)) {
            return n;
          }
        });
      }
      globals.stylesheets = selectedStylesheets;

      thisPlugin.setMediaQueries(thisPlugin);

      $.each(globals.iframes, function(i, iframe) {
        var $iframe = $(iframe);
        thisPlugin.initIframe($iframe, thisPlugin);
      });
    },

    initIframe: function($iframe, thisPlugin) {
      $iframe.on('mousedown.' + globals.eventNameSpace, function(e){
        $(document).on('mousemove.' + globals.eventNameSpace, function() {
          thisPlugin.matchMediaQueries($iframe);
        });

        $(document).on('mouseup.' + globals.eventNameSpace, function() {
          $(document).off('mousemove.' + globals.eventNameSpace);
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
      if (globals.hasSetBreakpoints && globals.mediaQueryRules) {
        globals.styleElement.append(globals.mediaQueryRules);
      }
      else if (!globals.hasSetBreakpoints && !globals.mediaQueryRules) {
        var styleSheets = globals.stylesheets;
        var allCss = '';
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

              globals.breakpoints[newClass] = {
                maxWidth: false,
                minWidth: false,
                deletedRule: currentRule,
                deletedRulePosition: currentRuleDeletePosition,
                addRulePosition: currentRulePosition,
                deletedFromStylesheet: currentRoleStylesheet,
                px: pxVal
              }

              if (rule.media[0].indexOf('max-width') > -1 && rule.media[0].indexOf('min-width') > -1) {
                globals.breakpoints[newClass].maxWidth = true;
                globals.breakpoints[newClass].minWidth = true;
                ruleDeleteIndex++;
              }
              else if (rule.media[0].indexOf('max-width') > -1) {
                globals.breakpoints[newClass].maxWidth = true;
              }
              else if (rule.media[0].indexOf('min-width') > -1) {
                globals.breakpoints[newClass].minWidth = true;
                ruleDeleteIndex++;
              }
            }
          });
      });
      globals.mediaQueryRules = allCss;
      globals.hasSetBreakpoints = true;
    }
    $('body').addClass(globals.plugin.options.bodyClass);
    },
    matchMediaQueries: function($iframe) {
      var iframeWidth = $iframe.width();
      $.each(globals.breakpoints, function(key, classObj) {
        var hasBeenDeleted = classObj.hasBeenDeleted;
        var mqClass = key;
        var mqPx = classObj.px;
        var mqType = classObj.type;
        if (classObj.maxWidth && classObj.minWidth) {
          if(!hasBeenDeleted) {
            classObj.deletedFromStylesheet.deleteRule(classObj.deletedRulePosition);
          }
          classObj.hasBeenDeleted = true;
          var max = Math.max.apply(null, mqPx);
          var min = Math.min.apply(null, mqPx);
          if (iframeWidth > min && iframeWidth < max) {
            if (!$iframe.hasClass(mqClass)) {
              $iframe.addClass(mqClass);
            }
          }
          else {
            $iframe.removeClass(mqClass);
          }
        }

        else if (classObj.maxWidth) {
          if (iframeWidth < mqPx) {
            if (!$iframe.hasClass(mqClass)) {
              $iframe.addClass(mqClass);
            }
          }
          else if (iframeWidth > mqPx) {
            $iframe.removeClass(mqClass);
          }
        }
        else if (classObj.minWidth) {
          if(!hasBeenDeleted) {
            classObj.deletedFromStylesheet.deleteRule(classObj.deletedRulePosition);
          }
          classObj.hasBeenDeleted = true;
          if (iframeWidth > mqPx) {
            if (!$iframe.hasClass(mqClass)) {
              $iframe.addClass(mqClass);
            }
          }
          else if (iframeWidth < mqPx) {
            $iframe.removeClass(mqClass);
          }
        }
      });
      if (globals.onWindowResize) {
        $(window).trigger('resize');
      }
      $(document).trigger(pluginName + '.matchMediaQueries', $iframe);
    },

    unsetQueries: function() {
      $('body').removeClass(globals.plugin.options.bodyClass);
      $.each(globals.breakpoints, function(key, classObj) {
        var mqClass = key;
        var mqPx = classObj.px;
        var mqType = classObj.type;
        if (classObj['hasBeenDeleted']) {
          classObj.deletedFromStylesheet.insertRule(classObj.deletedRule.cssText, classObj.addRulePosition);
          classObj['hasBeenDeleted'] = false;
          globals.iframes.removeClass(key);
        }
      });
      globals.styleElement.text('');
    },
    resetQueries: function() {
      globals.hasSetBreakpoints = false;
      globals.mediaQueryRules = false;
      globals.breakpoints = {};
    },
    destroy: function() {
      globals.plugin.unsetQueries();
      globals.plugin.resetQueries();
      globals.plugin.resetStyle(globals.iframes);
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
