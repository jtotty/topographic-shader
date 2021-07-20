import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';

/**
 * Our post processing. Let the magic happen! 🌟
 */
export default class PostProcessing {
  /**
   * Constructor.
   * @param {Object} _options
   */
  constructor(_option) {
    this.sizes = _option.sizes;
    this.renderer = _option.renderer;
    this.camera = _option.camera;
    this.scene = _option.scene;
    this.debug = _option.debug;

    this.init();
    this.initBokeh();
    this.resize();
  }

  /**
   * Setup our render target and instance of Effect Composer.
   */
  init() {
    this.renderTarget = new THREE.WebGLMultisampleRenderTarget(800, 600, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      encoding: THREE.sRGBEncoding,
    });

    this.effectComposer = new EffectComposer(this.renderer);
    this.effectComposer.addPass(new RenderPass(this.scene, this.camera.instance));
  }

  /**
   * Let the bokeh happen.
   */
  initBokeh() {
    this.bokehPass = new BokehPass(
      this.scene,
      this.camera.instance,
      {
        focus: 1.0,
        aperture: 0.025,
        maxblur: 0.01,
        width: this.sizes.width * this.sizes.pixelRatio,
        height: this.sizes.height * this.sizes.pixelRatio,
      },
    );

    if (this.debug) this.setupDebug();

    this.effectComposer.addPass(this.bokehPass);

    this.sizes.on('resize', () => {
      this.resize();
    });
  }

  /**
   * Resize the effect composer and set pixel ratio.
   */
  resize() {
    const { width, height } = this.sizes.viewport;

    this.effectComposer.setSize(width, height);
    this.effectComposer.setPixelRatio(this.sizes.pixelRatio);

    this.bokehPass.renderTargetDepth.width = width * this.sizes.pixelRatio;
    this.bokehPass.renderTargetDepth.height = height * this.sizes.pixelRatio;
  }

  /**
   * Debug utils for our post processing.
   */
  setupDebug() {
    this.debugFolder = this.debug.addFolder({ title: 'Post Processing (Bokeh)', expanded: true });

    // Toggle
    this.debugFolder.addInput(this.bokehPass, 'enabled');

    const { focus, aperture, maxblur } = this.bokehPass.materialBokeh.uniforms;

    // Focus
    this.debugFolder.addInput(focus, 'value', {
      label: 'focus',
      min: 0,
      max: 10,
      step: 0.01,
    });

    // Aperture
    this.debugFolder.addInput(aperture, 'value', {
      label: 'aperture',
      min: 0.0002,
      max: 0.1,
      step: 0.0001,
    });

    // Max Blur
    this.debugFolder.addInput(maxblur, 'value', {
      label: 'maxblur',
      min: 0,
      max: 0.02,
      step: 0.0001,
    });
  }
}
