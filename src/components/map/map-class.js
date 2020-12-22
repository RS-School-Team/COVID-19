import charts from 'map';
import { create } from '../../helper';
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
    this.tag = create(
      'div',
      'app-map embed-responsive col-lg-10 col-xl-10',
      null,
      this.container,
      ['click', 'mapClicked'],
      ['name', 'map']
    );
    this.events.addEventList('mapClicked', [this.countryClicked.bind(this)]);
    this.events.addEventList('sortChanged', [this.sortChanged.bind(this)]);
    this.events.addEventList('dataByCountryGot', [this.firstStart.bind(this)]);
    this.events.addEventList('countryChoosed', [this.countryChoosed.bind(this)]);
    this.events.addEventList('windowResized', [this.drawMap.bind(this)]);
    this.events.addEventList('fullScreen', [this.drawMap.bind(this)]);
  }

  firstStart() {
    this.setOptions();
    this.setSortType();
    this.setRegion();
    this.setDataArray();
    this.map.setOnLoadCallback(this.drawRegionsMap.bind(this));
  }

  setSortType(index) {
    const [firstSortType] = this.state.data.sortTypes;
    let [sortType, sortName] = firstSortType;
    if (index) {
      const [sortTypeByIndex, sortNameByIndex] = this.state.data.sortTypes[index];
      sortType = sortTypeByIndex;
      sortName = sortNameByIndex;
    }
    this.sortType = sortType;
    this.sortName = sortName;
  }

  setOptions() {
    this.options = {
      colorAxis: { colors: ['#3498db', '#ff7675', '#ff6b81', '#c0392b'] },
    };
  }

  setRegion(index) {
    this.options.region = 'world';
    if (index) {
      const { countryCode } = this.state.countriesList[index];
      this.options.region = countryCode;
    }
  }

  setDataArray() {
    const { countriesList } = this.state;
    this.dataArray = countriesList.map(country => {
      const { countryCode, name } = country;
      const information = country[this.sortType];
      return [countryCode, name, information];
    });
  }

  drawRegionsMap() {
    this.setOptions();
    this.setData();
    this.charty = new this.map.visualization.GeoChart(this.tag);
    this.drawMap();
  }

  setData() {
    this.data = this.map.visualization.arrayToDataTable([
      ['Country', 'Country Name', this.sortName],
      ...this.dataArray,
    ]);
  }

  drawMap() {
    this.charty.draw(this.data, this.options);
  }

  sortChanged(parameters) {
    let index = 0;
    if (parameters) {
      const [indexFromParameters] = parameters;
      if (indexFromParameters) index = indexFromParameters;
    }
    this.setSortType(index);
    this.setDataArray();
    this.setData();
    this.drawMap();
  }

  countryChoosed(rowArray) {
    const [row] = rowArray;
    this.setRegion(row);
    this.setData();
    this.drawMap();
  }

  countryClicked() {
    const [result] = this.charty.getSelection();
    if (result) {
      const { row } = result;
      this.events.dispatchEvent('countryChoosed', row);
    } else {
      this.events.dispatchEvent('countryChoosed');
    }
  }
}
export default Map;
