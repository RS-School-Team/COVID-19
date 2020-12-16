/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import Component from '../component';

export default class GetData extends Component {
  constructor() {
    super();
    this.worldPopulation = 7850000000;
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
      this.getWorldDataForTable();
      this.getWorldDataForChart();
    }
  }

  getWorldDataForTable() {
    const todayWorldCases = this.worldCases[0];
    const yesterdayWorldCases = this.worldCases[1];

    // Данные по миру за сегодня
    this.state.worldData.worldNewConfirmed = todayWorldCases.positiveIncrease;
    this.state.worldData.worldNewDeaths = todayWorldCases.deathIncrease;
    this.state.worldData.worldNewRecovered =
      todayWorldCases.recovered - yesterdayWorldCases.recovered;

    // Данные по миру за все время
    this.state.worldData.worldTotalConfirmed = todayWorldCases.positive;
    this.state.worldData.worldTotalDeaths = todayWorldCases.death;
    this.state.worldData.worldTotalRecovered = todayWorldCases.recovered;

    // Данные по миру за сегодня на 100к населения
    this.state.worldData.worldNewConfirmedPerOneHundredThousands = this.perOneHundredThousands(
      this.worldPopulations,
      todayWorldCases.positiveIncrease
    );
    this.state.worldData.worldNewDeathsPerOneHundredThousands = this.perOneHundredThousands(
      this.worldPopulations,
      todayWorldCases.deathIncrease
    );
    this.state.worldData.worldNewRecoveredPerOneHundredThousands = this.perOneHundredThousands(
      this.worldPopulations,
      todayWorldCases.positiveIncrease
    );

    // Данные по миру за все время на 100к населения
    this.state.worldData.worldTotalConfirmedPerOneHundredThousands = this.perOneHundredThousands(
      this.worldPopulations,
      todayWorldCases.positive
    );
    this.state.worldData.worldTotalDeathsPerOneHundredThousands = this.perOneHundredThousands(
      this.worldPopulations,
      todayWorldCases.death
    );
    this.state.worldData.worldTotalRecoveredPerOneHundredThousands = this.perOneHundredThousands(
      this.worldPopulations,
      todayWorldCases.recovered
    );
  }

  getWorldDataForChart() {
    // Data for chart
    this.state.worldData.worldCasesDate = [];

    this.state.worldData.dailyWorldNewConfirmed = [];
    this.state.worldData.dailyWorldNewDeaths = [];
    this.state.worldData.dailyWorldNewRecovered = [];

    this.state.worldData.dailyWorldConfirmed = [];
    this.state.worldData.dailyWorldDeaths = [];
    this.state.worldData.dailyWorldRecovered = [];

    this.state.worldData.dailyWorldNewConfirmedPerOneHundredThousands = [];
    this.state.worldData.dailyWorldNewDeathsPerOneHundredThousands = [];
    this.state.worldData.dailyWorldNewRecoveredPerOneHundredThousands = [];

    this.state.worldData.dailyWorldConfirmedPerOneHundredThousands = [];
    this.state.worldData.dailyWorldDeathsPerOneHundredThousands = [];
    this.state.worldData.dailyWorldRecoveredPerOneHundredThousands = [];

    this.worldCases.forEach((day, index) => {
      // Данные за сегодня
      this.state.worldData.dailyWorldNewConfirmed.push(day.positiveIncrease);
      this.state.worldData.dailyWorldNewDeaths.push(day.deathIncrease);

      // Вычисления выздоровевших в день
      if (index === 0) {
        this.state.worldData.dailyWorldNewRecovered.push(day.recovered);
        this.state.worldData.dailyWorldNewRecoveredPerOneHundredThousands.push(
          this.perOneHundredThousands(this.worldPopulations, day.recovered)
        );
      } else {
        this.state.worldData.dailyWorldNewRecovered.push(
          day.recovered - this.worldCases[index - 1].recovered
        );
        this.state.worldData.dailyWorldNewRecoveredPerOneHundredThousands.push(
          this.perOneHundredThousands(
            this.worldPopulations,
            day.recovered - this.worldCases[index - 1].recovered
          )
        );
      }

      // Данные за все время
      this.state.worldData.dailyWorldConfirmed.push(day.positive);
      this.state.worldData.dailyWorldDeaths.push(day.death);
      this.state.worldData.dailyWorldRecovered.push(day.recovered);

      // Данные за сегодня на 100к населения
      this.state.worldData.dailyWorldNewConfirmedPerOneHundredThousands.push(
        this.perOneHundredThousands(this.worldPopulations, day.positiveIncrease)
      );
      this.state.worldData.dailyWorldNewDeathsPerOneHundredThousands.push(
        this.perOneHundredThousands(this.worldPopulations, day.deathIncrease)
      );

      // Данные за все время на 100к населения
      this.state.worldData.dailyWorldConfirmedPerOneHundredThousands.push(
        this.perOneHundredThousands(this.worldPopulations, day.positive)
      );
      this.state.worldData.dailyWorldDeathsPerOneHundredThousands.push(
        this.perOneHundredThousands(this.worldPopulations, day.death)
      );
      this.state.worldData.dailyWorldRecoveredPerOneHundredThousands.push(
        this.perOneHundredThousands(this.worldPopulations, day.recovered)
      );

      // Даты
      this.state.worldData.worldCasesDate.push(day.dateChecked.slice(0, 10));
    });
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
      this.createCountryList();
    }
  }

  createCountryList() {
    this.state.countriesList = this.flags.slice().filter(country => {
      const indexOfCountry = this.data.Countries.findIndex(elem => elem.Country === country.name);
      if (indexOfCountry !== -1) {
        country.slug = this.data.Countries[indexOfCountry].Slug;
        country.countryCode = this.data.Countries[indexOfCountry].CountryCode;
        // Данные по стране за сегодня
        country.newConfirmed = this.data.Countries[indexOfCountry].NewConfirmed;
        country.newDeaths = this.data.Countries[indexOfCountry].NewDeaths;
        country.newRecovered = this.data.Countries[indexOfCountry].NewRecovered;

        // Данные по стране за все время
        country.totalConfirmed = this.data.Countries[indexOfCountry].TotalConfirmed;
        country.totalDeaths = this.data.Countries[indexOfCountry].TotalDeaths;
        country.totalRecovered = this.data.Countries[indexOfCountry].TotalRecovered;

        // Данные по стране за сегодня на 100к населения
        country.newDeathsPerOneHundredThousands = this.perOneHundredThousands(
          country.population,
          country.NewDeaths
        ).toFixed(3);
        country.newRecoveredPerOneHundredThousands = this.perOneHundredThousands(
          country.population,
          country.newRecovered
        ).toFixed(3);
        country.totalConfirmedPerOneHundredThousands = this.perOneHundredThousands(
          country.population,
          country.totalConfirmed
        ).toFixed(3);

        // Данные по стране за все время на 100к населения
        country.totalDeathsPerOneHundredThousands = this.perOneHundredThousands(
          country.population,
          country.totalDeaths
        ).toFixed(3);
        country.totalRecoveredPerOneHundredThousands = this.perOneHundredThousands(
          country.population,
          country.totalRecovered
        ).toFixed(3);
        country.newConfirmedPerOneHundredThousands = this.perOneHundredThousands(
          country.population,
          country.newConfirmed
        ).toFixed(3);

        return true;
      }
      return false;
    });
  }

  async getDataByCountry(index) {
    this.currentCountry = this.state.countriesList[index].Slug;
    this.state.countryData.population = this.state.countriesList[index].population;
    try {
      this.currentCountryData = await (
        await fetch(`https://api.covid19api.com/total/country/${this.currentCountry}`)
      ).json();
    } catch (e) {
      console.log(e);
    }
    if (this.currentCountryData) {
      this.createDataByCountryFOrChart();
    }
  }

  createDataByCountryFOrChart() {
    this.state.countryData.Label = this.currentCountryData[0].Country;
    this.state.countryData.Dates = [];

    this.state.countryData.NewConfirmed = [];
    this.state.countryData.NewRecovered = [];
    this.state.countryData.NewDeaths = [];

    this.state.countryData.Confirmed = [];
    this.state.countryData.Recovered = [];
    this.state.countryData.Deaths = [];

    this.state.countryData.NewConfirmedPerOneHundredThousands = [];
    this.state.countryData.NewRecoveredPerOneHundredThousands = [];
    this.state.countryData.NewDeathsPerOneHundredThousands = [];

    this.state.countryData.ConfirmedPerOneHundredThousands = [];
    this.state.countryData.RecoveredPerOneHundredThousands = [];
    this.state.countryData.DeathsPerOneHundredThousands = [];

    this.currentCountryData.forEach((e, i) => {
      // Данные для каждого дня дня общие и на 100тыс населения
      if (i === 0) {
        this.state.countryData.NewConfirmed.push(e.Confirmed);
        this.state.countryData.NewRecovered.push(e.Deaths);
        this.state.countryData.NewDeaths.push(e.Recovered);

        this.state.countryData.NewConfirmedPerOneHundredThousands.push(
          this.perOneHundredThousands(this.state.countryData.population, e.Confirmed)
        );
        this.state.countryData.NewRecoveredPerOneHundredThousands.push(
          this.perOneHundredThousands(this.state.countryData.population, e.Deaths)
        );
        this.state.countryData.NewDeathsPerOneHundredThousands.push(
          this.perOneHundredThousands(this.state.countryData.population, e.Recovered)
        );
      } else {
        this.state.countryData.NewConfirmed.push(
          e.Confirmed - this.currentCountryData[i - 1].Confirmed
        );
        this.state.countryData.NewRecovered.push(e.Deaths - this.currentCountryData[i - 1].Deaths);
        this.state.countryData.NewDeath.push(
          e.Recovered - this.currentCountryData[i - 1].Recovered
        );

        this.state.countryData.NewConfirmedPerOneHundredThousands.push(
          this.perOneHundredThousands(
            this.state.countryData.population,
            e.Confirmed - this.currentCountryData[i - 1].Confirmed
          )
        );
        this.state.countryData.NewRecoveredPerOneHundredThousands.push(
          this.perOneHundredThousands(
            this.state.countryData.population,
            e.Recovered - this.currentCountryData[i - 1].Recovered
          )
        );
        this.state.countryData.NewDeathsPerOneHundredThousands.push(
          this.perOneHundredThousands(
            this.state.countryData.population,
            e.Deaths - this.currentCountryData[i - 1].Deaths
          )
        );

        // Данные общие
        this.state.countryData.Confirmed.push(e.Confirmed);
        this.state.countryData.Recovered.push(e.Recovered);
        this.state.countryData.Deaths.push(e.Deaths);

        // Данные общие на 100к населения
        this.state.countryData.Confirmed.push(
          this.perOneHundredThousands(this.state.countryData.population, e.Confirmed)
        );
        this.state.countryData.Recovered.push(
          this.perOneHundredThousands(this.state.countryData.population, e.Recovered)
        );
        this.state.countryData.Deaths.push(
          this.perOneHundredThousands(this.state.countryData.population, e.Deaths)
        );
      }

      // Даты
      this.state.countryData.currentCountryDates.push(e.Date.slice(0, 10));
    });
  }
}
