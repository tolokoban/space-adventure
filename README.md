# space-adventure
**WebGL progressive app** which installs itself on the home screen of your smartphone.
This project is a simple game's prototype with a lot of comments and explenations.

[![Screen Shot](img/screen-shot.jpg)](https://tolokoban.github.io/space-adventure)

You can test it by clicking on the above picture.
_(try to refresh if you get a strange error)_

## Progressive app

We want our app to behave like a standalone app on Android smart phones.
That means three things:
* We want our game to be displayed in full screen and not in a browser.
* We want be able to play even if the network is out of order.
* We want a nice icon on our home screen.

This is now made possible with the [progressive app](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en) paradigm.

For this, we need [a manifest](src/mod/manifest.json) and a [service worker](src/mod/offline.wrk).

## WebGL

The game is ridiculously simple: you control a ship in a space full of planets (actually all the planets look like the Earth).
When you hit a planet, it will explode in the very next second. For this, we have 5 main modules:
* __[hero.js](src/mod/hero.js)__: The hero is a picture of the [Marvin](https://en.wikipedia.org/wiki/Marvin_(character))'s head.
    * It has a little deformation while it is still to give the impression of speed.
    * It becomes red after a collision with a planet.
* __[moon.js](src/mod/moon.js)__: This module deals with the planets.
    * The planet is the Earth. Therefore, you can see the sperical mapping of the [texture](src/mod/app/earth.png).
    * It can rotate freely on all axis.
    * It is enlighted to make it look as a real sphere and not just the disk that it really is.
    * It has a rough surface to test [normals mapping](src/mod/app/moon.png).
    * It becomes orange when hit by the hero. The transition between initial colors and orange takes .5 seconds.
* __[stars.js](src/mod/stars.js)__:
* __[explo.js](src/mod/explo.js)__:
* __[smoke.js](src/mod/smoke.js)__:


