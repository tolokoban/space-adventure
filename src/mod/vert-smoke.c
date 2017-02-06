#include vertCommon
#include game2gl  

// Vertex position and texture coords.
// (x,y) for vertex position, in game's space.
// z: birth.
// w: random.
attribute vec4 attPos;
// Used for collisions. Smoke become dark after a collision.
// Then attLight fall to zero.
attribute float attLight;

varying float varLight;
varying float varAge;

const float CURVATURE = 0.5;

void main() {
  // Propagate random to the fragment shader.
  varLight = attLight;
  
  // Point's size...
  float age = uniVTime - attPos.z;
  varAge = age;
  float size = uniScrH * .05 * (1.0 + attPos.w);
  size *= clamp( age, 0.0, 1.0 );
  size += 30.0;
  if( age > 2.0 ) size = 0.0;
  gl_PointSize = size;

  // Game's space coords.
  float x = attPos.x - 40.0;
  float shift = (age - 0.5) * 20.0;
  shift *= shift;
  shift -= 130.0;
  float y = attPos.y + shift;
  vec2 point = game2gl( x, y );
  // GL has a square space with coords between -1 and +1.
  // Final position in GL space.
  gl_Position = vec4( point, 0.0, 1.0 );
}
