import * as THREE from 'three';
import vertexShader from '../../shaders/vertex.glsl';
import fragmentShader from '../../shaders/fragment.glsl';

export default function PlaneMaterial(debug, config) {
  const uniforms = {
    uTime: { value: 0 },
    uElevation: { value: config.shader.elevation },
  };

  if (debug) {
    const debugFolder = debug.addFolder('Shader');
    debugFolder
      .add(config.shader, 'elevation').min(0).max(5).step(0.001)
      .onChange(() => {
        uniforms.uElevation.value = config.shader.elevation;
      });
    debugFolder.open();
  }

  const material = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader,
    fragmentShader,
    uniforms,
  });

  return material;
}
