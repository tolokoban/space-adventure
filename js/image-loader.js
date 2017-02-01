/** @module image-loader */require( 'image-loader', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

require("polyfill.promise");

/**
 * Return a Promise  which `data` is a dictionary of  all asked images
 * with a  String as value in  case of error  and an Image in  case of
 * success.
 * `reject` is never used.
 * 
 * @param sources - Dictionary of images you want to load.  The key is
 * an ID, the value is an URL.
 */
module.exports = function(sources) {
    return new Promise(
        function(resolve, reject) {
            var id, url, urlBase, urlExt;
            var result = {};
            var count = 0;
            var img;

            var next = function() {
                count--;
                if( count == 0 ) resolve( result );
            };

            var onload = function() {
                var canvas = document.createElement( 'canvas' );
                canvas.setAttribute( 'width', this.width );
                canvas.setAttribute( 'height', this.height );
                var ctx = canvas.getContext( '2d' );
                ctx.drawImage( this, 0, 0, this.width, this.height );
                result[this.$id] = canvas;
                next();
            };

            var onerror = function( err ) {
                console.error("Unable to load image ". this.src + "! ", err);
                result[this.$id] = err;
                next();
            };

            for( id in sources ) {
                url = "css/app/" + sources[id];
                // Splitting url into base and extension.
                // This is because we want  to load the `mini` version
                // on small screens.
                urlBase = url.substr( 0, url.length - 4 );
                urlExt = url.substr( url.length - 4 );
                // Increment the number of images that have to been loaded.
                count++;
                img = new Image();
                // I put `$` in order to not override existing Image's attribute.
                img.$id = id;
                result[id] = img;
                img.onload = next;
                img.onerror = onerror;   
                img.src = url;       
                img.srcset = urlBase + ".mini" + urlExt + " 640w, " + url;
            }
        }
    );
};


  
module.exports._ = _;
/**
 * @module image-loader
 * @see module:$
 * @see module:polyfill.promise

 */
});