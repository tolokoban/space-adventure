/**********************************************************************
 require( 'require' )
 -----------------------------------------------------------------------
 @example

 var Path = require("node://path");  // Only in NodeJS/NW.js environment.
 var Button = require("tfw.button");

 **********************************************************************/

window.require = function() {
    var modules = {};
    var definitions = {};
    var nodejs_require = typeof window.require === 'function' ? window.require : null;

    var f = function(id, body) {
        if( id.substr( 0, 7 ) == 'node://' ) {
            // Calling for a NodeJS module.
            if( !nodejs_require ) {
                throw Error( "[require] NodeJS is not available to load module `" + id + "`!" );
            }
            return nodejs_require( id.substr( 7 ) );
        }

        if( typeof body === 'function' ) {
            definitions[id] = body;
            return;
        }
        var mod;
        body = definitions[id];
        if (typeof body === 'undefined') {
            var err = new Error("Required module is missing: " + id);   
            console.error(err.stack);
            throw err;
        }
        mod = modules[id];
        if (typeof mod === 'undefined') {
            mod = {exports: {}};
            var exports = mod.exports;
            body(f, mod, exports);
            modules[id] = mod.exports;
            mod = mod.exports;
            //console.log("Module initialized: " + id);
        }
        return mod;
    };
    return f;
}();
function addListener(e,l) {
    if (window.addEventListener) {
        window.addEventListener(e,l,false);
    } else {
        window.attachEvent('on' + e, l);
    }
};

