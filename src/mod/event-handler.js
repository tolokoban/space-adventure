"use strict";

var on = function() {};
var start = false;

var lastX, lastY;

module.exports = {
    on: function(slot) { on = slot; },
    start: function() { start = true; },
    stop: function() { start = false; }
};

document.addEventListener( 'keydown', function(evt) {
    if( !start ) return;
    if( evt.keyCode == 38 ) on( +1 );
    if( evt.keyCode == 40 ) on( -1 );
});
document.addEventListener( 'touchstart', function(evt) {
    var touch = evt.changedTouches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
});
document.addEventListener( 'touchend', function(evt) {
    var touch = evt.changedTouches[0];
    var vx = touch.clientX - lastX;
    var vy = touch.clientY - lastY;
    if( Math.abs( vx ) > Math.abs( vy ) ) return;
    if( vy > 0 ) {
        on( -1 );
    } else {
        on( +1 );
    }
});
