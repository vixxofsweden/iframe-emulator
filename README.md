# iframeify
Use a div to display responsive patterns like you would inside an iframe

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

### Options

- `containerSelector`: the classes on your iframe emulators (divs)
- `stylesheetClass`: if you only want specific stylesheets to be targeted
- `classPrefix`: class prefix for dynamically generated elements
- `bodyClass`: class that is applied to the body when the iframe mode is enabled
- `onWindowResize`: this will trigger a window resize event (this can be used if you control some aspects of the responsiveness by JavaScript, unless you trigger it by checking the window width)

## Example use

Example can be found here:

[https://s.codepen.io/vixxofsweden/debug/ZqVZzo]https://s.codepen.io/vixxofsweden/debug/ZqVZzo


### Using methods to create options

#### Setting predefined sizes

```
$('.ifem-size-selector').click(function(e) {
  e.preventDefault();
  var iframeWidth = $(this).attr('data-ifem-pre-width');
  var iframeHeight = $(this).attr('data-ifem-pre-height');
  $(document).iframeify('setIframeSize', {
    width: iframeWidth,
    height: iframeHeight
  });
});
```

#### Reseting sizes
```
$('.ifem-size-reset').click(function(e) {
  e.preventDefault();
  $(document).iframeify('resetIframesSize');
});
```
