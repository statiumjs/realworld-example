import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

window.sleep = (ms = 0) => new Promise(resolve => {
  setTimeout(resolve, ms);
});
