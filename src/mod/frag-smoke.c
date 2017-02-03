precision mediump float;

uniform float uniFTime;

varying float varRnd;
varying float varAge;

void main() {
  float x = gl_PointCoord.x - .5;
  float y = gl_PointCoord.y - .5;
  float r = x*x + y*y;
  if( r > .25 ) gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  else {
    float a = 2.0 - varAge;
    a = clamp(a, 0.0, 1.0);
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1 * a);
  }
}
