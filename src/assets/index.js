import { baseData, keys } from './baseData';
import { importAll } from '../helper';

const image = importAll(require.context('./image', false, /\.(png|jpe?g|svg)$/));

export { baseData, keys, image };
