import PlaneMaterial from '../materials/PlaneMaterial'

/**
 * Assign our materials.
 * @param {Object} params
 */
export default class Materials {
  constructor(params) {
    this.debug = params.debug
    this.config = params.config
    this.resources = params.resources
    this.camera = params.camera
    this.items = {}

    this.setMaterials()
  }

  /**
   * Add our materials.
   */
  setMaterials() {
    this.items.shader = {
      plane: PlaneMaterial(this.debug, this.camera),
    }
  }
}
