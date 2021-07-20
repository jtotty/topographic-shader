import * as THREE from 'three';

export default class Plane {
  /**
   * Constructor.
   * @param {Object} _option
   */
  constructor(_option) {
    this.material = _option.material;
    this.time = _option.time;
    this.debug = _option.debug;

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
    const geometry = new THREE.PlaneGeometry(1, 1, 1000, 1000);
    geometry.rotateX(-Math.PI * 0.5);

    const mesh = new THREE.Mesh(geometry, this.material.items.shader.plane);
    mesh.scale.set(10, 10, 10);

    this.container.add(mesh);
    this.container.updateMatrix();

    // Animate our plane shader
    // this.time.on('tick', () => {
    //   this.material.items.shader.plane.uniforms.uTime.value = this.time.elapsed;
    // });
  }
}
