import { create } from '../../helper';

class Button {
  constructor(name, action, classTag, text) {
    this.name = name;
    this.class = classTag;
    this.action = action;
    this.text = text || name;
    this.tag = this.render();
  }

  render() {
    this.buttonTag = create(
      'button',
      `btn ${this.class}`,
      this.text,
      null,
      ['click', this.action],
      ['name', this.name]
    );
    return this.buttonTag;
  }

  setIcon(icon, format) {
    const image = new Image();
    switch (`${format}`) {
      case 'svg':
        this.tag.innerHTML = icon;
        break;
      default:
        image.src = icon;
        this.tag.innerHTML = '';
        this.tag.appendChild(image);
    }
  }

  setText(text) {
    this.tag.innerHTML = text;
  }
}

export default Button;
