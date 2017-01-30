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
But to prevent any memory allocation during animation, all the columns are created just once and they have this structure (assuming the W is the width of the column and H its height):

```js
[
  1,   // Obstacle type. 0 means that there is no more obstacle in this column.
  0,   // X. 0 is center. -W/2 left edge of the column and +W/2 right edge.
  23,  // Y. 0 bottom edge of the column and +H top edge.
  7,   // Attribute 1. Depends on the objstacle type. See below.
  9,   // Attribute 2.
  ...
  6,   // Attribute n.
  ...  // Repeat this sequence 5 times if you have a maximum of 5 obstacle in a column.
]
```

Here are the differents obstacles:
1. Moon.
  * Att1: radius
  * Att2: limit of movement in Y.
  * Att3: speed of movement.
2. Reward. The hero win points if he catch it.
  * Att1: number of points.
