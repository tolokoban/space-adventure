const float PI = 3.141592653589793;

// Time in seconds.
uniform float uniVTime;
// Screen dimensions in pixels.
uniform float uniScrW;
uniform float uniScrH;
// Game's space dimension.
uniform float uniGameW;
uniform float uniGameH;
// Where is the camera pointing?
uniform float uniCamX;
uniform float uniCamY;

vec2 game2gl(float xG, float yG) {
  // Where the camera points, the coords are (0,0).
  xG -= uniCamX;
  yG -= uniCamY;
  // Wrapping.
  if( xG < -.25 * uniGameW ) xG += uniGameW;
  else if( xG > .75 * uniGameW ) xG -= uniGameW;

  // Convert game coords into screen coords.
  // A column must fit entirely in the screens height.
  float factorS = uniScrH / uniGameH;
  float xS = xG * factorS - uniScrW * .25;
  float yS = yG * factorS;
  // Now, convert screen coords into WebGL coords.
  // Setting the center.
  float factorW = 2.0 / uniScrW;
  float factorH = 2.0 / uniScrH;
  float x = xS * factorW;
  float y = yS * factorH;  

  return vec2( x, y );
}


vec2 game2gl(vec2 pos) {
  return game2gl( pos.x, pos.y );
}


vec2 wrap(vec2 pos) {
  // Wrapping.
  if( pos.x < -uniGameW ) pos.x += uniGameW;
  if( pos.x > uniGameW ) pos.x -= uniGameW;
  return pos;
}


// Vertex position and texture coords.
// (x,y) for vertex position, in game's space.
// z: birth.
// w: random.
attribute vec4 attPos;

varying float varRnd;
varying float varAge;

const float CURVATURE = 0.5;

void main() {
  // Propagate random to the fragment shader.
  varRnd = attPos.w;
  
  // Point's size...
  float age = uniVTime - attPos.z;
  varAge = age;
  float size = uniScrH * .05 * (1.0 + varRnd);
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
