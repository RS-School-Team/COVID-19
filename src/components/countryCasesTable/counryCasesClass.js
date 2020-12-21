import * as helper from '../../helper';
import Component from '../component';

export default class CountryCasesTable extends Component {
  init() {
    this.events.addEventList('dataByCountryGot', [this.render.bind(this)]);
    this.events.addEventList('countryChoosed', [this.showStats.bind(this)]);
  }

  render() {
    this.initTable();
  }

  initTable() {
    this.mapCasesContainer = document.querySelector('.map-cases__container');
    this.flag = helper.create('img', 'country-cases__flag');
    this.flag.style.display = 'none';
    this.countryName = helper.create('h6', null, 'Global');
    this.casesContainer = helper.create(
      'div',
      'country-cases',
      [
        helper.create('ul', 'nav nav-tabs nav-fill', [
          helper.create('li', 'nav-link active', 'All Time'),
          helper.create('li', 'nav-link', 'Last Day'),
        ]),
        helper.create('ul', 'nav nav-tabs nav-fill', [
          helper.create('li', 'nav-link active', 'All Cases'),
          helper.create('li', 'nav-link', 'Per 100,000 Population'),
        ]),
        helper.create('div', 'cases__table py-3 border border-dark', [
          helper.create('div', 'country-cases__header', [this.flag, this.countryName]),
        ]),
      ],
      this.mapCasesContainer
    );
    this.container = document.querySelector('.cases__table');
    this.dataList = Array.from(this.state.countriesList);
    const globalCases = this.dataList.reduce((acc, country) => acc + country.confirmed, 0);
    const globalDeath = this.dataList.reduce((acc, country) => acc + country.death, 0);
    const globalRecovered = this.dataList.reduce((acc, country) => acc + country.recovered, 0);
    this.cases = helper.create(
      'span',
      'count-global-cases cases__table__count',
      globalCases.toString()
    );
    this.death = helper.create(
      'span',
      'count-global-cases cases__table__count',
      globalDeath.toString()
    );
    this.recovered = helper.create(
      'span',
      'count-global-cases cases__table__count',
      globalRecovered.toString()
    );
    this.casesContainer = helper.create('div', null, [
      helper.create('span', 'cases__table__header', 'Confirmed '),
      this.cases,
    ]);
    this.deathContainer = helper.create('div', null, [
      helper.create('span', 'cases__table__header', 'Death '),
      this.death,
    ]);
    this.recoveredContainer = helper.create('div', null, [
      helper.create('span', 'cases__table__header', 'Recovered '),
      this.recovered,
    ]);
    this.container.append(this.casesContainer, this.deathContainer, this.recoveredContainer);
  }

  showStats(index) {
    const country = this.state.countriesList[index];
    this.flag.src = country.flag;
    this.flag.style.display = '';
    this.countryName.innerText = country.name;
    this.cases.innerText = country.confirmed;
    this.death.innerText = country.death;
    this.recovered.innerText = country.recovered;
  }
}
