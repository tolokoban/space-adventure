precision mediump float;


void main() {
  float x = gl_PointCoord.x * 2.0 - 1.0;
  float y = gl_PointCoord.y * 2.0 - 1.0;
  float r = x*x + y*y;
  if( r < 1.0 ) gl_FragColor = vec4(0.3, 0.1, 0.0, 1.0);
  else gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
}
