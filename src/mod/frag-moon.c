precision mediump float;

uniform float uniFTime;

varying float varSize;
varying float varAngle;


void main() {
  float xx = gl_PointCoord.x * 2.0 - 1.0;
  float yy = gl_PointCoord.y * 2.0 - 1.0;
  // Rotation.
  float x = xx * cos(varAngle) - yy * sin(varAngle);
  float y = -xx * sin(varAngle) - yy * cos(varAngle);
    
  
  float r = x*x + y*y;
  if( r > 1.0 ) vec4(0.0, 0.0, 0.0, 0.0);
  else {
    float lat = asin( y );
    float r = cos( lat );
    float lng = 0.0;
    if( r > 0.0 ) {
      lng = asin( x / r );
    }

    lng = lng + 3.0 * cos(uniFTime * varSize * .01 + 10.0 * varSize);
    lng = mod(lng + 1.0, 2.0) - 1.0;

    x = mod(1.0 + lng, 1.0);
    y = mod(1.0 + lat, 1.0);

    if( x < .5 ) {
      if( y < .5 ) {
        gl_FragColor = vec4( 0.0, 1.0, 0.0, 1.0 );
      } else {
        gl_FragColor = vec4( 0.0, 0.0, 1.0, 1.0 );
      }
    } else {
      if( y < .5 ) {
        gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
      } else {
        gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
      }
    }
  }
}
