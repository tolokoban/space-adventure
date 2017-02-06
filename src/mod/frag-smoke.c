precision mediump float;

uniform float uniFTime;

varying float varRnd;
varying float varAge;

void main() {
  float x = gl_PointCoord.x - .5;
  float y = gl_PointCoord.y - .5;
  float r = sqrt(x*x + y*y);
  if( r > 0.5 ) gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  else {
    float a = 2.0 - varAge;
    a = clamp(a, 0.0, 1.0);
    a *= 1.0 - 2.0 * r;
    float k = .5 * (1.0 + sin(.3 * uniFTime));
    gl_FragColor = vec4(k, k, k, 0.25 * a);
  }
}
