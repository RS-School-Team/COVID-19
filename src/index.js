import './style.scss';
import { APPCONTAINERCLASS, BODYTAG } from './constants/app-constants';
import App from './app';
import { create, qs } from './helper';

document.addEventListener('DOMContentLoaded', () => {
  let appTag = qs(`${APPCONTAINERCLASS}`);

  if (!appTag) {
    appTag = create('div', `${APPCONTAINERCLASS}`);

    qs(BODYTAG).insertAdjacentElement('afterbegin', appTag);
  }

  const app = new App(appTag);
  app.init();
  app.start();
});
