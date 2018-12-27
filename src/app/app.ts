import "./styles.scss";
import * as request from "request-promise-native";
const xhr = require('nets');

//Private members
var _KEGGAPI = 'http://rest.kegg.jp/get/';

var _target = null, _pathway = 'hsa04910', _proxy = null, _expression = null, _cy = null, _conditions = null, _interval = null, _slider = null;

var _finder = function(cmp, arr){
    var y = arr[0] || null;
    for(var i = 1; i < arr.length; i++){
        y = cmp(y, arr[i]);
    }
    return y;
};

const invocation = new XMLHttpRequest();
const url = _KEGGAPI+_pathway+'/kgml';
   
function callOtherDomain() {
  if(invocation) {    
    invocation.open('GET', url, true);
    ///invocation.onreadystatechange = handler;
    console.log(invocation.onreadystatechange);
    invocation.send(); 
  }
}

// Use heroku proxy for Ajax calls
var _proxy = function(url){
    return 'https://cors-anywhere.herokuapp.com/'+url;
};

//callOtherDomain();

var query = function(){
    
    var url = _KEGGAPI+_pathway+'/kgml';
    url = (typeof _proxy === 'function') ? _proxy(url) : url;
   // xhr.AppendHeader("Access-Control-Allow-Origin", "*");

    xhr({
        url: url,
        method: 'GET',
        encoding: undefined,
        headers: {
            "Content-Type": "application/json"
           // "Origin": "*"
          }
    }, 
    function done(err, resp, body){
        
        if(err){ 
            console.error(err); 
            return;
        }
        

        console.log(resp.rawRequest.responseXML);
        console.log(resp);
        
       // _cy = render(resp.rawRequest.responseXML, div);
    });
};

query()