precision mediump float;
// The texture is the hero image.
uniform sampler2D uniTexture;
// texture coords UV between 0 and +1.
varying vec2 varUV;

void main() {
  gl_FragColor = texture2D( uniTexture, varUV );
}
