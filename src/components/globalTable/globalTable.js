import * as helper from '../../helper';
import Component from '../component';

export default class GlobalCasesTable extends Component {
  init() {
    this.tableNav = helper.create('select', 'form-control', null, null, ['change', 'sortChanged']);
    this.createTableNav();
    this.input = helper.create(
      'input',
      'input-group input-group-lg my-1 form-control',
      null,
      this.tableContainer,
      ['type', 'text'],
      ['placeholder', 'Country'],
      ['input', 'startSearch']
    );
    this.tableList = helper.create('div', 'list-group list-group-flush global-cases__table');
    this.tableContainer = helper.create('div', 'country-table border border-dark pt-2 mb-2');
    this.tableContainer.append(
      helper.create('h6', 'text-center', 'Cases by country'),
      this.tableNav,
      this.input,
      this.tableList
    );
    document
      .querySelector('.table-chart__container')
      .insertAdjacentElement('afterbegin', this.tableContainer);
    this.events.addEventList('dataByCountryGot', [this.sort.bind(this)]);
    this.events.addEventList('dataByCountryGot', [this.render.bind(this)]);
  }

  render() {
    this.events.addEventList('sortChanged', [this.sort.bind(this)]);
    this.events.addEventList('startSearch', [this.search.bind(this)]);
    this.events.addEventList('countryChoosed', [this.valueChange.bind(this)]);
  }

  sort(name) {
    let [sortType] = name;
    if (!sortType) {
      sortType = 'confirmed';
    }
    this.dataList = Array.from(this.state.countriesList).sort((a, b) => b[sortType] - a[sortType]);
    this.tableList = document.querySelector('.global-cases__table');
    this.buttonsList = this.dataList.map(country => {
      const img = helper.create('img', 'flag border img-fluid', null, null, ['src', country.flag]);
      const cases = helper.create('span', 'country-count mx-3', country[sortType].toString());
      if (sortType.includes('Death')) {
        cases.style.color = 'red';
      } else if (sortType.includes('Recovered')) {
        cases.style.color = 'green';
      } else {
        cases.style.color = 'black';
      }
      const countryName = helper.create('span', 'country-name', country.name);
      return helper.create(
        'button',
        'list-group-item list-group-item-action',
        [img, cases, countryName],
        this.tableListContainer,
        ['name', this.state.countriesList.indexOf(country)],
        ['click', 'countryChoosed']
      );
    });
    this.tableList.innerHTML = '';
    this.tableList.append(...this.buttonsList);
    this.tableNav.value = sortType;
    this.search(this.input.value);
  }

  createTableNav() {
    this.state.data.sortTypes.map(elem =>
      helper.create(
        'option',
        'dropdown-item',
        elem[1],
        this.tableNav,
        ['name', elem[0]],
        ['value', elem[0]]
      )
    );
  }

  search(value) {
    const searchVal = new RegExp(value.toString().trim(), 'i');
    this.buttonsList.forEach(button => {
      if (!button.textContent.match(searchVal)) {
        // eslint-disable-next-line no-param-reassign
        button.style.display = 'none';
      } else {
        // eslint-disable-next-line no-param-reassign
        button.style.display = '';
      }
    });
  }

  valueChange(index) {
    this.input.value = this.state.countriesList[index].name;
    this.search(this.input.value);
  }
}
