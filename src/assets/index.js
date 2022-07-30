import { baseData, keys, countries } from './baseData';
import { importAll, importAllSVG } from '../helper';
import Icons from './icons';

const image = importAll(require.context('./image', false, /\.(png|jpe?g)$/));
const iconsArray = importAllSVG(require.context('!svg-inline-loader!./icons', false, /\.(svg)$/));
const icons = new Icons(iconsArray);

export { baseData, keys, image, icons, countries };
