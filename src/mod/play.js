/**
 * This singleton manages the main scene, where the hero is trying to avoi asteroids.
 */
"use strict";

var G = require("global");
var Hero = require("hero");
var Moon = require("moon");
var Smoke = require("smoke");
var WebGL = require("tfw.webgl");
var ImageLoader = require("image-loader");
var EventHandler = require("event-handler");


//========================= Constants.

// Vertical acceleration in space's pixels per second.
var GRAVITY = 1600;
// Hardware size of a Float32.
var BPE = new Float32Array().BYTES_PER_ELEMENT;
// Square root of 2. We compute it only one time.
var SQRT2 = Math.sqrt( 2 );


//========================= Variables.

// WebGL context.
var gl;
// Canvas. Used to get display width and height.
var canvas;

// Hero variables.
var heroX, heroY;
var heroVX;  // Horizontal movement of the Hero in space's pixels per second.
var heroVY;  // Vertical speed in space's pixels per second.
var heroCol; // Current column's index in which the hero is.
var heroLastTime; // We keep the time of the hero's birth.
var heroImg; // Image of the hero's spaceship.
var heroSize; // Height if the hero in space's pixels.

// WebGL stuff for the hero.
var heroProgram;   // Shader program.
var heroBuffer;    // Will contain the attributes in GL memory.
var heroAttribs = new Float32Array(4 * 4);   // [x, y, u, v] * 4.
var heroTexture;

var blink = false;


//========================= init().

exports.init = function( argGl, argCanvas ) {
    gl = argGl;
    canvas = argCanvas;
    return new Promise(function (resolve, reject) {
        Hero.ready.then(function() {
            ImageLoader({ hero: "hero.png" }).then(function(data) {
                heroImg = data.hero;
                resolve();
            });
        });
    });
};


//========================= reset().

exports.reset = function() {
    Hero.reset( gl );
    Moon.reset( gl );
    Smoke.reset( gl );

    heroX = .5 * (G.NB_COLS * G.COL_W);
    heroY = .5 * G.COL_H;
    heroVX = G.COL_W * .5;
    heroVY = 5;
    heroSize = G.COL_H / 16;
    console.log( heroX, heroY, G );

    // We set 0 to tell draw() it has to set the time iiself.
    heroLastTime = 0;

    heroProgram = new WebGL.Program(gl, {
        vert: GLOBAL.vertHero,
        frag: GLOBAL.fragHero
    }, GLOBAL);

    // Create the hero buffer in GL memory.
    heroBuffer = gl.createBuffer();
    // Prepare texture for hero.
    heroTexture = gl.createTexture();
    // Create a texture.
    gl.bindTexture(gl.TEXTURE_2D, heroTexture);
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Upload the image into the texture.
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, heroTexture );
    gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false );
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA,
        //heroImg.width, heroImg.height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE,
        heroImg);
/*
    EventHandler.on(function( dir ) {
        heroVY = 666 * dir;
    });
    EventHandler.start();
*/
};


//========================= draw().

exports.draw = function( time ) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Converting time to seconds instead of ms.
    time *= .001;

    Hero.move( time );

    // Setting the hero's birth time.
    if( heroLastTime == 0 ) {
        heroLastTime = time;
        heroCol = 0;
        return;
    }
    var deltaTime = time - heroLastTime;

    // Computing hero's position regarding his speed.
    heroX = (G.COL_W * .5 + heroVX * time) % G.GAME_W;

    if( heroVY > 0) {
        heroVY -= GRAVITY * deltaTime;
        if( heroVY < 0 ) heroVY = 0;
    }
    else if( heroVY < 0) {
        heroVY += GRAVITY * deltaTime;
        if( heroVY > 0 ) heroVY = 0;
    }
    heroY += heroVY * deltaTime;
    if( heroY > G.GAME_H - heroSize ) {
        heroY = G.GAME_H - heroSize;
        heroVY = -Math.abs( heroVY );
    }
    else if( heroY < heroSize ) {
        heroY = heroSize;
        heroVY = Math.abs( heroVY );
    }

    G.cameraX = heroX;//Hero.x();
    G.cameraY = G.COL_H * .5;

    clearScreen();
    Moon.draw( time );
    Smoke.draw( time, heroX, heroY );

    //if( time % .6 < .5 ) {
    drawHero( time );
    //}
    //Hero.draw( time );

    heroLastTime = time;
};


//========================= Private functions.

/**
 * Paint the screen's background.
 */
function clearScreen() {
    // Disable depth testing because we don't need real 3D.
    gl.disable(gl.DEPTH_TEST);
    // Enable blending for transprent textures.
    gl.enable(gl.BLEND);
    // Define the filling color.
    gl.clearColor(28 / 255, 134 / 255, 182 / 255, 1.0);
    // Clear the current screen.
    gl.clear(gl.COLOR_BUFFER_BIT);
}


function drawHero( time ) {
    // Update the screen and game size.
    G.setGlobalUniforms( heroProgram, time );

    // Update  hero position.   There  are 4  vertices.   Each one  is
    // defined  by  a  center,  a  radius and  an  angle.   This  made
    // rotations easier.
    heroAttribs[0] = heroX;           // x
    heroAttribs[1] = heroY;           // y
    heroAttribs[2] = heroSize;        // z
    heroAttribs[3] = Math.PI * 0.25;  // w
    heroAttribs[4] = heroX;
    heroAttribs[5] = heroY;
    heroAttribs[6] = heroSize;
    heroAttribs[7] = Math.PI * 0.75;
    heroAttribs[8] = heroX;
    heroAttribs[9] = heroY;
    heroAttribs[10] = heroSize;
    heroAttribs[11] = Math.PI * 1.25;
    heroAttribs[12] = heroX;
    heroAttribs[13] = heroY;
    heroAttribs[14] = heroSize;
    heroAttribs[15] = Math.PI * 1.75;

    // Rotate the hero according to vertical speed.
    var rotation = heroVY > 0 ? Math.sqrt(heroVY) : -Math.sqrt(-heroVY);
    rotation *= .02;
    // Limit rotation.
    rotation = Math.min( Math.PI * .5, Math.max( -Math.PI * .5, rotation ) );
    heroProgram.$uniRotation = rotation;

    // Set the active buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, heroBuffer);
    // Paste attributes in this buffer.
    gl.bufferData(gl.ARRAY_BUFFER, heroAttribs, gl.STATIC_DRAW);

    // attPos
    gl.enableVertexAttribArray( heroProgram.$attPos );
    gl.vertexAttribPointer( heroProgram.$attPos, 4, gl.FLOAT, false, 4 * BPE, 0 );

    // Draw this SQUARE.
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
}
