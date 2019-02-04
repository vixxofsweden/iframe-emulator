$(document).ready(function(){

  var options = {
    containerSelector: '.iframe',
    stylesheetClass: 'ifr-iframe-stylesheet',
    classPrefix: 'ifr',
    bodyClass: 'ifr-active',
    onWindowResize: true
  }


  $('.iframe-toggle').click(function(){
    if ($('body').hasClass('ifr-active')) {
      $(document).iframeify('unsetQueries');
      $('.iframe').attr('style', '');
    }
    else {
      $(document).iframeify('setMediaQueries');
    }
    $(this).toggleClass('iframe-toggle-disabled');
  })

  $('.ifr-size-selector').click(function(e) {
    e.preventDefault();
    var iframeWidth = $(this).attr('data-ifr-pre-width');
    var iframeHeight = $(this).attr('data-ifr-pre-height');
    $(document).iframeify('setIframeSize', {
      width: iframeWidth,
      height: iframeHeight
    });
  });

  $('.ifr-size-selector-spec').click(function(e) {
    e.preventDefault();
    var iframeWidth = $(this).attr('data-ifr-pre-width');
    var iframeHeight = $(this).attr('data-ifr-pre-height');
    $(document).iframeify('setIframeSize', {
      width: iframeWidth,
      height: iframeHeight
    }, $('#iframe2'));
  });

  $('.ifr-size-reset').click(function(e) {
    e.preventDefault();
    $(document).iframeify('resetIframesSize');
  })

  $('.ifr-size-reset-spec').click(function(e) {
    e.preventDefault();
    $(document).iframeify('resetIframesSize', $('#iframe2'));
  })


  $('a[data-ifr-grid]').click(function(e){
    e.preventDefault();
    var elAttr = 'data-ifr-grid';
    var $btn = $(e.currentTarget);
    $btn.toggleClass('ifr-grid-active');
    $('body').toggleClass('ifr-grid-view');
  });

  var fadeOutTimeout = {};
  $(document).on('iframeify.matchMediaQueries', function(e, el) {
    var $el = $(el);
    var iframeWidth = $el.width();
    var iframeHeight = $el.height();
    var $sizeElement = $el.find('.iframe-size');
    $sizeElement.find('.width').text(iframeWidth);
    $sizeElement.find('.height').text(iframeHeight);

    if ($sizeElement.is(':hidden')) {
      $sizeElement.fadeIn();
    }

    var timeoutId;
    if ($el.data('ifrUniqueId')) {
      timeoutId = $el.data('ifrUniqueId');
    }
    else {
      var newUniqueId = Math.random().toString(36).substr(2, 9);
      $el.data('ifrUniqueId', newUniqueId);
      timeoutId = newUniqueId;
    }

    clearTimeout(fadeOutTimeout[timeoutId]);
    fadeOutTimeout[timeoutId] = setTimeout(function(){
      $sizeElement.fadeOut();
    }, 2000);
  });



  // Resize event to show example
  var initialWidth = 0;
  $(window).resize(function() {
    var $tabsGroups = $('.tabs');
    $.each($tabsGroups, function(i, tabs) {
      var $tabs = $(tabs);
      var tabsWidth = $tabs.prop('scrollWidth');
      var tabsParentWidth = $tabs.parent().innerWidth();
      if (tabsWidth > tabsParentWidth && !$tabs.hasClass('wrap')) {
        $tabs.addClass('wrap');
        initialWidth = tabsWidth;
      }
      else if (initialWidth < tabsParentWidth) {
        $tabs.removeClass('wrap');
      }
    });
  });

  // This needs to be initialise after any window resize event you want to trigger
  $(document).iframeify(options);
});
