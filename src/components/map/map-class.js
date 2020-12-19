import charts from 'map';
import { simpleTag } from '../../helper';
import Component from '../component';
import './map-style.scss';

class Map extends Component {
  constructor() {
    super();
    this.map = charts;
  }

  init(containerTag) {
    this.container = containerTag;
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
  }

  redrowMap(parameters) {
    const gettedParameters = [...parameters];
    this.state.sortTypes = [['confirmed', 'Number of cases']];
    const [index = 0] = gettedParameters;
    let [sortType, sortName] = this.state.sortTypes[index];
    if (!sortName) sortName = 'Number of cases';
    if (!sortType) sortType = 'totalConfirmed';
    this.map.setOnLoadCallback(this.drawRegionsMap.bind(this, sortType, sortName));
  }

  drawRegionsMap(sortType, sortName) {
    const cases = [];
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

  countryClicked() {
    const [result] = this.charty.getSelection();
    if (result) {
      const { row } = result;
      this.events.dispatchEvent('countryChoosed', row);
    }
  }
}
export default Map;
