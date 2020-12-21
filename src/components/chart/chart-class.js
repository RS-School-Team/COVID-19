import Chart from 'chart.js';
import Component from '../component';
import * as helper from '../../helper';
import './chart.scss';

class Graph extends Component {
  constructor() {
    super();
    this.options = {};
    this.ind = 0;
  }

  init() {
    // this.parent = container || document.querySelector('.chart__container');
    this.parent = document.querySelector('.chart__container');
    this.title = helper.create('h6', 'title', 'World Cases', this.parent);
    const containerElem = helper.create('canvas', 'chart', null, this.parent);
    this.chartContainer = containerElem.getContext('2d');
    this.cartNav = helper.create('select', 'form-control', null, this.parent, [
      'change',
      'sortChanged',
    ]);
    this.createChartNav();
    this.events.addEventList('initDataGot', [this.initChart.bind(this)]);
  }

  createChartNav() {
    this.state.data.sortTypes.map(elem =>
      helper.create(
        'option',
        'dropdown-item',
        elem[1],
        this.cartNav,
        ['name', elem[0]],
        ['value', elem[0]]
      )
    );
  }

  changeDataType(arg) {
    [this.dataPath] = this.options.data.datasets;
    if (typeof arg[0] === 'string') {
      [this.ind] = arg;
      if (this.ind < 6) {
        this.options.type = 'line';
        this.dataPath.fill = false;
      } else {
        this.options.type = 'bar';
        this.dataPath.fill = true;
      }
    } else {
      this.path = this.state.countryData;
      this.title.innerText = this.path.label;
    }

    this.cartNav[this.ind].selected = true;
    const [data, label] = this.state.data.sortTypes[this.ind];

    this.dataPath.data = this.path[data];
    this.dataPath.label = label;
    this.chart.update();
  }

  initChart() {
    this.path = this.state.worldData.chartData;
    this.options = {
      // The type of chart we want to create
      type: 'line',
      // The data for our dataset
      data: {
        labels: this.path.worldCasesDate,
        datasets: [
          {
            label: 'Total Confirmed',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            hoverBackgroundColor: 'rgb(190, 190, 255)',
            hoverBorderColor: 'rgb(190, 190, 255)',
            borderWidth: 0.5,
            pointRadius: 1,
            pointHitRadius: 4,
            data: this.path.confirmed,
            fill: false,
          },
        ],
      },
      // Configuration options go here
      options: {
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                stepSize: 30,
              },
            },
          ],
        },
      },
    };
    this.chart = new Chart(this.chartContainer, this.options);
    this.events.addEventList('sortChanged', [(...args) => this.changeDataType(...args)]);
    // this.events.addEventList('sortChanged', [this.changeDataType.bind(this)]);
    this.events.addEventList('dataCountryGot', [this.changeDataType.bind(this)]);
  }
}

export default Graph;
