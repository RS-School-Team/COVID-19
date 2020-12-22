import * as helper from '../../helper';
import Component from '../component';
import Button from '../../elements';

export default class GlobalCasesTable extends Component {
  init() {
    this.tableNav = helper.create('select', 'form-control', null, null, ['change', 'sortChanged']);
    this.createTableNav();
    this.input = helper.create(
      'input',
      'form-control',
      null,
      this.tableContainer,
      ['type', 'text'],
      ['placeholder', 'Search Country'],
      ['input', 'startSearch']
    );
    this.inputGroup = helper.create('div', 'input-group my-1', [
      this.input,
      helper.create(
        'div',
        'input-group-append',
        helper.create(
          'button',
          'btn btn-outline-secondary',
          'Reset',
          null,
          ['type', 'button'],
          ['click', 'countryChoosed'],
          ['alt', 'Reset'],
          ['name', '']
        )
      ),
    ]);

    this.tableList = helper.create('div', 'list-group list-group-flush global-cases__table');
    const fullScreenBtn = new Button(
      'country-table',
      'fullScreen',
      'btn btn-outline-secondary full-screen__button'
    );
    fullScreenBtn.setIcon(this.state.image[0]);
    this.tableContainer = helper.create(
      'div',
      'country-table__container border border-dark pt-2 mb-2',
      fullScreenBtn.tag
    );
    this.tableContainer.append(
      helper.create('h6', 'text-center', 'Cases by countries'),
      this.tableNav,
      this.inputGroup,
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

  sort(indexArray) {
    let [index] = indexArray;
    if (!index) {
      index = 0;
    }
    this.tableNav[index].selected = true;
    const [sortType] = this.state.data.sortTypes[index];
    this.dataList = Array.from(this.state.countriesList).sort((a, b) => b[sortType] - a[sortType]);
    this.tableList = document.querySelector('.global-cases__table');
    this.buttonsList = this.dataList.map(country => {
      const img = helper.create('img', 'flag border img-fluid', null, null, ['src', country.flag]);
      const cases = helper.create('span', 'country-count mx-1', country[sortType].toString());
      if (sortType.includes('eath')) {
        cases.style.color = 'red';
      } else if (sortType.includes('ecovered')) {
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
    this.search(this.input.value);
  }

  createTableNav() {
    this.state.data.sortTypes.map((elem, index) =>
      helper.create(
        'option',
        'dropdown-item',
        elem[1],
        this.tableNav,
        ['name', elem[0]],
        ['value', index]
      )
    );
  }

  search(value) {
    const searchVal = new RegExp(value.toString().trim(), 'i');
    this.buttonsList.forEach(button => {
      if (!button.textContent.match(searchVal)) {
        button.classList.add('hidden');
      } else {
        button.classList.remove('hidden');
      }
    });
  }

  valueChange(indexArray) {
    const [index] = indexArray;
    if (!index) {
      this.input.value = '';
      this.events.dispatchEvent('sortChanged');
    } else {
      this.input.value = this.state.countriesList[index].name;
      this.search(this.input.value);
    }
  }
}
