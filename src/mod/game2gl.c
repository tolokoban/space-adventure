vec2 game2scr(float xG, float yG) {
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

  return vec2(xS, yS);
}

vec2 game2gl(float xG, float yG) {
  vec2 scr = game2scr(xG, yG);
  // Now, convert screen coords into WebGL coords.
  // Setting the center.
  float factorW = 2.0 / uniScrW;
  float factorH = 2.0 / uniScrH;
  float x = scr.x * factorW;
  float y = scr.y * factorH;  

  return vec2( x, y );
}


vec2 game2gl(vec2 pos) {
  return game2gl( pos.x, pos.y );
}


float pointSize( float radius ) {
  float factorS = uniScrH / uniGameH;
  return 2.0 * radius * factorS;
}

vec2 wrap(vec2 pos) {
  // Wrapping.
  if( pos.x < -uniGameW ) pos.x += uniGameW;
  if( pos.x > uniGameW ) pos.x -= uniGameW;
  return pos;
}
