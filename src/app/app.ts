import "./styles.scss";
import * as DM from './dataManager';
import * as d3 from 'D3';

const xhr = require('nets');

const dm = new DM.DataManager();
//const queryAPI = DM.default;

d3.select('.search-icon').on('click', ()=> searchById());

let test = dm.GET('hsa04910');

//let convertTest = dm.CONVERT('ncbi-geneid:12190');

function searchById() {

    let withQuery = [];
    let queryDate = [];

    const value = (<HTMLInputElement>document.getElementById('search-bar')).value;
    console.log(value);
  
    if(value.includes('ncbi-geneid')){
        console.log('yes');
        dm.CONVERT('ncbi-geneid:12190');
    }

  
}
