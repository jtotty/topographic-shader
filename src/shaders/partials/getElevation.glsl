uniform float uTime;
uniform float uElevation;
uniform float uElevationValleyFrequency;
uniform float uElevationValley;
uniform float uElevationGeneral;
uniform float uElevationGeneralFrequency;
uniform float uElevationDetails;
uniform float uElevationDetailsFrequency;

#pragma glslify: getPerlinNoise3d = require('../partials/getPerlinNoise3d.glsl')
#pragma glslify: getFBM2d = require('../partials/getFBM2d.glsl')

float getElevation(vec3 position) {
  float elevation = 0.0;

  // General elevation
  elevation += getPerlinNoise3d(position * 0.3) * 0.5;
  // elevation += getFBM2d(position * 0.3) * 0.5;

  // Hills
  elevation += getPerlinNoise3d(position + 123.0) * 0.2;
  // elevation += getFBM2d(position + 123.0) * 0.2;

  elevation *= uElevation * 0.01;

  return elevation;
}

#pragma glslify: export(getElevation)