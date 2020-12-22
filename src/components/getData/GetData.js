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

    if (this.worldCases) {
      this.state.worldData = getWorldDataForTable(this.worldCases);
      this.state.worldData.chartData = getWorldDataForChart(this.worldCasesForChart);
    }
  }

  async getCountryList() {
    try {
      this.flags = await (
        await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag')
      ).json();
    } catch (e) {
      console.log(e);
    }
    if (this.flags && this.worldCases) {
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
      this.events.dispatchEvent('dataCountryGot');
    }
  }
}

/* <button class="asdf" data-click = "имя ивента которого мне надо задиспатчить"
   data-name="аргументы которые я хочу передать"></button> */

// [['key', 'название кнопки и тд'], ['dailyCasesByCountryToday', 'Daily Cases'], ['dailyCasesByCountryToday', 'Daily Cases'], ['dailyCasesByCountryToday', 'Daily Cases'], ['dailyCasesByCountryToday', 'Daily Cases'], ]
