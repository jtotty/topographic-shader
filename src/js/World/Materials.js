import PlaneMaterial from '../materials/PlaneMaterial';

export default class Materials {
  constructor(_option) {
    this.debug = _option.debug;
    this.config = _option.config;
    this.resources = _option.resources;
    this.items = {};

    this.setMaterials();
  }

  /**
   * Add our materials.
   */
  setMaterials() {
    this.items.shader = {
      plane: PlaneMaterial(this.debug, this.config),
    };
  }
}
