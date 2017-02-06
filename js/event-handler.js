/** @module event-handler */require( 'event-handler', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

var on = function() {};
var start = false;

module.exports = {
    on: function(slot) { on = slot; },
    start: function() { start = true; },
    stop: function() { start = false; }
};

document.addEventListener( 'keyup', function(evt) {
    if( !start ) return;
    if( evt.keyCode == 38 ) {
        on( +1 );
}
    else if( evt.keyCode == 40 ) {
        on( -1 );
    }
});

var X, Y;
document.addEventListener( 'touchstart', function(evt) {
    var t = evt.changedTouches[0];
    X = t.clientX;
    Y = t.clientY;
});
document.addEventListener( 'touchend', function(evt) {
    var t = evt.changedTouches[0];
    var x = t.clientX - X;
    var y = t.clientY - Y;
    if( Math.abs( x ) > Math.abs( y ) ) {
        // This is a fire gesture. TODO...
        return;
    }
    if( y < 0 ) return on( +1 );
    if( y > 0 ) return on( -1 );
});


  
module.exports._ = _;
/**
 * @module event-handler
 * @see module:$

 */
});