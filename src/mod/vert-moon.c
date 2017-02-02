#include vertCommon

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


const float CURVATURE = 0.5;
const float PI = 3.1415926535;

void main() {
  // Propagate size to the fragment shader.
  varSize = attSize;
  // Game's space coords.
  float xG = attPos.x - uniCamX;
  float yG = attPos.y - uniCamY;    
  // Wrapping.
  if( xG < -uniGameW * .5 ) xG += uniGameW;
  if( xG > uniGameW * .5 ) xG -= uniGameW;
    
  // Curvature.
  float a = PI * .5 - PI * xG / uniGameW;
  varAngle = a + PI * .5;
  float r = attPos.y + uniGameH * CURVATURE;

  xG = r * cos( a );
  yG = r * sin( a ) - uniGameH * (CURVATURE + 0.5);

  #include game2gl
  
  // GL has a square space with coords between -1 and +1.
  // Final position in GL space.
  gl_Position = vec4( x, y, 0.0, 1.0 );
  // Point's size...
  gl_PointSize = attSize * factorS;
}
