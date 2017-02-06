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
        Hero.ready.then( resolve );
    });
};


//========================= reset().

exports.reset = function() {
    Hero.reset( gl );
    Moon.reset( gl );
    Smoke.reset( gl );
};


//========================= draw().

exports.draw = function( time ) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Converting time to seconds instead of ms.
    time *= .001;

    Hero.move( time );
    Moon.move( time );

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

    G.cameraX = Hero.x();
    G.cameraY = G.COL_H * .5;

    clearScreen();
    Moon.draw( time );
    Hero.draw( time );
    Smoke.draw( time );

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
