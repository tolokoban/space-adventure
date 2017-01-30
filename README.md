# space-adventure
Clone of the [Calvacadeur's game](https://cavalcadeur.github.io/space-adventure/), but in WebGL.

## Specifications
The game must be responsive: it must adapt to any screen size.
It must be fast on smart phones.

The world is NOT in polar coordinates. It is only a projection made by a vertex shader that shows it polar on the screen.
All the game is designed as if the hero was flying over a totaly flat planet.
Each obstacle is in its own column and can move only up and down. This way, the hero can only be in two columns at the same time, and the collision detection is optimized.
No collision is tested between obtacles. Only between hero/obstacle (and fire/obtacle if we add the ability to fire on obstacles).

Columns are stored in a fixed-length array where new columns will override old ones.
But to prevent any memory allocation during animation, all the columns are created just once and they have this structure:

```js
ff
```