addListener(
    'DOMContentLoaded',
    function() {
        document.body.parentNode.$data = {};
        // Attach controllers.
        APP = require('app');
setTimeout(function (){if(typeof APP.start==='function')APP.start()});

    }
);
require("$",function(n,r,a){a.config={name:'"space-adventure"',description:'"WebGL clone of Cavalcadeur\'s original game."',author:'"tolokoban"',version:'"0.0.44"',major:"0",minor:"0",revision:"44",date:"2017-02-09T15:24:03.000Z",consts:{}};var o=null;a.lang=function(n){return void 0===n&&(window.localStorage&&(n=window.localStorage.getItem("Language")),n||(n=window.navigator.language,n||(n=window.navigator.browserLanguage,n||(n="fr"))),n=n.substr(0,2).toLowerCase()),o=n,window.localStorage&&window.localStorage.setItem("Language",n),n},a.intl=function(n,r){var o,e,t,i,g,l,u,s=n[a.lang()],c=r[0];for(u in n)break;if(!u)return c;if(!s&&(s=n[u],!s))return c;if(o=s[c],o||(s=n[u],o=s[c]),!o)return c;if(r.length>1){for(e="",g=0,t=0;t<o.length;t++)i=o.charAt(t),"$"===i?(e+=o.substring(g,t),t++,l=o.charCodeAt(t)-48,e+=l<0||l>=r.length?"$"+o.charAt(t):r[l],g=t+1):"\\"===i&&(e+=o.substring(g,t),t++,e+=o.charAt(t),g=t+1);e+=o.substr(g),o=e}return o}});
//# sourceMappingURL=$.js.map
require("app",function(e,t,n){var r=function(){function t(){return r(n,arguments)}var n={en:{},fr:{}},r=e("$").intl;return t.all=n,t}();e("offline");var i=e("tfw.webgl"),o=e("alert"),a=e("play"),s=e("$").config,u=document.getElementById("canvas"),d=new i.Renderer(u),w=a.init(d.gl,u);w.then(function(){a.reset(),d.start(function(e){var t=window.innerHeight>800?1:0,n=window.innerWidth>>t,r=window.innerHeight>>t;u.setAttribute("width",n),u.setAttribute("height",r),d.gl.viewport(0,0,n,r),a.draw(e)})}),o("Quick slides up and down to move your spaceship.<br/>Or use the keyboard's arrow keys.<p>"+s.version+"</p>",a.start.bind(a)),t.exports._=r});
//# sourceMappingURL=app.js.map
require("play",function(e,r,t){function a(){n.disable(n.DEPTH_TEST),n.enable(n.BLEND),n.clearColor(28/255,34/255,67/255,1),n.clear(n.COLOR_BUFFER_BIT)}var n,E,T,o=function(){function r(){return a(t,arguments)}var t={en:{},fr:{}},a=e("$").intl;return r.all=t,r}(),i=e("global"),_=e("hero"),R=e("moon"),u=e("stars"),m=e("explo"),c=e("smoke"),d=(e("tfw.webgl"),e("image-loader")),l=(e("event-handler"),0);t.init=function(e,r){return l=0,n=e,E=r,new Promise(function(e,r){d({hero:"hero.png",moon:"moon.png",earth:"earth.png"}).then(function(r){T=document.createElement("canvas"),T.setAttribute("width",512),T.setAttribute("height",512);var t=T.getContext("2d");t.drawImage(r.hero,0,0,256,256),t.drawImage(r.moon,256,0,256,256),t.drawImage(r.earth,0,256,256,256),e()})})},t.start=function(){_.start()},t.reset=function(){l=0,_.reset(n),R.reset(n),c.reset(n),u.reset(n),m.reset(n);var e=n.createTexture();n.bindTexture(n.TEXTURE_2D,e),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,e),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,T)},t.draw=function(e){if(n.blendFunc(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA),e*=.001,0==l)return void(l=e);l=e,_.move(e),R.move(e),i.cameraX=_.x(),i.cameraY=.5*i.COL_H,a(),u.draw(e),R.draw(e),_.draw(e),c.draw(e),m.draw(e)},r.exports._=o});
//# sourceMappingURL=play.js.map
require("event-handler",function(n,e,t){var o=function(){function e(){return o(t,arguments)}var t={en:{},fr:{}},o=n("$").intl;return e.all=t,e}(),i=function(){},c=!1;e.exports={on:function(n){i=n},start:function(){c=!0},stop:function(){c=!1}},document.addEventListener("keyup",function(n){c&&(38==n.keyCode?i(1):40==n.keyCode&&i(-1))});var r,u,a;document.addEventListener("touchstart",function(n){var e=n.changedTouches[0];r=e.clientX,u=e.clientY,a=Date.now()}),document.addEventListener("touchmove",function(n){var e=n.changedTouches[0],t=e.clientX-r,o=e.clientY-u;(t>0?t:-t)>(o>0?o:-o)&&i(0);var c=(o>0?o:-o)/((Date.now()-a)*window.innerHeight);return c*=1e3,c=Math.min(2,c<1?1:c),o<0?i(+c):o>0?i(-c):(r=e.clientX,u=e.clientY,void(a=Date.now()))}),e.exports._=o});
//# sourceMappingURL=event-handler.js.map
require("image-loader",function(n,r,e){var o=function(){function r(){return o(e,arguments)}var e={en:{},fr:{}},o=n("$").intl;return r.all=e,r}();n("polyfill.promise"),r.exports=function(n){return new Promise(function(r,e){var o,i,t,s,l,u={},a=0,c=function(){a--,0==a&&r(u)},f=function(n){console.error("Unable to load image "+this.src+"! ",n),u[this.$id]=n,c()};for(o in n)i="css/app/"+n[o],t=i.substr(0,i.length-4),s=i.substr(i.length-4),a++,l=new Image,l.$id=o,u[o]=l,l.onload=c,l.onerror=f,l.src=i,l.srcset=t+".mini"+s+" 640w, "+i})},r.exports._=o});
//# sourceMappingURL=image-loader.js.map
require("polyfill.promise",function(t,n,e){var r=function(){function n(){return r(e,arguments)}var e={en:{},fr:{}},r=t("$").intl;return n.all=e,n}();window.Promise||function(){"use strict";function t(t){return"function"==typeof t||"object"==typeof t&&null!==t}function n(t){return"function"==typeof t}function e(t){return"object"==typeof t&&null!==t}function r(){}function o(){return function(){process.nextTick(c)}}function i(){var t=0,n=new q(c),e=document.createTextNode("");return n.observe(e,{characterData:!0}),function(){e.data=t=++t%2}}function s(){var t=new MessageChannel;return t.port1.onmessage=c,function(){t.port2.postMessage(0)}}function u(){return function(){setTimeout(c,1)}}function c(){for(var t=0;t<D;t+=2){var n=K[t],e=K[t+1];n(e),K[t]=void 0,K[t+1]=void 0}D=0}function a(){}function f(){return new TypeError("You cannot resolve a promise with itself")}function l(){return new TypeError("A promises callback cannot return that same promise.")}function h(t){try{return t.then}catch(t){return $.error=t,$}}function p(t,n,e,r){try{t.call(n,e,r)}catch(t){return t}}function _(t,n,e){Y(function(t){var r=!1,o=p(e,n,function(e){r||(r=!0,n!==e?y(t,e):w(t,e))},function(n){r||(r=!0,b(t,n))},"Settle: "+(t._label||" unknown promise"));!r&&o&&(r=!0,b(t,o))},t)}function v(t,n){n._state===U?w(t,n._result):t._state===W?b(t,n._result):g(n,void 0,function(n){y(t,n)},function(n){b(t,n)})}function d(t,e){if(e.constructor===t.constructor)v(t,e);else{var r=h(e);r===$?b(t,$.error):void 0===r?w(t,e):n(r)?_(t,e,r):w(t,e)}}function y(n,e){n===e?b(n,f()):t(e)?d(n,e):w(n,e)}function m(t){t._onerror&&t._onerror(t._result),A(t)}function w(t,n){t._state===N&&(t._result=n,t._state=U,0===t._subscribers.length||Y(A,t))}function b(t,n){t._state===N&&(t._state=W,t._result=n,Y(m,t))}function g(t,n,e,r){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=n,o[i+U]=e,o[i+W]=r,0===i&&t._state&&Y(A,t)}function A(t){var n=t._subscribers,e=t._state;if(0!==n.length){for(var r,o,i=t._result,s=0;s<n.length;s+=3)r=n[s],o=n[s+e],r?P(e,r,o,i):o(i);t._subscribers.length=0}}function j(){this.error=null}function E(t,n){try{return t(n)}catch(t){return z.error=t,z}}function P(t,e,r,o){var i,s,u,c,a=n(r);if(a){if(i=E(r,o),i===z?(c=!0,s=i.error,i=null):u=!0,e===i)return void b(e,l())}else i=o,u=!0;e._state!==N||(a&&u?y(e,i):c?b(e,s):t===U?w(e,i):t===W&&b(e,i))}function T(t,n){try{n(function(n){y(t,n)},function(n){b(t,n)})}catch(n){b(t,n)}}function S(t,n,e,r){this._instanceConstructor=t,this.promise=new t(a,r),this._abortOnReject=e,this._validateInput(n)?(this._input=n,this.length=n.length,this._remaining=n.length,this._init(),0===this.length?w(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&w(this.promise,this._result))):b(this.promise,this._validationError())}function k(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function M(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function O(t,e){this._id=Q++,this._label=e,this._state=void 0,this._result=void 0,this._subscribers=[],a!==t&&(n(t)||k(),this instanceof O||M(),T(this,t))}var C;C=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var R,x=C,D=(Date.now||function(){return(new Date).getTime()},Object.create||function(t){if(arguments.length>1)throw new Error("Second argument not supported");if("object"!=typeof t)throw new TypeError("Argument must be an object");return r.prototype=t,new r},0),Y=function(t,n){K[D]=t,K[D+1]=n,D+=2,2===D&&R()},I="undefined"!=typeof window?window:{},q=I.MutationObserver||I.WebKitMutationObserver,F="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,K=new Array(1e3);R="undefined"!=typeof process&&"[object process]"==={}.toString.call(process)?o():q?i():F?s():u();var N=void 0,U=1,W=2,$=new j,z=new j;S.prototype._validateInput=function(t){return x(t)},S.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")},S.prototype._init=function(){this._result=new Array(this.length)};var B=S;S.prototype._enumerate=function(){for(var t=this.length,n=this.promise,e=this._input,r=0;n._state===N&&r<t;r++)this._eachEntry(e[r],r)},S.prototype._eachEntry=function(t,n){var r=this._instanceConstructor;e(t)?t.constructor===r&&t._state!==N?(t._onerror=null,this._settledAt(t._state,n,t._result)):this._willSettleAt(r.resolve(t),n):(this._remaining--,this._result[n]=this._makeResult(U,n,t))},S.prototype._settledAt=function(t,n,e){var r=this.promise;r._state===N&&(this._remaining--,this._abortOnReject&&t===W?b(r,e):this._result[n]=this._makeResult(t,n,e)),0===this._remaining&&w(r,this._result)},S.prototype._makeResult=function(t,n,e){return e},S.prototype._willSettleAt=function(t,n){var e=this;g(t,void 0,function(t){e._settledAt(U,n,t)},function(t){e._settledAt(W,n,t)})};var G=function(t,n){return new B(this,t,!0,n).promise},H=function(t,n){function e(t){y(i,t)}function r(t){b(i,t)}var o=this,i=new o(a,n);if(!x(t))return b(i,new TypeError("You must pass an array to race.")),i;for(var s=t.length,u=0;i._state===N&&u<s;u++)g(o.resolve(t[u]),void 0,e,r);return i},J=function(t,n){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var r=new e(a,n);return y(r,t),r},L=function(t,n){var e=this,r=new e(a,n);return b(r,t),r},Q=0,V=O;O.all=G,O.race=H,O.resolve=J,O.reject=L,O.prototype={constructor:O,then:function(t,n,e){var r=this,o=r._state;if(o===U&&!t||o===W&&!n)return this;r._onerror=null;var i=new this.constructor(a,e),s=r._result;if(o){var u=arguments[o-1];Y(function(){P(o,i,u,s)})}else g(r,i,t,n);return i},catch:function(t,n){return this.then(null,t,n)}};var X=function(){var t;t="undefined"!=typeof global?global:"undefined"!=typeof window&&window.document?window:self;var e="Promise"in t&&"resolve"in t.Promise&&"reject"in t.Promise&&"all"in t.Promise&&"race"in t.Promise&&function(){var e;return new t.Promise(function(t){e=t}),n(e)}();e||(t.Promise=V)};X()}.call(this),n.exports._=r});
//# sourceMappingURL=polyfill.promise.js.map
require("tfw.webgl",function(e,r,t){function n(e,r,t){if("string"===(r.vert,!1))throw Error("[tfw.webgl.Program] Missing attribute `vert` in argument `codes`!");if("string"===(r.frag,!1))throw Error("[tfw.webgl.Program] Missing attribute `frag` in argument `codes`!");r=a(r,t);var n=e.createProgram();e.attachShader(n,s(e,r.vert||"//No Vertex Shader")),e.attachShader(n,c(e,r.frag||"//No Fragment Shader")),e.linkProgram(n),this.program=n,Object.freeze(this.program),this.use=function(){e.useProgram(n)},this.use();var u,f,m={},g=e.getProgramParameter(n,e.ACTIVE_ATTRIBUTES);for(u=0;u<g;u++)f=e.getActiveAttrib(n,u),m[f.name]=e.getAttribLocation(n,f.name),this["$"+f.name]=e.getAttribLocation(n,f.name);Object.freeze(m),this.attribs=m;var E={},T=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(u=0;u<T;u++)f=e.getActiveUniform(n,u),E[f.name]=e.getUniformLocation(n,f.name),Object.defineProperty(this,"$"+f.name,{set:i(e,f,E[f.name]),get:o(f),enumerable:!0,configurable:!0});Object.freeze(E),this.uniforms=E}function a(e,r){var t,n,a={};for(t in e)n=e[t],a[t]=n.split("\n").map(function(e){if("#include"!=e.trim().substr(0,8))return e;var t=e.indexOf("#include")+8,n=e.substr(t).trim();"'<\"".indexOf(n.charAt(0))>-1&&(n=n.substr(1,n.length-2));var a=r[n];if("string"!=typeof a)throw console.error("Include <"+n+"> not found in ",r),Error("Include not found in shader: "+n);return a}).join("\n");return a}function i(e,r,t){var n="_$"+r.name;switch(r.type){case e.BYTE:case e.UNSIGNED_BYTE:case e.SHORT:case e.UNSIGNED_SHORT:case e.INT:case e.UNSIGNED_INT:return 1==r.size?function(r){e.uniform1i(t,r),this[n]=r}:function(r){e.uniform1iv(t,r),this[n]=r};case e.FLOAT:return 1==r.size?function(r){e.uniform1f(t,r),this[n]=r}:function(r){e.uniform1fv(t,r),this[n]=r}}}function o(e){var r="_$"+e.name;return function(){return this[r]}}function u(e,r,t){var n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),r.getShaderParameter(n,r.COMPILE_STATUS)?n:(console.log(t),console.error("An error occurred compiling the shader: "+r.getShaderInfoLog(n)),null)}function c(e,r){return u(e.FRAGMENT_SHADER,e,r)}function s(e,r){return u(e.VERTEX_SHADER,e,r)}var f=function(){function r(){return n(t,arguments)}var t={en:{},fr:{}},n=e("$").intl;return r.all=t,r}(),m=function(e){"string"==typeof e&&(e=document.getElementById(e)),Object.defineProperty(this,"canvas",{value:e,writable:!1,configurable:!1,enumerable:!0}),Object.defineProperty(this,"gl",{value:e.getContext("webgl")||e.getContext("experimental-webgl"),writable:!1,configurable:!1,enumerable:!0})};m.prototype.start=function(e){var r=function(t){window.requestAnimationFrame(r),e(t)};window.requestAnimationFrame(r)};var g=function(e,r,t){var n=e.createTexture();return e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,r,t,0,e.RGBA,e.UNSIGNED_BYTE,null),n},E=function(e){var r=e.width,t=e.height,n=document.createElement("canvas");n.setAttribute("width",r),n.setAttribute("height",t);var a=n.getContext("2d");return a.drawImage(e,0,0),a.getImageData(0,0,r,t).data};t.Renderer=m,t.Program=n,t.createTextureForFB=g,t.getDataFromImage=E,r.exports._=f});
//# sourceMappingURL=tfw.webgl.js.map
require("smoke",function(r,e,t){function n(r,e,t){F=r;var n=s*R;a[n++]=e-10,a[n++]=t-40,a[n++]=r,a[n++]=u(),a[n++]=Math.min(1,r-f.collisionTime()),R=(R+1)%_}var a,i,o,A=function(){function e(){return n(t,arguments)}var t={en:{},fr:{}},n=r("$").intl;return e.all=t,e}(),l=r("global"),u=r("random"),f=r("hero"),b=r("programs"),c=.01,s=5,_=100,P=null,R=0,F=0;t.ready=new Promise(function(r,e){r()}),t.reset=function(r){P||(P=r,i=P.createBuffer(),o=b(P,"Smoke")),a=new Float32Array(s*_),i=P.createBuffer()},t.draw=function(r){P.blendFunc(P.SRC_ALPHA,P.ONE_MINUS_SRC_ALPHA),P.blendFuncSeparate(P.SRC_ALPHA,P.ONE_MINUS_SRC_ALPHA,P.ZERO,P.ONE),P.blendEquation(P.FUNC_ADD),r-F>c&&n(r,f.x()-30*u(),f.y()-30*u()),l.setGlobalUniforms(o,r),o.$uniCollision=f.collisionTime(),P.bindBuffer(P.ARRAY_BUFFER,i),P.bufferData(P.ARRAY_BUFFER,a,P.STATIC_DRAW);var e=l.BPE*s;P.enableVertexAttribArray(o.$attPos),P.vertexAttribPointer(o.$attPos,4,P.FLOAT,!1,e,0),P.enableVertexAttribArray(o.$attLight),P.vertexAttribPointer(o.$attLight,1,P.FLOAT,!1,e,4*l.BPE),P.drawArrays(P.POINTS,0,_)},e.exports._=A});
//# sourceMappingURL=smoke.js.map
require("programs",function(r,n,a){var o=function(){function n(){return o(a,arguments)}var a={en:{},fr:{}},o=r("$").intl;return n.all=a,n}(),t={vertHero:"#include vertCommon\r\n#include game2gl  \r\n\r\n// Rotation in radians.\r\nuniform float uniRotation;\r\n\r\n// Vertex position and texture coords.\r\n// (x,y) for vertex position, in game's space.\r\n// (z,w) for (radius,angle).\r\nattribute vec4 attPos;\r\n\r\nvarying vec2 varUV;\r\n\r\nconst float SQRT2 = 1.4142135623730951;\r\n\r\nvoid main() {\r\n  float xG = attPos.x;\r\n  float yG = attPos.y;\r\n  // Diagonals must be multiplied by the square root of two.\r\n  float radius = attPos.z * SQRT2;\r\n  // Using the angle, we can deduce the corner position.\r\n  float angle = attPos.w;\r\n  // Propagate UV to the fragment shader.\r\n  varUV = vec2( .5 * SQRT2 * cos(angle) + .5,\r\n                .5 - .5 * SQRT2 * sin(angle) );\r\n  // Apply hero's self rotation.\r\n  angle += uniRotation;\r\n  // Adding some deformations due to \"Infinite Improbability Drive\".\r\n  angle *= 1.0 + .03 * cos(.6 * uniVTime * (.777+angle));\r\n  // Coords of this corner.\r\n  vec2 point = game2gl( xG + radius * cos(angle), yG + radius * sin(angle) );\r\n  \r\n  // GL has a square space with coords between -1 and +1.\r\n  // Final position in GL space.\r\n  gl_Position = vec4( point, 0.0, 1.0 );\r\n}\r\n",fragHero:"precision mediump float;\r\n// Current time.\r\nuniform float uniFTime;\r\n// Last collision time.\r\nuniform float uniCollision;\r\n// The texture is the hero image.\r\nuniform sampler2D uniTexture;\r\n// texture coords UV between 0 and +1.\r\nvarying vec2 varUV;\r\n\r\nvoid main() {\r\n  gl_FragColor = texture2D( uniTexture, .495 * varUV );\r\n  float collision = uniFTime - uniCollision;\r\n  if( collision < 1.0 ) {\r\n    gl_FragColor.g *= collision;\r\n    gl_FragColor.b *= collision;\r\n  }\r\n}\r\n",vertMoon:"#include vertCommon\r\n#include game2gl\r\n  \r\n// Vertex position and texture coords.\r\n// (x,y) for vertex position, in game's space.\r\n// (z,w) for (u,v) texture coords.\r\nattribute vec2 attPos;\r\n// Point size.\r\nattribute float attSize;\r\nattribute float attRnd1;\r\nattribute float attRnd2;\r\nattribute float attDeath;\r\n\r\nvarying float varSize;\r\nvarying float varRnd1;\r\nvarying float varRnd2;\r\nvarying float varDeath;\r\n\r\n\r\nvoid main() {\r\n  // Propagate size to the fragment shader.\r\n  varSize = attSize;\r\n  varRnd1 = attRnd1;\r\n  varRnd2 = attRnd2;\r\n  varDeath = attDeath;\r\n  // Game's space coords.\r\n  vec2 point = game2gl( attPos );\r\n  // GL has a square space with coords between -1 and +1.\r\n  // Final position in GL space.\r\n  gl_Position = vec4( point, 0.0, 1.0 );\r\n  // Point's size...\r\n  gl_PointSize = pointSize( attSize );\r\n}\r\n",fragMoon:"precision mediump float;\r\n\r\nconst float PI = 3.141592653589793;\r\n\r\nconst float X = .5;\r\nconst float Y = -.5;\r\nconst float Z = 0.7071067811865476;\r\n\r\nconst vec4 WHITE = vec4( 1.0, 1.0, 1.0, 1.0 );\r\nconst vec4 BLACK = vec4( 0.0, 0.0, 0.0, 1.0 );\r\nconst vec4 ORANGE = vec4( 1.0, 0.5, 0.0, 1.0 );\r\n\r\nuniform float uniFTime;\r\n\r\n// The texture is the hero image.\r\nuniform sampler2D uniTexture;\r\n\r\nvarying float varSize;\r\nvarying float varRnd1;\r\nvarying float varRnd2;\r\nvarying float varDeath;\r\n\r\n\r\nvoid main() {\r\n  // Vector (x,y,z) has its tail at the center of the sphere and its head on the surface of the sphere.\r\n  float x = gl_PointCoord.x * 2.0 - 1.0;\r\n  float y = gl_PointCoord.y * 2.0 - 1.0;\r\n  float radius = x*x + y*y;\r\n  float alpha = 1.0;\r\n  if( radius > 1.0 ) {\r\n    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\r\n    return;\r\n  }\r\n  if( radius > .9 ) {\r\n    alpha = 10.0 * (1.0 - radius);\r\n  }\r\n  // Therefore, the length of the (x,y,z) vector must be 1 and x*x + y*y + z*z = 1.\r\n  float z = sqrt( 1.0 - x*x - y*y );\r\n  // Rotation.\r\n  float a = uniFTime * .75 * (.2374 + varRnd1);\r\n  float x1 = x;\r\n  float y1 = y * cos(a) + z * sin(a);\r\n  float z1 = -y * sin(a) + z * cos(a);\r\n  a = uniFTime * .75 * (.3797 + varRnd2);\r\n  float x2 = x1 * cos(a) + z1 * sin(a);\r\n  float y2 = y1;\r\n  float z2 = -x1 * sin(a) + z1 * cos(a);\r\n  \r\n  float lat = -asin( y2 );\r\n  float r = cos( lat );\r\n  float lng = 0.0;\r\n  if( r > 0.0 ) {\r\n    lng = asin( x2 / r );\r\n  }\r\n  lng += PI * .5;   // Now lng is between 0 and PI.\r\n  if( z2 < .0 ) {\r\n    // We must adjust for the backface of the moon.\r\n    lng = 2.0 * PI - lng;\r\n  }  \r\n  \r\n  vec2 uv = vec2(.5 * lng / PI, .5 - lat / PI);\r\n  vec2 uvColor = .5 * uv + vec2(.0, .5);\r\n  //gl_FragColor = vec4(uv.x, uv.x, uv.x, 1.0);\r\n  gl_FragColor = texture2D( uniTexture, uvColor );\r\n  // Check death date.  Because .5 seconds before the  death, the moon\r\n  // turns orange.  \r\n  if( varDeath > uniFTime ) {\r\n    gl_FragColor = mix(ORANGE, gl_FragColor, clamp(2.0 * (varDeath - uniFTime), .0, 1.0));\r\n  }\r\n\r\n  // Now, we want  to compute normals to apply lighting effects.\r\n  vec2 uvNormal = .5 * uv + vec2(.5, .0);\r\n  vec3 normal = texture2D( uniTexture, uvNormal ).xyz;\r\n  normal = 2.0 * ( normal - vec3(.5, .5, .5) );\r\n  \r\n  lat = -asin( normal.y );\r\n  r = cos( lat );\r\n  lng = 0.0;\r\n  if( r > 0.0 ) {\r\n    lng = asin( normal.x / r );\r\n  }\r\n  normal = vec3(x,y,z);\r\n  x = normal.x;\r\n  y = normal.y * cos(lat) + normal.z * sin(lat);\r\n  z = -normal.y * sin(lat) + normal.z * cos(lat);\r\n  normal = vec3(x,y,z);\r\n  \r\n  // Shadow. (x,y,z) is the normal and (X,Y,Z) is the light ray.\r\n  vec3 light = reflect( vec3(X, Y, Z), normal );\r\n  //light = reflect( light, normal );\r\n  float shadow = -light.z;\r\n  if( shadow > 0.0 ) gl_FragColor = mix( gl_FragColor, WHITE, shadow );\r\n  else if( shadow < 0.0 ) gl_FragColor = mix( gl_FragColor, BLACK, -shadow );\r\n\r\n  gl_FragColor.a = alpha;\r\n}\r\n",vertSmoke:"#include vertCommon\r\n#include game2gl  \r\n\r\n// Vertex position and texture coords.\r\n// (x,y) for vertex position, in game's space.\r\n// z: birth.\r\n// w: random.\r\nattribute vec4 attPos;\r\n// Used for collisions. Smoke become dark after a collision.\r\n// Then attLight fall to zero.\r\nattribute float attLight;\r\n\r\nvarying float varLight;\r\nvarying float varAge;\r\n\r\nconst float CURVATURE = 0.5;\r\n\r\nvoid main() {\r\n  // Propagate random to the fragment shader.\r\n  varLight = attLight;\r\n  \r\n  // Point's size...\r\n  float age = uniVTime - attPos.z;\r\n  varAge = age;\r\n  float size = uniScrH * .05 * (1.0 + attPos.w);\r\n  size *= clamp( age, 0.0, 1.0 );\r\n  size += 30.0;\r\n  if( age > 2.0 ) size = 0.0;\r\n  gl_PointSize = size;\r\n\r\n  // Game's space coords.\r\n  float x = attPos.x - 40.0;\r\n  float shift = (age - 0.5) * 20.0;\r\n  shift *= shift;\r\n  shift -= 130.0;\r\n  float y = attPos.y + shift;\r\n  vec2 point = game2gl( x, y );\r\n  // GL has a square space with coords between -1 and +1.\r\n  // Final position in GL space.\r\n  gl_Position = vec4( point, 0.0, 1.0 );\r\n}\r\n",fragSmoke:"precision mediump float;\r\n\r\nuniform float uniFTime;\r\nuniform float uniCollision;\r\n\r\nvarying float varLight;\r\nvarying float varAge;\r\n\r\nvoid main() {\r\n  float x = gl_PointCoord.x - .5;\r\n  float y = gl_PointCoord.y - .5;\r\n  float r = sqrt(x*x + y*y);\r\n  if( r > 0.5 ) gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\r\n  else {\r\n    float a = 2.0 - varAge;\r\n    a = clamp(a, 0.0, 1.0);\r\n    a *= 1.0 - 2.0 * r;\r\n    float k = varLight;\r\n    gl_FragColor = vec4(k, k, k, 0.25 * a);\r\n  }\r\n}\r\n",vertStars:"#include vertCommon\r\n\r\n// Vertex position and texture coords.\r\n// (x,y,z) for vertex position, in game's space.\r\n// w: random.\r\nattribute vec4 attPos;\r\n\r\nvarying float varZ;\r\nvarying float varRnd;\r\n\r\nvoid main() {\r\n  // Propagate random to the fragment shader.\r\n  varZ = attPos.z;\r\n  varRnd = attPos.w;\r\n  \r\n  float factorS = uniScrH / uniGameH;\r\n  gl_PointSize = uniGameH * .08 * varZ * factorS;\r\n\r\n  // Game's space coords.\r\n  float xG = uniGameW * .5 - mod(attPos.x + uniCamX * varZ, uniGameW);\r\n  float yG = attPos.y - uniGameH * .5;\r\n\r\n  // Convert game coords into screen coords.\r\n  // A column must fit entirely in the screens height.\r\n  float xS = xG * factorS;\r\n  float yS = yG * factorS;\r\n  // Now, convert screen coords into WebGL coords.\r\n  // Setting the center.\r\n  float factorW = 2.0 / uniScrW;\r\n  float factorH = 2.0 / uniScrH;\r\n  float x = xS * factorW;\r\n  float y = yS * factorH;  \r\n\r\n  // GL has a square space with coords between -1 and +1.\r\n  // Final position in GL space.\r\n  gl_Position = vec4( x, y, 0.0, 1.0 );\r\n}\r\n",fragStars:"precision mediump float;\r\n\r\nuniform float uniFTime;\r\n\r\nvarying float varZ;\r\nvarying float varRnd;\r\n\r\nvoid main() {\r\n  float x = gl_PointCoord.x - .5;\r\n  float y = gl_PointCoord.y - .5;\r\n  float a = uniFTime * (.5 + varRnd);\r\n  float xx = x * cos(a) + y * sin(a);\r\n  float yy = -x * sin(a) + y * cos(a);\r\n  float r = abs(xx*xx - yy*yy);\r\n  if( r > 0.01 ) gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\r\n  else {\r\n    gl_FragColor = vec4(1.0, 1.0 - varRnd * .5, varRnd, varZ * .5);\r\n  }\r\n}\r\n",vertExplo:"#include vertCommon\r\n#include game2gl  \r\n\r\n// Vertex position and texture coords.\r\n// (x,y) for vertex position, in game's space.\r\n// z: birth.\r\n// w: random.\r\nattribute vec4 attPos;\r\n\r\nvarying float varBirth;\r\n\r\nvoid main() {\r\n  float age = uniVTime - attPos.z;\r\n  if( age > 1.0 ) {\r\n    gl_PointSize = 0.0;\r\n    return;\r\n  }\r\n\r\n  // Propagate random to the fragment shader.\r\n  varBirth = attPos.z;\r\n  \r\n  // Point's size...\r\n  gl_PointSize = pointSize( attPos.w * (1.0 + 2.0 * age) );\r\n\r\n  // Game's space coords.\r\n  vec2 point = game2gl( attPos.x, attPos.y );\r\n  // GL has a square space with coords between -1 and +1.\r\n  // Final position in GL space.\r\n  gl_Position = vec4( point, 0.0, 1.0 );\r\n}\r\n",fragExplo:"precision mediump float;\r\n\r\nuniform float uniFTime;\r\n\r\nvarying float varBirth;\r\n\r\nvoid main() {\r\n  float age = uniFTime - varBirth;\r\n\r\n  float x = gl_PointCoord.x - .5;\r\n  float y = gl_PointCoord.y - .5;\r\n  float r = 4.0 * sqrt(x*x + y*y);\r\n  float alpha = 0.0;\r\n  if( r < 1.0 ) {\r\n    alpha = sin( r * 20.0 + uniFTime * 5.0 );\r\n    alpha = abs( alpha );\r\n    alpha = .5 * alpha + .5;\r\n    alpha *= 1.0 - age;\r\n  }\r\n  gl_FragColor = vec4(1.0, 0.5, 0.0, alpha);\r\n}\r\n",game2gl:"vec2 game2scr(float xG, float yG) {\r\n  // Where the camera points, the coords are (0,0).\r\n  xG -= uniCamX;\r\n  yG -= uniCamY;\r\n  // Wrapping.\r\n  if( xG < -.25 * uniGameW ) xG += uniGameW;\r\n  else if( xG > .75 * uniGameW ) xG -= uniGameW;\r\n\r\n  // Convert game coords into screen coords.\r\n  // A column must fit entirely in the screens height.\r\n  float factorS = uniScrH / uniGameH;\r\n  float xS = xG * factorS - uniScrW * .25;\r\n  float yS = yG * factorS;\r\n\r\n  return vec2(xS, yS);\r\n}\r\n\r\nvec2 game2gl(float xG, float yG) {\r\n  vec2 scr = game2scr(xG, yG);\r\n  // Now, convert screen coords into WebGL coords.\r\n  // Setting the center.\r\n  float factorW = 2.0 / uniScrW;\r\n  float factorH = 2.0 / uniScrH;\r\n  float x = scr.x * factorW;\r\n  float y = scr.y * factorH;  \r\n\r\n  return vec2( x, y );\r\n}\r\n\r\n\r\nvec2 game2gl(vec2 pos) {\r\n  return game2gl( pos.x, pos.y );\r\n}\r\n\r\n\r\nfloat pointSize( float radius ) {\r\n  float factorS = uniScrH / uniGameH;\r\n  return 2.0 * radius * factorS;\r\n}\r\n\r\nvec2 wrap(vec2 pos) {\r\n  // Wrapping.\r\n  if( pos.x < -uniGameW ) pos.x += uniGameW;\r\n  if( pos.x > uniGameW ) pos.x -= uniGameW;\r\n  return pos;\r\n}\r\n",vertCommon:"const float PI = 3.141592653589793;\r\n\r\n// Time in seconds.\r\nuniform float uniVTime;\r\n// Screen dimensions in pixels.\r\nuniform float uniScrW;\r\nuniform float uniScrH;\r\n// Game's space dimension.\r\nuniform float uniGameW;\r\nuniform float uniGameH;\r\n// Where is the camera pointing?\r\nuniform float uniCamX;\r\nuniform float uniCamY;\r\n"},e=r("tfw.webgl");n.exports=function(r,n){var a=t["vert"+n];if(!a)throw Error("Vertex shader not found: vert"+n+"!");var o=t["frag"+n];if(!o)throw Error("Fragment shader not found: frag"+n+"!");return new e.Program(r,{vert:a,frag:o},t)},n.exports._=o});
//# sourceMappingURL=programs.js.map
require("hero",function(n,r,t){var e,o,i,u,a,f,c,l,A,s,_=function(){function r(){return e(t,arguments)}var t={en:{},fr:{}},e=n("$").intl;return r.all=t,r}(),h=n("global"),R=n("random"),m=n("programs"),v=n("image-loader"),C=n("event-handler"),d=Math.PI,L=1600,M=2*h.COL_W,b=600,F=0,P=null,E=0;t.ready=new Promise(function(n,r){v({hero:"hero.png"}).then(function(r){i=r.hero,n()})}),t.start=function(){F=b},t.reset=function(n){P||(P=n,o=P.createBuffer(),u=m(P,"Hero")),e=new Float32Array(16),s=0,a=.5*(h.NB_COLS*h.COL_W),f=.5*h.COL_H,c=0,l=0,A=h.COL_H/16,E=-666,C.on(function(n){l=777*n}),C.start()},t.draw=function(n){P.blendFunc(P.SRC_ALPHA,P.ONE_MINUS_SRC_ALPHA),h.setGlobalUniforms(u,n),u.$uniCollision=E,e[0]=a,e[1]=f,e[2]=A,e[3]=.25*d,e[4]=a,e[5]=f,e[6]=A,e[7]=.75*d,e[8]=a,e[9]=f,e[10]=A,e[11]=1.25*d,e[12]=a,e[13]=f,e[14]=A,e[15]=1.75*d;var r=l>0?Math.sqrt(l):-Math.sqrt(-l);r*=.02,r=Math.min(.5*d,Math.max(.5*-d,r)),u.$uniRotation=r,P.bindBuffer(P.ARRAY_BUFFER,o),P.bufferData(P.ARRAY_BUFFER,e,P.STATIC_DRAW),P.enableVertexAttribArray(u.$attPos),P.vertexAttribPointer(u.$attPos,4,P.FLOAT,!1,4*h.BPE,0),P.drawArrays(P.TRIANGLE_FAN,0,4)},t.move=function(n){if(0==s)return void(s=n);var r=n-s;s=n,a+=c*r,c<M&&(c=Math.min(M,c+F*r*(c<0?4:1))),l>0?(l-=L*r,l<0&&(l=0)):l<0&&(l+=L*r,l>0&&(l=0)),f+=l*r,f>h.GAME_H-A?(f=h.GAME_H-A,l=l<0?l:-l):f<A&&(f=A,l=l>0?l:-l)},t.collision=function(n,r){c<0||(E=n,l+=(r<0?1:-1)*R()*1200,c=c<0?c:-c)},t.collisionTime=function(){return E},t.isInCollision=function(n){return n-E<1},t.x=function(){return a},t.y=function(){return f},t.vx=function(){return c},t.vy=function(){return l},t.size=function(){return A},r.exports._=_});
//# sourceMappingURL=hero.js.map
require("random",function(r,n,t){var e=function(){function n(){return e(t,arguments)}var t={en:{},fr:{}},e=r("$").intl;return n.all=t,n}();n.exports=Math.random,n.exports._=e});
//# sourceMappingURL=random.js.map
require("global",function(n,e,i){function r(n,i){Object.defineProperty(e.exports,n,{value:i,writable:!1,configurable:!0,enumerable:!0})}var a=function(){function e(){return r(i,arguments)}var i={en:{},fr:{}},r=n("$").intl;return e.all=i,e}();r("BPE",(new Float32Array).BYTES_PER_ELEMENT),r("COL_W",512),r("COL_H",1024),r("NB_COLS",16),r("GAME_W",i.NB_COLS*i.COL_W),r("GAME_H",i.COL_H),i.cameraX=0,i.cameraY=0,i.setGlobalUniforms=function(n,e){n.use(),n.$uniVTime=e,n.$uniFTime=e;var r=window.innerHeight>800?1:0;n.$uniScrW=window.innerWidth>>r,n.$uniScrH=window.innerHeight>>r,n.$uniGameW=i.GAME_W,n.$uniGameH=i.GAME_H,n.$uniCamX=i.cameraX,n.$uniCamY=i.cameraY},e.exports._=a});
//# sourceMappingURL=global.js.map
require("explo",function(r,e,n){var t,a,o,A=function(){function e(){return t(n,arguments)}var n={en:{},fr:{}},t=r("$").intl;return e.all=n,e}(),u=r("global"),f=(r("random"),r("programs")),i=4,l=6,_=null,R=0;n.ready=new Promise(function(r,e){r()}),n.reset=function(r){_||(_=r,a=_.createBuffer(),o=f(_,"Explo")),t=new Float32Array(i*l),a=_.createBuffer()},n.draw=function(r){_.blendFunc(_.SRC_ALPHA,_.ONE_MINUS_SRC_ALPHA),_.blendFuncSeparate(_.SRC_ALPHA,_.ONE_MINUS_SRC_ALPHA,_.ZERO,_.ONE),_.blendEquation(_.FUNC_ADD),u.setGlobalUniforms(o,r),_.bindBuffer(_.ARRAY_BUFFER,a),_.bufferData(_.ARRAY_BUFFER,t,_.STATIC_DRAW);var e=u.BPE*i;_.enableVertexAttribArray(o.$attPos),_.vertexAttribPointer(o.$attPos,4,_.FLOAT,!1,e,0),_.drawArrays(_.POINTS,0,l)},n.newExplosion=function(r,e,n,a){var o;o=i*R,t[o++]=r,t[o++]=e,t[o++]=n,t[o++]=2*a,R=(R+1)%l},e.exports._=A});
//# sourceMappingURL=explo.js.map
require("stars",function(r,e,t){var n,a,A,o=function(){function e(){return n(t,arguments)}var t={en:{},fr:{}},n=r("$").intl;return e.all=t,e}(),f=r("global"),u=r("random"),i=r("programs"),_=4,l=200,s=null;t.ready=new Promise(function(r,e){r()}),t.reset=function(r){s||(s=r,a=s.createBuffer(),A=i(s,"Stars")),n=new Float32Array(_*l),a=s.createBuffer();for(var e=0,t=0;t<l;t++)n[e++]=f.GAME_W*u(),n[e++]=f.GAME_H*u(),n[e++]=.25+.5*u(),n[e++]=u()},t.draw=function(r){s.blendFunc(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA),s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE),s.blendEquation(s.FUNC_ADD),f.setGlobalUniforms(A,r),s.bindBuffer(s.ARRAY_BUFFER,a),s.bufferData(s.ARRAY_BUFFER,n,s.STATIC_DRAW);var e=f.BPE*_;s.enableVertexAttribArray(A.$attPos),s.vertexAttribPointer(A.$attPos,4,s.FLOAT,!1,e,0),s.drawArrays(s.POINTS,0,l)},e.exports._=o});
//# sourceMappingURL=stars.js.map
require("moon",function(t,e,r){function n(t,e,r){O.collision(e,r),a(t,e)}function a(t,e){o[t+5]=e+.5}var o,i,A,l,f=function(){function e(){return n(r,arguments)}var r={en:{},fr:{}},n=t("$").intl;return e.all=r,e}(),_=t("global"),u=t("random"),O=t("hero"),b=t("explo"),L=t("programs"),C=t("image-loader"),S=6,v=null,B=-555;r.ready=new Promise(function(t,e){C({moon:"moon.png"}).then(function(e){l=e.moon,t()})}),r.reset=function(t){v||(v=t,i=v.createBuffer(),A=L(v,"Moon")),o=new Float32Array(S*_.NB_COLS),i=v.createBuffer();for(var e=0,r=0;r<_.NB_COLS;r++)o[e++]=0,o[e++]=0,o[e++]=0,o[e++]=0,o[e++]=0,o[e++]=0},r.draw=function(t){v.blendFunc(v.SRC_ALPHA,v.ONE_MINUS_SRC_ALPHA),v.blendFuncSeparate(v.SRC_ALPHA,v.ONE_MINUS_SRC_ALPHA,v.ZERO,v.ONE),v.blendEquation(v.FUNC_ADD),_.setGlobalUniforms(A,t),v.bindBuffer(v.ARRAY_BUFFER,i),v.bufferData(v.ARRAY_BUFFER,o,v.STATIC_DRAW);var e=_.BPE*S;v.enableVertexAttribArray(A.$attPos),v.vertexAttribPointer(A.$attPos,2,v.FLOAT,!1,e,0*_.BPE),v.enableVertexAttribArray(A.$attSize),v.vertexAttribPointer(A.$attSize,1,v.FLOAT,!1,e,2*_.BPE),v.enableVertexAttribArray(A.$attRnd1),v.vertexAttribPointer(A.$attRnd1,1,v.FLOAT,!1,e,3*_.BPE),v.enableVertexAttribArray(A.$attRnd2),v.vertexAttribPointer(A.$attRnd2,1,v.FLOAT,!1,e,4*_.BPE),v.enableVertexAttribArray(A.$attDeath),v.vertexAttribPointer(A.$attDeath,1,v.FLOAT,!1,e,5*_.BPE),v.drawArrays(v.POINTS,0,_.NB_COLS)},r.move=function(t){for(var e,r=0,a=0;a<_.NB_COLS;a++)e=o[r+5],e>0&&t>e&&(b.newExplosion(o[r],o[r+1],t,o[r+2]),o[r+1]=-1e4,o[r+2]=0,o[r+5]=0),r+=S;if(!O.isInCollision(t)){var i=O.x(),A=O.y(),l=Math.floor(i/_.COL_W);if(l!=B){B=l;var f=l%_.NB_COLS,L=l*_.COL_W,C=Math.ceil(.6*_.NB_COLS),v=(f+C)%_.NB_COLS,r=v*S,c=_.COL_H/12*(.7+.6*u());o[r++]=L+(C+u())*_.COL_W,o[r++]=A+2*c*(u()-.5),o[r++]=c,o[r++]=u(),o[r++]=u(),o[r++]=0}var d,s,P,N,R=Math.floor(i/_.COL_W)%_.NB_COLS,x=(R+_.NB_COLS-1)%_.NB_COLS,E=(R+1)%_.NB_COLS,m=x*S,F=R*S,$=E*S;return s=o[m+0]-i,P=o[m+1]-A,N=O.size()+o[m+2],d=s*s+P*P,d<N*N?void n(m,t,P):(s=o[F+0]-i,P=o[F+1]-A,N=O.size()+o[F+2],d=s*s+P*P,d<N*N?void n(F,t,P):(s=o[$+0]-i,P=o[$+1]-A,N=O.size()+o[$+2],d=s*s+P*P,d<N*N?void n($,t,P):void 0))}},r.makeTerrain=function(t){var e=document.createElement("canvas");e.setAttribute("width",256),e.setAttribute("height",256);var r=e.getContext("2d");r.fillStyle="rgb(127, 127, 255)",r.fillRect(0,0,256,256);for(var n,a,o,i,A,l=0;l<13;l++)for(o=8*u()+16,n=u()*(192-o)+64,a=u()*(192-o)+64,i=-1;i<2;i++)for(A=-1;A<2;A++)r.drawImage(t,n+256*i,a+256*A,.5*o,o);return e},e.exports._=f});
//# sourceMappingURL=moon.js.map
require("alert",function(e,n,t){function o(e){32!=e.keyCode&&13!=e.keyCode||r()}function d(){r()}function r(){c&&(c.className="alert",document.body.removeEventListener("keyup",o),document.body.removeEventListener("touchend",d),window.setTimeout(function(){c&&(document.body.removeChild(c),c=null,"function"==typeof u&&u())},300))}var u,i=function(){function n(){return o(t,arguments)}var t={en:{},fr:{}},o=e("$").intl;return n.all=t,n}(),c=null;n.exports=function(e,n){u=n;var t=document.body;c&&t.removeChild(c),c=document.createElement("div"),c.className="alert show";var r=document.createElement("div");r.innerHTML=e,c.appendChild(r),t.appendChild(c),t.addEventListener("keyup",o,!0),t.addEventListener("touchend",d,!0)},n.exports._=i});
//# sourceMappingURL=alert.js.map
require("offline",function(e,r,n){var o=function(){function r(){return o(n,arguments)}var n={en:{},fr:{}},o=e("$").intl;return r.all=n,r}();navigator.serviceWorker&&(navigator.serviceWorker.register("offline.js",{scope:"/space-adventure/"}),navigator.serviceWorker.ready.then(function(e){console.info("Service Worker is ready for ",e.scope)}).catch(function(e){console.error("Registration failed with: ",e)})),r.exports._=o});
//# sourceMappingURL=offline.js.map
