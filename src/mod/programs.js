/**
 * Manage all the shaders programs.
 */

"use strict";

var WebGL = require("tfw.webgl");


module.exports = function( gl, name ) {
    var vert = GLOBAL['vert' + name];
    if( !vert ) throw Error("Vertex shader not found: " + 'vert' + name + "!");
    var frag = GLOBAL['frag' + name];
    if( !frag ) throw Error("Fragment shader not found: " + 'frag' + name + "!");
    
    return new WebGL.Program(gl, {
        vert: vert,
        frag: frag
    }, GLOBAL);
};
