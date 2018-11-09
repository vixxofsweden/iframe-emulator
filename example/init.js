$(document).ready(function(){

  var options = {
    containerSelector: '.iframe',
    stylesheetClass: 'ifr-iframe-stylesheet',
    classPrefix: 'ifr',
    bodyClass: 'ifr-active'
  }

  $(document).iframeEmulator(options);

  $('.iframe-toggle').click(function(){
    if ($('body').hasClass('ifr-active')) {
      $(document).iframeEmulator('unsetAll');
    }
    else {
      $(document).iframeEmulator('init');
    }
    $(this).toggleClass('iframe-toggle-disabled');
  })

  $('.ifr-size-selector').click(function(e) {
    e.preventDefault();
    var iframeWidth = $(this).attr('data-ifr-pre-width');
    var iframeHeight = $(this).attr('data-ifr-pre-height');
    $(document).iframeEmulator('setIframeSize', {
      width: iframeWidth,
      height: iframeHeight
    });
  });

  $('.ifr-size-reset').click(function(e) {
    e.preventDefault();
    $(document).iframeEmulator('resetIframesSize');
  })


  $('a[data-ifr-grid]').click(function(e){
    e.preventDefault();
    var elAttr = 'data-ifr-grid';
    var $btn = $(e.currentTarget);
    $btn.toggleClass('ifr-grid-active');
    $('body').toggleClass('ifr-grid-view');
  });
});
