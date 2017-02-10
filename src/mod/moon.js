/**
 * Manage the obstacles.
 */
"use strict";

var G = require("global");
var Rnd = require("random");
var Hero = require("hero");
var Explo = require("explo");
var Programs = require("programs");
var ImageLoader = require("image-loader");

// Vibration function depending on the browser.
var vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || function(){};


// Number of attributes for an obstacle.
// x, y, radius, rnd1, rnd2, death.
// `death` is a date  in the future or 0. At this  date, the moon will
// explode. Little before this date, the moon will turn orange.
var PARTICLE_SIZE = 6;

var gl = null;
// Atributes of all the obstacles.
var attribs;
var buffer;
// Shader program.
var prg;
// Last time a particle was created.
var lastEmission = 0;
// Normals map.
var image;
// As soon as the  hero steps in a new column, that we  add a new moon
// in front of him.
var lastColForHero = -555;

exports.ready = new Promise(function (resolve, reject) {
    ImageLoader({ moon: "moon.png" }).then(function(data) {
        image = data.moon;
        resolve();
    });
});

exports.reset = function( argGL ) {
    if( !gl ) {
        gl = argGL;
        buffer = gl.createBuffer();
        prg = Programs( gl, 'Moon' );
    }
    attribs = new Float32Array( PARTICLE_SIZE * G.NB_COLS );
    buffer = gl.createBuffer();

    // The space is empty before the apparition of first moons.
    var ptr = 0;
    for( var i=0; i<G.NB_COLS; i++ ) {
        attribs[ptr++] = 0;
        attribs[ptr++] = 0;
        attribs[ptr++] = 0;
        attribs[ptr++] = 0;
        attribs[ptr++] = 0;
        attribs[ptr++] = 0;
    }
};


exports.draw = function( time ) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
    gl.blendEquation(gl.FUNC_ADD);

    G.setGlobalUniforms( prg, time );

    // Set the active buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Paste attributes in this buffer.
    gl.bufferData(gl.ARRAY_BUFFER, attribs, gl.STATIC_DRAW);

    var size = G.BPE * PARTICLE_SIZE;
    // attPos
    gl.enableVertexAttribArray( prg.$attPos );
    gl.vertexAttribPointer( prg.$attPos, 2, gl.FLOAT, false, size, 0 * G.BPE );
    // attSize
    gl.enableVertexAttribArray( prg.$attSize );
    gl.vertexAttribPointer( prg.$attSize, 1, gl.FLOAT, false, size, 2 * G.BPE );
    // attRnd1
    gl.enableVertexAttribArray( prg.$attRnd1 );
    gl.vertexAttribPointer( prg.$attRnd1, 1, gl.FLOAT, false, size, 3 * G.BPE );
    // attRnd2
    gl.enableVertexAttribArray( prg.$attRnd2 );
    gl.vertexAttribPointer( prg.$attRnd2, 1, gl.FLOAT, false, size, 4 * G.BPE );
    // attDeath
    gl.enableVertexAttribArray( prg.$attDeath );
    gl.vertexAttribPointer( prg.$attDeath, 1, gl.FLOAT, false, size, 5 * G.BPE );

    // Draw this POINTS.
    gl.drawArrays( gl.POINTS, 0, G.NB_COLS );
};


