/**
 * Manage the obstacles.
 */
"use strict";

var G = require("global");
var Programs = require("programs");

// Number of attributes for an obstacle.
var PARTICLE_SIZE = 4;

var gl = null;
// Atributes of all the obstacles.
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
        prg = Programs( gl, 'Moon' );
    }
    attribs = new Float32Array( PARTICLE_SIZE * G.NB_COLS );
    buffer = gl.createBuffer();

    var ptr = 0;
    var r, x, y;

    for( var i=0; i<G.NB_COLS; i++ ) {
        r = ( G.COL_H / 6 ) * ( .7 + .6 * Math.random() );
        x = Math.random() * G.COL_W + i * G.COL_W;
        y = Math.random() * (G.COL_H - 2 * r) + r;
        attribs[ptr++] = 1;  // Type.
        attribs[ptr++] = x;
        attribs[ptr++] = y;
        attribs[ptr++] = r;
    }
};


exports.draw = function( time ) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    G.setGlobalUniforms( prg, time );

    // Set the active buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Paste attributes in this buffer.
    gl.bufferData(gl.ARRAY_BUFFER, attribs, gl.STATIC_DRAW);

    var size = G.BPE * PARTICLE_SIZE;
    // attTypd
    gl.enableVertexAttribArray( prg.$attType );
    gl.vertexAttribPointer( prg.$attType, 1, gl.FLOAT, false, size, 0 );
    // attPos
    gl.enableVertexAttribArray( prg.$attPos );
    gl.vertexAttribPointer( prg.$attPos, 2, gl.FLOAT, false, size, 1 * G.BPE );
    // attSize
    gl.enableVertexAttribArray( prg.$attSize );
    gl.vertexAttribPointer( prg.$attSize, 1, gl.FLOAT, false, size, 3 * G.BPE );

    // Draw this POINTS.
    gl.drawArrays( gl.POINTS, 0, G.NB_COLS );
};
