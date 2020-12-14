// import Chart from '../node_modules/chart.js/dist/Chart.bundle';


async function getData() {
  const data = await (await fetch ('https://api.covid19api.com/summary')).json();
  console.log(data)

  const flags = await (await fetch ('https://restcountries.eu/rest/v2/all?fields=name;population;flag')).json()

  const woldCases = await (await fetch ('https://api.covidtracking.com/v1/us/daily.json')).json();
  const worldCasesDate =[]
  const worldCasesCount = []
  woldCases.forEach((day) => {
    worldCasesCount.push(day.positive);
    worldCasesDate.push(day.dateChecked.slice(0, 10))
  })
  
  // const response5 = await fetch ('https://api.covid19api.com/dayone/country/south-africa/status/confirmed')
  // const res5 = await response5.json()
  // let cases = [];
  // let dataArr = [];
  // if (res5.length !== 0) {
  //   res5.forEach((day) => {
  //     cases.push(day.Cases);
  //     dataArr.push(day.Date.slice(0, 10))
  //   });
  // }

  // const response3 = await fetch ('https://api.covid19api.com/world?from=2020-01-01T00:00:00Z&to=2020-12-12T00:00:00Z')
  // const wip = await response3.json()
  // const wipSort = wip.sort((a,b) => a.TotalConfirmed - b.TotalConfirmed)  

  const countriesList = flags.slice().filter((country) => {
    const indexOfCountry = data.Countries.findIndex(elem => elem.Country === country.name)
    if (indexOfCountry !== -1) {
      country.Slug = data.Countries[indexOfCountry].Slug
      country.newConfirmed = data.Countries[indexOfCountry].NewConfirmed
      country.NewDeaths = data.Countries[indexOfCountry].NewDeaths
      country.NewRecovered = data.Countries[indexOfCountry].NewRecovered
      country.TotalConfirmed = data.Countries[indexOfCountry].TotalConfirmed
      country.TotalDeaths = data.Countries[indexOfCountry].TotalDeaths
      country.TotalRecovered = data.Countries[indexOfCountry].TotalRecovered
      country.newConfirmed = data.Countries[indexOfCountry].NewConfirmed
      country.CountryCode = data.Countries[indexOfCountry].CountryCode

      country.NewDeathsPerOneHundredThousands = perOneHundredThousands(country.population, country.NewDeaths).toFixed(3)
      country.NewRecoveredPerOneHundredThousands = perOneHundredThousands(country.population, country.NewRecovered).toFixed(3)
      country.TotalConfirmedPerOneHundredThousands = perOneHundredThousands(country.population, country.TotalConfirmed).toFixed(3)
      country.TotalDeathsPerOneHundredThousands = perOneHundredThousands(country.population, country.TotalDeaths).toFixed(3)
      country.TotalRecoveredPerOneHundredThousands = perOneHundredThousands(country.population, country.TotalRecovered).toFixed(3)
      country.newConfirmedPerOneHundredThousands = perOneHundredThousands(country.population, country.newConfirmed).toFixed(3)
      return country
    }
  })

  console.log(JSON.stringify(countriesList, null, 2))

  const select = document.querySelector('#country')

  countriesList.forEach(e => {
    select.innerHTML +=`<option value="${e.Slug}">${e.name}</option>`
  })

  select.value = "ukraine"

  select.addEventListener("change", () => {    
    drawChart(select.value);
  });



  console.log('countriesList', countriesList)
  console.log('woldCases', woldCases)

  async function drawChart(country) {
    const data = await (await fetch(`https://api.covid19api.com/total/country/${country}/status/confirmed`)).json()
    const countryCases = []
    const countryDate = []
    const countryName = data[0].Country

    data.forEach(e => {
      countryCases.push(e.Cases)
      countryDate.push(e.Date.slice(0, 10))
    })
    newDataset(countryCases, countryDate, countryName)
  }



  const ctx = document.getElementById('myChart').getContext('2d');
  const chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          labels: worldCasesDate,
          datasets: [{
              label: 'World cases',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: worldCasesCount,
              fill: false,
          }]
      },

      // Configuration options go here
      options: {
        scales: {
          xAxes: [{
              type: 'time',
              time: {
                stepSize: 30,
              },
          }]
        }
      }
  });

  function newDataset(cases, date, country) {  
    chart.data = {
      labels: date,
      datasets: [{
        label: `${country}`,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: cases,
        fill: false,
      }]
    }

    chart.update()
  }

  const button = document.querySelector('#next')

  button.addEventListener('click', ()=>newDataset())
}





function perOneHundredThousands(population, cases) {
  return cases / (population / 100000)
}

getData()

async function getInitData() {
  const woldCases = await (await fetch ('https://api.covidtracking.com/v1/us/daily.json')).json()
  const worldCasesDate =[]
  const worldCasesCount = []
  woldCases.forEach((day) => {
    worldCasesCount.push(day.positive);
    worldCasesDate.push(day.dateChecked.slice(0, 10))
  })

  
};
getInitData()