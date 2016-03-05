var sparklines = function sparklines ( el /*, aspectRatio */ ) {
    var aspectRatio = arguments.length > 1
            ? arguments[ 1 ]
            : false,
        namespaceURI = 'http://www.w3.org/2000/svg';

        var maxWidth = el.clientWidth,
            strokeWidth = 4,
            padding = 1,
            values = el
                .dataset
                .values
                .split( ',' )
                .map( function ( value ) { return parseFloat( value ); } ),
            svg = document.createElementNS( namespaceURI, 'svg' ),
            filled = el.classList.contains( 'sparkline-filled' ),
            scale, max, min, path, offset, pathString, fill, maxHeight;

        var buildPath = function () {
                path = document.createElementNS( namespaceURI, 'path' );

                pathString = 'M ' + padding + ' ' + calculateY( values[ 0 ] ).toFixed( 2 );

                for ( var j = 1; j < values.length; j++ ) {
                    pathString += ' L ' + ( j * offset + padding ) + ' ' + ( calculateY( values[ j ] ).toFixed( 2 ) );
                }
                path.setAttribute( 'd', pathString );
            },
            buildLine = function () {
                var y1 = calculateY( values[ 0 ] ).toFixed( 2 ),
                    y2 = calculateY( values[ 1 ] ).toFixed( 2 );
                path = document.createElementNS( namespaceURI, 'line' );
                path.setAttribute( 'x1', 0 );
                path.setAttribute( 'y1', y1 );
                path.setAttribute( 'x2', maxWidth );
                path.setAttribute( 'y2', y2 );
                if ( filled ) {
                    pathString = 'M 0 ' + y1 + ' L ' + maxWidth + ' ' + ( y2 );
                }
            },
            calculateY = function ( y ) {
                return Math.round( ( maxHeight - ( 2 * padding ) ) * ( ( y - min ) / ( max - min ) ) ) + padding;
            };

        // Figure out aspect ratio, if not passed in
        if ( ! aspectRatio ) {
            // Use the element height
            if ( el.clientHeight > 0 ) {
                aspectRatio = el.clientWidth / el.clientHeight;
            }
            // If the element has - height, check the parent
            else if ( el.parentElement.clientHeight > 0 ) {
                aspectRatio = el.clientWidth / el.parentElement.clientHeight;
            }
            // If we can't get a height, use a sensible default
            else {
                aspectRatio = 2.5;
            }
        }

        maxHeight = Math.round( maxWidth / aspectRatio );
        padding = maxHeight * 0.05;
        // maxHeight = 1000;

        // Get or calculate max and min Y values
        if ( undefined !== el.dataset.scale ) {
            scale = el.dataset.scale.split( ',' ).map( function ( value ) { return parseFloat( value ); } );
            min = scale[ 0 ];
            max = scale[ 1 ];

        }
        else {
            max = Math.max.apply( null, values );
            min = Math.min.apply( null, values );
        }

        // Build the SVG container
        svg.setAttribute( 'viewBox', '0 0 ' + maxWidth + ' ' +  maxHeight );
        svg.setAttribute( 'preserveAspectRatio', 'none' );

        offset = Math.floor( ( maxWidth -  ( 2 * padding ) ) / ( values.length - 1 ) );

        // Check if we are building a path or a line
        if ( values.length < 3 ) {
            buildLine();
        }
        else {
            buildPath();
        }

        path.setAttribute( 'fill', 'none' );
        path.setAttribute( 'stroke-linejoin', 'round' );
        path.setAttribute( 'transform', 'scale(1,-1) translate(0,-' + maxHeight + ')' );
        if ( el.dataset.dashed ) {
            path.setAttribute( 'stroke-dasharray', ( strokeWidth * 1.5 ) + '%, ' + ( strokeWidth * .75 ) + '%' );
        }

        svg.appendChild( path );

        if ( filled ) {
            pathString += ' V 0 H 0 Z';
            fill = document.createElementNS( namespaceURI, 'path' );
            fill.setAttribute( 'd', pathString );
            fill.setAttribute( 'stroke', 'none' );
            fill.setAttribute( 'transform', 'scale(1,-1) translate(0,-' + maxHeight + ')' );

            svg.appendChild( fill );
        }

        el.appendChild( svg );
};