/** @module event-handler */require( 'event-handler', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

var onDown = function() {};
var onUp = function() {};
var start = false;

module.exports = {
    onDown: function(slot) { onDown = slot; },
    onUp: function(slot) { onUp = slot; },
    start: function() { start = true; },
    stop: function() { start = false; }
};

function down( evt ) {
    if( start ) onDown();
}

function up( evt ) {
    if( start ) onUp();
}

document.addEventListener( 'keydown', down );
document.addEventListener( 'keyup', up );
document.addEventListener( 'touchstart', down );
document.addEventListener( 'touchend', up );


  
module.exports._ = _;
/**
 * @module event-handler
 * @see module:$

 */
});