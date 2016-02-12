# Library to generate SVG sparklines

## Usage

### HTML
``` html
<div class="sparkline" data-values="1,4,3,6,5"></div>
<div class="sparkline sparkline-filled" data-values="1,4,3,6,5"></div>
<script src="sparklines.js"></script>
```

### Javascript
Pass a selector to the function.
``` javascript
sparklines( '.sparkline' );
```
Optionally pass an aspectRatio.
``` javascript
var el = document.getElementById( 'foo' ),
    aspectRatio = foo.clientWidth / foo.clientHeight;

sparklines( '.sparkline', aspectRatio );

// OR

sparklines( '.sparkline', 2.5 )
```

### CSS
Set line and fill colors.
``` css
.sparkline svg {
    stroke: rgb( 70, 200, 255 );
}
.sparkline-filled svg {
    fill: rgba( 70, 200, 255, 0.25 );
}
```
