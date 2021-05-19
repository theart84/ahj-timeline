class EventBus {
  constructor() {
    this.handlers = [];
  }

  /**
   *
   * @param {string} event
   * @param {function} handler
   * @param {object} context
   */
  subscribe(event, handler, context) {
    if (typeof context === 'undefined') {
      context = handler;
    }
    this.handlers.push({
      event,
      handler: handler.bind(context),
    });
  }

  emit(event, args) {
    this.handlers.forEach((topic) => {
      if (topic.event === event) {
        if (Array.isArray(args)) {
          topic.handler.call(null, ...args);
        } else {
          topic.handler(args);
        }
      }
    });
  }
}

const eventBus = new EventBus();

export default eventBus;
