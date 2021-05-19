import templateEngine from './TemplateEngine';
import eventBus from './EventBus';

export default class ModalDelete {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('Передайте HTML элемент');
    }
    this.container = container;
  }

  init() {
    this.bindToDOM();
    this.subscribeOnEvents();
  }

  render() {
    return templateEngine.generate({
      type: 'div',
      attr: {
        class: ['modal__info'],
      },
      content: [
        {
          type: 'div',
          attr: {
            class: ['modal__background'],
          },
          content: '',
        },
        {
          type: 'div',
          attr: {
            class: ['modal__content'],
          },
          content: [
            {
              type: 'div',
              attr: {
                class: ['modal__header'],
              },
              content: '',
            },
            {
              type: 'div',
              attr: {
                class: ['modal__body'],
              },
              content:
                'Your browser does not support this feature or you have denied access to it.',
            },
            {
              type: 'div',
              attr: {
                class: ['modal__footer'],
              },
              content: [
                {
                  type: 'div',
                  attr: {
                    class: ['modal__ok'],
                  },
                  listener: {
                    type: 'click',
                    cb: () => this.close(),
                  },
                  content: 'Ok',
                },
              ],
            },
          ],
        },
      ],
    });
  }

  bindToDOM() {
    this.container.appendChild(this.render());
  }

  subscribeOnEvents() {
    eventBus.subscribe('show-modal-info', this.showModal, this);
  }

  close() {
    this.modalElement.classList.remove('active');
    eventBus.emit('close-modal-info');
  }

  showModal() {
    const modalTitle = this.modalElement.querySelector('.modal__header');
    modalTitle.textContent = 'Information!';
    this.modalElement.classList.add('active');
  }

  get modalElement() {
    return this.container.querySelector('.modal__info');
  }
}
