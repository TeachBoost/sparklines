// Dependency on svg.js library
var sparklines = function sparklines ( el /*, aspectRatio */ ) {
    var maxWidth = el.clientWidth,
        padding = 0,
        values = el
            .dataset
            .values
            .split( ',' )
            .map( function ( value ) { return parseFloat( value ); } ),
        aspectRatio = arguments.length > 1
            ? arguments[ 1 ]
            : false,
        // filled = el.classList.contains( 'sparkline-filled' ),
        // grid = el.classList.contains( 'sparkline-grid' ),
        // @TODO check for class inclusion to determine grid inclusion, allow for "x-only" and "y-only"
        grid = true,
        svg, path,
        scale, max, min, xStep, yStep, maxHeight, pathArray;

        var buildGrid = function( ) {
            // @TODO check if "x-only" or "y-only"
            var grid = SVG( el ),
                pattern = grid.pattern( xStep, yStep, function ( add ) {
                    add.path( 'M ' + xStep + ' 0 L 0 0 L 0 ' + yStep )
                        .fill( 'none' )
                        .stroke( { width: 0.5  } )
                }),
                gridPath = grid.path( 'M ' + padding + ' ' + padding + ' H ' + ( maxWidth - 2 * padding + 1 ) + ' V ' + ( maxHeight - padding ) + ' H ' + padding + ' z' ).fill( pattern );

            pattern.x( padding );
            pattern.y( padding );

            grid.addClass( 'grid' );
        };

        var buildPathArray = function( ) {
            var calculateY = function ( y ) {
                    return Math.round( ( maxHeight - ( 2 * padding ) ) * ( ( y - min ) / ( max - min ) ) ) + padding;
                },
                pathValues = values.map( function( value, index ) {
                    var xValue = index * xStep + padding,
                        yValue = calculateY( value ) ;

                    return [ ( index == 0 ) ? 'M' : 'L', xValue, yValue ];

                });
            // @TODO
            // if ( filled ) {
            //     pathString = 'M 0 ' + y1 + ' L ' + maxWidth + ' ' + ( y2 );
            // }

            return pathValues;
        };

        // Figure out aspect ratio, if not passed in
        if ( ! aspectRatio ) {
            // Use the element height
            if ( el.clientHeight > 0 ) {
                aspectRatio = el.clientWidth / el.clientHeight;
            }
            // If the element has 0 height, check the parent
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

        // Calculate the how far apart each X and Y point should be
        xStep = Math.floor( ( maxWidth -  ( 2 * padding ) ) / ( values.length - 1 ) );
        yStep = ( maxHeight - 2 * padding - 1 ) / ( max - 1 );

        // Build the SVG container
        svg = SVG( el );
        svg.viewbox( 0, 0, maxWidth, maxHeight )
            .attr( 'preserveAspectRatio', 'none' )
            .addClass( 'plot' );

        // Check if we are building a path or a line
        if ( values.length === 2 ) {
            var y1 = calculateY( values[ 0 ] ).toFixed( 2 ),
                y2 = calculateY( values[ 1 ] ).toFixed( 2 );

            path = svg.line( 0, y1, maxWidth, y2 );
        }
        else if ( values.length > 2 ) {
            pathArray = new SVG.PathArray( buildPathArray( ) );
            path = svg.path( pathArray );
        }
        else {
            console.log( 'Need to deal with a single point line?' );
        }

        // Build the reference grid
        if ( grid ) {
            buildGrid();
        }

        path.fill( 'none' )
            .transform( { scaleX: 1, scaleY: -1 } )
            .attr( 'stroke-linejoin', 'round' );

        if ( el.dataset.dashed ) {
            path.attr( 'stroke-dasharray', ( strokeWidth * 1.5 ) + '%, ' + ( strokeWidth * .75 ) + '%' );
        }
};