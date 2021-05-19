export default class Post {
  constructor(type, message, coordinates) {
    this.type = type;
    this.message = message;
    this.coordinates = coordinates;
  }

  markup() {
    let typeContent = {};
    if (this.type === 'audio') {
      typeContent = {
        type: 'audio',
        attr: {
          class: ['post__audio'],
          src: this.message,
          controls: '',
        },
        content: '',
      };
    } else if (this.type === 'video') {
      typeContent = {
        type: 'video',
        attr: {
          class: ['post__video'],
          src: this.message,
          controls: '',
        },
        content: '',
      };
    } else {
      typeContent = {
        type: 'div',
        attr: {
          class: ['post__text'],
        },
        content: this.message,
      };
    }
    const sourceDate = new Date();
    const date = `${sourceDate.toLocaleDateString()} ${sourceDate
      .toLocaleTimeString()
      .slice(0, 5)}`;
    return {
      type: 'div',
      attr: {
        class: ['post'],
        'data-post-id': Date.now(),
      },
      content: [
        {
          type: 'div',
          attr: {
            class: ['post__header'],
          },
          content: date,
        },
        {
          type: 'div',
          attr: {
            class: ['post__body'],
          },
          content: typeContent,
        },
        {
          type: 'div',
          attr: {
            class: ['post__coordinates'],
          },
          content: [
            {
              type: 'span',
              attr: {
                class: ['post__icon'],
              },
              content: '',
            },
            {
              type: 'span',
              attr: {
                class: ['post__description'],
              },
              content: this.coordinates,
            },
          ],
        },
      ],
    };
  }
}
