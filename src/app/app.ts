import "./styles.scss";
import * as DM from './dataManager';
const xhr = require('nets');

const dm = new DM.DataManager();
//const queryAPI = DM.default;

//let test = dm.GET('hsa04910');
let convertTest = dm.CONVERT('12190').then(d=> {
    console.log(d);
    let test = JSON.parse(d);
    console.log(test)
});
//console.log(convertTest);