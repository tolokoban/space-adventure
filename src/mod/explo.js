/**
 * Manage the explosions.
 * Each explo-particle has 4 attributes:
 *  - x, y: position.
 *  - birth: time of birth.
 *  - random: random value between 0 and 1.
 */
"use strict";

var G = require("global");
var Rnd = require("random");
var Programs = require("programs");


// Time in seconds between two particles emissions.
var PERIOD = .01;
// Number of attributes in a particle.
var PARTICLE_SIZE = 4;
// Number of particles. This the  maximum number of explosions that we
// can see at the same time.
var NB_PARTICLES = 6;


var gl = null;
// Index of the next free slot where to create a new explo particle.
var particleIndex = 0;
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
        prg = Programs( gl, 'Explo' );
    }
    attribs = new Float32Array( PARTICLE_SIZE * NB_PARTICLES );
    buffer = gl.createBuffer();

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


exports.newExplosion = function(x, y, t, r) {
    var idx;
    idx = PARTICLE_SIZE * particleIndex;
    attribs[idx++] = x;
    attribs[idx++] = y;
    attribs[idx++] = t;
    attribs[idx++] = r * 2;
    particleIndex = (particleIndex + 1) % NB_PARTICLES;
};
