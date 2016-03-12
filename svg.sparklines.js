// Dependency on svg.js library
var sparklines = function sparklines ( el /*, aspectRatio */ ) {
    var maxWidth = el.clientWidth,
        padding = 0,
        values = el
            .dataset
            .values
            .split( ',' )
            .map( function ( value ) {
                return ( value ) ? parseFloat( value ) : 0;
            }),
        aspectRatio = arguments.length > 1
            ? arguments[ 1 ]
            : false,
        gridSettings = el.dataset.grid,
        plot, grid, path,
        // filled = el.classList.contains( 'sparkline-filled' ),
        // grid = el.classList.contains( 'sparkline-grid' ),
        // @TODO check for class inclusion to determine grid inclusion, allow for "x-only" and "y-only"
        scale, max, min, xStep, yStep, maxHeight, pathArray, y1, y2;

        var buildGrid = function ( ) {
            var xGridLine, yGridLine;

            pathArray.forEach( function ( segment ) {
                if ( gridSettings.indexOf( 'x' ) > - 1 ) {
                    xGridLine = plot.line(
                        segment[ 1 ],
                        padding,
                        segment[ 1 ],
                        maxHeight - padding );
                    xGridLine.addClass( 'grid' );
                }
                if ( gridSettings.indexOf( 'y' ) > - 1 ) {
                    yGridLine = plot.line(
                        padding,
                        segment[ 2 ],
                        maxWidth - ( padding * 2 ),
                        segment[ 2 ] );
                    yGridLine.addClass( 'grid' );
                }
            });
        };

        var calculateY = function ( y ) {
            var aVal = maxHeight - ( 2 * padding ),
                bVal = ( y - min ) / ( max - min );
            return Math.round( aVal * bVal ) + padding;
        };

        var buildPathArray = function () {
            var pathValues = values.map( function ( value, index ) {
                var xValue = ( index * xStep ) + padding,
                    yValue = calculateY( value );

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
            scale = el.dataset.scale.split( ',' ).map(
                function ( value ) {
                    return ( value ) ? parseFloat( value ) : 0;
                });
            min = scale[ 0 ];
            max = scale[ 1 ];
        }
        else {
            max = Math.max.apply( null, values );
            min = Math.min.apply( null, values );
        }

        // Calculate the how far apart each X and Y point should be
        xStep = Math.floor( ( maxWidth -  ( 2 * padding ) ) / ( values.length - 1 ) );
        yStep = ( maxHeight - ( 2 * padding ) - 1 ) / ( max - 1 );

        // Build the SVG container
        plot = SVG( el );
        plot.viewbox( 0, 0, maxWidth, maxHeight )
            .attr( 'preserveAspectRatio', 'none' )
            .addClass( 'plot' );

        // Check if we are building a path or a line
        if ( values.length === 2 ) {
            y1 = calculateY( values[ 0 ] ).toFixed( 2 );
            y2 = calculateY( values[ 1 ] ).toFixed( 2 );
            pathArray = [ [ 'M', padding, y1 ], [ 'L', maxWidth - ( padding * 2 ), y2 ] ];
        }
        else if ( values.length > 2 ) {
            // Both the grid and plot need the path array
            pathArray = buildPathArray( );
        }
        else {
            y1 = calculateY( values[ 0 ] ).toFixed( 2 );
            pathArray = [ [ 'M', padding, y1 ], [ 'L', maxWidth - ( padding * 2 ), y1 ] ];
        }
        // Build the grid lines first so they render under the plot
        if ( gridSettings ) {
            buildGrid();
        }

        path = plot.path( pathArray );
        path.fill( 'none' )
            .transform( { scaleX: 1, scaleY: -1 } )
            .translate( 0, maxHeight )
            .attr( 'stroke-linejoin', 'round' );

        if ( el.dataset.dashed ) {
            path.attr( 'stroke-dasharray', ( strokeWidth * 1.5 ) + '%, ' + ( strokeWidth * .75 ) + '%' );
        }
};