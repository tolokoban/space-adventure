#include vertCommon
#include game2gl  

// Vertex position and texture coords.
// (x,y) for vertex position, in game's space.
// z: birth.
// w: random.
attribute vec4 attPos;

varying float varBirth;

void main() {
  float age = uniVTime - attPos.z;
  if( age > 1.0 ) {
    // After 1 second, explosion must not been drawn.
    gl_PointSize = 0.0;
    return;
  }

  // Propagate random to the fragment shader.
  varBirth = attPos.z;
  
  // Point's size... Depending on age.
  gl_PointSize = pointSize( attPos.w * (1.0 + 2.0 * age) );

  // Game's space coords.
  vec2 point = game2gl( attPos.x, attPos.y );
  // GL has a square space with coords between -1 and +1.
  // Final position in GL space.
  gl_Position = vec4( point, 0.0, 1.0 );
}
