/**
 * This singleton manages the main scene, where the hero is trying to avoi asteroids.
 */
"use strict";

var G = require("global");
var Hero = require("hero");
var Moon = require("moon");
var Stars = require("stars");
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

var canvasForTextures;
// Using the time of the previous frame to know the time delta.
var lastTime = 0;

//========================= init().

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
            var canvas = document.createElement( "canvas" );
            canvas.setAttribute( "width", 256 );
            canvas.setAttribute( "height", 256 );
            var ctx = canvas.getContext( "2d" );
            ctx.drawImage( data.hero, 0, 0, 128, 128 );
            ctx.drawImage( Moon.makeTerrain( data.moon ), 128, 0, 128, 128 );
            ctx.drawImage( data.earth, 0, 128, 128, 128 );
            canvasForTextures = canvas;
            resolve();
        });
    });
};


//========================= start().

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

    // Prepare texture for hero.
    var texture = gl.createTexture();
    // Create a texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

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
