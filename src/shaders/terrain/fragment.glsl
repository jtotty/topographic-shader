uniform sampler2D uTexture;
uniform float uTime;
uniform float uTextureFrequency;

varying float vElevation;
varying vec2 vUv;

#pragma glslify: getPerlinNoise2d = require('../partials/getPerlinNoise2d.glsl')
#pragma glslify: getElevation = require('../partials/getElevation.glsl')
#pragma glslify: hsl2rgb = require('../partials/hsl2rgb.glsl')

vec3 getRainbowColor() {
  float hue = getPerlinNoise2d(vec2(vUv * uTime * 0.001));
  vec3 hslColor = vec3(hue, 1.0, 0.5);

  return hsl2rgb(hslColor);
}

void main() {
  vec3 uColor = vec3(1.0, 1.0, 1.0);

  vec3 rainbowColor = getRainbowColor();

  vec4 textureColor = texture2D(uTexture, vec2(0.0, vElevation * uTextureFrequency));

  // float alpha = mod(vElevation * 10.0, 1.0);
  // alpha = step(0.95, alpha);

  vec3 color = mix(uColor, rainbowColor, textureColor.r);

  gl_FragColor = vec4(color, textureColor.a);
}