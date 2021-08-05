uniform sampler2D uTexture;
uniform float uTime;
uniform float uTextureFrequency; // 10
uniform float uHslHue; // 1
uniform float uHslHueOffset; // 0
uniform float uHslHueFrequency; // 10
uniform float uHslLightness; // 0.75
uniform float uHslLightnessVariation; // 0.25
uniform float uHslLightnessFrequency; // 20
uniform float uHslTimeFrequency; // 0.0005

varying float vElevation;
varying vec2 vUv;

#pragma glslify: getPerlinNoise2d = require('../partials/getPerlinNoise2d.glsl')
#pragma glslify: getFBM2d = require('../partials/getFBM2d.glsl')
#pragma glslify: hsl2rgb = require('../partials/hsl2rgb.glsl')

vec3 getRainbowColor() {
  vec2 uv = vUv;
  uv.y += + uTime * uHslTimeFrequency;

  float hue = uHslHueOffset + getPerlinNoise2d(uv * uHslHueFrequency) * uHslHue;
  float lightness = uHslLightness 
    + getFBM2d(uv * uHslLightnessFrequency + 1234.5) 
    * uHslLightnessVariation;

  vec3 hslColor = vec3(hue, 1.0, lightness);

  return hsl2rgb(hslColor);
}

void main() {
  vec3 uColor = vec3(1.0, 1.0, 1.0);

  vec3 rainbowColor = getRainbowColor();
  vec4 textureColor = texture2D(uTexture, vec2(0.0, vElevation * uTextureFrequency));

  vec3 color = mix(uColor, rainbowColor, textureColor.r);

  // float sideAlpha = 1.0 - max(
  //   smoothstep(0.4, 0.5, abs(vUv.x - 0.5)),
  //   smoothstep(0.4, 0.5, abs(vUv.y - 0.5))
  // );
  
  float sideAlpha = 1.0;

  gl_FragColor = vec4(color, textureColor.a * sideAlpha);
}