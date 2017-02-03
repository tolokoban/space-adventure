/**
 * Manage the hero.
 */
"use strict";

var G = require("global");
var Programs = require("programs");
var ImageLoader = require("image-loader");
var EventHandler = require("event-handler");

// This is what brakes the movement.
var GRAVITY = 1600;

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
    vx = G.COL_W * .8;
    vy = 0;
    size = G.COL_H / 16;
    console.log( x, y, G );    

    // Prepare texture for hero.
    texture = gl.createTexture();
    // Create a texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Upload the image into the texture.
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false );
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA,
        //heroImg.width, heroImg.height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE,
        image);

    EventHandler.on(function( dir ) {
        vy = 666 * dir;
    });
    EventHandler.start();
};


exports.draw = function( time ) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    G.setGlobalUniforms( prg, time );

    // Update  hero position.   There  are 4  vertices.   Each one  is
    // defined  by  a  center,  a  radius and  an  angle.   This  made
    // rotations easier.
    attribs[0] = x;           // x
    attribs[1] = y;           // y
    attribs[2] = size;        // z
    attribs[3] = Math.PI * 0.25;  // w
    attribs[4] = x;
    attribs[5] = y;
    attribs[6] = size;
    attribs[7] = Math.PI * 0.75;
    attribs[8] = x;
    attribs[9] = y;
    attribs[10] = size;
    attribs[11] = Math.PI * 1.25;
    attribs[12] = x;
    attribs[13] = y;
    attribs[14] = size;
    attribs[15] = Math.PI * 1.75;

    // Rotate the hero according to vertical speed.
    var rotation = vy > 0 ? Math.sqrt(vy) : -Math.sqrt(-vy);
    rotation *= .02;
    // Limit rotation.
    rotation = Math.min( Math.PI * .5, Math.max( -Math.PI * .5, rotation ) );
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
    
    // Computing hero's position regarding his speed.
    x = (G.COL_W * .5 + vx * time) % G.GAME_W;

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
        vy = -Math.abs( vy );
    }
    else if( y < size ) {
        y = size;
        vy = Math.abs( vy );
    }
};


exports.collision = function( time ) {
    collisionTime = time;
    //console.info("[hero] collisionTime=...", collisionTime);
};

exports.x = function() { return x; };
exports.y = function() { return y; };
exports.vx = function() { return vx; };
exports.vy = function() { return vy; };
exports.size = function() { return size; };
