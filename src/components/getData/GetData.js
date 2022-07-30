/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import Component from '../component';
import {
  getWorldDataForTable,
  createCountryList,
  getWorldDataForChart,
  createDataByCountryForChart,
} from './helper';

// eslint-disable-next-line consistent-return
async function extraFetch(url) {
  const requestOptions = {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  };
  try {
    const proxyurl = 'https://thingproxy.freeboard.io/fetch/';
    const response = await fetch(proxyurl + url, requestOptions);
    const cases = await response.json();
    return cases;
  } catch (e) {
    console.log(e);
  }
}

export default class GetData extends Component {
  constructor() {
    super();
    this.worldPopulation = 7850000000;
  }

  async init() {
    await this.getInitData();

    this.events.dispatchEvent('initDataGot');

    await this.getCountryList();

    this.events.addEventList('countryChoosed', [this.getDataByCountry.bind(this)]);
  }

  async getInitData() {
    try {
      this.worldCasesForChart = await (
        await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=366')
      ).json();
      this.worldCases = await (await fetch('https://api.covid19api.com/summary')).json();
    } catch (e) {
      this.worldCases = await extraFetch('http://api.covid19api.com/summary');
    }

    if (Array.isArray(this.worldCases.Countries)) {
      if (this.worldCases.Message === 'Caching in progress') {
        // eslint-disable-next-line no-alert
        alert('Извините, API не работает, попробуйте позднее');
        throw new Error('проблемы с https://api.covid19api.com/summary');
      }
      this.state.worldData = getWorldDataForTable(this.worldCases);
      this.state.worldData.chartData = getWorldDataForChart(this.worldCasesForChart);
    }
  }

  async getCountryList() {
    this.flags = this.state.countries.filter((countrie) => countrie.population);
    if (Array.isArray(this.flags) && Array.isArray(this.worldCases.Countries)) {
      if (this.worldCases.Message === 'Caching in progress') {
        // eslint-disable-next-line no-alert
        alert('Извините, API не работает, попробуйте позднее');
        throw new Error('проблемы с https://api.covid19api.com/summary');
      }
      this.state.countriesList = createCountryList(this.flags, this.worldCases);
      this.events.dispatchEvent('dataByCountryGot');
    }
  }

  async getDataByCountry(indexArr) {
    const [index] = indexArr;
    if (index) {
      this.currentCountry = this.state.countriesList[index].slug;
      try {
        this.currentCountryData = await (
          await fetch(`https://api.covid19api.com/total/country/${this.currentCountry}`)
        ).json();
      } catch (e) {
        this.currentCountryData = await extraFetch(
          `http://api.covid19api.com/total/country/${this.currentCountry}`
        );
      }
      if (this.currentCountryData) {
        this.state.countryData = createDataByCountryForChart(
          this.currentCountryData,
          this.state.countriesList[index].population
        );
      }
      console.log('dataCountryGot');
      this.events.dispatchEvent('dataCountryGot');
    }
  }
}

/* <button class="asdf" data-click = "имя ивента которого мне надо задиспатчить"
   data-name="аргументы которые я хочу передать"></button> */

// [['key', 'название кнопки и тд'], ['dailyCasesByCountryToday', 'Daily Cases'], ['dailyCasesByCountryToday', 'Daily Cases'], ['dailyCasesByCountryToday', 'Daily Cases'], ['dailyCasesByCountryToday', 'Daily Cases'], ]
