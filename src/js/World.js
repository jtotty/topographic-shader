import * as THREE from 'three';

import Materials from './World/Materials';
import Torus from './World/Torus';

/**
 * Our 3D world.
 */
export default class World {
  /**
   * Constructor.
   * @param {Object} _option
   */
  constructor(_option) {
    this.time = _option.time;
    this.sizes = _option.sizes;
    this.debug = _option.debug;
    this.renderer = _option.renderer;
    this.config = _option.config;
    this.camera = _option.camera;
    this.resources = _option.resources;

    // Set up
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('world');
      this.debugFolder.open();
    }

    // Lets go!
    this.start();
  }

  /**
   * Start our world.
   */
  start() {
    this.setMaterials();
    this.setTorus();
  }

  /**
   * Add our materials.
   */
  setMaterials() {
    this.material = new Materials({
      resources: this.resources,
    });
  }

  /**
   * Add our Torus to the world.
   */
  setTorus() {
    this.torus = new Torus({
      material: this.material,
      debug: this.debugFolder,
    });

    this.container.add(this.torus.container);
  }
}
