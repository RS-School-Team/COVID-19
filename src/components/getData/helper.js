/* eslint-disable no-param-reassign */
// PerOneHundredThousands === POHT

function POHT(population, cases) {
  return cases / (population / 100000);
}

function getWorldDataForTable(worldCases) {
  // const today = worldCases[0];
  // const yesterday = worldCases[1];
  const cases = worldCases.Global;
  const population = 7850000000;
  const data = {};

  // Данные по миру за сегодня
  data.newConfirmed = cases.NewConfirmed;
  data.newDeath = cases.NewDeaths;
  data.newRecovered = cases.NewRecovered;

  // Данные по миру за все время
  data.confirmed = cases.TotalConfirmed;
  data.death = cases.TotalDeaths;
  data.recovered = cases.TotalRecovered;

  // Данные по миру за сегодня на 100к населения
  data.newConfirmedPOHT = POHT(population, data.newConfirmed);
  data.newDeathPOHT = POHT(population, data.newDeath);
  data.newRecoveredPOHT = POHT(population, data.newRecovered);

  // Данные по миру за все время на 100к населения
  data.confirmedPOHT = POHT(population, data.confirmed);
  data.deathPOHT = POHT(population, data.death);
  data.recoveredPOHT = POHT(population, data.recovered);

  return data;
}

function createCountryList(flags, data) {
  const countriesList = flags.slice().filter(country => {
    const indexOfCountry = data.Countries.findIndex(elem => elem.Country === country.name);
    if (indexOfCountry !== -1) {
      country.slug = data.Countries[indexOfCountry].Slug;
      country.countryCode = data.Countries[indexOfCountry].CountryCode;
      // Данные по стране за сегодня
      country.newConfirmed = data.Countries[indexOfCountry].NewConfirmed;
      country.newDeath = data.Countries[indexOfCountry].NewDeaths;
      country.newRecovered = data.Countries[indexOfCountry].NewRecovered;

      // Данные по стране за все время
      country.confirmed = data.Countries[indexOfCountry].TotalConfirmed;
      country.death = data.Countries[indexOfCountry].TotalDeaths;
      country.recovered = data.Countries[indexOfCountry].TotalRecovered;

      // Данные по стране за сегодня на 100к населения
      country.newDeathPOHT = parseFloat(POHT(country.population, country.newDeath).toFixed(3));
      country.newRecoveredPOHT = parseFloat(
        POHT(country.population, country.newRecovered).toFixed(3)
      );
      country.confirmedPOHT = parseFloat(POHT(country.population, country.confirmed).toFixed(3));

      // Данные по стране за все время на 100к населения
      country.deathPOHT = parseFloat(POHT(country.population, country.death).toFixed(3));
      country.recoveredPOHT = parseFloat(POHT(country.population, country.recovered).toFixed(3));
      country.newConfirmedPOHT = parseFloat(
        POHT(country.population, country.newConfirmed).toFixed(3)
      );

      return true;
    }
    return false;
  });
  return countriesList;
}

function getNewCases(arr) {
  const res = [];
  arr.forEach((cases, i) => {
    if (i === 0) {
      res.push(cases);
    } else {
      res.push(cases - arr[i - 1]);
    }
  });
  return res;
}

function getWorldDataForChart(worldCases) {
  const cases = Object.values(worldCases.cases).sort((a, b) => a - b);
  const deaths = Object.values(worldCases.deaths).sort((a, b) => a - b);
  const recovered = Object.values(worldCases.recovered).sort((a, b) => a - b);
  const dates = Object.keys(worldCases.cases);
  const population = 7850000000;
  const data = {};
  data.dates = dates;

  data.newConfirmed = getNewCases(cases);
  data.newDeath = getNewCases(deaths);
  data.newRecovered = getNewCases(recovered);

  data.confirmed = cases;
  data.death = deaths;
  data.recovered = recovered;

  data.newConfirmedPOHT = data.newConfirmed.map(e => POHT(population, e));
  data.newDeathPOHT = data.newDeath.map(e => POHT(population, e));
  data.newRecoveredPOHT = data.newRecovered.map(e => POHT(population, e));

  data.confirmedPOHT = data.confirmed.map(e => POHT(population, e));
  data.deathPOHT = data.death.map(e => POHT(population, e));
  data.recoveredPOHT = data.recovered.map(e => POHT(population, e));
  return data;
}

function createDataByCountryForChart(countryData, population) {
  const data = {};
  data.label = countryData[0].Country;
  data.dates = [];

  data.confirmed = [];
  data.recovered = [];
  data.death = [];

  data.newConfirmed = [];
  data.newRecovered = [];
  data.newDeath = [];

  data.newConfirmedPOHT = [];
  data.newRecoveredPOHT = [];
  data.newDeathPOHT = [];

  data.confirmedPOHT = [];
  data.recoveredPOHT = [];
  data.deathPOHT = [];

  countryData.forEach((e, i) => {
    // Данные общие
    data.confirmed.push(e.Confirmed);
    data.recovered.push(e.Recovered);
    data.death.push(e.Deaths);

    // Данные общие на 100к населения
    data.confirmedPOHT.push(POHT(population, e.Confirmed));
    data.recoveredPOHT.push(POHT(population, e.Recovered));
    data.deathPOHT.push(POHT(population, e.Deaths));
    // Данные для каждого дня дня общие и на 100тыс населения
    if (i === 0) {
      data.newConfirmed.push(e.Confirmed);
      data.newRecovered.push(e.Deaths);
      data.newDeath.push(e.Recovered);

      data.newConfirmedPOHT.push(POHT(population, e.Confirmed));
      data.newRecoveredPOHT.push(POHT(population, e.Deaths));
      data.newDeathPOHT.push(POHT(population, e.Recovered));
    } else {
      data.newConfirmed.push(e.Confirmed - countryData[i - 1].Confirmed);
      data.newRecovered.push(e.Deaths - countryData[i - 1].Deaths);
      data.newDeath.push(e.Recovered - countryData[i - 1].Recovered);

      data.newConfirmedPOHT.push(POHT(population, e.Confirmed - countryData[i - 1].Confirmed));
      data.newRecoveredPOHT.push(POHT(population, e.Recovered - countryData[i - 1].Recovered));
      data.newDeathPOHT.push(POHT(population, e.Deaths - countryData[i - 1].Deaths));
    }
    // Даты
    data.dates.push(e.Date.slice(0, 10));
  });
  return data;
}

export {
  POHT,
  getWorldDataForTable,
  createCountryList,
  getWorldDataForChart,
  createDataByCountryForChart,
};
