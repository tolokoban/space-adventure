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
var GRAVITY = 1600;
// Maximum number of obstacles that can appear in the same column.
var MAX_OBSTACLES_PER_COL = 1;
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
        ImageLoader({ hero: "hero.png", moon: "moon.png" }).then(function(data) {
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
    }, GLOBAL);

    // Create the hero buffer in GL memory.
    obstacleBuffer = gl.createBuffer();

    for( var colIdx=0; colIdx<nbColumns; colIdx++ ) {
        randomColumn( colIdx );
    }

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

    EventHandler.on(function( type ) {
        heroVY = type * GRAVITY * .5;
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

    if( heroVY > 0 ) {
        heroVY -= GRAVITY * deltaTime;
        if( heroVY < 0 ) heroVY = 0;
    }
    else if( heroVY < 0 ) {
        heroVY += GRAVITY * deltaTime;
        if( heroVY > 0 ) heroVY = 0;
    }
    heroY += heroVY * deltaTime;
    if( heroY > gameHeight - heroSize ) {
        heroY = gameHeight - heroSize;
        heroVY = -Math.abs( heroVY );
    }
    else if( heroY < heroSize ) {
        heroY = heroSize;
        heroVY = Math.abs( heroVY );
    }

    clearScreen();
    drawObstacles( time );
    drawHero( time );

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
    rotation *= .04;
    // Limit rotation.
    rotation = Math.min( Math.PI * .5, Math.max( -Math.PI * .5, rotation ) );
    heroProgram.$uniRotation = rotation;    

    // Update the screen and game size.
    setUniforms( heroProgram, time );

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
    setUniforms( obstacleProgram, time );

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


/**
 * Set the common uniforms for screen size, camera position, etc.
 */
function setUniforms( prg, time ) {
    prg.$uniVTime = time;
    prg.$uniFTime = time;
    prg.$uniScrW = canvas.width;
    prg.$uniScrH = canvas.height;
    prg.$uniGameW = gameWidth;
    prg.$uniGameH = gameHeight;
    prg.$uniCamX = heroX;
    prg.$uniCamY = COL_H * .5;    
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
    var r = ( COL_H / 6 ) * ( .8 + .4 * Math.random() );
    var x = Math.random() * COL_W;
    var y = Math.random() * (COL_H - 2 * r) + r;
    columns[offset] = 1;  // Type
    columns[offset + 1] = x + colIdx * COL_W;
    columns[offset + 2] = y;
    columns[offset + 3] = r;
}
