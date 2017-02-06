precision mediump float;
// Current time.
uniform float uniFTime;
// Last collision time.
uniform float uniCollision;
// The texture is the hero image.
uniform sampler2D uniTexture;
// texture coords UV between 0 and +1.
varying vec2 varUV;

void main() {
  gl_FragColor = texture2D( uniTexture, .495 * varUV );
  float collision = uniFTime - uniCollision;
  if( collision < 1.0 ) {
    gl_FragColor.g *= collision;
    gl_FragColor.b *= collision;
  }
}
