var sparklines = function sparklines ( selector /*, aspectRatio */ ) {
    var aspectRatio = arguments.length > 1
            ? arguments[ 1 ]
            : 2.5,
        namespaceURI = 'http://www.w3.org/2000/svg',
        els = document.querySelectorAll( selector ),
        el;

    for ( var i = 0; i < els.length; i++ ) {
        el =  els[ i ];
            // Sensible defaults for the svg viewport; it scales
            // to the actual width of the svg element on render
        var maxWidth = Math.max( el.clientWidth, 1000 ),
            maxHeight = maxWidth / aspectRatio,
            padding = maxWidth * 0.02,
            strokeWidth = maxWidth * .006,
            values = el
                .dataset
                .values
                .split( ',' )
                .map( function ( value ) { return parseFloat( value ); } ),
            max = Math.max.apply( null, values ),
            min = Math.min.apply( null, values ),
            svg = document.createElementNS( namespaceURI, 'svg' ),
            path = document.createElementNS( namespaceURI, 'path' ),
            filled = el.classList.contains( 'sparkline-filled' ),
            offset, pathString, fill;


        var calculateY = function ( y ) {
            return relativeY = maxHeight * ( ( y - min ) / ( max - min ) );
        };

        svg.setAttribute( 'viewBox', '0 0 ' + maxWidth + ' ' +  maxHeight );
        svg.setAttribute( 'style', 'padding:' + strokeWidth / 2 + '%' );

        maxHeight -= padding * 2;
        maxWidth -= padding * 2;
        offset = Math.floor( maxWidth / ( values.length - 1 ) );

        pathString = 'M 0 ' + calculateY( values[ 0 ] ).toFixed( 2 );

        for ( var j = 1; j < values.length; j++ ) {
            pathString += ' L ' + ( j * offset ) + ' ' + ( calculateY( values[ j ] ).toFixed( 2 ) );
        }

        path.setAttribute( 'd', pathString );
        path.setAttribute( 'fill', 'none' );
        path.setAttribute( 'stroke-width', strokeWidth + '%' );
        path.setAttribute( 'stroke-linejoin', 'round' );
        path.setAttribute( 'transform', 'scale(1,-1) translate(0,-' + maxHeight + ')' );
        if ( el.dataset.dashed ) {
            path.setAttribute( 'stroke-dasharray', ( strokeWidth * 1.5 ) + '%, ' + ( strokeWidth * .75 ) + '%' );
        }
        svg.appendChild( path );

        if ( filled ) {
            pathString += 'V 0 H 0 Z'
            fill = document.createElementNS( namespaceURI, 'path' );
            fill.setAttribute( 'd', pathString );
            fill.setAttribute( 'stroke', 'none' );
            fill.setAttribute( 'transform', 'scale(1,-1) translate(0,-' + maxHeight + ')' );

            svg.appendChild( fill );
        }

        el.appendChild( svg );
    }
};

//# sourceMappingURL=datatables.js.map