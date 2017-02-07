"use strict";

if( navigator.serviceWorker ) {
    navigator.serviceWorker.register('offline.js', {
        scope: '/space-adventure/'
    });

    navigator.serviceWorker.ready.then(function() {
        console.info( "Service Worker is ready!" );
    });
}
