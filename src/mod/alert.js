/**
 * @module alert
 * 
 * Display a message and wait for  touch or Enter/Space key. Then call
 * a callback function.
 */

"use strict";


var screen = null;
var callbackFunction;


/**
 * @param {string} msg - HTML code to display.
 * @param {function} callback - Function to call when the user touch the screen or hit Enter or Space.
 */
module.exports = function( msg, callback ) {
    callbackFunction = callback;
    var body = document.body;
    if( screen ) {
        body.removeChild( screen );
    }
    screen = document.createElement( 'div' );
    screen.className = 'alert show';
    var cell = document.createElement( 'div' );
    cell.innerHTML = msg;
    screen.appendChild( cell );
    body.appendChild( screen );

    body.addEventListener( 'keyup', onkeyup, true );
    body.addEventListener( 'touchend', ontouchend, true );
};


function onkeyup(evt) {
    if( evt.keyCode == 32 || evt.keyCode == 13 ) {
        detach();
    }
}


function ontouchend() {
    detach();
}


function detach() {
    if( !screen ) return;
    screen.className = 'alert';
    document.body.removeEventListener( 'keyup', onkeyup );
    document.body.removeEventListener( 'touchend', ontouchend );
    // CSS transition takes .3 seconds.  That's why we wait .3 seconds
    // before calling the callback function.
    window.setTimeout(function() {
        if( screen ) {
            document.body.removeChild( screen );
            screen = null;
            if( typeof callbackFunction === 'function' ) {
                callbackFunction();
            }
        }
    }, 300);
}
