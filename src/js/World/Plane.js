import * as THREE from 'three';

/**
 * Create our plane mesh.
 *
 * @param {Object} params
 */
export default class Plane {
  constructor(params) {
    this.terrain = params.material;
    this.time = params.time;
    this.debug = params.debug;

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({ title: 'plane', expanded: true });
    }

    this.setPlane();
  }

  /**
   * Create our plane.
   */
  setPlane() {
    // const geometry = new THREE.PlaneGeometry(1, 1, 1000, 1000);
    const geometry = new THREE.SphereGeometry(2, 1024, 1024);
    geometry.rotateX(-Math.PI * 0.5);

    const mesh = new THREE.Mesh(geometry, this.terrain.material);
    mesh.scale.set(10, 10, 10);

    // Assing our depth material for bokeh to userData
    mesh.userData.depthMaterial = this.terrain.depthMaterial;

    this.container.add(mesh);
    this.container.updateMatrix();

    // Animate our plane shader
    this.time.on('tick', () => {
      this.terrain.uniforms.uTime.value = this.time.elapsed;
    });
  }
}
