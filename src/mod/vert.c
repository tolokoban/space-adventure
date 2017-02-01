// Screen dimensions in pixels.
uniform float uniScrW;
uniform float uniScrH;
// Game's space dimension.
uniform float uniGameW;
uniform float uniGameH;

// Where is the camero pointing?
uniform float uniCamX;
uniform float uniCamY;

// Vertex position and texture coords.
// (x,y) for vertex position, in game's space.
// (z,w) for (u,v) texture coords.
attribute vec4 attPos;

varying vec2 varUV;

void main() {
  // Propagate UV to the fragment shader.
  varUV = attPos.zw;
  // Game's space coords.
  float xG = attPos.x - uniCamX;
  float yG = attPos.y - uniCamY;
  // Wrapping.
  if( xG < -uniGameW ) xG += uniGameW;
  if( xG > uniGameW ) xG -= uniGameW;
  // Convert game coords into screen coords.
  // A column must fit entirely in the screens height.
  float factorS = uniScrH / uniGameH;
  float xS = xG * factorS;
  float yS = yG * factorS;
  // Now, convert screen coords into WebGL coords.
  // Setting the center.
  float factorW = 2.0 / uniScrW;
  float factorH = 2.0 / uniScrH;
  float x = xS * factorW;
  float y = yS * factorH;
  // GL has a square space with coords between -1 and +1.
  // Final position in GL space.
  gl_Position = vec4( x, y, 0.0, 1.0 );
}
