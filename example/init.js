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
      $(document).iframeify('unsetAll');
    }
    else {
      $(document).iframeify('init');
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

  $('.ifr-size-reset').click(function(e) {
    e.preventDefault();
    $(document).iframeify('resetIframesSize');
  })


  $('a[data-ifr-grid]').click(function(e){
    e.preventDefault();
    var elAttr = 'data-ifr-grid';
    var $btn = $(e.currentTarget);
    $btn.toggleClass('ifr-grid-active');
    $('body').toggleClass('ifr-grid-view');
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
