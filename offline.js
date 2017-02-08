<<<<<<< HEAD
function precache(){return caches.open(CACHE).then(function(e){return e.addAll(["./index.html","./manifest.json","./js/@index.js","./css/@index.css","./css/app/earth.mini.png","./css/app/earth.png","./css/app/hero.mini.png","./css/app/hero.png","./css/app/icon-192.png","./css/app/icon-512.png","./css/app/moon.mini.png","./css/app/moon.png"])})}function fromCache(e){return caches.open(CACHE).then(function(n){return n.match(e).then(function(e){return e||Promise.reject("no-match")})})}function update(e){return caches.open(CACHE).then(function(n){return fetch(e).then(function(t){return n.put(e,t)})})}var window=self;window.require=function(){var e={},n={},t="function"==typeof window.require?window.require:null,r=function(o,i){if("node://"==o.substr(0,7)){if(!t)throw Error("[require] NodeJS is not available to load module `"+o+"`!");return t(o.substr(7))}if("function"==typeof i)return void(n[o]=i);var a;if(i=n[o],"undefined"==typeof i){var s=new Error("Required module is missing: "+o);throw console.error(s.stack),s}if(a=e[o],"undefined"==typeof a){a={exports:{}};var c=a.exports;i(r,a,c),e[o]=a.exports,a=a.exports}return a};return r}(),require("$",function(e,n,t){t.config={name:'"space-adventure"',description:'"WebGL clone of Cavalcadeur\'s original game."',author:'"tolokoban"',version:'"0.0.34"',major:"0",minor:"0",revision:"34",date:"2017-02-08T08:22:57.000Z",consts:{}};var r=null;t.lang=function(e){return void 0===e&&(window.localStorage&&(e=window.localStorage.getItem("Language")),e||(e=window.navigator.language,e||(e=window.navigator.browserLanguage,e||(e="fr"))),e=e.substr(0,2).toLowerCase()),r=e,window.localStorage&&window.localStorage.setItem("Language",e),e},t.intl=function(e,n){var r,o,i,a,s,c,u,l=e[t.lang()],f=n[0];for(u in e)break;if(!u)return f;if(!l&&(l=e[u],!l))return f;if(r=l[f],r||(l=e[u],r=l[f]),!r)return f;if(n.length>1){for(o="",s=0,i=0;i<r.length;i++)a=r.charAt(i),"$"===a?(o+=r.substring(s,i),i++,c=r.charCodeAt(i)-48,o+=c<0||c>=n.length?"$"+r.charAt(i):n[c],s=i+1):"\\"===a&&(o+=r.substring(s,i),i++,o+=r.charAt(i),s=i+1);o+=r.substr(s),r=o}return r}});var CACHE="cache-and-update";self.addEventListener("install",function(e){console.log("[SW] install."),e.waitUntil(precache())}),self.addEventListener("activate",function(e){console.log("[SW] activate."),e.waitUntil(precache())}),self.addEventListener("fetch",function(e){console.log("[SW] fetch. ",e.request.url),e.respondWith(fromCache(e.request)),e.waitUntil(update(e.request))}),self.addEventListener("message",function(e){console.log("[SW] message.")}),self.addEventListener("sync",function(e){console.log("[SW] sync.")}),self.addEventListener("push",function(e){console.log("[SW] push.")});
//# sourceMappingURL=mod/offline.wrk.map
=======
function precache() {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll([
            './index.html',
            './manifest.json',
            './js/@index.js',
            './css/@index.css',
            './css/app/earth.mini.png',
            './css/app/earth.png',
            './css/app/hero.mini.png',
            './css/app/hero.png',
            './css/app/icon-192.png',
            './css/app/icon-512.png',
            './css/app/moon.mini.png',
            './css/app/moon.png'
        ]);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}

function update(request) {
    return caches.open(CACHE).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
}


var CACHE = 'cache-and-update';

self.addEventListener('install', function(evt) {
    console.log('[SW] install.');
    evt.waitUntil(precache());
});

self.addEventListener('activate', function(evt) {
    console.log('[SW] activate.');
    evt.waitUntil(precache());
});

self.addEventListener('fetch', function(evt) {
    console.log('[SW] fetch. ', evt.request.url);
    evt.respondWith(fromCache(evt.request));
    evt.waitUntil(update(evt.request));
});

self.addEventListener('message', function(evt) {
    console.log('[SW] message.');
});

self.addEventListener('sync', function(evt) {
    console.log('[SW] sync.');
});

self.addEventListener('push', function(evt) {
    console.log('[SW] push.');
});

>>>>>>> 4ba374cc197d22ecd3145bbc51874f133ad58589
