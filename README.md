# iframe-emulator
Use a div to display responsive patterns like you would inside an iframe

## Currently works with the following types of media queries:

- max-width
- min-width
- min-width to max-width

## Initialise

```
var options = {
  containerSelector: '.iframe',
  stylesheetClass: 'ifem-iframe-stylesheet',
  classPrefix: 'ifem',
  bodyClass: 'ifem-active'
}

$(document).iframeEmulator(options);
```

### Options

- `containerSelector`: the classes on your iframe emulators (divs)
- `stylesheetClass`: if you only want specific stylesheets to be targeted
- `classPrefix`: class prefix for dynamically generated elements
- `bodyClass`: class that is applied to the body when the iframe mode is enabled

## Example use

Example here:

[https://s.codepen.io/vixxofsweden/debug/ZqVZzo]https://s.codepen.io/vixxofsweden/debug/ZqVZzo


### Using methods to create options

#### Setting predefined sizes

```
$('.ifem-size-selector').click(function(e) {
  e.preventDefault();
  var iframeWidth = $(this).attr('data-ifem-pre-width');
  var iframeHeight = $(this).attr('data-ifem-pre-height');
  $(document).iframeEmulator('setIframeSize', {
    width: iframeWidth,
    height: iframeHeight
  });
});
```

#### Reseting sizes
```
$('.ifem-size-reset').click(function(e) {
  e.preventDefault();
  $(document).iframeEmulator('resetIframesSize');
});
```
