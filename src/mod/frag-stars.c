precision mediump float;

uniform float uniFTime;

varying float varZ;
varying float varRnd;

void main() {
  float x = gl_PointCoord.x - .5;
  float y = gl_PointCoord.y - .5;
  float a = uniFTime * (.5 + varRnd);
  float xx = x * cos(a) + y * sin(a);
  float yy = -x * sin(a) + y * cos(a);
  float r = abs(xx*xx - yy*yy);
  if( r > 0.01 ) gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  else {
    gl_FragColor = vec4(1.0, 1.0 - varRnd * .5, varRnd, varZ * .5);
  }
}
