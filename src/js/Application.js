import * as THREE from 'three';
import * as dat from 'dat.gui';

import Time from './utils/Time';
import Sizes from './utils/Sizes';
import Resources from './Resources';

import Camera from './Camera';
import World from './World';

/**
 * Our Three JS Application.
 *
 */
export default class Application {
  /**
   * Constructor.
   * @param {Object} _options
   */
  constructor(_options) {
    this.canvas = _options.canvas;

    this.time = new Time();
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
    if (this.config.debug) this.debug = new dat.GUI({ width: 420 });
  }

  /**
   * The WebGL renderer displays your beautifully crafted scenes using WebGL
   */
  setRenderer() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setClearColor(0x000000);

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
      config: this.config,
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
      config: this.config,
      camera: this.camera,
      resources: this.resources,
    });

    this.scene.add(this.world.container);
  }

  /**
   * Desctructor
   */
  desctructor() {
    this.time.off('tick');
    this.sizes.off('resize');
    this.camera.orbitControls.dispose();
    this.renderer.dispose();
    this.debug.destroy();
  }
}
