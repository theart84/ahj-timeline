import eventBus from './EventBus';

export default class Recorder {
  constructor(type) {
    this.type = type;
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
  }

  async init() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: this.type !== 'audio',
      });
      this.recorder = new MediaRecorder(this.stream);
      this.registerEvents();
    } catch (e) {
      console.error(e);
    }
  }

  registerEvents() {
    this.recorder.addEventListener('dataavailable', (evt) => this.chunks.push(evt.data));
    this.recorder.addEventListener('stop', () => {
      const blob = new Blob(this.chunks);
      const source = URL.createObjectURL(blob);
      if (this.cancel) {
        return;
      }
      eventBus.emit('received-link', source);
    });
  }

  start() {
    this.recorder.start(1000);
  }

  stop() {
    this.recorder.stop();
    this.stream.getTracks().forEach((track) => track.stop());
  }

  cancelStream() {
    this.cancel = true;
    this.stop();
  }
}
