import Button from '../../elements';
import { create } from '../../helper';
import Component from '../component';

class Footer extends Component {
  constructor() {
    super();
    this.name = 'footer';
  }

  init(appTag) {
    const openButton = new Button();
    openButton.setIcon(this.state.icons.getIcon('rs_school_js'), 'svg');
    this.tag = create('div', 'footer__container', [openButton.tag], appTag);
  }
}

export default Footer;
