/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
// PerOneHundredThousands === POHT

function POHT(population, cases) {
  return cases / (population / 100000);
}

function getWorldDataForTable(worldCases) {
  const today = worldCases[0];
  const yesterday = worldCases[1];
  const population = 7850000000;
  const data = {};

  // Данные по миру за сегодня
  data.newConfirmed = today.positiveIncrease;
  data.newDeaths = today.deathIncrease;
  data.newRecovered = today.recovered - yesterday.recovered;

  // Данные по миру за все время
  data.totalConfirmed = today.positive;
  data.totalDeaths = today.death;
  data.totalRecovered = today.recovered;

  // Данные по миру за сегодня на 100к населения
  data.newConfirmedPOHT = POHT(population, today.positiveIncrease);
  data.newDeathsPOHT = POHT(population, today.deathIncrease);
  data.newRecoveredPOHT = POHT(population, today.positiveIncrease);

  // Данные по миру за все время на 100к населения
  data.totalConfirmedPOHT = POHT(population, today.positive);
  data.totalDeathsPOHT = POHT(population, today.death);
  data.totalRecoveredPOHT = POHT(population, today.recovered);

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
      country.newDeaths = data.Countries[indexOfCountry].NewDeaths;
      country.newRecovered = data.Countries[indexOfCountry].NewRecovered;

      // Данные по стране за все время
      country.totalConfirmed = data.Countries[indexOfCountry].TotalConfirmed;
      country.totalDeaths = data.Countries[indexOfCountry].TotalDeaths;
      country.totalRecovered = data.Countries[indexOfCountry].TotalRecovered;

      // Данные по стране за сегодня на 100к населения
      country.newDeathsPOHT = POHT(country.population, country.NewDeaths).toFixed(3);
      country.newRecoveredPOHT = POHT(country.population, country.newRecovered).toFixed(3);
      country.totalConfirmedPOHT = POHT(country.population, country.totalConfirmed).toFixed(3);

      // Данные по стране за все время на 100к населения
      country.totalDeathsPOHT = POHT(country.population, country.totalDeaths).toFixed(3);
      country.totalRecoveredPOHT = POHT(country.population, country.totalRecovered).toFixed(3);
      country.newConfirmedPOHT = POHT(country.population, country.newConfirmed).toFixed(3);

      return true;
    }
    return false;
  });
  return countriesList;
}

function getWorldDataForChart(worldCases) {
  // Data for chart
  const population = 7850000000;
  const data = {};
  data.worldCasesDate = [];

  data.NewConfirmed = [];
  data.NewDeaths = [];
  data.NewRecovered = [];

  data.Confirmed = [];
  data.Deaths = [];
  data.Recovered = [];

  data.NewConfirmedPOHT = [];
  data.NewDeathsPOHT = [];
  data.NewRecoveredPOHT = [];

  data.ConfirmedPOHT = [];
  data.DeathsPOHT = [];
  data.RecoveredPOHT = [];

  worldCases.forEach((day, index) => {
    // Данные за сегодня
    data.NewConfirmed.push(day.positiveIncrease);
    data.NewDeaths.push(day.deathIncrease);

    // Вычисления выздоровевших в день
    if (index === 0) {
      data.NewRecovered.push(day.recovered);
      data.NewRecoveredPOHT.push(POHT(population, day.recovered));
    } else {
      data.NewRecovered.push(day.recovered - worldCases[index - 1].recovered);
      data.NewRecoveredPOHT.push(POHT(population, day.recovered - worldCases[index - 1].recovered));
    }

    // Данные за все время
    data.Confirmed.push(day.positive);
    data.Deaths.push(day.death);
    data.Recovered.push(day.recovered);

    // Данные за сегодня на 100к населения
    data.NewConfirmedPOHT.push(POHT(population, day.positiveIncrease));
    data.NewDeathsPOHT.push(POHT(population, day.deathIncrease));

    // Данные за все время на 100к населения
    data.ConfirmedPOHT.push(POHT(population, day.positive));
    data.DeathsPOHT.push(POHT(population, day.death));
    data.RecoveredPOHT.push(POHT(population, day.recovered));

    // Даты
    data.worldCasesDate.push(day.dateChecked.slice(0, 10));
  });
  return data;
}

function createDataByCountryForChart(countryData, population) {
  console.log(countryData);
  const data = {};
  data.Label = countryData[0].Country;
  data.Dates = [];

  data.NewConfirmed = [];
  data.NewRecovered = [];
  data.NewDeaths = [];

  data.NewConfirmed = [];
  data.NewRecovered = [];
  data.NewDeaths = [];

  data.NewConfirmedPOHT = [];
  data.NewRecoveredPOHT = [];
  data.NewDeathsPOHT = [];

  data.ConfirmedPOHT = [];
  data.RecoveredPOHT = [];
  data.DeathsPOHT = [];

  countryData.forEach((e, i) => {
    // Данные для каждого дня дня общие и на 100тыс населения
    if (i === 0) {
      data.NewConfirmed.push(e.Confirmed);
      data.NewRecovered.push(e.Deaths);
      data.NewDeaths.push(e.Recovered);

      data.NewConfirmedPOHT.push(POHT(population, e.Confirmed));
      data.NewRecoveredPOHT.push(POHT(population, e.Deaths));
      data.NewDeathsPOHT.push(POHT(population, e.Recovered));
    } else {
      data.NewConfirmed.push(e.Confirmed - countryData[i - 1].Confirmed);
      data.NewRecovered.push(e.Deaths - countryData[i - 1].Deaths);
      data.NewDeath.push(e.Recovered - countryData[i - 1].Recovered);

      data.NewConfirmedPOHT.push(POHT(population, e.Confirmed - countryData[i - 1].Confirmed));
      data.NewRecoveredPOHT.push(POHT(population, e.Recovered - countryData[i - 1].Recovered));
      data.NewDeathsPOHT.push(POHT(population, e.Deaths - countryData[i - 1].Deaths));

      // Данные общие
      data.Confirmed.push(e.Confirmed);
      data.Recovered.push(e.Recovered);
      data.Deaths.push(e.Deaths);

      // Данные общие на 100к населения
      data.Confirmed.push(POHT(population, e.Confirmed));
      data.Recovered.push(POHT(population, e.Recovered));
      data.Deaths.push(POHT(population, e.Deaths));
    }

    // Даты
    data.Dates.push(e.Date.slice(0, 10));
  });
  console.log(data);
  return data;
}

export {
  POHT,
  getWorldDataForTable,
  createCountryList,
  getWorldDataForChart,
  createDataByCountryForChart,
};