exports.move = function( time ) {
    // Check death expiration date.
    var ptr = 0, death;
    for( var idx=0; idx<G.NB_COLS; idx++ ) {
        death = attribs[ptr + 5];
        if( death > 0 && time > death ) {
            // Display explosion.
            Explo.newExplosion(
                attribs[ptr],     // x
                attribs[ptr + 1], // y
                time,
                attribs[ptr + 2]  // radius
            );
            // Moon is  dead, we must  hide it  out of the  screen and
            // give it a null radius.
            attribs[ptr + 1] = -10000;  // y
            attribs[ptr + 2] = 0;       // radius
            attribs[ptr + 5] = 0;       // reset death.
            vibrate(200);
        }
        ptr += PARTICLE_SIZE;
    }

    // While the hero is in collision status, it is invincible.
    if( Hero.isInCollision( time ) ) return;

    var x = Hero.x();
    var y = Hero.y();

    // Current column.
    var col = Math.floor( x / G.COL_W );
    if( col != lastColForHero ) {
        // Each time the hero goes to another column, we have to create a new moon.
        lastColForHero = col;
        // `col` can be hugely greater than G.NB_COLS because `Hero.x()` is always growing.
        var realCol = col % G.NB_COLS;
        // Position of the column's left side.
        var colX = col * G.COL_W;
        // Add a new moon in a column for ahead.
        var shiftCol = Math.ceil( .6 * G.NB_COLS );
        var nextCol = ( realCol + shiftCol ) % G.NB_COLS;
        // Pointer to the column's attributes.
        var ptr = nextCol * PARTICLE_SIZE;
        // Radius of the new moon.
        var r = ( G.COL_H / 12 ) * ( .7 + .6 * Rnd() );
        // Setting x position.
        attribs[ptr++] = colX + (shiftCol + Rnd()) * G.COL_W;
        // y is set in order to put the moon in front of the hero.
        attribs[ptr++] = y + r * 2.0 * (Rnd() - .5);
        // The radius.
        attribs[ptr++] = r;
        // Random values to manage moon's own rotation.
        attribs[ptr++] = Rnd();
        attribs[ptr++] = Rnd();
        // Death date.
        attribs[ptr++] = 0;
    }

    // Collision testing.
    var idx1 = Math.floor( x / G.COL_W ) % G.NB_COLS;
    var idx0 = (idx1 + G.NB_COLS - 1) % G.NB_COLS;
    var idx2 = (idx1 + 1) % G.NB_COLS;

    var ptr0 = idx0 * PARTICLE_SIZE;
    var ptr1 = idx1 * PARTICLE_SIZE;
    var ptr2 = idx2 * PARTICLE_SIZE;

    var dis, dx, dy, limit;

    dx = attribs[ptr0 + 0] - x;
    dy = attribs[ptr0 + 1] - y;
    limit = Hero.size() + attribs[ptr0 + 2];
    dis = dx*dx + dy*dy;
    if( dis < limit * limit ) {
        collision( ptr0, time, dy );
        return;
    }

    dx = attribs[ptr1 + 0] - x;
    dy = attribs[ptr1 + 1] - y;
    limit = Hero.size() + attribs[ptr1 + 2];
    dis = dx*dx + dy*dy;
    if( dis < limit * limit ) {
        collision( ptr1, time, dy );
        return;
    }

    dx = attribs[ptr2 + 0] - x;
    dy = attribs[ptr2 + 1] - y;
    limit = Hero.size() + attribs[ptr2 + 2];
    dis = dx*dx + dy*dy;
    if( dis < limit * limit ) {
        collision( ptr2, time, dy );
        return;
    }
};


/**
 * Collision between moon and hero.
 */
function collision( ptr, time, dy ) {
    Hero.collision( time, dy );
    die( ptr, time );
}


/**
 * Set the death date in 0.5 seconds from now.
 * @param {integer} ptr - pointer of the moon in the attributes array.
 * @param {double} time - current time in seconds.
 */
function die( ptr, time ) {
    attribs[ptr + 5] = time + .5;
}


exports.makeTerrain = function( hole ) {
    var canvas = document.createElement( "canvas" );
    canvas.setAttribute( "width", 256 );
    canvas.setAttribute( "height", 256 );
    var ctx = canvas.getContext( "2d" );
    ctx.fillStyle = "rgb(127, 127, 255)";
    ctx.fillRect(0,0,256,256);
    var x, y, r, i, j;
    for( var loop=0; loop<13; loop++ ) {
        r = Rnd() * 8 + 16;
        x = Rnd() * (192 - r) + 64;
        y = Rnd() * (192 - r) + 64;
        for( i=-1; i<2; i++ ) {
            for( j=-1; j<2; j++ ) {
                ctx.drawImage( hole, x + i * 256, y + j * 256, r * .5, r );
            }
        }
    }
    return canvas;
};
