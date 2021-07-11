import * as THREE from 'three';
import * as dat from 'dat.gui';

import Time from './utils/Time';
import Sizes from './utils/Sizes';
import Resources from './utils/Resources';

import Camera from './Camera';
import World from './World';

/**
 * Our Three JS Application.
 *
 * @param {Object} _options
 */
export default class Application {
  constructor(_options) {
    this.canvas = _options.canvas;

    this.sizes = new Sizes();
    this.resources = new Resources();

    this.setConfig();
    this.setDebug();
    this.setRenderer();
    this.setCamera();
    this.setWorld();
  }

  /**
   * Set debug option.
   * If anchor part of a URL contains "debug".
   */
  setConfig() {
    this.config = {};
    this.config.debug = window.location.hash === '#debug';
  }

  /**
   * Start debug GUI if in debug mode.
   */
  setDebug() {
    if (this.setConfig.debug) {
      this.debug = new dat.GUI({ width: 420 });
    }
  }

  /**
   * The WebGL renderer displays your beautifully crafted scenes using WebGL
   */
  setRenderer() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });

    const { width, height } = this.sizes.viewport;

    const rendererSize = () => {
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    rendererSize();

    this.sizes.on('resize', () => {
      rendererSize();
    });
  }

  /**
   * Create the camera.
   */
  setCamera() {
    this.camera = new Camera({
      time: this.time,
      sizes: this.sizes,
      debug: this.debug,
      renderer: this.renderer,
    });

    this.scene.add(this.camera.container);

    this.time.on('tick', () => {
      this.renderer.render(this.scene, this.camera.instance);
    });
  }

  /**
   * Create the world.
   */
  setWorld() {
    this.world = new World({
      time: this.time,
      sizes: this.sizes,
      debug: this.debug,
      renderer: this.renderer,
      camera: this.camera,
      resources: this.resources,
    });

    this.scene.add(this.world.container);
  }
}
