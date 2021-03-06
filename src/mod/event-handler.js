"use strict";

var on = function() {};
var start = false;

module.exports = {
    on: function(slot) { on = slot; },
    start: function() { start = true; },
    stop: function() { start = false; }
};

document.addEventListener( 'keydown', function(evt) {
    if( !start ) return;
    if( evt.keyCode == 38 ) {
        on( +1 );
}
    else if( evt.keyCode == 40 ) {
        on( -1 );
    }
});

var X, Y, T;
document.addEventListener( 'touchstart', function(evt) {
    var t = evt.changedTouches[0];
    X = t.clientX;
    Y = t.clientY;
    T = Date.now();
});
document.addEventListener( 'touchmove', function(evt) {
    var t = evt.changedTouches[0];
    var x = t.clientX - X;
    var y = t.clientY - Y;
    if( (x > 0 ? x : -x) > (y > 0 ? y : -y) ) {
        // Fire!
        on( 0 );
    }
    var speed = (y > 0 ? y : -y) / ((Date.now() - T) * window.innerHeight);
    speed *= 1000;
    speed = Math.min( 2, speed < 1 ? 1 : speed );
    if( y < 0 ) return on( +speed );
    if( y > 0 ) return on( -speed );

    X = t.clientX;
    Y = t.clientY;
    T = Date.now();
});
