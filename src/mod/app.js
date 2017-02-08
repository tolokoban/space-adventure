"use strict";

// Starting the service worker for offline experience.
require("offline");

var WebGL = require("tfw.webgl");
var Alert = require("alert");
var Play = require("play");
var Cfg = require("$").config;

var canvas = document.getElementById( "canvas" );
var renderer = new WebGL.Renderer( canvas );
var playReady = Play.init( renderer.gl, canvas );

playReady.then(function() {
    // Reset the game.
    Play.reset();

    renderer.start(function( time ) {
        var res = window.innerHeight > 800 ? 1 : 0;
        // Managing resize.
        var W = window.innerWidth >> res;
        var H = window.innerHeight >> res;
        canvas.setAttribute( 'width', W );
        canvas.setAttribute( 'height', H );
        renderer.gl.viewport( 0, 0, W, H );
        // Drawing the scene.
        Play.draw( time );
    });
});

Alert(
    "Quick slides up and down to move your spaceship.<br/>Or use the keyboard's arrow keys."
        + "<p>" + Cfg.version + "</p>",
    Play.start.bind( Play )
);
