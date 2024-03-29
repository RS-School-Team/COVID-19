import * as helper from '../../helper';
import Component from '../component';
import Button from '../../elements';

export default class CountryCasesTable extends Component {
  constructor() {
    super();
    this.allCases = true;
  }

  init() {
    this.flag = helper.create('img', 'country-cases__flag');
    this.flag.classList.add('hidden');
    this.countryName = helper.create('h6', null, 'Global');
    const datasetArray = [
      [0, 'confirmed death recovered'],
      [3, 'confirmedPOHT deathPOHT recoveredPOHT'],
      [6, 'newConfirmed newDeath newRecovered'],
      [9, 'newConfirmedPOHT newDeathPOHT newRecoveredPOHT'],
    ];
    this.tabArr = datasetArray.map((elem) => {
      const [name, linked] = elem;
      const [, tabHeader] = this.state.data.sortTypes[name];
      return helper.create(
        'li',
        'nav-link',
        tabHeader.replace('Confirmed', '').replace('Population', ''),
        null,
        ['click', 'sortChanged'],
        ['name', name],
        ['linked', linked]
      );
    });
    const fullScreenButton = new Button(
      'country-cases',
      'fullScreen',
      'btn btn-outline-secondary full-screen__button'
    );
    fullScreenButton.setIcon(this.state.image[0]);
    this.date = helper.create('h5', 'data-date');
    this.casesContainer = helper.create('div', 'country-cases__container mb-1', [
      helper.create('ul', 'nav nav-tabs', [...this.tabArr]),
      fullScreenButton.tag,
      helper.create(
        'div',
        'cases__table py-3 border border-dark d-flex flex-column flex-lg-row justify-around',
        [helper.create('div', 'country-cases__header', [this.date, this.flag, this.countryName])]
      ),
    ]);
    this.events.addEventList('dataByCountryGot', [this.render.bind(this)]);
    this.events.addEventList('countryChoosed', [this.showStats.bind(this)]);
    this.events.addEventList('sortChanged', [this.changeStats.bind(this)]);
  }

  render() {
    this.initTable();
  }

  initTable() {
    this.mapCasesContainer = document.querySelector('.map-cases__container');
    this.mapCasesContainer.append(this.casesContainer);
    this.container = document.querySelector('.cases__table');
    this.dataList = Array.from(this.state.countriesList);
    const globalCases = this.state.worldData.confirmed;
    const globalDeath = this.state.worldData.death;
    const globalRecovered = this.state.worldData.recovered;
    const casesAmount = helper.create('div', 'cases__amount');
    this.cases = helper.create(
      'span',
      'count-global-cases cases__table__count confirmed',
      globalCases.toString()
    );
    this.death = helper.create(
      'span',
      'count-global-cases cases__table__count font-weight-bold death',
      globalDeath.toString()
    );
    this.recovered = helper.create(
      'span',
      'count-global-cases cases__table__count font-weight-bold recovered',
      globalRecovered.toString()
    );
    this.casesContainer = helper.create('div', null, [
      helper.create('span', 'cases__table__header confirmed', 'Confirmed: '),
      this.cases,
    ]);
    this.deathContainer = helper.create('div', null, [
      helper.create('span', 'cases__table__header death', 'Death: '),
      this.death,
    ]);
    this.recoveredContainer = helper.create('div', null, [
      helper.create('span', 'cases__table__header recovered', 'Recovered: '),
      this.recovered,
    ]);
    const dataArr = this.state.worldData.chartData.dates;
    const dateInner = new Date(dataArr[dataArr.length - 1]);
    this.date.innerText = `${dateInner.toLocaleDateString()}`;
    casesAmount.append(this.casesContainer, this.deathContainer, this.recoveredContainer);
    this.container.append(casesAmount);
    this.changeStats([]);
  }

  showStats(indexArray) {
    const [index] = indexArray;
    if (!index) {
      this.country = this.state.worldData;
      this.countryName.innerText = 'Global';
      this.flag.classList.add('hidden');
    } else {
      this.country = this.state.countriesList[index];
      this.flag.src = this.country.flag;
      this.flag.classList.remove('hidden');
      this.countryName.innerText = this.country.name;
    }
  }

  changeStats(indexArray) {
    let [index] = indexArray;
    if (!index) {
      index = 0;
    }
    if (!this.country) {
      this.country = this.state.worldData;
    }
    const [sort] = this.state.data.sortTypes[index];
    const pref = sort.match('new') ? 'new' : '';
    const suff = sort.match('POHT') ? 'POHT' : '';
    this.tabArr.map((elem) =>
      elem.dataset.linked.split(' ').includes(sort)
        ? elem.classList.add('active')
        : elem.classList.remove('active')
    );
    this.cases.innerText = this.country[sort];
    this.death.innerText = this.country[`${pref}${pref ? 'D' : 'd'}eath${suff}`];
    this.recovered.innerText = this.country[`${pref}${pref ? 'R' : 'r'}ecovered${suff}`];
  }
}
