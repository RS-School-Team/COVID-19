import GetData from './getData/GetData';
import Map from './map';
import InitialLayout from './layout';
import GlobalCasesTable from './globalTable';
import CountryCasesTable from './countryCasesTable';

class Components {
  constructor() {
    this.getData = new GetData();
    this.layout = new InitialLayout();
    this.globalCasesTable = new GlobalCasesTable();
    this.CountryCasesTable = new CountryCasesTable();
    this.map = new Map();
  }
}

export default Components;
