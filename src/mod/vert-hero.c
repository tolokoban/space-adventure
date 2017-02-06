#include vertCommon
#include game2gl  

// Rotation in radians.
uniform float uniRotation;

// Vertex position and texture coords.
// (x,y) for vertex position, in game's space.
// (z,w) for (radius,angle).
attribute vec4 attPos;

varying vec2 varUV;

const float SQRT2 = 1.4142135623730951;

void main() {
  float xG = attPos.x;
  float yG = attPos.y;
  // Diagonals must be multiplied by the square root of two.
  float radius = attPos.z * SQRT2;
  // Using the angle, we can deduce the corner position.
  float angle = attPos.w;
  // Propagate UV to the fragment shader.
  varUV = vec2( .5 * SQRT2 * cos(angle) + .5,
                .5 - .5 * SQRT2 * sin(angle) );
  // Apply hero's self rotation.
  angle += uniRotation;
  // Adding some deformations due to "Infinite Improbability Drive".
  angle *= 1.0 + .03 * cos(.6 * uniVTime * (.777+angle));
  // Coords of this corner.
  vec2 point = game2gl( xG + radius * cos(angle), yG + radius * sin(angle) );
  
  // GL has a square space with coords between -1 and +1.
  // Final position in GL space.
  gl_Position = vec4( point, 0.0, 1.0 );
}
