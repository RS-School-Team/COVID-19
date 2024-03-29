import countriesJ from './countries.json';

const countries = JSON.parse(JSON.stringify(countriesJ));

const baseData = {
  dayInfo: {},
  sortTypes: [
    ['confirmed', 'Total Confirmed'],
    ['death', 'Total Death'],
    ['recovered', 'Total Recovered'],
    ['confirmedPOHT', 'Total Confirmed Per 100,000 Population'],
    ['deathPOHT', 'Total Deaths Per 100,000 Population'],
    ['recoveredPOHT', 'Total Recovered Per 100,000 Population'],
    ['newConfirmed', 'Last Day Confirmed'],
    ['newDeath', 'Last Day Death'],
    ['newRecovered', 'Last Day Recovered'],
    ['newConfirmedPOHT', 'Last Day Confirmed Per 100,000 Population'],
    ['newDeathPOHT', 'Last Day Death Per 100,000 Population'],
    ['newRecoveredPOHT', 'Last Day Recovered Per 100,000 Population'],
  ],
};

const keys = {
  mapsApiKey: 'mapAPIKey',
};

export { baseData, keys, countries };
