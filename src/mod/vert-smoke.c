#include vertCommon

// Vertex position and texture coords.
// (x,y) for vertex position, in game's space.
// z: birth.
// w: random.
attribute vec4 attPos;

varying float varRnd;
varying float varAge;

const float CURVATURE = 0.5;
const float PI = 3.1415926535;

void main() {
  // Propagate random to the fragment shader.
  varRnd = attPos.w;
  // Game's space coords.
  float xG = attPos.x - uniCamX;
  float yG = attPos.y - uniCamY;    
  // Wrapping.
  if( xG < -uniGameW * .5 ) xG += uniGameW;
  if( xG > uniGameW * .5 ) xG -= uniGameW;
    
  // Curvature.
  float a = PI * .5 - PI * xG / uniGameW;
  float r = attPos.y + uniGameH * CURVATURE;

  xG = r * cos( a );
  yG = r * sin( a ) - uniGameH * (CURVATURE + 0.5);

  #include game2gl
  
  // Point's size...
  float age = uniVTime - attPos.z;
  varAge = age;
  float size = 50.0 * (1.0 + varRnd);
  size *= clamp( age, 0.0, 1.0 );
  size += 30.0;
  if( age > 2.0 ) size = 0.0;
  gl_PointSize = size * factorS;
}
