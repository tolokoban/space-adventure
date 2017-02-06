/** @module play */require( 'play', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
 var GLOBAL = {
  "vertHero": "#include vertCommon\r\n\r\n// Rotation in radians.\r\nuniform float uniRotation;\r\n\r\n// Vertex position and texture coords.\r\n// (x,y) for vertex position, in game's space.\r\n// (z,w) for (radius,angle).\r\nattribute vec4 attPos;\r\n\r\nvarying vec2 varUV;\r\n\r\nconst float SQRT2 = 1.4142135623730951;\r\n\r\nvoid main() {\r\n  // Diagonals must be multiplied by the square root of two.\r\n  float angle = attPos.w;\r\n  // Adding some deformations due to \"Infinite Improbability Drive\".\r\n  float radius = attPos.z * SQRT2\r\n    * (.95 + .1 * cos(uniVTime * angle));\r\n  // Propagate UV to the fragment shader.\r\n  varUV = vec2( .5 * SQRT2 * cos(angle) + .5,\r\n                .5 - .5 * SQRT2 * sin(angle) );\r\n  // Game's space coords.\r\n  float xG = attPos.x - uniCamX;\r\n  float yG = attPos.y - uniCamY;\r\n  // Wrapping.\r\n  if( xG < -uniGameW ) xG += uniGameW;\r\n  if( xG > uniGameW ) xG -= uniGameW;\r\n  // The center is wrapped, we can set the corners.\r\n  angle += uniRotation;\r\n  xG += radius * cos(angle);\r\n  yG += radius * sin(angle);\r\n  \r\n  #include game2gl\r\n  \r\n  // GL has a square space with coords between -1 and +1.\r\n  // Final position in GL space.\r\n  gl_Position = vec4( x, y, 0.0, 1.0 );\r\n}\r\n",
  "fragHero": "precision mediump float;\r\n// Current time.\r\nuniform float uniFTime;\r\n// Last collision time.\r\nuniform float uniCollision;\r\n// The texture is the hero image.\r\nuniform sampler2D uniTexture;\r\n// texture coords UV between 0 and +1.\r\nvarying vec2 varUV;\r\n\r\nvoid main() {\r\n  gl_FragColor = texture2D( uniTexture, .5 * varUV );\r\n  float collision = uniFTime - uniCollision;\r\n  if( collision < 1.0 ) {\r\n    gl_FragColor.g *= collision;\r\n    gl_FragColor.b *= collision;\r\n  }\r\n}\r\n",
  "vertMoon": "#include vertCommon\r\n#include game2gl\r\n  \r\n// Vertex position and texture coords.\r\n// (x,y) for vertex position, in game's space.\r\n// (z,w) for (u,v) texture coords.\r\nattribute vec2 attPos;\r\n// Point size.\r\nattribute float attSize;\r\nattribute float attRnd1;\r\nattribute float attRnd2;\r\n\r\nvarying float varSize;\r\nvarying float varRnd1;\r\nvarying float varRnd2;\r\n\r\n\r\nvoid main() {\r\n  // Propagate size to the fragment shader.\r\n  varSize = attSize;\r\n  varRnd1 = attRnd1;\r\n  varRnd2 = attRnd2;\r\n  // Game's space coords.\r\n  vec2 point = game2gl( attPos );\r\n  // GL has a square space with coords between -1 and +1.\r\n  // Final position in GL space.\r\n  gl_Position = vec4( point, 0.0, 1.0 );\r\n    \r\n  // Point's size...\r\n  gl_PointSize = pointSize( attSize );\r\n}\r\n",
  "fragMoon": "precision mediump float;\r\n\r\nconst float PI = 3.141592653589793;\r\n\r\nconst float X = .5;\r\nconst float Y = -.5;\r\nconst float Z = 0.7071067811865476;\r\n\r\nconst vec4 WHITE = vec4( 1.0, 1.0, 1.0, 1.0 );\r\nconst vec4 BLACK = vec4( 0.0, 0.0, 0.0, 1.0 );\r\n\r\nuniform float uniFTime;\r\n\r\n// The texture is the hero image.\r\nuniform sampler2D uniTexture;\r\n\r\nvarying float varSize;\r\nvarying float varRnd1;\r\nvarying float varRnd2;\r\n\r\n\r\nvoid main() {\r\n  // Vector (x,y,z) has its tail at the center of the sphere and its head on the surface of the sphere.\r\n  float x = gl_PointCoord.x * 2.0 - 1.0;\r\n  float y = gl_PointCoord.y * 2.0 - 1.0;\r\n  float radius = x*x + y*y;\r\n  if( radius > 1.0 ) {\r\n    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\r\n    return;\r\n  }\r\n  if( radius > .8 ) {\r\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);\r\n    return;\r\n  }\r\n  // Therefore, the length of the (x,y,z) vector must be 1 and x*x + y*y + z*z = 1.\r\n  float z = sqrt( 1.0 - x*x - y*y );\r\n  // Rotation.\r\n  float a = uniFTime * .5 * (.2 + varRnd1);\r\n  float x1 = x;\r\n  float y1 = y * cos(a) + z * sin(a);\r\n  float z1 = -y * sin(a) + z * cos(a);\r\n  a = uniFTime * .5 * (.2 + varRnd2);\r\n  float x2 = x1 * cos(a) + z1 * sin(a);\r\n  float y2 = y1;\r\n  float z2 = -x1 * sin(a) + z1 * cos(a);\r\n  \r\n  gl_FragColor = vec4( .6, .3, .0, 1.0 );\r\n\r\n  vec3 normal = texture2D( uniTexture, vec2(.25 * x2 + .75, .25 * y2 + .25) ).xyz;\r\n  normal = 2.0 * ( normal - vec3(.5, .5, .5) );\r\n  \r\n  float lat = -asin( normal.y );\r\n  float r = cos( lat );\r\n  float lng = 0.0;\r\n  if( r > 0.0 ) {\r\n    lng = asin( normal.x / r );\r\n  }\r\n  normal = vec3(x,y,z);\r\n  x = normal.x;\r\n  y = normal.y * cos(lat) + normal.z * sin(lat);\r\n  z = -normal.y * sin(lat) + normal.z * cos(lat);\r\n  normal = vec3(x,y,z);\r\n  \r\n  // Shadow. (x,y,z) is the normal and (X,Y,Z) is the light ray.\r\n  vec3 light = reflect( vec3(X, Y, Z), normal );\r\n  //light = reflect( light, normal );\r\n  float shadow = -light.z;\r\n  if( shadow > 0.0 ) gl_FragColor = mix( gl_FragColor, WHITE, shadow );\r\n  else if( shadow < 0.0 ) gl_FragColor = mix( gl_FragColor, BLACK, -shadow );\r\n}\r\n",
  "game2gl": "vec2 game2scr(float xG, float yG) {\r\n  // Where the camera points, the coords are (0,0).\r\n  xG -= uniCamX;\r\n  yG -= uniCamY;\r\n  // Wrapping.\r\n  if( xG < -.25 * uniGameW ) xG += uniGameW;\r\n  else if( xG > .75 * uniGameW ) xG -= uniGameW;\r\n\r\n  // Convert game coords into screen coords.\r\n  // A column must fit entirely in the screens height.\r\n  float factorS = uniScrH / uniGameH;\r\n  float xS = xG * factorS - uniScrW * .25;\r\n  float yS = yG * factorS;\r\n\r\n  return vec2(xS, yS);\r\n}\r\n\r\nvec2 game2gl(float xG, float yG) {\r\n  vec2 scr = game2scr(xG, yG);\r\n  // Now, convert screen coords into WebGL coords.\r\n  // Setting the center.\r\n  float factorW = 2.0 / uniScrW;\r\n  float factorH = 2.0 / uniScrH;\r\n  float x = scr.x * factorW;\r\n  float y = scr.y * factorH;  \r\n\r\n  return vec2( x, y );\r\n}\r\n\r\n\r\nvec2 game2gl(vec2 pos) {\r\n  return game2gl( pos.x, pos.y );\r\n}\r\n\r\n\r\nfloat pointSize( float radius ) {\r\n  float factorS = uniScrH / uniGameH;\r\n  return 2.0 * radius * factorS;\r\n}\r\n\r\nvec2 wrap(vec2 pos) {\r\n  // Wrapping.\r\n  if( pos.x < -uniGameW ) pos.x += uniGameW;\r\n  if( pos.x > uniGameW ) pos.x -= uniGameW;\r\n  return pos;\r\n}\r\n",
  "vertCommon": "const float PI = 3.141592653589793;\r\n\r\n// Time in seconds.\r\nuniform float uniVTime;\r\n// Screen dimensions in pixels.\r\nuniform float uniScrW;\r\nuniform float uniScrH;\r\n// Game's space dimension.\r\nuniform float uniGameW;\r\nuniform float uniGameH;\r\n// Where is the camera pointing?\r\nuniform float uniCamX;\r\nuniform float uniCamY;\r\n"};
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
var canvasForTextures;

//========================= init().

exports.init = function( argGl, argCanvas ) {
    gl = argGl;
    canvas = argCanvas;
    return new Promise(function (resolve, reject) {
        ImageLoader({ hero: "hero.png", moon: "moon.png" }).then(function(data) {
            var canvas = document.createElement( "canvas" );
            canvas.setAttribute( "width", 256 );
            canvas.setAttribute( "height", 256 );
            var ctx = canvas.getContext( "2d" );
            ctx.drawImage( data.hero, 0, 0, 128, 128 );
            ctx.drawImage( Moon.makeTerrain( data.moon ), 128, 0, 128, 128 );
            canvasForTextures = canvas;
            resolve();
        });
    });
};


//========================= reset().

exports.reset = function() {
    Hero.reset( gl );
    Moon.reset( gl );
    Smoke.reset( gl );

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


  
module.exports._ = _;
/**
 * @module play
 * @see module:$
 * @see module:global
 * @see module:hero
 * @see module:moon
 * @see module:smoke
 * @see module:tfw.webgl
 * @see module:image-loader
 * @see module:event-handler

 */
});