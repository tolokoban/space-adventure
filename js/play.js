/** @module play */require( 'play', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
 var GLOBAL = {
  "vertHero": "// Screen dimensions in pixels.\nuniform float uniScrW;\nuniform float uniScrH;\n// Game's space dimension.\nuniform float uniGameW;\nuniform float uniGameH;\n\n// Where is the camero pointing?\nuniform float uniCamX;\nuniform float uniCamY;\n\n// Vertex position and texture coords.\n// (x,y) for vertex position, in game's space.\n// (z,w) for (u,v) texture coords.\nattribute vec4 attPos;\n\nvarying vec2 varUV;\n\nvoid main() {\n  // Propagate UV to the fragment shader.\n  varUV = attPos.zw;\n  // Game's space coords.\n  float xG = attPos.x - uniCamX;\n  float yG = attPos.y - uniCamY;\n  // Wrapping.\n  if( xG < -uniGameW ) xG += uniGameW;\n  if( xG > uniGameW ) xG -= uniGameW;\n  // Convert game coords into screen coords.\n  // A column must fit entirely in the screens height.\n  float factorS = uniScrH / uniGameH;\n  float xS = xG * factorS;\n  float yS = yG * factorS;\n  // Now, convert screen coords into WebGL coords.\n  // Setting the center.\n  float factorW = 2.0 / uniScrW;\n  float factorH = 2.0 / uniScrH;\n  float x = xS * factorW;\n  float y = yS * factorH;\n  // GL has a square space with coords between -1 and +1.\n  // Final position in GL space.\n  gl_Position = vec4( x, y, 0.0, 1.0 );\n}\n",
  "fragHero": "precision mediump float;\n// The texture is the hero image.\nuniform sampler2D uniTexture;\n// texture coords UV between 0 and +1.\nvarying vec2 varUV;\n\nvoid main() {\n  gl_FragColor = texture2D( uniTexture, varUV );\n}\n",
  "vertMoon": "// Screen dimensions in pixels.\nuniform float uniScrW;\nuniform float uniScrH;\n// Game's space dimension.\nuniform float uniGameW;\nuniform float uniGameH;\n// Where is the camera pointing?\nuniform float uniCamX;\nuniform float uniCamY;\n\n// Obstacle's type.\nattribute float attType;\n// Vertex position and texture coords.\n// (x,y) for vertex position, in game's space.\n// (z,w) for (u,v) texture coords.\nattribute vec2 attPos;\n// Point size.\nattribute float attSize;\n\nconst float CURVATURE = 0.5;\nconst float PI = 3.1415926535;\n\nvoid main() {\n  // Game's space coords.\n  float xG = attPos.x - uniCamX;\n  float yG = attPos.y - uniCamY;    \n  // Wrapping.\n  if( xG < -uniGameW * .5 ) xG += uniGameW;\n  if( xG > uniGameW * .5 ) xG -= uniGameW;\n    \n  // Curvature.\n  float a = PI * .5 - PI * xG / uniGameW;\n  float r = attPos.y + uniGameH * CURVATURE;\n\n  xG = r * cos( a );\n  yG = r * sin( a ) - uniGameH * (CURVATURE + 0.5);\n\n  // Convert game coords into screen coords.\n  // A column must fit entirely in the screens height.\n  float factorS = uniScrH / uniGameH;\n  float xS = xG * factorS;\n  float yS = yG * factorS;\n  // Now, convert screen coords into WebGL coords.\n  // Setting the center.\n  float factorW = 2.0 / uniScrW;\n  float factorH = 2.0 / uniScrH;\n  float x = xS * factorW;\n  float y = yS * factorH;\n  // GL has a square space with coords between -1 and +1.\n  // Final position in GL space.\n  gl_Position = vec4( x, y, 0.0, 1.0 );\n  // Point's size...\n  gl_PointSize = attSize;\n}\n",
  "fragMoon": "precision mediump float;\n\n\nvoid main() {\n  float x = gl_PointCoord.x * 2.0 - 1.0;\n  float y = gl_PointCoord.y * 2.0 - 1.0;\n  float r = x*x + y*y;\n  if( r < 1.0 ) gl_FragColor = vec4(0.3, 0.1, 0.0, 1.0);\n  else gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n}\n"};
  /**
 * This singleton manages the main scene, where the hero is trying to avoi asteroids.
 */
"use strict";

var WebGL = require("tfw.webgl");
var ImageLoader = require("image-loader");
var EventHandler = require("event-handler");


//========================= Constants.

// Column's width in space's pixels.
var COL_W = 400;
// Column's height in space's pixels.
var COL_H = 1000;
// Vertical acceleration in space's pixels per second.
var GRAVITY = -1600;
// Maximum number of obstacles that can appear in the same column.
var MAX_OBSTACLES_PER_COL = 5;
// Number of generic obstacles per obstacle.
var NB_ATT_PER_OBSTACLE = 3;
// Size of one obstacle buffer.
var OBS_BUFF_LENGTH = 3 + NB_ATT_PER_OBSTACLE;
// Size of one column buffer.
var COL_BUFF_LENGTH = OBS_BUFF_LENGTH * MAX_OBSTACLES_PER_COL;
// Hardware size of a Float32.
var BPE = new Float32Array().BYTES_PER_ELEMENT;
// Square root of 2. We compute it only one time.
var SQRT2 = Math.sqrt( 2 );


//========================= Variables.

// WebGL context.
var gl;
// Canvas. Used to get display width and height.
var canvas;
// Columns contain obstacles.
var columns = [];
// Number of obstacle per column.
var columnsLengths = [];
// Number of columns.
var nbColumns;
// Space width: nbColumns * COL_W.
var gameWidth;
var gameHeight;

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

// WebGL stuff for obstacles.
var obstacleProgram;  // Shader program.
var obstacleBuffer;   // Will contain the attributes in GL memory.


//========================= init().

exports.init = function( argGl, argCanvas ) {
    gl = argGl;
    canvas = argCanvas;
    return new Promise(function (resolve, reject) {
        ImageLoader({ hero: "hero.png" }).then(function(data) {
            console.info("[play] data=", data);
            heroImg = data.hero;
            resolve();
        });
    });
};


//========================= reset().

exports.reset = function() {
    // We assume that there is no screen which width is more than the double of its height.
    nbColumns = Math.ceil( COL_H / COL_W ) * 2;
    columns = new Float32Array( nbColumns * COL_BUFF_LENGTH );
    columnsLengths = new Array( nbColumns );
    gameWidth = nbColumns * COL_W;
    gameHeight = COL_H;

    obstacleProgram = new WebGL.Program(gl, {
        vert: GLOBAL.vertMoon,
        frag: GLOBAL.fragMoon
    });

    // Create the hero buffer in GL memory.
    obstacleBuffer = gl.createBuffer();

    for( var colIdx=0; colIdx<nbColumns; colIdx++ ) {
        randomColumn( colIdx );
    }
console.info("[play] columns=", columns);


    heroX = .5 * (nbColumns * COL_W);
    heroY = .5 * COL_H;
    heroVX = 100;
    heroVY = 5;
    heroSize = COL_H / 16;

    // We set 0 to tell draw() it has to set the time iiself.
    heroLastTime = 0;

    heroProgram = new WebGL.Program(gl, {
        vert: GLOBAL.vertHero,
        frag: GLOBAL.fragHero
    });

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

    EventHandler.onDown(function() {
        heroVY = 1000;
    });
    EventHandler.onUp(function() {
        if( heroVY > 0 ) heroVY *= .2;
    });
    EventHandler.start();
};


//========================= draw().

exports.draw = function( time ) {
    // Converting time to seconds instead of ms.
    time *= .001;
    // Setting the hero's birth time.
    if( heroLastTime == 0 ) {
        heroLastTime = time;
        heroCol = 0;
        return;
    }
    var deltaTime = time - heroLastTime;

    // Computing hero's position regarding his speed.
    heroX = (COL_W * .5 + heroVX * time) % gameWidth;

    heroY += heroVY * deltaTime;
    heroVY += GRAVITY * deltaTime;
    if( heroY > gameHeight - heroSize ) {
        heroY = gameHeight - heroSize;
        heroVY = -Math.abs( heroVY );
    }
    else if( heroY < heroSize ) {
        heroY = heroSize;
        heroVY = 0; //-GRAVITY;
    }

    clearScreen();
    drawHero();
    drawObstacles();

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
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // Define the filling color.
    gl.clearColor(28 / 255, 134 / 255, 182 / 255, 1.0);
    // Clear the current screen.
    gl.clear(gl.COLOR_BUFFER_BIT);
}


function drawHero( time ) {
    heroProgram.use();

    // Update hero position.
    heroAttribs[0] = heroX - heroSize;
    heroAttribs[1] = heroY - heroSize;
    heroAttribs[2] = 0;
    heroAttribs[3] = 1;
    heroAttribs[4] = heroX + heroSize;
    heroAttribs[5] = heroY - heroSize;
    heroAttribs[6] = 1;
    heroAttribs[7] = 1;
    heroAttribs[8] = heroX + heroSize;
    heroAttribs[9] = heroY + heroSize;
    heroAttribs[10] = 1;
    heroAttribs[11] = 0;
    heroAttribs[12] = heroX - heroSize;
    heroAttribs[13] = heroY + heroSize;
    heroAttribs[14] = 0;
    heroAttribs[15] = 0;

    // Update the screen and game size.
    heroProgram.$uniScrW = canvas.width;
    heroProgram.$uniScrH = canvas.height;
    heroProgram.$uniGameW = gameWidth;
    heroProgram.$uniGameH = gameHeight;
    heroProgram.$uniCamX = heroX;
    heroProgram.$uniCamY = COL_H * .5;

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


function drawObstacles( time ) {
    obstacleProgram.use();

    // Update the screen and game size.
    obstacleProgram.$uniScrW = canvas.width;
    obstacleProgram.$uniScrH = canvas.height;
    obstacleProgram.$uniGameW = gameWidth;
    obstacleProgram.$uniGameH = gameHeight;
    obstacleProgram.$uniCamX = heroX;
    obstacleProgram.$uniCamY = COL_H * .5;

    // Set the active buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, obstacleBuffer);
    // Paste attributes in this buffer.
    gl.bufferData(gl.ARRAY_BUFFER, columns, gl.STATIC_DRAW);

    var size = BPE * OBS_BUFF_LENGTH;
    // attTypd
    gl.enableVertexAttribArray( obstacleProgram.$attType );
    gl.vertexAttribPointer( obstacleProgram.$attType, 1, gl.FLOAT, false, size, 0 );
    // attPos
    gl.enableVertexAttribArray( obstacleProgram.$attPos );
    gl.vertexAttribPointer( obstacleProgram.$attPos, 2, gl.FLOAT, false, size, 1 * BPE );
    // attSize
    gl.enableVertexAttribArray( obstacleProgram.$attSize );
    gl.vertexAttribPointer( obstacleProgram.$attSize, 1, gl.FLOAT, false, size, 3 * BPE );

    // Draw this SQUARE.
    gl.drawArrays( gl.POINTS, 0, nbColumns * MAX_OBSTACLES_PER_COL );
}


function randomColumn( colIdx ) {
    colIdx = (colIdx + nbColumns) % nbColumns;
    var offset = colIdx * COL_BUFF_LENGTH;
    for( var i=0; i<MAX_OBSTACLES_PER_COL; i++ ) {
        randomObstacle( colIdx, offset );
        offset += OBS_BUFF_LENGTH;
    }
}


function randomObstacle( colIdx, offset ) {
    var r = ( COL_H / 16 ) * ( .8 + .4 * Math.random() );
    var x = Math.random() * COL_W;
    var y = Math.random() * (COL_H - 2 * r) + r;
    columns[offset] = 1;  // Type
    columns[offset + 1] = x + colIdx * COL_W;
    columns[offset + 2] = y;
    columns[offset + 3] = r;
}


  
module.exports._ = _;
/**
 * @module play
 * @see module:$
 * @see module:tfw.webgl
 * @see module:image-loader
 * @see module:event-handler

 */
});