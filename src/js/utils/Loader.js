/* eslint-disable no-console */
import * as THREE from 'three';
import EventEmitter from './EventEmitter';

/**
 * Create our 3D asset loaders.
 */
export default class Loader extends EventEmitter {
  constructor() {
    super();

    this.setLoaders();

    this.toLoad = 0;
    this.loaded = 0;
  }

  /**
   * Set out different file loaders.
   */
  setLoaders() {
    this.loaders = [];

    const textureLoader = new THREE.TextureLoader();

    // ex: _resource: { name: 'matcapRed', source: 'name.jpg' }
    this.loaders.push({
      extensions: ['jpg', 'png'],
      action: (resource) => {
        textureLoader.load(resource.source, (texture) => {
          this.fileLoadEnd(resource, texture);
        });
      },
    });
  }

  /**
   * Send events when file and all files finished loading.
   * @param {*} resource
   * @param {*} data
   */
  fileLoadEnd(resource, data) {
    this.loaded += 1;

    this.trigger('fileEnd', [resource, data]);

    if (this.loaded === this.toLoad) {
      this.trigger('end');
    }
  }

  /**
   * Load resources.
   * @param {Array} resources
   */
  load(resources = []) {
    resources.forEach((resource) => {
      this.toLoad += 1;

      // jpg, png, ...
      const extension = resource.source.match(/\.([a-z]+)$/)[1];

      if (typeof extension !== 'undefined') {
        const loader = this.loaders.find((_loader) => _loader.extensions.includes(extension));

        if (loader) {
          loader.action(resource);
        } else {
          console.error(`Cannot find loader for ${resource}`);
        }
      } else {
        console.error(`Cannot find loader for ${resource}`);
      }
    });
  }
}
