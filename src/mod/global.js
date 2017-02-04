"use strict";

/**
 * Create read-only attribute.
 */
function set( name, value ) {
    Object.defineProperty( module.exports, name, {
        value: value,
        writable: false,
        configurable: true,
        enumerable: true
    });
}


// Hardware size of a Float32.
set( 'BPE', new Float32Array().BYTES_PER_ELEMENT );
// Column's width in game's pixels.
set( 'COL_W', 400 );
// Column's height in game's pixels.
set( 'COL_H', 1000 );
// Game's width must have be least the double of the height.
set( 'NB_COLS', Math.ceil( 2 * exports.COL_H / exports.COL_W ) );
set( 'GAME_W', exports.NB_COLS * exports.COL_W );
set( 'GAME_H', exports.COL_H );


// Camera's position.
exports.cameraX = 0;
exports.cameraY = 0;


exports.setGlobalUniforms = function(prg, time) {
    prg.use();
    prg.$uniVTime = time;
    prg.$uniFTime = time;
    prg.$uniScrW = window.innerWidth;
    prg.$uniScrH = window.innerHeight;
    prg.$uniGameW = exports.GAME_W;
    prg.$uniGameH = exports.GAME_H;
    prg.$uniCamX = exports.cameraX;
    prg.$uniCamY = exports.cameraY;        
};
