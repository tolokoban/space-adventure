function precache(){return caches.open(CACHE).then(function(n){return n.addAll(["./index.html","./manifest.json","./js/@index.js","./css/@index.css","./css/app/earth.mini.png","./css/app/earth.png","./css/app/hero.mini.png","./css/app/hero.png","./css/app/icon-192.png","./css/app/icon-512.png","./css/app/moon.mini.png","./css/app/moon.png"])})}function fromCache(n){return caches.open(CACHE).then(function(e){return e.match(n).then(function(n){return n||Promise.reject("no-match")})})}function update(n){return caches.open(CACHE).then(function(e){return fetch(n).then(function(t){return e.put(n,t)})})}var window=self;window.require=function(){var n={},e={},t="function"==typeof window.require?window.require:null,r=function(o,i){if("node://"==o.substr(0,7)){if(!t)throw Error("[require] NodeJS is not available to load module `"+o+"`!");return t(o.substr(7))}if("function"==typeof i)return void(e[o]=i);var a;if(void 0===(i=e[o])){var s=new Error("Required module is missing: "+o);throw console.error(s.stack),s}if(void 0===(a=n[o])){a={exports:{}};var c=a.exports;i(r,a,c),n[o]=a.exports,a=a.exports}return a};return r}(),require("$",function(n,e,t){t.config={name:'"space-adventure"',description:'"WebGL clone of Cavalcadeur\'s original game."',author:'"tolokoban"',version:'"0.0.50"',major:"0",minor:"0",revision:"50",date:"2022-01-25T14:25:23.000Z",consts:{}};var r=null;t.lang=function(n){return void 0===n&&(window.localStorage&&(n=window.localStorage.getItem("Language")),n||(n=window.navigator.language)||(n=window.navigator.browserLanguage)||(n="fr"),n=n.substr(0,2).toLowerCase()),r=n,window.localStorage&&window.localStorage.setItem("Language",n),n},t.intl=function(n,e){var r,o,i,a,s,c,u,l=n[t.lang()],f=e[0];for(u in n)break;if(!u)return f;if(!l&&!(l=n[u]))return f;if(r=l[f],r||(l=n[u],r=l[f]),!r)return f;if(e.length>1){for(o="",s=0,i=0;i<r.length;i++)a=r.charAt(i),"$"===a?(o+=r.substring(s,i),i++,c=r.charCodeAt(i)-48,c<0||c>=e.length?o+="$"+r.charAt(i):o+=e[c],s=i+1):"\\"===a&&(o+=r.substring(s,i),i++,o+=r.charAt(i),s=i+1);o+=r.substr(s),r=o}return r}});var CACHE="cache-and-update";self.addEventListener("install",function(n){console.log("[SW] install."),n.waitUntil(precache())}),self.addEventListener("activate",function(n){console.log("[SW] activate."),n.waitUntil(precache())}),self.addEventListener("fetch",function(n){console.log("[SW] fetch. ",n.request.url),n.respondWith(fromCache(n.request)),n.waitUntil(update(n.request))}),self.addEventListener("message",function(n){console.log("[SW] message.")}),self.addEventListener("sync",function(n){console.log("[SW] sync.")}),self.addEventListener("push",function(n){console.log("[SW] push.")});
//# sourceMappingURL=mod/offline.wrk.map