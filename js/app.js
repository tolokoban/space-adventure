/** @module app */require( 'app', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";
var WebGL = require("tfw.webgl");
var Play = require("play");

var canvas = document.getElementById( "canvas" );
var renderer = new WebGL.Renderer( canvas );
var playReady = Play.init( renderer.gl, canvas );


playReady.then(function() {
    Play.reset();

    renderer.start(function( time ) {
        // Managing resize.
        canvas.setAttribute( 'width', screen.width );
        canvas.setAttribute( 'height', screen.height );
        renderer.gl.viewport( 0, 0, screen.width, screen.height );
        // Drawing the scene.
        Play.draw( time );
    });
});


  
module.exports._ = _;
/**
 * @module app
 * @see module:$
 * @see module:tfw.webgl
 * @see module:play

 */
});