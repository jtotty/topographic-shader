uniform float uTime;

varying float vElevation;
varying vec2 vUv;

#pragma glslify: getElevation = require('../partials/getElevation.glsl')

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = getElevation(modelPosition.xyz + vec3(uTime * 0.0001, uTime * 0.0001, uTime * 0.0001));
  modelPosition.xyz *= elevation * 0.01;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

	gl_Position = projectionPosition;

  vElevation = elevation;
  vUv = uv;
}