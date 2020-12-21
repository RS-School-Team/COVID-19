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
    this.flag.style.display = 'none';
    this.countryName = helper.create('h6', null, 'Global');
    const datasetArray = [
      [0, 'confirmed death recovered'],
      [3, 'confirmedPOHT deathPOHT recoveredPOHT'],
      [6, 'newConfirmed newDeath newRecovered'],
      [9, 'newConfirmedPOHT newDeathPOHT newRecoveredPOHT'],
    ];
    this.tabArr = datasetArray.map(elem => {
      const [name, linked] = elem;
      const [, tabHeader] = this.state.data.sortTypes[name];
      return helper.create(
        'li',
        'nav-link',
        tabHeader.replace('Confirmed', 'Cases'),
        null,
        ['click', 'sortChanged'],
        ['name', name],
        ['linked', linked]
      );
    });
    const fullScreenButton = new Button(
      'country-cases',
      'fullScreen',
      'btn full-screen__button',
      'X'
    );
    this.casesContainer = helper.create('div', 'country-cases__container', [
      helper.create('ul', 'nav nav-tabs', [...this.tabArr]),
      fullScreenButton.tag,
      helper.create('div', 'cases__table py-3 border border-dark d-flex justify-around', [
        helper.create('div', 'country-cases__header', [this.flag, this.countryName]),
      ]),
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
    const globalCases = this.dataList.reduce((acc, country) => acc + country.confirmed, 0);
    const globalDeath = this.dataList.reduce((acc, country) => acc + country.death, 0);
    const globalRecovered = this.dataList.reduce((acc, country) => acc + country.recovered, 0);
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
    casesAmount.append(this.casesContainer, this.deathContainer, this.recoveredContainer);
    this.container.append(casesAmount);
    this.changeStats([]);
  }

  showStats(indexArray) {
    const [index] = indexArray;
    if (!index) {
      this.country = this.state.worldData;
      this.countryName.innerText = 'Global';
      this.flag.style.display = 'none';
    } else {
      this.country = this.state.countriesList[index];
      this.flag.src = this.country.flag;
      this.flag.style.display = '';
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
    this.tabArr.map(elem =>
      elem.dataset.linked.split(' ').includes(sort)
        ? elem.classList.add('active')
        : elem.classList.remove('active')
    );
    this.cases.innerText = this.country[sort];
    this.death.innerText = this.country[`${pref}${pref ? 'D' : 'd'}eath${suff}`];
    this.recovered.innerText = this.country[`${pref}${pref ? 'R' : 'r'}ecovered${suff}`];
  }
}
