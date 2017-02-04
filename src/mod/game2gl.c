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
