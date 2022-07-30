import Button from '../../elements';
import { create } from '../../helper';
import Component from '../component';
import './footer.scss';

class Footer extends Component {
  constructor() {
    super();
    this.name = 'footer';
  }

  init(appTag) {
    const openButton = new Button(
      'switcher',
      'footerSwitch',
      'text-right footer__button-opener',
      'footer'
    );
    this.tag = create('div', 'footer__container', [openButton.tag], appTag);
    this.row = create('div', 'footer__row row-fluid', null, this.tag);
    create('span', 'footer-year', null, null, '2020');
    const linksArr = [
      ['803142', 'https://github.com/803142', 'github'],
      ['diana-valeeva', 'https://github.com/diana-valeeva', 'github'],
      ['shadezp', 'https://github.com/shadezp', 'github'],
      ['RSSchool', 'https://rs.school/js/', 'rs_school_js'],
    ];
    linksArr.forEach(link => {
      const [name, href, icon] = link;
      create(
        'a',
        'btn',
        this.state.icons.getIcon(icon, 'svg'),
        this.row,
        ['href', href],
        ['title', name],
        ['target', '_blank']
      );
    });
    create('span', 'footer-year', '2020', this.row);
    this.events.addEventList('footerSwitch', [this.show.bind(this)]);
  }

  show() {
    this.tag.classList.toggle('show');
  }
}

export default Footer;
