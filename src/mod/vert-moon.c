#include vertCommon
#include game2gl
  
// Vertex position and texture coords.
// (x,y) for vertex position, in game's space.
// (z,w) for (u,v) texture coords.
attribute vec2 attPos;
// Point size.
attribute float attSize;
attribute float attRnd1;
attribute float attRnd2;
attribute float attDeath;

varying float varSize;
varying float varRnd1;
varying float varRnd2;
varying float varDeath;


void main() {
  // Propagate size to the fragment shader.
  varSize = attSize;
  varRnd1 = attRnd1;
  varRnd2 = attRnd2;
  varDeath = attDeath;
  // Game's space coords.
  vec2 point = game2gl( attPos );
  // GL has a square space with coords between -1 and +1.
  // Final position in GL space.
  gl_Position = vec4( point, 0.0, 1.0 );
  // Point's size...
  gl_PointSize = pointSize( attSize );
}
