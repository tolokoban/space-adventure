precision mediump float;

uniform float uniFTime;

varying float varBirth;

void main() {
  float age = uniFTime - varBirth;

  float x = gl_PointCoord.x - .5;
  float y = gl_PointCoord.y - .5;
  float r = 4.0 * sqrt(x*x + y*y);
  float alpha = 0.0;
  if( r < 1.0 ) {
    alpha = sin( r * 20.0 + uniFTime * 5.0 );
    alpha = abs( alpha );
    alpha = .5 * alpha + .5;
    alpha *= 1.0 - age;
  }
  gl_FragColor = vec4(1.0, 0.5, 0.0, alpha);
}
