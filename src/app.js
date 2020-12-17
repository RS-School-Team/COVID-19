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

  render() {
    Object.keys(this.components).forEach(component => {
      if (this.components[component].render) {
        this.components[component].render(this.app);
      }
    });
  }

  start() {
    this.app.addEventListener('click', clicked => {
      const { target } = clicked;
      if (findTarget(target, 'click')) {
        const { action, name } = findTarget(target, 'click');
        this.events.dispatchEvent(action.toString(), name.toString());
      }
    });
  }
}

export default App;
