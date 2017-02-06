#include vertCommon

// Vertex position and texture coords.
// (x,y,z) for vertex position, in game's space.
// w: random.
attribute vec4 attPos;

varying float varZ;
varying float varRnd;

void main() {
  // Propagate random to the fragment shader.
  varZ = attPos.z;
  varRnd = attPos.w;
  
  float factorS = uniScrH / uniGameH;
  gl_PointSize = uniGameH * .08 * varZ * factorS;

  // Game's space coords.
  float xG = uniGameW * .5 - mod(attPos.x + uniCamX * varZ, uniGameW);
  float yG = attPos.y - uniGameH * .5;

  // Convert game coords into screen coords.
  // A column must fit entirely in the screens height.
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
