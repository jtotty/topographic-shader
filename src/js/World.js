import * as THREE from 'three';

import Materials from './world/Materials';
import Plane from './world/Plane';

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

    // Lets go!
    this.start();
  }

  /**
   * Start our world.
   */
  start() {
    // Wait for resources to finish loading
    this.resources.on('ready', () => {
      this.setMaterials();
      this.setPlane();
    });
  }

  /**
   * Add our materials.
   */
  setMaterials() {
    this.material = new Materials({
      resources: this.resources,
      debug: this.debug,
      config: this.config,
    });
  }

  /**
   * Add our Plane to the world.
   */
  setPlane() {
    this.plane = new Plane({
      material: this.material,
      time: this.time,
      debug: this.debugFolder,
    });

    this.container.add(this.plane.container);
  }
}
