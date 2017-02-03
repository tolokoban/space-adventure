#include vertCommon

// Rotation in radians.
uniform float uniRotation;

// Vertex position and texture coords.
// (x,y) for vertex position, in game's space.
// (z,w) for (radius,angle).
attribute vec4 attPos;

varying vec2 varUV;

const float SQRT2 = 1.4142135623730951;

void main() {
  // Diagonals must be multiplied by the square root of two.
  float angle = attPos.w;
  // Adding some deformations due to "Infinite Improbability Drive".
  float radius = attPos.z * SQRT2
    * (.95 + .1 * cos(uniVTime * angle));
  // Propagate UV to the fragment shader.
  varUV = vec2( .5 * SQRT2 * cos(angle) + .5,
                .5 - .5 * SQRT2 * sin(angle) );
  // Game's space coords.
  float xG = attPos.x - uniCamX;
  float yG = attPos.y - uniCamY;
  // Wrapping.
  if( xG < -uniGameW ) xG += uniGameW;
  if( xG > uniGameW ) xG -= uniGameW;
  // The center is wrapped, we can set the corners.
  angle += uniRotation;
  xG += radius * cos(angle);
  yG += radius * sin(angle);
  
  #include game2gl
  
  // GL has a square space with coords between -1 and +1.
  // Final position in GL space.
  gl_Position = vec4( x, y, 0.0, 1.0 );
}
