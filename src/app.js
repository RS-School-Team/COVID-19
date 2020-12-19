import Component from './components/component';
import Components from './components';
import { findTarget } from './helper';

class App extends Component {
  constructor(appTag) {
    super();
    this.app = appTag;
    this.components = new Components();
  }

  init() {
    this.state.setAppName(this.app.className);
    this.state.getLocalStorage();

    Object.keys(this.components).forEach(component => this.components[component].init(this.app));
  }

  start() {
    this.app.addEventListener('click', clicked => {
      const { target } = clicked;
      if (findTarget(target, 'click')) {
        const { action, name } = findTarget(target, 'click');
        this.events.dispatchEvent(action.toString(), name.toString());
      }
    });
    this.app.addEventListener('change', clicked => {
      const { target } = clicked;
      if (findTarget(target, 'change')) {
        const { action } = findTarget(target, 'change');
        const name = target.value;
        // const index = target.selectedIndex;
        this.events.dispatchEvent(action.toString(), name.toString());
      }
    });
    this.app.addEventListener('input', clicked => {
      const { target } = clicked;
      if (findTarget(target, 'input')) {
        const { action } = findTarget(target, 'input');
        const name = target.value;
        this.events.dispatchEvent(action.toString(), name.toString());
      }
    });
  }
}

export default App;
