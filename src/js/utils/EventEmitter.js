export default class EventEmitter {
  constructor() {
    this.callbacks = { base: {} };
  }

  /**
   * input : this.on('xx/yy/zz.alpha', callback)
   * result: this.callbacks['base'] = {'xx':[..., callback], 'yy':[..., callback]}
   *         this.callbacks['alpha'] = {'zz':[..., callback]}
   * @param {string} _names
   * @callback       _callback
   */
  on(_names, _callback) {
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('Invalid names');
      return false;
    }

    if (typeof _callback === 'undefined') {
      console.warn('Invalid callback');
      return false;
    }

    // Resolve names and loop
    EventEmitter.resolveAllNames(_names).forEach((_name) => {
      // Resolve the name
      const { namespace, value } = EventEmitter.resolveSingleName(_name);

      // Namespace does not exist -> set empty object
      if (!(this.callbacks[namespace] instanceof Object)) {
        this.callbacks[namespace] = {};
      }

      // Callbacks do not exist -> set empty array
      if (!(this.callbacks[namespace][value] instanceof Array)) {
        this.callbacks[namespace][value] = [];
      }

      // Add callback
      this.callbacks[namespace][value].push(_callback);
    });

    return this;
  }

  /**
   * ex: this.remove({_names: 'xx', _callback: ...})
   * ex: this.remove({_names: 'xx/yy/zz.alpha', _callback: ...})
   * @param {string} names
   */
  off(_names) {
    // Errors
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('Invalid name');
      return false;
    }

    // Resolve names
    EventEmitter.resolveAllNames(_names).forEach((_name) => {
      // Resolve name
      const { namespace, value } = EventEmitter.resolveSingleName(_name);

      // Remove namepsace
      if (namespace !== 'base' && value === '') {
        delete this.callbacks[namespace];
      } else if (namespace === 'base') {
        Object.values(this.callbacks).forEach((_namespace) => {
          if (_namespace instanceof Object && _namespace[value] instanceof Array) {
            delete this.callbacks[namespace][value];

            // Remove namespace if empty
            if (!Object.keys(_namespace).length) {
              delete this.callbacks[namespace];
            }
          }
        });
      } else if (
        this.callbacks[namespace] instanceof Object
        && this.callbacks[namespace][value] instanceof Array
      ) {
        delete this.callbacks[namespace][value];

        // Remove namespace if empty
        if (!Object.keys(this.callbacks[namespace]).length) {
          delete this.callbacks[namespace];
        }
      }
    });

    return this;
  }

  /**
   * input:  this.trigger('xx', [5,3])
   * result: this.callbacks['base']['xx'] -> [c1, c2, ...]
   *         execute c1(5,3), c2(5,3)
   * @param {string} _names
   * @param {Array}  _args
   */
  trigger(_names, _args) {
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('Invalid name');
      return false;
    }

    let finalResult = null;

    // Default args[]
    const args = !(_args instanceof Array) ? [] : _args;

    const names = EventEmitter.resolveAllNames(_names);
    const { namespace, value } = EventEmitter.resolveSingleName(names[0]);

    // base, trigger

    if (namespace === 'base') {
      Object.values(this.callbacks).forEach((_namespace) => {
        if (_namespace instanceof Object && _namespace[value] instanceof Array) {
          _namespace[value].forEach((cb) => {
            if (typeof finalResult === 'undefined') finalResult = cb.apply(this, args);
          });
        }
      });
    } else if (this.callbacks[namespace] instanceof Object) {
      if (value === '') {
        console.warn('Invalid name');
        return this;
      }

      this.callbacks[namespace][value].forEach((cb) => {
        if (typeof finalResult === 'undefined') finalResult = cb.apply(this, args);
      });
    }

    return finalResult;
  }

  /**
   * 1. Remove any characters that do not match
   * 2. Replace comma or forward slash with whitespace
   * 3. Split string by whitespace
   * example: 'xx/yy/zz' -> ['xx', 'yy', 'zz']
   * @param {string} _names
   * @returns {string[]}
   */
  static resolveAllNames(_names) {
    let names = _names;
    names = names.replace(/[^a-zA-Z0-9,/.]/g, '');
    names = names.replace(/[,/]+/g, ' ');
    names = names.split(' ');

    return names;
  }

  /**
   * ex:    'xx' -> { original: 'xx', value: 'xx', namespace: 'base' }
   * ex: 'xx.yy' -> { original: 'xx.yy', value: 'xx', namespace: 'yy'}
   * @param {string} _name
   * @returns {Object}
   */
  static resolveSingleName(_name) {
    const [value, namespace] = _name.split('.');

    const resolved = {
      original: _name,
      value,
      namespace: namespace ?? 'base',
    };

    return resolved;
  }
}
