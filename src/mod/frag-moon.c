precision mediump float;

const float PI = 3.141592653589793;

const float X = .5;
const float Y = -.5;
const float Z = 0.7071067811865476;

const vec4 WHITE = vec4( 1.0, 1.0, 1.0, 1.0 );
const vec4 BLACK = vec4( 0.0, 0.0, 0.0, 1.0 );
const vec4 ORANGE = vec4( 1.0, 0.5, 0.0, 1.0 );

uniform float uniFTime;

// The texture is the hero image.
uniform sampler2D uniTexture;

varying float varSize;
varying float varRnd1;
varying float varRnd2;
varying float varDeath;

/**
 * To perform a sphere mapping, we must figure out (u,v) coords on the texture
 * from (x,y) from the PointCoord. We also must consider rotations of the sphere.
 * Step 1:
 *   Consider the hemi-sphere, and find out the vector (x,y,z).
 *   We already know x and y, and we also know that (x,y,z) have a length of 1.
 *   Hence, x*x + y*y + z*z = 1 and we can deduce z.
 * Step 2:
 *   Apply sphere rotation. This is a combination of two rotations: one around X axe
 *   and another one around Y axe.
 *   For instance, around X, we have:
 *     Y = y*cos(a) + z*sin(a)
 *     Z = -y*sin(a) + z*cos(a)
 *   The rotation formula are simple to memorize because the second expression
 *   can be deduced by derivation of the first one.
 * Step 3:
 *   Now we consider (X,Y). With asin(Y) we get the latitude between -PI/2 and +PI/2.
 *   The plane y=Y cuts the sphere in a disk of radius cos(lat). Hence, we get longitude
 *   by computing asin(X / cos(lat)).
 * Step 4:
 *   Of course, the longitude you get is between -PI/2 and +PI/2, but it is only valid
 *   if Z is positive. If Z is negative, you want to get a longitude between +PI/2 and
 *   +3.PI/2. And while for Z positive longitude increase with X, on Z negative it is reversed.
 * 
 */
void main() {
  // Vector (x,y,z) has its tail at the center of the sphere and its head on the surface of the sphere.
  float x = gl_PointCoord.x * 2.0 - 1.0;
  float y = gl_PointCoord.y * 2.0 - 1.0;
  float radius = x*x + y*y;
  float alpha = 1.0;
  if( radius > 1.0 ) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }
  if( radius > .9 ) {
    alpha = 10.0 * (1.0 - radius);
  }
  // Therefore, the length of the (x,y,z) vector must be 1 and x*x + y*y + z*z = 1.
  float z = sqrt( 1.0 - x*x - y*y );
  // Rotation.
  float a = uniFTime * .75 * (.2374 + varRnd1);
  float x1 = x;
  float y1 = y * cos(a) + z * sin(a);
  float z1 = -y * sin(a) + z * cos(a);
  a = uniFTime * .75 * (.3797 + varRnd2);
  float x2 = x1 * cos(a) + z1 * sin(a);
  float y2 = y1;
  float z2 = -x1 * sin(a) + z1 * cos(a);
  
  float lat = -asin( y2 );
  float r = cos( lat );
  float lng = 0.0;
  if( r > 0.0 ) {
    lng = asin( x2 / r );
  }
  lng += PI * .5;   // Now lng is between 0 and PI.
  if( z2 < .0 ) {
    // We must adjust for the backface of the moon.
    lng = 2.0 * PI - lng;
  }  
  
  vec2 uv = vec2(.5 * lng / PI, .5 - lat / PI);
  vec2 uvColor = .5 * uv + vec2(.0, .5);
  //gl_FragColor = vec4(uv.x, uv.x, uv.x, 1.0);
  gl_FragColor = texture2D( uniTexture, uvColor );
  // Check death date.  Because .5 seconds before the  death, the moon
  // turns orange.  
  if( varDeath > uniFTime ) {
    gl_FragColor = mix(ORANGE, gl_FragColor, clamp(2.0 * (varDeath - uniFTime), .0, 1.0));
  }

  // Now, we want  to compute normals to apply lighting effects.
  vec2 uvNormal = .5 * uv + vec2(.5, .0);
  vec3 normal = texture2D( uniTexture, uvNormal ).xyz;
  normal = 2.0 * ( normal - vec3(.5, .5, .5) );
  
  lat = -asin( normal.y );
  r = cos( lat );
  lng = 0.0;
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

  gl_FragColor.a = alpha;
}
