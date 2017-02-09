/**
 * Manage the stars behind the hero's spaceship.
 * Each star particle has 4 attributes:
 *  - x, y, z: position.
 *  - random: random value between 0 and 1.
 */
"use strict";

var G = require("global");
var Rnd = require("random");
var Programs = require("programs");


// Number of attributes in a particle.
var PARTICLE_SIZE = 4;
// Number of particles.
var NB_PARTICLES = 80;


var gl = null;
// Atributes of all the particles.
var attribs;
var buffer;
// Shader program.
var prg;


exports.ready = new Promise(function (resolve, reject) {
    resolve();
});

exports.reset = function( argGL ) {
    if( !gl ) {
        gl = argGL;
        buffer = gl.createBuffer();
        prg = Programs( gl, 'Stars' );
    }
    attribs = new Float32Array( PARTICLE_SIZE * NB_PARTICLES );
    buffer = gl.createBuffer();

    var ptr = 0;
    for( var i=0 ; i<NB_PARTICLES ; i++ ) {
        attribs[ptr++] = G.GAME_W * Rnd();
        attribs[ptr++] = G.GAME_H * Rnd();
        attribs[ptr++] = .25 + .5 * Rnd();
        attribs[ptr++] = Rnd();        
    }
};


exports.draw = function( time ) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
    gl.blendEquation(gl.FUNC_ADD);

    G.setGlobalUniforms( prg, time );

    // Set the active buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Paste attributes in this buffer.
    gl.bufferData(gl.ARRAY_BUFFER, attribs, gl.STATIC_DRAW);

    var size = G.BPE * PARTICLE_SIZE;
    // attPos
    gl.enableVertexAttribArray( prg.$attPos );
    gl.vertexAttribPointer( prg.$attPos, 4, gl.FLOAT, false, size, 0 );

    // Draw this POINTS.
    gl.drawArrays( gl.POINTS, 0, NB_PARTICLES );
};
