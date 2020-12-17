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
  }

  async getDataByCountry(index) {
    console.log(this.state.countriesList);
    this.currentCountry = this.state.countriesList[index].slug;
    console.log(`https://api.covid19api.com/total/country/${this.currentCountry}`);
    // this.state.countryData.population = this.state.countriesList[index].population;
    try {
      this.currentCountryData = await (
        await fetch(`https://api.covid19api.com/total/country/${this.currentCountry}`)
      ).json();
    } catch (e) {
      console.log(e);
    }
    if (this.currentCountryData) {
      // this.createDataByCountryFOrChart();
      this.state.countryData = createDataByCountryForChart(
        this.currentCountryData,
        this.state.countriesList[index].population
      );
    }
  }

  // createDataByCountryFOrChart() {
  //   this.state.countryData.Label = this.currentCountryData[0].Country;
  //   this.state.countryData.Dates = [];

  //   this.state.countryData.NewConfirmed = [];
  //   this.state.countryData.NewRecovered = [];
  //   this.state.countryData.NewDeaths = [];

  //   this.state.countryData.Confirmed = [];
  //   this.state.countryData.Recovered = [];
  //   this.state.countryData.Deaths = [];

  //   this.state.countryData.NewConfirmedPerOneHundredThousands = [];
  //   this.state.countryData.NewRecoveredPerOneHundredThousands = [];
  //   this.state.countryData.NewDeathsPerOneHundredThousands = [];

  //   this.state.countryData.ConfirmedPerOneHundredThousands = [];
  //   this.state.countryData.RecoveredPerOneHundredThousands = [];
  //   this.state.countryData.DeathsPerOneHundredThousands = [];

  //   this.currentCountryData.forEach((e, i) => {
  //     // Данные для каждого дня дня общие и на 100тыс населения
  //     if (i === 0) {
  //       this.state.countryData.NewConfirmed.push(e.Confirmed);
  //       this.state.countryData.NewRecovered.push(e.Deaths);
  //       this.state.countryData.NewDeaths.push(e.Recovered);

  //       this.state.countryData.NewConfirmedPerOneHundredThousands.push(
  //         this.perOneHundredThousands(this.state.countryData.population, e.Confirmed)
  //       );
  //       this.state.countryData.NewRecoveredPerOneHundredThousands.push(
  //         this.perOneHundredThousands(this.state.countryData.population, e.Deaths)
  //       );
  //       this.state.countryData.NewDeathsPerOneHundredThousands.push(
  //         this.perOneHundredThousands(this.state.countryData.population, e.Recovered)
  //       );
  //     } else {
  //       this.state.countryData.NewConfirmed.push(
  //         e.Confirmed - this.currentCountryData[i - 1].Confirmed
  //       );
  //       this.state.countryData.NewRecovered.push(e.Deaths - this.currentCountryData[i - 1].Deaths);
  //       this.state.countryData.NewDeath.push(
  //         e.Recovered - this.currentCountryData[i - 1].Recovered
  //       );

  //       this.state.countryData.NewConfirmedPerOneHundredThousands.push(
  //         this.perOneHundredThousands(
  //           this.state.countryData.population,
  //           e.Confirmed - this.currentCountryData[i - 1].Confirmed
  //         )
  //       );
  //       this.state.countryData.NewRecoveredPerOneHundredThousands.push(
  //         this.perOneHundredThousands(
  //           this.state.countryData.population,
  //           e.Recovered - this.currentCountryData[i - 1].Recovered
  //         )
  //       );
  //       this.state.countryData.NewDeathsPerOneHundredThousands.push(
  //         this.perOneHundredThousands(
  //           this.state.countryData.population,
  //           e.Deaths - this.currentCountryData[i - 1].Deaths
  //         )
  //       );

  //       // Данные общие
  //       this.state.countryData.Confirmed.push(e.Confirmed);
  //       this.state.countryData.Recovered.push(e.Recovered);
  //       this.state.countryData.Deaths.push(e.Deaths);

  //       // Данные общие на 100к населения
  //       this.state.countryData.Confirmed.push(
  //         this.perOneHundredThousands(this.state.countryData.population, e.Confirmed)
  //       );
  //       this.state.countryData.Recovered.push(
  //         this.perOneHundredThousands(this.state.countryData.population, e.Recovered)
  //       );
  //       this.state.countryData.Deaths.push(
  //         this.perOneHundredThousands(this.state.countryData.population, e.Deaths)
  //       );
  //     }

  //     // Даты
  //     this.state.countryData.currentCountryDates.push(e.Date.slice(0, 10));
  //   });
  // }
}
