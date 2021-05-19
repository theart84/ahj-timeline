import templateEngine from './TemplateEngine';
import eventBus from './EventBus';

export default class Modal {
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
        class: ['modal__form'],
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
              content: 'Information!',
            },
            {
              type: 'div',
              attr: {
                class: ['modal__body'],
              },
              content: [
                {
                  type: 'div',
                  attr: {
                    class: ['modal__text'],
                  },
                  content:
                    'Unfortunately, we were unable to determine your location, please give permission to use geolocation, or enter the coordinates manually.',
                },
                {
                  type: 'form',
                  attr: {
                    class: ['modal__form'],
                    name: 'modal-form',
                  },
                  listener: {
                    type: 'submit',
                    cb: (event) => this.submit(event),
                  },
                  content: [
                    {
                      type: 'div',
                      attr: {
                        class: ['form__group'],
                      },
                      content: [
                        {
                          type: 'label',
                          attr: {
                            class: ['form__label'],
                            for: 'username-field',
                          },
                          content: 'Latitude and longitude separated by commas',
                        },
                        {
                          type: 'input',
                          attr: {
                            class: ['form__input'],
                            name: 'coordinates',
                            placeholder: 'Please enter your coordinates...',
                          },
                          content: '',
                        },
                        {
                          type: 'div',
                          attr: {
                            class: ['form__hint', 'hidden'],
                          },
                          content: '',
                        },
                      ],
                    },
                  ],
                },
              ],
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
                    class: ['modal__close'],
                  },
                  listener: {
                    type: 'click',
                    cb: (event) => this.close(event),
                  },
                  content: 'Close',
                },
                {
                  type: 'div',
                  attr: {
                    class: ['modal__ok'],
                  },
                  listener: {
                    type: 'click',
                    cb: (event) => this.submit(event),
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
    this.modalElement = this.container.querySelector('.modal__form');
    this.formElement = this.modalElement.querySelector('form');
  }

  subscribeOnEvents() {
    eventBus.subscribe('show-modal', this.showModal, this);
  }

  submit(event) {
    event.preventDefault();
    const { formElement } = this;
    if (formElement.elements.coordinates.value === '') {
      return;
    }
    const normalizeData = formElement.elements.coordinates.value.split(',');
    const coordsIsValid = this.validateInput(formElement.elements.coordinates.value);
    if (coordsIsValid) {
      this.hideHint();
      this.modalElement.querySelector('.modal__header').textContent = '';
      eventBus.emit('manual-coords', [normalizeData[0], normalizeData[1]]);
      this.close();
    } else {
      this.showHint('Enter the coordinates of the following type: 00.00000, 0.00000');
    }
  }

  validateInput(value) {
    const templateRegExp = /^\[?([-+]?\d{1,2}[.]\d+),\s*([-+]?\d{1,3}[.]\d+)\]?$/gm;
    return templateRegExp.test(value);
  }

  close() {
    this.clearForm();
    this.modalElement.classList.remove('active');
  }

  showModal() {
    this.modalElement.classList.add('active');
  }

  clearForm() {
    this.formElement.elements.coordinates.value = '';
  }

  showHint(message) {
    const hintElement = this.formElement.querySelector('.form__hint');
    hintElement.textContent = message;
    hintElement.classList.remove('hidden');
  }

  hideHint() {
    const hintElement = this.formElement.querySelector('.form__hint');
    hintElement.textContent = '';
    hintElement.classList.add('hidden');
  }
}
