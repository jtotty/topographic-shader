import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/**
 * Our Camera.
 * @param {Object} params
 */
export default class Camera {
  constructor(params) {
    // Options
    this.time = params.time
    this.sizes = params.sizes
    this.debug = params.debug
    this.renderer = params.renderer
    this.config = params.config

    // Set up
    this.container = new THREE.Object3D()
    this.container.matrixAutoUpdate = false

    this.setCamera()
    this.setOrbitControls()
  }

  setCamera() {
    const { width, height } = this.sizes.viewport

    this.instance = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
    this.instance.position.set(0, 0, 1.1)
    this.instance.lookAt(new THREE.Vector3())
    this.container.add(this.instance)

    this.sizes.on('resize', () => {
      this.instance.aspect = this.sizes.viewport.width / this.sizes.viewport.height
      this.instance.updateProjectionMatrix()
    })
  }

  setOrbitControls() {
    this.orbitControls = new OrbitControls(this.instance, this.renderer.domElement)
    this.orbitControls.enableDamping = true

    this.time.on('tick', () => {
      this.orbitControls.update()
    })
  }
}
