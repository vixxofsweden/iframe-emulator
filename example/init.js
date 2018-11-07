$(document).ready(function(){

  var options = {
    containerSelector: '.iframe',
    stylesheetClass: 'ifem-iframe-stylesheet',
    classPrefix: 'ifem',
    bodyClass: 'ifem-active'
  }

  $(document).iframeEmulator(options);

  $('.iframe-toggle').click(function(){
    if ($('body').hasClass('ifem-active')) {
      $(document).iframeEmulator('unsetAll');
    }
    else {
      $(document).iframeEmulator('init');
    }
    $(this).toggleClass('iframe-toggle-disabled');
  })

  $('.ifem-size-selector').click(function(e) {
    e.preventDefault();
    var iframeWidth = $(this).attr('data-ifem-pre-width');
    var iframeHeight = $(this).attr('data-ifem-pre-height');
    $(document).iframeEmulator('setIframeSize', {
      width: iframeWidth,
      height: iframeHeight
    });
  });

  $('.ifem-size-reset').click(function(e) {
    e.preventDefault();
    $(document).iframeEmulator('resetIframesSize');
  })


  $('a[data-ifem-grid]').click(function(e){
    e.preventDefault();
    var elAttr = 'data-ifem-grid';
    var $btn = $(e.currentTarget);
    $btn.toggleClass('ifem-grid-active');
    $('body').toggleClass('ifem-grid-view');
  });
});
