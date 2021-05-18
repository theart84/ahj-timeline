import Post from './Post';
import eventBus from './EventBus';
import templateEngine from './TemplateEngine';
import geolocation from './geolocation';

export default class Feed {
  constructor(container) {
    this.container = container;
  }

  init() {
    this.bindToDOM();
    this.registerEvents();
    this.subscribeOnEvents();
  }

  registerEvents() {
    this.inputElement.addEventListener('keydown', (event) => {
      if (event.keyCode === 13) {
        this.addTextPostHandler(event);
      }
    });
    this.micElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('input__media')) {
        this.addAudioPostHandler(event);
        return;
      }
      if (event.target.classList.contains('stop')) {
        this.stopAudioPostHandler(event);
        return;
      }
      if (event.target.classList.contains('cancel')) {
        this.cancelAudioPostHandler(event);
      }
    });
    this.videoElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('input__media')) {
        this.addVideoPostHandler(event);
      }
      if (event.target.classList.contains('stop')) {
        this.stopVideoPostHandler(event);
        return;
      }
      if (event.target.classList.contains('cancel')) {
        this.cancelVideoPostHandler(event);
      }
    });
  }

  bindToDOM() {
    this.container.appendChild(templateEngine.generate(this.markup()));
    this.feedContainer = this.container.querySelector('.feed__content');
    this.inputElement = this.container.querySelector('.input__field');
    this.micElement = this.container.querySelector('.input__media-audio');
    this.micControlsElement = this.container.querySelector(
      '.input__media-audio .input__media-controls'
    );
    this.videoControlsElement = this.container.querySelector(
      '.input__media-video .input__media-controls'
    );
    this.videoElement = this.container.querySelector('.input__media-video');
  }

  subscribeOnEvents() {
    eventBus.subscribe('manual-coords', this.addTextPost, this);
  }

  async addTextPostHandler(event) {
    try {
      const coordinates = await geolocation();
      this.addTextPost(
        coordinates.coords.latitude,
        coordinates.coords.longitude,
        event.target.value
      );
    } catch (e) {
      eventBus.emit('show-modal');
      this.currentValue = event.target.value;
    } finally {
      event.target.value = '';
    }
  }

  addTextPost(latitude, longitude, message = this.currentValue) {
    const newPost = new Post(message, `[${latitude}, ${longitude}]`);
    this.feedContainer.insertAdjacentElement(
      'afterbegin',
      templateEngine.generate(newPost.markup())
    );
    this.currentValue = null;
  }

  addAudioPostHandler() {
    if (
      this.micElement.classList.contains('input__media-audio--active') &&
      this.videoElement.classList.contains('input__media-video--active')
    ) {
      this.videoElement.classList.remove('input__media-video--active');
      console.log('Video - Rec stop');
      console.log('Mic - Rec start');
      return;
    }
    if (this.micElement.classList.contains('input__media-audio--active')) {
      this.micElement.classList.remove('input__media-audio--active');
      this.micControlsElement.classList.remove('input__media-controls--show');
      this.micControlsElement.classList.add('hidden');
      console.log('Mic - Rec stop');
      return;
    }
    this.micElement.classList.add('input__media-audio--active');
    this.micControlsElement.classList.remove('hidden');
    setTimeout(() => {
      this.micControlsElement.classList.add('input__media-controls--show');
    }, 300);
    console.log('Mic - Rec start');
  }

  addVideoPostHandler() {
    if (
      this.micElement.classList.contains('input__media-audio--active') &&
      this.videoElement.classList.contains('input__media-video--active')
    ) {
      this.micElement.classList.remove('input__media-audio--active');
      this.videoElement.classList.remove('input__media-video--active');
      this.videoControlsElement.classList.remove('input__media-controls--show');
      this.videoControlsElement.classList.add('hidden');
      console.log('Video - Rec stop');
      return;
    }
    if (this.micElement.classList.contains('input__media-audio--active')) {
      this.videoElement.classList.add('input__media-video--active');
      console.log('Mic - Rec stop');
      console.log('Video - Rec start');
      return;
    }
    this.micElement.classList.add('input__media-audio--active');
    this.videoElement.classList.add('input__media-video--active');
    this.videoControlsElement.classList.remove('hidden');
    setTimeout(() => {
      this.videoControlsElement.classList.add('input__media-controls--show');
    }, 300);
    console.log('Video - Rec start');
  }

  stopAudioPostHandler(event) {
    console.log('stop')
  }

  cancelAudioPostHandler(event) {
    console.log('cancel')
  }

  stopVideoPostHandler(event) {
    console.log('stop')
  }

  cancelVideoPostHandler(event) {
    console.log('cancel')
  }

  markup() {
    return {
      type: 'div',
      attr: {
        class: ['feed'],
      },
      content: [
        {
          type: 'div',
          attr: {
            class: ['feed__header'],
          },
          content: {
            type: 'h1',
            attr: {
              class: ['feed__title'],
            },
            content: 'My Feed',
          },
        },
        {
          type: 'div',
          attr: {
            class: ['feed__content'],
          },
          content: '',
        },
        {
          type: 'div',
          attr: {
            class: ['feed__footer'],
          },
          content: {
            type: 'div',
            attr: {
              class: ['input__container'],
            },
            content: [
              {
                type: 'input',
                attr: {
                  class: ['input__field'],
                  type: 'text',
                  placeholder: 'Please enter your message...',
                },
              },
              {
                type: 'div',
                attr: {
                  class: ['input__media', 'input__media-audio', 'input__media-audio--img'],
                },
                content: {
                  type: 'div',
                  attr: {
                    class: ['input__media-controls', 'hidden'],
                  },
                  content: [
                    {
                      type: 'span',
                      attr: {
                        class: ['stop', 'stop--img'],
                      },
                      content: '',
                    },
                    {
                      type: 'span',
                      attr: {
                        class: ['recording-timeline'],
                      },
                      content: '00:05',
                    },
                    {
                      type: 'span',
                      attr: {
                        class: ['cancel', 'cancel--img'],
                      },
                      content: '',
                    },
                  ],
                },
              },
              {
                type: 'div',
                attr: {
                  class: ['input__media', 'input__media-video', 'input__media-video--img'],
                },
                content: {
                  type: 'div',
                  attr: {
                    class: ['input__media-controls', 'hidden'],
                  },
                  content: [
                    {
                      type: 'span',
                      attr: {
                        class: ['stop', 'stop--img'],
                      },
                      content: '',
                    },
                    {
                      type: 'span',
                      attr: {
                        class: ['recording-timeline'],
                      },
                      content: '00:05',
                    },
                    {
                      type: 'span',
                      attr: {
                        class: ['cancel', 'cancel--img'],
                      },
                      content: '',
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    };
  }
}
