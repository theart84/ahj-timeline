import Feed from './Feed';
import Modal from './Modal';

export default class AppController {
  constructor(container) {
    this.container = container;
  }

  init() {
    this.feedContainer = new Feed(this.container);
    this.modal = new Modal(this.container);

    this.feedContainer.init();
    this.modal.init();
  }
}
