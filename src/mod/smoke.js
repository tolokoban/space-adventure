/**
 * Manage the smoke behind the hero's spaceship.
 * Each smokeparticle has 4 attributes:
 *  - x, y: position.
 *  - birth: time of birth.
 *  - random: random value between 0 and 1.
 */
"use strict";

var G = require("global");
var Hero = require("hero");
var Programs = require("programs");


// Time in seconds between two particles emissions.
var PERIOD = .01;
// Number of attributes in a particle.
var PARTICLE_SIZE = 5;
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


exports.draw = function( time ) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
    gl.blendEquation(gl.FUNC_ADD);

    if( time - lastEmission > PERIOD ) {
        addParticle(
            time, Hero.x() - Math.random() * 30,
            Hero.y() - Math.random() * 30
        );
    }

    G.setGlobalUniforms( prg, time );
    prg.$uniCollision = Hero.collisionTime();

    // Set the active buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Paste attributes in this buffer.
    gl.bufferData(gl.ARRAY_BUFFER, attribs, gl.STATIC_DRAW);

    var size = G.BPE * PARTICLE_SIZE;
    // attPos
    gl.enableVertexAttribArray( prg.$attPos );
    gl.vertexAttribPointer( prg.$attPos, 4, gl.FLOAT, false, size, 0 );
    // attLight
    gl.enableVertexAttribArray( prg.$attLight );
    gl.vertexAttribPointer( prg.$attLight, 1, gl.FLOAT, false, size, 4 * G.BPE );

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
    attribs[idx++] = Math.min( 1, t - Hero.collisionTime() );    
    particleIndex = (particleIndex + 1) % NB_PARTICLES;
}
