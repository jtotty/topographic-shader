import * as THREE from 'three';
import Materials from './world/Materials';
import Plane from './world/Plane';

/**
 * Our 3D world.
 *
 * @param {Object} params
 */
export default class World {
  constructor(params) {
    this.time = params.time;
    this.sizes = params.sizes;
    this.debug = params.debug;
    this.renderer = params.renderer;
    this.config = params.config;
    this.camera = params.camera;
    this.resources = params.resources;

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
    // this.resources.on('ready', () => {});
    this.setMaterials();
    this.setPlane();
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
      material: this.material.items.shader.plane,
      time: this.time,
      debug: this.debugFolder,
    });

    this.container.add(this.plane.container);
  }
}
