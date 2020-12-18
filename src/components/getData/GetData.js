/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import Component from '../component';
import {
  getWorldDataForTable,
  createCountryList,
  getWorldDataForChart,
  createDataByCountryForChart,
} from './helper';

export default class GetData extends Component {
  constructor() {
    super();
    this.worldPopulation = 7850000000;
  }

  async init() {
    await this.getInitData();
    await this.getCountryList();
    await this.getDataByCountry(1);
    this.events.addEventList('countryChoosed', [this.getDataByCountry.bind(this)]);
    console.log(this.state);
  }

  // eslint-disable-next-line class-methods-use-this
  perOneHundredThousands(population, cases) {
    return cases / (population / 100000);
  }

  async getInitData() {
    try {
      this.worldCases = await (
        await fetch('https://api.covidtracking.com/v1/us/daily.json')
      ).json();
    } catch (e) {
      console.log(e);
    }

    if (this.worldCases) {
      this.state.worldData = getWorldDataForTable(this.worldCases);
      this.state.worldData.chartData = getWorldDataForChart(this.worldCases);
    }
    this.events.dispatchEvent('initDataGot');
  }

  async getCountryList() {
    try {
      this.data = await (await fetch('https://api.covid19api.com/summary')).json();
      this.flags = await (
        await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag')
      ).json();
    } catch (e) {
      console.log(e);
    }
    if (this.flags && this.data) {
      this.state.countriesList = createCountryList(this.flags, this.data);
    }
    this.events.dispatchEvent('countryListGot');
  }

  async getDataByCountry(index) {
    this.currentCountry = this.state.countriesList[index].slug;
    console.log(`https://api.covid19api.com/total/country/${this.currentCountry}`);
    try {
      this.currentCountryData = await (
        await fetch(`https://api.covid19api.com/total/country/${this.currentCountry}`)
      ).json();
    } catch (e) {
      console.log(e);
    }
    if (this.currentCountryData) {
      this.state.countryData = createDataByCountryForChart(
        this.currentCountryData,
        this.state.countriesList[index].population
      );
    }
    this.events.dispatchEvent('dataByCountryGot');
  }
}

/* <button class="asdf" data-click = "имя ивента которого мне надо задиспатчить"
   data-name="аргументы которые я хочу передать"></button> */

// [['key', 'название кнопки и тд'], ['dailyCasesByCountryToday', 'Daily Cases'], ['dailyCasesByCountryToday', 'Daily Cases'], ['dailyCasesByCountryToday', 'Daily Cases'], ['dailyCasesByCountryToday', 'Daily Cases'], ]
