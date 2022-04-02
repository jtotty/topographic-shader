import * as THREE from 'three'
import { Pane } from 'tweakpane'

import Stats from 'stats.js'
import Time from './utils/Time'
import Sizes from './utils/Sizes'
import Resources from './Resources'

import Camera from './Camera'
import World from './World'
import PostProcessing from './PostProcessing'

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
    this.canvas = _options.canvas

    this.time = new Time()
    this.sizes = new Sizes()
    this.resources = new Resources()

    // Instantiatite our global object container on the window
    window.topo = {}

    this.setConfig()
    this.setDebug()
    this.setRenderer()
    this.setCamera()
    this.setWorld()
    this.setPostProcessing()
    this.statsMonitoring()
  }

  /**
   * Set debug option.
   * If anchor part of a URL contains "debug".
   */
  setConfig() {
    this.config = {
      debug: window.location.hash === '#debug',
      clearColor: '#08001f',
    }
  }

  /**
   * Start debug GUI if in debug mode.
   */
  setDebug() {
    if (this.config.debug) {
      this.debug = new Pane()
    }
  }

  /**
   * The WebGL renderer displays your beautifully crafted scenes using WebGL
   */
  setRenderer() {
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
    })
    this.renderer.setClearColor(this.config.clearColor)

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({ title: 'App', expanded: true })

      this.debugFolder.addInput(this.config, 'clearColor', {
        label: 'Clear Color',
        view: 'color',
      }).on('change', (event) => {
        this.renderer.setClearColor(event.value)
      })
    }

    Application.resize(this.renderer, this.sizes.viewport)

    this.sizes.on('resize', () => {
      Application.resize(this.renderer, this.sizes.viewport)
    })
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
    })

    this.scene.add(this.camera.container)

    this.time.on('tick', () => {
      this.renderer.render(this.scene, this.camera.instance)
    })
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
    })

    this.scene.add(this.world.group)
  }

  /**
   * Add our post processing.
   */
  setPostProcessing() {
    this.postProcessing = new PostProcessing({
      time: this.time,
      sizes: this.sizes,
      renderer: this.renderer,
      camera: this.camera,
      scene: this.scene,
      debug: this.debug,
    })

    this.time.on('tick', () => {
      this.postProcessing.effectComposer.render()
    })
  }

  /**
   * Desctructor
   */
  desctructor() {
    this.time.off('tick')
    this.sizes.off('resize')
    this.camera.orbitControls.dispose()
    this.renderer.dispose()
    this.debug.destroy()
  }

  /**
   * FPS Monitoring.
   * This might be a bit heavy.
   */
  statsMonitoring() {
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)

    this.time.on('tick', () => {
      this.stats.begin()
      this.stats.end()
    })
  }

  /**
   * Resize the renderer and set pixel ratio.
   * @param {THREE.WebGLRenderer} renderer
   * @param {Object}              viewport
   */
  static resize(renderer, { width, height, pixelRatio }) {
    renderer.setSize(width, height)
    renderer.setPixelRatio(pixelRatio)
  }
}
