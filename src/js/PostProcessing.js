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

    this.init();
    this.initBokeh();
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
    this.effectComposer.setSize(this.sizes.width, this.sizes.height);
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
        width: 800,
        height: 600,
      },
    );

    this.effectComposer.addPass(this.bokehPass);
  }
}
