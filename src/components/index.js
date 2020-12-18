import GetData from './getData/GetData';
import Map from './map';

class Components {
  constructor() {
    this.getData = new GetData();
    this.map = new Map();
  }
}

export default Components;
