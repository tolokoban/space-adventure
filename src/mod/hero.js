/**
 * Manage the hero.
 */
"use strict";

var Programs = require("programs");


var gl = null;
// Atributes of all the particles.
var attribs;
var buffer;
// Shader program.
var prg;
// X, Y
var x, y;
// Speed
var vx, vy;


exports.ready = new new Promise(function (resolve, reject) {
    resolve();
});

exports.reset = function( argGL ) {
    if( !gl ) {
        gl = argGL;
        buffer = gl.createBuffer();
        prg = Programs( gl, 'hero' );
    }
    attribs = new Float32Array( 4 * MAX_SMOKES );
};


/**
 * TODO!!!
 */
exports.draw = function( time ) {

};


exports.x = function() { return x; };
exports.y = function() { return y; };
exports.vx = function() { return vx; };
exports.vy = function() { return vy; };
