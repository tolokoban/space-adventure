#include vertCommon
#include game2gl
  
// Obstacle's type.
attribute float attType;
// Vertex position and texture coords.
// (x,y) for vertex position, in game's space.
// (z,w) for (u,v) texture coords.
attribute vec2 attPos;
// Point size.
attribute float attSize;

varying float varSize;
varying float varAngle;


void main() {
  // Propagate size to the fragment shader.
  varSize = attSize;
  // Game's space coords.
  vec2 point = game2gl( attPos );
  // GL has a square space with coords between -1 and +1.
  // Final position in GL space.
  gl_Position = vec4( point, 0.0, 1.0 );
    
  // Point's size...
  gl_PointSize = pointSize( attSize );
}
