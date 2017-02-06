precision mediump float;

const float PI = 3.141592653589793;

const float X = .5;
const float Y = -.5;
const float Z = 0.7071067811865476;

const vec4 WHITE = vec4( 1.0, 1.0, 1.0, 1.0 );
const vec4 BLACK = vec4( 0.0, 0.0, 0.0, 1.0 );

uniform float uniFTime;

// The texture is the hero image.
uniform sampler2D uniTexture;

varying float varSize;
varying float varRnd1;
varying float varRnd2;


void main() {
  // Vector (x,y,z) has its tail at the center of the sphere and its head on the surface of the sphere.
  float x = gl_PointCoord.x * 2.0 - 1.0;
  float y = gl_PointCoord.y * 2.0 - 1.0;
  float radius = x*x + y*y;
  if( radius > 1.0 ) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }
  if( radius > .8 ) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
    return;
  }
  // Therefore, the length of the (x,y,z) vector must be 1 and x*x + y*y + z*z = 1.
  float z = sqrt( 1.0 - x*x - y*y );
  // Rotation.
  float a = uniFTime * .5 * (.2 + varRnd1);
  float x1 = x;
  float y1 = y * cos(a) + z * sin(a);
  float z1 = -y * sin(a) + z * cos(a);
  a = uniFTime * .5 * (.2 + varRnd2);
  float x2 = x1 * cos(a) + z1 * sin(a);
  float y2 = y1;
  float z2 = -x1 * sin(a) + z1 * cos(a);
  
  gl_FragColor = vec4( .6, .3, .0, 1.0 );

  vec3 normal = texture2D( uniTexture, vec2(.25 * x2 + .75, .25 * y2 + .25) ).xyz;
  normal = 2.0 * ( normal - vec3(.5, .5, .5) );
  
  float lat = -asin( normal.y );
  float r = cos( lat );
  float lng = 0.0;
  if( r > 0.0 ) {
    lng = asin( normal.x / r );
  }
  normal = vec3(x,y,z);
  x = normal.x;
  y = normal.y * cos(lat) + normal.z * sin(lat);
  z = -normal.y * sin(lat) + normal.z * cos(lat);
  normal = vec3(x,y,z);
  
  // Shadow. (x,y,z) is the normal and (X,Y,Z) is the light ray.
  vec3 light = reflect( vec3(X, Y, Z), normal );
  //light = reflect( light, normal );
  float shadow = -light.z;
  if( shadow > 0.0 ) gl_FragColor = mix( gl_FragColor, WHITE, shadow );
  else if( shadow < 0.0 ) gl_FragColor = mix( gl_FragColor, BLACK, -shadow );
}
