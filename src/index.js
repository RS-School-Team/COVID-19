import './style.scss';
import { APPCONTAINERCLASS, BODYTAG } from './constants/app-constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './app';
import { simpleTag, qs } from './helper';

document.addEventListener('DOMContentLoaded', () => {
  let appTag = qs(`${APPCONTAINERCLASS}`);

  if (!appTag) {
    appTag = simpleTag({
      classTag: `${APPCONTAINERCLASS}`,
    });

    qs(BODYTAG).insertAdjacentElement('afterbegin', appTag);
  }

  const app = new App(appTag);
  app.init();
  app.render();
  app.start();
});