uniform float uElevation;

#pragma glslify: getPerlinNoise3d = require('../partials/getPerlinNoise3d.glsl')

float getElevation(vec2 position) {
  float elevation = 0.0;

  // General elevation
  elevation += getPerlinNoise3d(vec3(
    position * 0.3,
    0.0
  )) * 0.5;

  // Hills
  elevation += getPerlinNoise3d(vec3(
    (position + 120.0) * 1.0,
    0.0
  )) * 0.2;

  elevation *= uElevation;

  return elevation;
}

#pragma glslify: export(getElevation)