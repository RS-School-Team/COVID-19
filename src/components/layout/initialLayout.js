import * as helper from '../../helper';
import Component from '../component';

export default class InitialLayout extends Component {
  init(appTag) {
    this.mainContainer = helper.create('main', 'container-fluid row');
    this.infoContainer = helper.create(
      'div',
      'table-chart__container col-lg-4 col-md-12 py-3',
      null,
      this.mainContainer
    );
    this.chartContainer = helper.create(
      'div',
      'chart__container border border-dark',
      null,
      this.infoContainer
    );
    this.mapCasesContainer = helper.create(
      'div',
      'col-lg-8 col-md-12 map-cases__container py-3',
      null,
      this.mainContainer
    );
    this.mapContainer = helper.create('div', 'map__container', null, this.mapCasesContainer);
    appTag.appendChild(this.mainContainer);
  }

  render() {
    this.mainContainer = helper.create('main', 'container-fluid row');
  }
}
