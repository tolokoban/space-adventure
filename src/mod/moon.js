/**
 * Manage the obstacles.
 */
"use strict";

var G = require("global");
var Rnd = require("random");
var Hero = require("hero");
var Programs = require("programs");
var ImageLoader = require("image-loader");


// Number of attributes for an obstacle.
var PARTICLE_SIZE = 5;

var gl = null;
// Atributes of all the obstacles.
var attribs;
var buffer;
// Shader program.
var prg;
// Last time a particle was created.
var lastEmission = 0;
// Normals map.
var image;
// As soon as the  hero steps in a new column, that we  add a new moon
// in front of him.
var lastColForHero = -555;

exports.ready = new Promise(function (resolve, reject) {
    ImageLoader({ moon: "moon.png" }).then(function(data) {
        image = data.moon;
        resolve();
    });
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
        r = ( G.COL_H / 12 ) * ( .7 + .6 * Rnd() );
        x = Rnd() * G.COL_W + i * G.COL_W;
        y = Rnd() * G.COL_H;

        attribs[ptr++] = x;
        attribs[ptr++] = y;
        attribs[ptr++] = r;
        attribs[ptr++] = Rnd();
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
    gl.vertexAttribPointer( prg.$attPos, 2, gl.FLOAT, false, size, 0 * G.BPE );
    // attSize
    gl.enableVertexAttribArray( prg.$attSize );
    gl.vertexAttribPointer( prg.$attSize, 1, gl.FLOAT, false, size, 2 * G.BPE );
    // attRnd1
    gl.enableVertexAttribArray( prg.$attRnd1 );
    gl.vertexAttribPointer( prg.$attRnd1, 1, gl.FLOAT, false, size, 3 * G.BPE );
    // attRnd2
    gl.enableVertexAttribArray( prg.$attRnd2 );
    gl.vertexAttribPointer( prg.$attRnd2, 1, gl.FLOAT, false, size, 3 * G.BPE );

    // Draw this POINTS.
    gl.drawArrays( gl.POINTS, 0, G.NB_COLS );
};


exports.move = function( time ) {
    // While the hero is in collision status, it is invincible.
    if( Hero.isInCollision( time ) ) return;

    var x = Hero.x();
    var y = Hero.y();

    // Current column.
    var col = ( x / G.COL_W ) << 0; // optimization of the following code: Math.floor( x / G.COL_W );
    if( col != lastColForHero ) {
        lastColForHero = col;
        // Add a new moon in a column for ahead.
        col = Math.ceil( col + G.NB_COLS / 2 ) % G.NB_COLS;
        var ptr = col * 5;
        var r = ( G.COL_H / 12 ) * ( .7 + .6 * Rnd() );

        attribs[ptr++] = (col + Rnd()) * G.COL_W;
        attribs[ptr++] = y + r * (Rnd() - .5);
        attribs[ptr++] = r;
        attribs[ptr++] = Rnd();
        attribs[ptr++] = Rnd();
    }

    // Collision testing.
    var idx1 = ( x / G.COL_W ) << 0;  // Math.floor(...)
    var idx0 = (idx1 + G.NB_COLS - 1) % G.NB_COLS;
    var idx2 = (idx1 + 1) % G.NB_COLS;

    idx0 *= PARTICLE_SIZE;
    idx1 *= PARTICLE_SIZE;
    idx2 *= PARTICLE_SIZE;

    var dis, dx, dy, limit;

    dx = attribs[idx0 + 0] - x;
    dy = attribs[idx0 + 1] - y;
    limit = Hero.size() + attribs[idx0 + 2];
    dis = dx*dx + dy*dy;
    if( dis < limit * limit ) {
        return Hero.collision( time, dy );
    }

    dx = attribs[idx1 + 0] - x;
    dy = attribs[idx1 + 1] - y;
    limit = Hero.size() + attribs[idx1 + 2];
    dis = dx*dx + dy*dy;
    if( dis < limit * limit ) {
        return Hero.collision( time, dy );
    }

    dx = attribs[idx2 + 0] - x;
    dy = attribs[idx2 + 1] - y;
    limit = Hero.size() + attribs[idx2 + 2];
    dis = dx*dx + dy*dy;
    if( dis < limit * limit ) {
        return Hero.collision( time, dy );
    }
};


exports.makeTerrain = function( hole ) {
    var canvas = document.createElement( "canvas" );
    canvas.setAttribute( "width", 128 );
    canvas.setAttribute( "height", 128 );
    var ctx = canvas.getContext( "2d" );
    ctx.fillStyle = "rgb(127, 127, 255)";
    ctx.fillRect(0,0,128,128);
    var x, y, r, i, j;
    for( var loop=0; loop<2; loop++ ) {
        r = Rnd() * 8 + 16;
        x = Rnd() * 128;
        y = Rnd() * (96 - r) + 32;
        for( i=-1; i<2; i++ ) {
            for( j=-1; j<2; j++ ) {
                ctx.drawImage( hole, x + i * 128, y + j * 128, r, r );
            }
        }
    }
    return canvas;
};
