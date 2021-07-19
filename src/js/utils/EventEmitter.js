/* eslint-disable no-console */
export default class EventEmitter {
  /**
   * Constructor
   */
  constructor() {
    this.callbacks = {};
    this.callbacks.base = {};
  }

  /**
   * On
   */
  on(_names, callback) {
    // Errors
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('Invalid names');
      return false;
    }

    if (typeof callback === 'undefined') {
      console.warn('Invalid callback');
      return false;
    }

    // Resolve names
    const names = EventEmitter.resolveNames(_names);

    // Each name
    names.forEach((_name) => {
      // Resolve name
      const name = EventEmitter.resolveName(_name);

      // Create namespace if not exist
      if (!(this.callbacks[name.namespace] instanceof Object)) {
        this.callbacks[name.namespace] = {};
      }

      // Create callback if not exist
      if (!(this.callbacks[name.namespace][name.value] instanceof Array)) {
        this.callbacks[name.namespace][name.value] = [];
      }

      // Add callback
      this.callbacks[name.namespace][name.value].push(callback);
    });

    return this;
  }

  /**
   * Off
   */
  off(_names) {
    // Errors
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('Invalid name');
      return false;
    }

    // Resolve names
    const names = EventEmitter.resolveNames(_names);

    // Each name
    names.forEach((_name) => {
      // Resolve name
      const name = EventEmitter.resolveName(_name);

      // Remove namespace
      if (name.namespace !== 'base' && name.value === '') {
        delete this.callbacks[name.namespace];
      } else if (name.namespace === 'base') {
        // Try to remove from each namespace
        Object.keys(this.callbacks).forEach((namespace) => {
          // eslint-disable-next-line max-len
          if (this.callbacks[namespace] instanceof Object && this.callbacks[namespace][name.value] instanceof Array) {
            delete this.callbacks[namespace][name.value];

            // Remove namespace if empty
            if (Object.keys(this.callbacks[namespace]).length === 0) {
              delete this.callbacks[namespace];
            }
          }
        });
      // eslint-disable-next-line max-len
      } else if (this.callbacks[name.namespace] instanceof Object && this.callbacks[name.namespace][name.value] instanceof Array) {
        delete this.callbacks[name.namespace][name.value];

        // Remove namespace if empty
        if (Object.keys(this.callbacks[name.namespace]).length === 0) {
          delete this.callbacks[name.namespace];
        }
      }
    });

    return this;
  }

  /**
   * Trigger
   */
  trigger(_name, _args) {
    // Errors
    if (typeof _name === 'undefined' || _name === '') {
      console.warn('wrong name');
      return false;
    }

    let finalResult = null;
    let result = null;

    // Default args
    const args = !(_args instanceof Array) ? [] : _args;

    // Resolve names (should on have one event)
    let name = EventEmitter.resolveNames(_name);

    // Resolve name
    name = EventEmitter.resolveName(name[0]);

    // Default namespace
    if (name.namespace === 'base') {
      // Try to find callback in each namespace
      // eslint-disable-next-line no-restricted-syntax
      Object.keys(this.callbacks).forEach((namespace) => {
        // eslint-disable-next-line max-len
        if (this.callbacks[namespace] instanceof Object && this.callbacks[namespace][name.value] instanceof Array) {
          this.callbacks[namespace][name.value].forEach((callback) => {
            result = callback.apply(this, args);

            if (typeof finalResult === 'undefined') {
              finalResult = result;
            }
          });
        }
      });
    } else if (this.callbacks[name.namespace] instanceof Object) {
      if (name.value === '') {
        console.warn('wrong name');
        return this;
      }

      this.callbacks[name.namespace][name.value].forEach((callback) => {
        result = callback.apply(this, args);

        if (typeof finalResult === 'undefined') {
          finalResult = result;
        }
      });
    }

    return finalResult;
  }

  /**
   * Resolve names
   */
  static resolveNames(_names) {
    let names = _names;
    names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '');
    names = names.replace(/[,/]+/g, ' ');
    names = names.split(' ');

    return names;
  }

  /**
   * Resolve name
   */
  static resolveName(name) {
    const newName = {};
    const parts = name.split('.');
    const [value, namespace] = parts;

    newName.original = name;
    newName.value = value;
    newName.namespace = 'base'; // Base namespace

    // Specified namespace
    if (parts.length > 1 && namespace !== '') {
      newName.namespace = namespace;
    }

    return newName;
  }
}
