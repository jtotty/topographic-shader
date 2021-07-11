import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
  /**
   * Constructor.
   */
  constructor() {
    super();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    this.tick = this.tick.bind(this);
    this.tick();
  }

  /**
   * Start time.
   */
  tick() {
    this.ticker = window.requestAnimationFrame(this.tick);

    const current = Date.now();

    this.delta = current - this.current;
    this.elapsed = current - this.start;
    this.current = current;

    // Cap delta at 60 - consistent animation speed across devices
    // eg High refresh rate (120+) screens will run faster
    if (this.delta > 60) this.delta = 60;

    this.trigger('tick');
  }

  /**
   * Stop time.
   */
  stop() {
    window.cancelAnimationFrame(this.ticker);
  }
}
