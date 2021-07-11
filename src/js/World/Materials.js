import * as THREE from 'three';

export default class Materials {
  constructor(_option) {
    this.resources = _option.resources;
    this.items = {};

    this.setMaterials();
  }

  /**
   * Add our materials.
   */
  setMaterials() {
    const { matcapRed, matcapGold } = this.resources.items;

    console.log(this.resources);

    this.items.matcap = {
      red: new THREE.MeshMatcapMaterial({ matcap: matcapRed }),
      gold: new THREE.MeshMatcapMaterial({ matcap: matcapGold }),
    };
  }
}
