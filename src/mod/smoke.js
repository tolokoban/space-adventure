/**
 * Manage the smoke behind the hero's spaceship.
 * Each smokeparticle has 4 attributes:
 *  - x, y: position.
 *  - birth: time of birth.
 *  - random: random value between 0 and 1.
 */
"use strict";

var G = require("global");
var Programs = require("programs");


// Time in seconds between two particles emissions.
var PERIOD = .01;
// Number of attributes in a particle.
var PARTICLE_SIZE = 4;
// Number of particles.
var NB_PARTICLES = 100;


var gl = null;
// Index of the next free slot where to create a new smoke particle.
var particleIndex = 0;
// Atributes of all the particles.
var attribs;
var buffer;
// Shader program.
var prg;
// Last time a particle was created.
var lastEmission = 0;


exports.ready = new Promise(function (resolve, reject) {
    resolve();
});

exports.reset = function( argGL ) {
    if( !gl ) {
        gl = argGL;
        buffer = gl.createBuffer();
        prg = Programs( gl, 'Smoke' );
    }
    attribs = new Float32Array( PARTICLE_SIZE * NB_PARTICLES );
    buffer = gl.createBuffer();
    
};


exports.draw = function( time, x, y ) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    if( time - lastEmission > PERIOD ) {
        console.log("Emit!");
        addParticle( time, x - Math.random() * 30, y - Math.random() * 30 );
    }

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


function addParticle(t, x, y) {
    lastEmission = t;
    var idx = PARTICLE_SIZE * particleIndex;
    attribs[idx++] = x - 10;
    attribs[idx++] = y - 40;
    attribs[idx++] = t;
    attribs[idx++] = Math.random();
    particleIndex = (particleIndex + 1) % NB_PARTICLES;
}
