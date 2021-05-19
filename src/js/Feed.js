import Post from './Post';
import eventBus from './EventBus';
import templateEngine from './TemplateEngine';
import geolocation from './geolocation';
import Recorder from './Recorder';

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
        this.onClickMicHandler(event);
        return;
      }
      if (event.target.classList.contains('stop')) {
        this.stopHandler('audio');
        return;
      }
      if (event.target.classList.contains('cancel')) {
        this.cancelHandler('audio');
      }
    });
    this.videoElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('input__media')) {
        this.onClickVideoHandler(event);
      }
      if (event.target.classList.contains('stop')) {
        this.stopHandler('video');
        return;
      }
      if (event.target.classList.contains('cancel')) {
        this.stopHandler('video');
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
    eventBus.subscribe('manual-coords', this.addPost, this);
    eventBus.subscribe('received-link', this.addMediaPost, this);
    eventBus.subscribe(
      'close-modal-info',
      () => {
        this.hideAudioControlElements();
        this.hideVideoControlElements();
      },
      this
    );
  }

  async addTextPostHandler(event) {
    const coordinates = await this.coordinates();
    this.type = 'text';
    if (coordinates) {
      this.addPost(coordinates.coords.latitude, coordinates.coords.longitude, event.target.value);
    } else {
      this.currentValue = event.target.value;
    }
    event.target.value = '';
  }

  async coordinates() {
    try {
      return await geolocation();
    } catch (e) {
      eventBus.emit('show-modal');
      return null;
    }
  }

  addPost(latitude, longitude, message = this.currentValue) {
    const newPost = new Post(this.type, message, `[${latitude}, ${longitude}]`);
    this.feedContainer.insertAdjacentElement(
      'afterbegin',
      templateEngine.generate(newPost.markup())
    );
    this.currentValue = null;
  }

  async onClickMicHandler() {
    if (
      this.micElement.classList.contains('input__media-audio--active') &&
      this.videoElement.classList.contains('input__media-video--active')
    ) {
      this.videoElement.classList.remove('input__media-video--active');
      this.videoControlsElement.classList.remove('input__media-controls--show');
      this.videoControlsElement.classList.add('hidden');
      this.micControlsElement.classList.remove('hidden');
      setTimeout(() => {
        this.micControlsElement.classList.add('input__media-controls--show');
      }, 300);
      this.recorder.cancelStream();
      this.recorder = null;
      this.stopTimer();
      this.createRecorder('audio', this.micElement);
      return;
    }
    if (this.micElement.classList.contains('input__media-audio--active')) {
      this.micElement.classList.remove('input__media-audio--active');
      this.micControlsElement.classList.remove('input__media-controls--show');
      this.micControlsElement.classList.add('hidden');
      this.recorder.cancelStream();
      this.recorder = null;
      this.stopTimer();
      return;
    }
    this.micElement.classList.add('input__media-audio--active');
    this.micControlsElement.classList.remove('hidden');
    setTimeout(() => {
      this.micControlsElement.classList.add('input__media-controls--show');
    }, 300);
    this.createRecorder('audio', this.micElement);
  }

  async onClickVideoHandler() {
    if (
      this.micElement.classList.contains('input__media-audio--active') &&
      this.videoElement.classList.contains('input__media-video--active')
    ) {
      this.micElement.classList.remove('input__media-audio--active');
      this.videoElement.classList.remove('input__media-video--active');
      this.videoControlsElement.classList.remove('input__media-controls--show');
      this.videoControlsElement.classList.add('hidden');
      this.recorder.cancelStream();
      this.recorder = null;
      this.stopTimer();
      return;
    }
    if (this.micElement.classList.contains('input__media-audio--active')) {
      this.micControlsElement.classList.remove('input__media-controls--show');
      this.micControlsElement.classList.add('hidden');

      this.videoElement.classList.add('input__media-video--active');
      this.videoControlsElement.classList.remove('hidden');
      setTimeout(() => {
        this.videoControlsElement.classList.add('input__media-controls--show');
      }, 300);
      this.recorder.cancelStream();
      this.recorder = null;
      this.stopTimer();
      this.createRecorder('video', this.videoElement);
      return;
    }
    this.micElement.classList.add('input__media-audio--active');
    this.videoElement.classList.add('input__media-video--active');
    this.videoControlsElement.classList.remove('hidden');
    setTimeout(() => {
      this.videoControlsElement.classList.add('input__media-controls--show');
    }, 300);
    this.createRecorder('video', this.videoElement);
  }

  stopHandler(type) {
    if (type === 'audio') {
      this.recorder.stop();
      this.stopTimer();
      this.hideAudioControlElements();
    } else {
      this.recorder.stop();
      this.stopTimer();
      this.hideVideoControlElements();
    }
  }

  cancelHandler(type) {
    if (type === 'audio') {
      this.recorder.cancelStream();
      this.recorder = null;
      this.stopTimer();
      this.hideAudioControlElements();
    } else {
      this.recorder.cancelStream();
      this.recorder = null;
      this.stopTimer();
      this.hideVideoControlElements();
    }
  }

  async addMediaPost(value) {
    const coordinates = await this.coordinates();
    this.currentValue = value;
    if (coordinates) {
      this.addPost(coordinates.coords.latitude, coordinates.coords.longitude, value);
    }
  }

  hideAudioControlElements() {
    this.micElement.classList.remove('input__media-audio--active');
    this.micControlsElement.classList.remove('input__media-controls--show');
    this.micControlsElement.classList.add('hidden');
  }

  hideVideoControlElements() {
    this.micElement.classList.remove('input__media-audio--active');
    this.videoElement.classList.remove('input__media-video--active');
    this.videoControlsElement.classList.remove('input__media-controls--show');
    this.videoControlsElement.classList.add('hidden');
  }

  async createRecorder(type, container) {
    try {
      this.type = type;
      this.recorder = new Recorder(type);
      await this.recorder.init();
      this.recorder.start();
      this.startTimer(container);
    } catch (e) {
      eventBus.emit('show-modal-info');
    }
  }

  startTimer(container) {
    this.timerID = null;
    const time = container.querySelector('.recording-timeline');
    const currentTime = Date.now();
    this.timerID = setInterval(() => {
      const timeStamp = new Date(Date.now() - currentTime).toTimeString().slice(3, 8);
      time.textContent = `${timeStamp}`;
    }, 1000);
  }

  stopTimer() {
    this.micElement.querySelector('.recording-timeline').textContent = '00:00';
    this.videoElement.querySelector('.recording-timeline').textContent = '00:00';
    clearInterval(this.timerID);
    this.timerID = null;
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
                      content: '00:00',
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
                      content: '00:00',
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
