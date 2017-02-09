/**
 * @module play
 * 
 * This singleton manages the main scene, where the hero is trying to avoid planets.
 */
"use strict";

var G = require("global");
var Hero = require("hero");
var Moon = require("moon");
var Stars = require("stars");
var Explo = require("explo");
var Smoke = require("smoke");
var WebGL = require("tfw.webgl");
var ImageLoader = require("image-loader");
var EventHandler = require("event-handler");


//========================= Variables.

// WebGL context.
var gl;
// Canvas. Used to get display width and height.
var canvas;
// We use only one  texture slot in WebGL. It is  a 512x512 image made
// with three  256x256 images.  The canvas  is used  to put  the three
// images.
var canvasForTextures;
// Using the time of the previous frame to know the time delta.
var lastTime = 0;

//========================= init().

/**
 * Return  a promise  that will  be fulfilled  after loading  of three
 * images used for the hero and the planets.
 */
exports.init = function( argGl, argCanvas ) {
    lastTime = 0;
    gl = argGl;
    canvas = argCanvas;
    return new Promise(function (resolve, reject) {
        ImageLoader({
            hero: "hero.png",
            moon: "moon.png",
            earth: "earth.png"
        }).then(function(data) {
            // Canvas for the only texture we use: a 512x512 image.
            canvasForTextures = document.createElement( "canvas" );
            canvasForTextures.setAttribute( "width", 512 );
            canvasForTextures.setAttribute( "height", 512 );
            var ctx = canvasForTextures.getContext( "2d" );
            ctx.drawImage( data.hero, 0, 0, 256, 256 );
            ctx.drawImage( data.moon, 256, 0, 256, 256 );
            ctx.drawImage( data.earth, 0, 256, 256, 256 );
            resolve();
        });
    });
};


//========================= start().

/**
 * The hero has no acceleration until this function is called.
 */
exports.start = function() {
    Hero.start();
};


//========================= reset().

exports.reset = function() {
    lastTime = 0;
    Hero.reset( gl );
    Moon.reset( gl );
    Smoke.reset( gl );
    Stars.reset( gl );
    Explo.reset( gl );

    // Prepare texture for hero.
    var texture = gl.createTexture();
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
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA,
        gl.RGBA, gl.UNSIGNED_BYTE,
        canvasForTextures);
};


//========================= draw().

exports.draw = function( time ) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Converting time to seconds instead of ms.
    time *= .001;    
    if( lastTime == 0 ) {
        lastTime = time;
        return;
    }
    var deltaTime = time - lastTime;
    lastTime = time;
    
    Hero.move( time );
    Moon.move( time );

    G.cameraX = Hero.x();
    G.cameraY = G.COL_H * .5;

    clearScreen();

    Stars.draw( time );
    Moon.draw( time );
    Hero.draw( time );
    Smoke.draw( time );
    Explo.draw( time );
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
    gl.clearColor(28 / 255, 34 / 255, 67 / 255, 1.0);
    // Clear the current screen.
    gl.clear(gl.COLOR_BUFFER_BIT);
}
