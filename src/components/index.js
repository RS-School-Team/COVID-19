import GetData from './getData';
import Map from './map';
import InitialLayout from './layout';
import GlobalCasesTable from './globalTable';
import CountryCasesTable from './countryCasesTable';
import Graph from './chart';

class Components {
  constructor() {
    this.getData = new GetData();
    this.layout = new InitialLayout();
    this.globalCasesTable = new GlobalCasesTable();
    this.CountryCasesTable = new CountryCasesTable();
    this.map = new Map();
    this.graph = new Graph();
  }
}

export default Components;
