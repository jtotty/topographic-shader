import * as THREE from 'three';
import vertexShader from '../../shaders/vertex.glsl';
import fragmentShader from '../../shaders/fragment.glsl';

export default function PlaneMaterial() {
  const uniforms = {
    uTime: { value: 0 },
  };

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
