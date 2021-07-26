uniform float uElevation;
uniform float uElevationValleyFrequency;
uniform float uElevationValley;
uniform float uElevationGeneral;
uniform float uElevationGeneralFrequency;
uniform float uElevationDetails;
uniform float uElevationDetailsFrequency;

#pragma glslify: getPerlinNoise2d = require('../partials/getPerlinNoise2d.glsl')

float getElevation(vec2 position) {
  float elevation = 0.0;

  // General elevation
  elevation += getPerlinNoise2d(position * 0.3) * 0.5;

  // Hills
  elevation += getPerlinNoise2d(position + 123.0) * 0.2;

  elevation *= uElevation;

  return elevation;
}

#pragma glslify: export(getElevation)