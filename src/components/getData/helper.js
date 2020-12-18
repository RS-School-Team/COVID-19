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
  data.newDeath = today.deathIncrease;
  data.newRecovered = today.recovered - yesterday.recovered;

  // Данные по миру за все время
  data.confirmed = today.positive;
  data.death = today.death;
  data.recovered = today.recovered;

  // Данные по миру за сегодня на 100к населения
  data.newConfirmedPOHT = POHT(population, today.positiveIncrease);
  data.newDeathPOHT = POHT(population, today.deathIncrease);
  data.newRecoveredPOHT = POHT(population, today.positiveIncrease);

  // Данные по миру за все время на 100к населения
  data.confirmedPOHT = POHT(population, today.positive);
  data.deathPOHT = POHT(population, today.death);
  data.recoveredPOHT = POHT(population, today.recovered);

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
      country.newDeathPOHT = parseFloat(POHT(country.population, country.newDeaths).toFixed(3));
      country.newRecoveredPOHT = parseFloat(
        POHT(country.population, country.newRecovered).toFixed(3)
      );
      country.totalConfirmedPOHT = parseFloat(
        POHT(country.population, country.totalConfirmed).toFixed(3)
      );

      // Данные по стране за все время на 100к населения
      country.totalDeathPOHT = parseFloat(POHT(country.population, country.totalDeaths).toFixed(3));
      country.totalRecoveredPOHT = parseFloat(
        POHT(country.population, country.totalRecovered).toFixed(3)
      );
      country.newConfirmedPOHT = parseFloat(
        POHT(country.population, country.newConfirmed).toFixed(3)
      );

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
  data.NewDeath = [];
  data.NewRecovered = [];

  data.Confirmed = [];
  data.Death = [];
  data.Recovered = [];

  data.NewConfirmedPOHT = [];
  data.NewDeathPOHT = [];
  data.NewRecoveredPOHT = [];

  data.ConfirmedPOHT = [];
  data.DeathPOHT = [];
  data.RecoveredPOHT = [];

  worldCases.forEach((day, index) => {
    // Данные за сегодня
    data.NewConfirmed.push(day.positiveIncrease);
    data.NewDeath.push(day.deathIncrease);

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
    data.Death.push(day.death);
    data.Recovered.push(day.recovered);

    // Данные за сегодня на 100к населения
    data.NewConfirmedPOHT.push(POHT(population, day.positiveIncrease));
    data.NewDeathPOHT.push(POHT(population, day.deathIncrease));

    // Данные за все время на 100к населения
    data.ConfirmedPOHT.push(POHT(population, day.positive));
    data.DeathPOHT.push(POHT(population, day.death));
    data.RecoveredPOHT.push(POHT(population, day.recovered));

    // Даты
    data.worldCasesDate.push(day.dateChecked.slice(0, 10));
  });
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
