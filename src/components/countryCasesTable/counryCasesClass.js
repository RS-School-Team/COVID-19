import * as helper from '../../helper';
import Component from '../component';

export default class CountryCasesTable extends Component {
  constructor() {
    super();
    this.isAllTime = true;
    this.isAllCases = true;
  }

  init() {
    this.flag = helper.create('img', 'country-cases__flag');
    this.flag.style.display = 'none';
    this.countryName = helper.create('h6', null, 'Global');
    this.allTimeTab = helper.create(
      'li',
      'nav-link active',
      'All Time',
      null,
      ['click', 'sortChanged'],
      ['name', 'confirmed']
    );
    this.lastDayTab = helper.create(
      'li',
      'nav-link',
      'Last Day',
      null,
      ['click', 'sortChanged'],
      ['name', 'newConfirmed']
    );
    this.allCasesTab = helper.create(
      'li',
      'nav-link active',
      'All Cases',
      null,
      ['click', 'sortChanged'],
      ['name', 'confirmed']
    );
    this.casesPOHTTab = helper.create(
      'li',
      'nav-link',
      'Per 100,000 Population',
      null,
      ['click', 'sortChanged'],
      ['name', 'confirmedPOHT']
    );
    this.casesContainer = helper.create('div', 'country-cases', [
      helper.create('ul', 'nav nav-tabs', [this.allTimeTab, this.lastDayTab]),
      helper.create('ul', 'nav nav-tabs', [this.allCasesTab, this.casesPOHTTab]),
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
    console.log(this.country);
    if (sortType.toString().match('new')) {
      this.isAllTime = false;
      if (sortType.toString().match('POHT')) {
        this.isAllCases = false;
      } else {
        this.isAllCases = true;
      }
    } else {
      this.isAllTime = true;
      if (sortType.toString().match('POHT')) {
        this.isAllCases = false;
      } else {
        this.isAllCases = true;
      }
    }
    if (this.isAllTime) {
      this.allTimeTab.classList.add('active');
      this.lastDayTab.classList.remove('active');
      if (this.isAllCases) {
        this.allCasesTab.classList.add('active');
        this.casesPOHTTab.classList.remove('active');
        this.cases.innerText = this.country.confirmed;
        this.death.innerText = this.country.death;
        this.recovered.innerText = this.country.recovered;
      } else {
        this.allCasesTab.classList.remove('active');
        this.casesPOHTTab.classList.add('active');
        this.cases.innerText = this.country.confirmedPOHT;
        this.death.innerText = this.country.deathPOHT;
        this.recovered.innerText = this.country.recoveredPOHT;
      }
    } else {
      this.lastDayTab.classList.add('active');
      this.allTimeTab.classList.remove('active');
      if (this.isAllCases) {
        this.allCasesTab.classList.add('active');
        this.casesPOHTTab.classList.remove('active');
        this.cases.innerText = this.country.newConfirmed;
        this.death.innerText = this.country.newDeath;
        this.recovered.innerText = this.country.newRecovered;
      } else {
        this.allCasesTab.classList.remove('active');
        this.casesPOHTTab.classList.add('active');
        this.cases.innerText = this.country.newConfirmedPOHT;
        this.death.innerText = this.country.newDeathPOHT;
        this.recovered.innerText = this.country.newRecoveredPOHT;
      }
    }
    console.log(this.isAllTime, this.isAllCases);
  }
}
