import EventEmitter from './utils/EventEmitter';
import Loader from './utils/Loader';

export default class Resources extends EventEmitter {
  constructor() {
    super();

    this.loader = new Loader();
    this.items = {};

    // After each asset loaded
    this.loader.on('fileEnd', (_resource, _data) => {
      this.items[_resource.name] = _data;

      const { loaded, toLoad } = this.loader;
      const percent = Math.round((loaded / toLoad) * 100);

      this.trigger('progress', [percent]);
    });

    // Finished loading
    this.loader.on('end', () => {
      this.trigger('ready');
    });

    // this.loader.load([]);
  }
}
