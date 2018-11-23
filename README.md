# iframeify
Turns a div into a faux iframe that can be used to display responsive patterns. **Still experimental and has only been tested in a recent version of Chrome**

## Currently works with the following types of media queries:

- max-width
- min-width
- min-width to max-width

## Initialise

**Default options:**

```
var options = {
  containerSelector: '.ifr-iframe',
  classPrefix: 'ifr',
  stylesheetClass: false,
  bodyClass: 'ifr-active',
  onWindowResize: false
}

$(document).iframeify(options);
```

## Options

- `containerSelector`: the classes on your faux iframes
- `stylesheetClass`: if you only want specific stylesheets to be targeted
- `classPrefix`: class prefix for dynamically generated elements
- `bodyClass`: class that is applied to the body when the faux iframe mode is enabled
- `onWindowResize`: this will trigger a window resize event (this can be used if you control some aspects of the responsiveness by JavaScript, unless you trigger it by checking the window width)

## Recommended styling

Use with `resize: both;` for a great option to resize the faux iframe by dragging it. Note: Limited browser support.


## Using methods to create controls

### Setting predefined sizes


**Global controls**
```
$('.ifr-size-selector').click(function(e) {
  e.preventDefault();
  var iframeWidth = $(this).attr('data-ifr-pre-width');
  var iframeHeight = $(this).attr('data-ifr-pre-height');
  $(document).iframeify('setIframeSize', {
    width: iframeWidth,
    height: iframeHeight
  };
});
```

**Individual controls**

```
$('.ifr-size-selector').click(function(e) {
  e.preventDefault();
  var iframeWidth = $(this).attr('data-ifr-pre-width');
  var iframeHeight = $(this).attr('data-ifr-pre-height');
  $(document).iframeify('setIframeSize', {
    width: iframeWidth,
    height: iframeHeight
  }, $('#iframe1')); // Target a specific faux iframe
});
```

### Reseting sizes

**Global controls**

```
$('.ifr-size-reset').click(function(e) {
  e.preventDefault();
  $(document).iframeify('resetIframesSize'); // Targets all faux iframes
});
```

**Individual controls**
```
$('.ifr-size-reset-spec').click(function(e) {
  e.preventDefault();
  $(document).iframeify('resetIframesSize', $('#iframe2')); // Target a specific faux iframe
});
```

## Events

### Matching media query

The function that matches the faux iframe size to media queries triggers an event, which can be listened to. This could, for example, be used to display the current width and height of the faux iframe.

```
$(document).on('iframeify.matchMediaQueries', function(e, el) {
  var $el = $(el); // This is the faux iframe
  var iframeWidth = $el.width();
  var iframeHeight = $el.height();
  var $sizeElement = $el.find('.iframe-size');
  $sizeElement.find('.width').text(iframeWidth);
  $sizeElement.find('.height').text(iframeHeight);
});
```

## Example use

Example can be found here:

[https://vixxofsweden.com/code/iframeify/](https://vixxofsweden.com/code/iframeify/)
