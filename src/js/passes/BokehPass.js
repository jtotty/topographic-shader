/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import {
  Color,
  Mesh,
  MeshDepthMaterial,
  NearestFilter,
  NoBlending,
  RGBADepthPacking,
  ShaderMaterial,
  UniformsUtils,
  WebGLRenderTarget,
} from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass';
import { BokehShader } from 'three/examples/jsm/shaders/BokehShader';

/**
 * Depth-of-field post-process with bokeh shader.
 *
 * @param {THREE.scene}  scene
 * @param {THREE.Camera} camera
 * @param {Object}       params
 */
export default class BokehPass extends Pass {
  constructor(scene, camera, params) {
    super();

    this.scene = scene;
    this.camera = camera;

    const focus = (params.focus !== undefined) ? params.focus : 1.0;
    const aspect = (params.aspect !== undefined) ? params.aspect : camera.aspect;
    const aperture = (params.aperture !== undefined) ? params.aperture : 0.025;
    const maxblur = (params.maxblur !== undefined) ? params.maxblur : 1.0;

    // render targets
    const width = params.width || window.innerWidth || 1;
    const height = params.height || window.innerHeight || 1;

    this.renderTargetDepth = new WebGLRenderTarget(width, height, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
    });

    this.renderTargetDepth.texture.name = 'BokehPass.depth';

    // depth material
    this.materialDepth = new MeshDepthMaterial();
    this.materialDepth.depthPacking = RGBADepthPacking;
    this.materialDepth.blending = NoBlending;

    // bokeh material
    if (BokehShader === undefined) {
      console.error('THREE.BokehPass relies on BokehShader');
    }

    const bokehShader = BokehShader;
    const bokehUniforms = UniformsUtils.clone(bokehShader.uniforms);

    bokehUniforms.tDepth.value = this.renderTargetDepth.texture;

    bokehUniforms.focus.value = focus;
    bokehUniforms.aspect.value = aspect;
    bokehUniforms.aperture.value = aperture;
    bokehUniforms.maxblur.value = maxblur;
    bokehUniforms.nearClip.value = camera.near;
    bokehUniforms.farClip.value = camera.far;

    this.materialBokeh = new ShaderMaterial({
      defines: { ...bokehShader.defines },
      uniforms: bokehUniforms,
      vertexShader: bokehShader.vertexShader,
      fragmentShader: bokehShader.fragmentShader,
    });

    this.uniforms = bokehUniforms;
    this.needsSwap = false;

    this.fsQuad = new FullScreenQuad(this.materialBokeh);
    this.oldClearColor = new Color();
  }

  /**
   * Render.
   *
   * @param {THREE.WebGLRenderer} renderer
   * @param {THREE.WebGLRenderTarget} writeBuffer
   * @param {THREE.WebGLRenderTarget} readBuffer
   */
  render(_renderer, writeBuffer, readBuffer) {
    // Render depth into texture
    // this.scene.overrideMaterial = this.materialDepth;

    // Only override mesh
    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.userData.originalMaterial = child.material;

        if (child.userData.depthMaterial) {
          child.material = child.userData.depthMaterial;
        } else {
          child.material = this.materialDepth;
        }
      }
    });

    const renderer = _renderer;

    renderer.getClearColor(this.oldClearColor);
    const oldClearAlpha = renderer.getClearAlpha();
    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;

    renderer.setClearColor(0xffffff);
    renderer.setClearAlpha(1.0);
    renderer.setRenderTarget(this.renderTargetDepth);
    renderer.clear();
    renderer.render(this.scene, this.camera);

    // Render bokeh composite
    this.uniforms.tColor.value = readBuffer.texture;
    this.uniforms.nearClip.value = this.camera.near;
    this.uniforms.farClip.value = this.camera.far;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      renderer.clear();
      this.fsQuad.render(renderer);
    }

    // this.scene.overrideMaterial = null;
    // Set the material back to original
    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = child.userData.originalMaterial;
      }
    });

    renderer.setClearColor(this.oldClearColor);
    renderer.setClearAlpha(oldClearAlpha);
    renderer.autoClear = oldAutoClear;
  }
}
