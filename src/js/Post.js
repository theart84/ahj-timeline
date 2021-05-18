export default class Post {
  constructor(message, coordinates) {
    this.message = message;
    this.coordinates = coordinates;
  }

  markup() {
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
          content: {
            type: 'div',
            attr: {
              class: ['post__text'],
            },
            content: this.message,
          },
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
