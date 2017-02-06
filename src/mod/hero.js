/**
 * Manage the hero.
 */
"use strict";

var G = require("global");
var Rnd = require("random");
var Programs = require("programs");
var ImageLoader = require("image-loader");
var EventHandler = require("event-handler");

// PI to optimize the Math.PI code.
var PI = Math.PI;
// This is what brakes the movement.
var GRAVITY = 1600;
// Maximum horizontal speed.
var MAX_SPEED = G.COL_W * 2;
// Acceleration to reach the MAX_SPEED;
var ACCEL = 600;
var accel = 0;

var gl = null;
// Atributes of all the particles.
var attribs;
// Buffer in WebGL memory to store attributes.
var buffer;
// Hero's texture.
var texture;
// Hero's image used to produe the texture.
var image;
// Shader program.
var prg;
// X, Y
var x, y;
// Speed
var vx, vy;
// Size
var size;
// Lastime the hero was displayed.
var lastTime;
// Time of the last collision.
var collisionTime = 0;


exports.ready = new Promise(function (resolve, reject) {
    ImageLoader({ hero: "hero.png" }).then(function(data) {
        image = data.hero;
        resolve();
    });
});


exports.start = function() {
    accel = ACCEL;
};


exports.reset = function( argGL ) {
    if( !gl ) {
        gl = argGL;
        buffer = gl.createBuffer();
        prg = Programs( gl, 'Hero' );
    }
    attribs = new Float32Array( 4 * 4 );

    lastTime = 0;
    x = .5 * (G.NB_COLS * G.COL_W);
    y = .5 * G.COL_H;
    vx = 0;
    vy = 0;
    size = G.COL_H / 16;
    // Last collision was long time ago.
    collisionTime = -666;
    
    EventHandler.on(function( dir ) {
        vy = 777 * dir;
    });
    EventHandler.start();
};


exports.draw = function( time ) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    G.setGlobalUniforms( prg, time );

    prg.$uniCollision = collisionTime;
    
    // Update  hero position.   There  are 4  vertices.   Each one  is
    // defined  by  a  center,  a  radius and  an  angle.   This  made
    // rotations easier.
    attribs[0] = x;           // x
    attribs[1] = y;           // y
    attribs[2] = size;        // z
    attribs[3] = PI * 0.25;  // w
    attribs[4] = x;
    attribs[5] = y;
    attribs[6] = size;
    attribs[7] = PI * 0.75;
    attribs[8] = x;
    attribs[9] = y;
    attribs[10] = size;
    attribs[11] = PI * 1.25;
    attribs[12] = x;
    attribs[13] = y;
    attribs[14] = size;
    attribs[15] = PI * 1.75;

    // Rotate the hero according to vertical speed.
    var rotation = vy > 0 ? Math.sqrt(vy) : -Math.sqrt(-vy);
    rotation *= .02;
    // Limit rotation.
    rotation = Math.min( PI * .5, Math.max( -PI * .5, rotation ) );
    prg.$uniRotation = rotation;    

    // Set the active buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Paste attributes in this buffer.
    gl.bufferData(gl.ARRAY_BUFFER, attribs, gl.STATIC_DRAW);

    // attPos
    gl.enableVertexAttribArray( prg.$attPos );
    gl.vertexAttribPointer( prg.$attPos, 4, gl.FLOAT, false, 4 * G.BPE, 0 );

    // Draw this SQUARE.
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
};


exports.move = function( time ) {
    if( lastTime == 0 ) {
        lastTime = time;
        return;
    }
    var deltaTime = time - lastTime;
    lastTime = time;
    
    // Computing hero's position regarding to his speed.
    x = (x + vx * deltaTime) % G.GAME_W;
    if( vx < MAX_SPEED ) {
        vx = Math.min( MAX_SPEED, vx + accel * deltaTime * (vx < 0 ? 4 : 1) );
    }
    
    if( vy > 0) {
        vy -= GRAVITY * deltaTime;
        if( vy < 0 ) vy = 0;
    }
    else if( vy < 0) {
        vy += GRAVITY * deltaTime;
        if( vy > 0 ) vy = 0;
    }
    y += vy * deltaTime;
    if( y > G.GAME_H - size ) {
        y = G.GAME_H - size;
        vy = vy < 0 ? vy : -vy;
    }
    else if( y < size ) {
        y = size;
        vy = vy > 0 ? vy : -vy;  // abs( vy )
    }
};


exports.collision = function( time, dy ) {
    if( vx < 0 ) return;
    collisionTime = time;
    vy += (dy < 0 ? 1 : -1) * Rnd() * 1200;
    vx = vx < 0 ? vx : -vx;  // -Math.abs(...)
};


exports.collisionTime = function() {
    return collisionTime;
};


exports.isInCollision = function( time ) {
    return time - collisionTime < 1;
};


exports.x = function() { return x; };
exports.y = function() { return y; };
exports.vx = function() { return vx; };
exports.vy = function() { return vy; };
exports.size = function() { return size; };
