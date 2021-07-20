/* eslint-disable no-plusplus */
import * as THREE from 'three';
import vertexShader from '../../shaders/vertex.glsl';
import fragmentShader from '../../shaders/fragment.glsl';

/**
 * Setup our debug UI folder for the Plane Material.
 *
 * @param {Object} debug
 * @param {Object} uniforms
 * @param {Object} terrain
 */
const setupDebug = (debug, uniforms, terrain) => {
  const debugFolder = debug.addFolder({ title: 'Shader', expanded: true });

  debugFolder.addInput(uniforms.uElevation, 'value', {
    label: 'elevation',
    min: 0,
    max: 10,
    step: 0.001,
  });

  debugFolder.addInput(terrain.texture, 'linesCount', {
    min: 1,
    max: 10,
    step: 1,
  }).on('change', () => {
    terrain.texture.update();
  });

  debugFolder.addInput(terrain.texture, 'thickLineHeight', {
    min: 0,
    max: 0.1,
    step: 0.0001,
  }).on('change', () => {
    terrain.texture.update();
  });

  debugFolder.addInput(terrain.texture, 'thinLineHeight', {
    min: 0,
    max: 0.1,
    step: 0.0001,
  }).on('change', () => {
    terrain.texture.update();
  });

  debugFolder.addInput(terrain.texture, 'thinLineAlhpa', {
    min: 0,
    max: 1,
    step: 0.001,
  }).on('change', () => {
    terrain.texture.update();
  });

  debugFolder.addInput(terrain.material.uniforms.uTextureFrequency, 'value', {
    label: 'frequency',
    min: 0.01,
    max: 50,
    step: 0.01,
  });
};

/**
 * Our plane material.
 *
 * @param {Object} debug
 * @param {Object} config
 * @returns {THREE.ShaderMaterial} material
 */
export default function PlaneMaterial(debug, config) {
  const terrain = {
    texture: {
      width: 32,
      height: 128,
      linesCount: 5,
      thickLineHeight: 0.04,
      thinLineHeight: 0.01,
      thinLineAlhpa: 0.5,
    },
  };

  const canvas = document.createElement('canvas');
  canvas.width = terrain.texture.width;
  canvas.height = terrain.texture.height;
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = 1;

  terrain.texture.canvas = canvas;
  document.body.append(terrain.texture.canvas);

  terrain.texture.context = terrain.texture.canvas.getContext('2d');

  terrain.texture.instance = new THREE.CanvasTexture(terrain.texture.canvas);
  terrain.texture.instance.wrapS = THREE.RepeatWrapping;
  terrain.texture.instance.wrapT = THREE.RepeatWrapping;
  terrain.texture.instance.magFilter = THREE.NearestFilter;

  terrain.texture.update = () => {
    /*
      This code snippet erases the entire canvas.
      This is commonly required at the start of each frame in an animation.
      The dimensions of the cleared area are set to equal the
      <canvas> element's width and height attributes.
    */
    terrain.texture.context.clearRect(0, 0, terrain.texture.width, terrain.texture.height);

    // Thicker lines
    const actualThickLineHeight = Math.round(
      terrain.texture.height * terrain.texture.thickLineHeight,
    );
    terrain.texture.context.globalAlpha = 1;
    terrain.texture.context.fillStyle = '#ffffff';
    terrain.texture.context.fillRect(
      0,
      0,
      terrain.texture.width,
      actualThickLineHeight,
    );

    // Thinner lines
    const actualThinLineHeight = Math.round(
      Math.round(terrain.texture.height * terrain.texture.thinLineHeight),
    );

    for (let i = 0; i < terrain.texture.linesCount - 1; i++) {
      terrain.texture.context.globalAlpha = terrain.texture.thinLineAlhpa;
      terrain.texture.context.fillRect(
        0,
        actualThickLineHeight + Math.round(
          terrain.texture.height / terrain.texture.linesCount,
        ) * (i + 1),
        terrain.texture.width,
        actualThinLineHeight,
      );
    }

    // terrain.texture.context.fillStyle = 'red';
    // terrain.texture.context.fillRect(
    //   0, Math.round(terrain.texture.height * 0), terrain.texture.width, 4,
    // );
    // terrain.texture.context.fillStyle = 'blue';
    // terrain.texture.context.fillRect(
    //   0, Math.round(terrain.texture.height * 0.4), terrain.texture.width, 4,
    // );
    // terrain.texture.context.fillStyle = 'green';
    // terrain.texture.context.fillRect(
    //   0, Math.round(terrain.texture.height * 0.9), terrain.texture.width, 4,
    // );

    terrain.texture.instance.needsUpdate = true;
  };

  terrain.texture.update();

  const uniforms = {
    uTime: { value: 0 },
    uElevation: { value: config.shader.elevation },
    uTexture: { value: terrain.texture.instance },
    uTextureFrequency: { value: 10 },
  };

  terrain.material = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader,
    fragmentShader,
    uniforms,
  });

  if (debug) setupDebug(debug, uniforms, terrain);

  return terrain.material;
}
