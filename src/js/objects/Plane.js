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
    this.position = params.position;

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
    const geometry = new THREE.SphereGeometry(50, 1024, 1024);
    geometry.rotateZ(Math.PI * 0.5);

    this.mesh = new THREE.Mesh(geometry, this.terrain.material);
    this.mesh.scale.set(10, 10, 10);

    const { x, y, z } = this.position;
    this.mesh.position.set(x, y, z);

    // Assing our depth material for bokeh to userData
    this.mesh.userData.depthMaterial = this.terrain.depthMaterial;

    // this.container.add(mesh);
    // this.container.updateMatrix();

    // Animate our plane shader
    this.time.on('tick', () => {
      this.terrain.uniforms.uTime.value = this.time.elapsed;
    });
  }
}
