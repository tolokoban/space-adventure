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





