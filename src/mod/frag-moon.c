precision mediump float;

const float PI = 3.141592653589793;
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
  if( r > 1.0 ) gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  else if( r > .8 ) gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
  else {
    float lat = asin( y );
    float r = cos( lat );
    float lng = 0.0;
    if( r > 0.0 ) {
      lng = asin( x / r );
    }

    float shadow = abs( lng );
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

    gl_FragColor = mix( gl_FragColor, vec4(0.0, 0.0, 0.0, 1.0), shadow);
  }
}
