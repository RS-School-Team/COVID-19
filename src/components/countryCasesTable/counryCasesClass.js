import * as helper from '../../helper';
import Component from '../component';

export default class CountryCasesTable extends Component {
  constructor() {
    super();
    this.allCases = true;
  }

  init() {
    this.flag = helper.create('img', 'country-cases__flag');
    this.flag.style.display = 'none';
    this.countryName = helper.create('h6', null, 'Global');
    this.tabArr = [
      helper.create(
        'li',
        'nav-link active',
        'All Cases',
        null,
        ['click', 'sortChanged'],
        ['name', 'confirmed'],
        ['linked', 'confirmed death recovered']
      ),
      helper.create(
        'li',
        'nav-link',
        'Last Day Cases',
        null,
        ['click', 'sortChanged'],
        ['name', 'newConfirmed'],
        ['linked', 'newConfirmed newDeath newRecovered']
      ),
      helper.create(
        'li',
        'nav-link',
        'All Cases Per 100,000 Population',
        null,
        ['click', 'sortChanged'],
        ['name', 'confirmedPOHT'],
        ['linked', 'confirmedPOHT deathPOHT recoveredPOHT']
      ),
      helper.create(
        'li',
        'nav-link',
        'Last Day Cases Per 100,000 Population',
        null,
        ['click', 'sortChanged'],
        ['name', 'newConfirmedPOHT'],
        ['linked', 'newConfirmedPOHT newDeathPOHT newRecoveredPOHT']
      ),
    ];
    this.casesContainer = helper.create('div', 'country-cases', [
      helper.create('ul', 'nav nav-tabs', [...this.tabArr]),
      helper.create('div', 'cases__table py-3 border d-flex justify-around', [
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
  }

  showStats(index) {
    this.country = this.state.countriesList[index];
    this.flag.src = this.country.flag;
    this.flag.style.display = '';
    this.countryName.innerText = this.country.name;
  }

  changeStats(sortType) {
    if (!this.country) {
      this.country = this.state.worldData;
      this.countryName.innerText = 'Global';
    }
    const sort = sortType.toString();
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
