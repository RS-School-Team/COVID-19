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
    create('span', 'footer-year', null, null, '2020');
    const githubOne = new Button();
    const githubTwo = new Button();
    const githubThree = new Button();
    const RSSButton = new Button('footer__button-opener', 'footer-switch');
    githubOne.setIcon(this.state.icons.getIcon('github'), 'svg');
    githubTwo.setIcon(this.state.icons.getIcon('github'), 'svg');
    githubThree.setIcon(this.state.icons.getIcon('github'), 'svg');
    RSSButton.setIcon(this.state.icons.getIcon('rs_school_js'), 'svg');
    this.tag = create('div', 'footer__container', [openButton.tag], appTag);
    this.row = create(
      'div',
      'footer__row row-fluid',
      [githubOne.tag, githubTwo.tag, githubThree.tag, RSSButton.tag],
      this.tag
    );
    create('span', 'footer-year', '2020', this.row);
    this.events.addEventList('footerSwitch', [this.show.bind(this)]);
  }

  show() {
    this.tag.classList.toggle('show');
  }
}

export default Footer;
