import charts from 'map';
import { simpleTag } from '../../helper';
import Component from '../component';
import './map-style.scss';

class Map extends Component {
  constructor() {
    super();
    this.map = charts;
  }

  init() {
    this.container = document.querySelector('.map__container');
    this.map.charts.load('current', {
      packages: ['geochart'],
    });
    this.tag = simpleTag({
      classTag: 'app-map embed-responsive',
      advanced: {
        'data-click': 'mapClicked',
        'data-name': 'map',
      },
    });
    this.container.appendChild(this.tag);
    this.events.addEventList('mapClicked', [this.countryClicked.bind(this)]);
    this.events.addEventList('sortChanged', [this.redrowMap.bind(this)]);
    this.events.addEventList('dataByCountryGot', [this.redrowMap.bind(this)]);
    this.events.addEventList('countryChoosed', [this.countryChoosed.bind(this)]);
  }

  redrowMap(parameters) {
    let index = this.state.data.sortTypes.findIndex(e => e[0] === parameters.toString());
    if (index === -1) index = 0;
    const [sortType, sortName] = this.state.data.sortTypes[index];
    this.map.setOnLoadCallback(this.drawRegionsMap.bind(this, sortType, sortName));
  }

  drawRegionsMap(sortType, sortName) {
    const cases = [];
    const { countriesList } = this.state;
    if (countriesList) {
      this.state.countriesList.forEach(country => {
        const { countryCode, name } = country;
        const information = country[sortType];
        cases.push([countryCode, name, information]);
      });
      const data = this.map.visualization.arrayToDataTable([
        ['Country', 'Country Name', sortName],
        ...cases,
      ]);
      const options = {
        colorAxis: { colors: ['#3498db', '#ff7675', '#ff6b81', '#c0392b'] },
      };

      this.charty = new this.map.visualization.GeoChart(this.tag);

      this.charty.draw(data, options);
    }
  }

  countryChoosed(rowArray) {
    const [row] = rowArray;
    this.charty.setSelection([{ row }]);
  }

  countryClicked() {
    const [result] = this.charty.getSelection();
    if (result) {
      const { row } = result;
      this.events.dispatchEvent('countryChoosed', row);
    }
  }
}
export default Map;
