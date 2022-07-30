import { baseData, keys, image, icons, countries } from '../../assets';

class Storage {
  constructor() {
    this.storage = {};
    this.appName = 'app';
    this.data = baseData;
    this.apiKey = keys;
    this.image = image;
    this.icons = icons;
    this.countries = countries;
  }

  toLocalStorage() {
    const myStorage = window.localStorage;
    myStorage.setItem(this.appName, JSON.stringify(this.storage));
  }

  getLocalStorage() {
    const myStorage = window.localStorage;
    const storage = myStorage[this.appName];
    if (storage) {
      this.storage = JSON.parse(storage);
      return true;
    }
    return false;
  }

  getStorage() {
    return this.storage;
  }

  setAppName(appName) {
    this.appName = `${appName}`;
  }
}

const storage = new Storage();

export default storage;
