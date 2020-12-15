import events from './eventlistener';
import storage from './storage';

class Component {
  constructor() {
    this.events = events;
    this.state = storage;
  }
}

export default Component;
