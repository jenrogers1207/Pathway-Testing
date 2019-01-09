import "./styles.scss";
import * as DM from './dataManager';
import * as d3 from 'D3';

const dm = new DM.DataManager();


d3.select('.search-icon').on('click', ()=> dm.SEARCH());

