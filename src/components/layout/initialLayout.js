import * as helper from '../../helper';
import Component from '../component';
import Button from '../../elements';

export default class InitialLayout extends Component {
  init(appTag) {
    this.fullScreenBtnMap = new Button('map', 'fullScreen', 'btn full-screen__button', 'X');
    this.fullScreenBtnMap.setIcon(this.state.image[0]);
    this.fullScreenBtnChart = new Button('chart', 'fullScreen', 'btn full-screen__button', 'X');
    this.fullScreenBtnChart.setIcon(this.state.image[0]);
    this.mainContainer = helper.create('main', 'container-fluid row');
    this.infoContainer = helper.create(
      'div',
      'table-chart__container col-lg-4 col-md-12 py-3 d-lg-flex flex-column justify-content-between',
      null,
      this.mainContainer
    );
    this.chartContainer = helper.create(
      'div',
      'chart__container border border-dark py-1',
      this.fullScreenBtnChart.tag,
      this.infoContainer
    );
    this.mapCasesContainer = helper.create(
      'div',
      'col-lg-8 col-md-12 map-cases__container py-3 d-lg-flex flex-column-reverse justify-content-end',
      null,
      this.mainContainer
    );
    this.mapContainer = helper.create(
      'div',
      'map__container',
      this.fullScreenBtnMap.tag,
      this.mapCasesContainer
    );
    appTag.appendChild(this.mainContainer);
    this.events.addEventList('fullScreen', [helper.fullScreenSwitcher]);
  }

  render() {
    this.mainContainer = helper.create('main', 'container-fluid row');
  }
}
