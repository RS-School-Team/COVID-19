import { simpleTag } from '../../helper';

class Button {
  constructor(name, action, classTag, text) {
    this.name = name;
    this.class = classTag;
    this.action = action;
    this.text = text || name;
    this.tag = this.render();
  }

  render() {
    this.buttonTag = simpleTag(
      {
        tagName: 'button',
        classTag: `btn ${this.class}`,
        advanced: {
          'data-click': this.action,
          'data-name': this.name,
        },
      },
      this.text
    );
    return this.buttonTag;
  }

  setIcon(icon) {
    const image = new Image();
    image.src = icon;
    this.tag.innerHTML = '';
    this.tag.appendChild(image);
  }

  setText(text) {
    this.tag.innerHTML = text;
  }
}

export default Button;
