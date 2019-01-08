import "./styles.scss";
import * as DM from './dataManager';
import * as d3 from 'D3';


const xhr = require('nets');

const dm = new DM.DataManager();
//const queryAPI = DM.default;

d3.select('.search-icon').on('click', ()=> searchById());

function searchById() {
    
    d3.select('#linked-pathways').selectAll('*').remove();
    d3.select('#pathway-render').selectAll('*').remove();
    d3.select('#assoc-genes').selectAll('*').remove();
    d3.select('#gene-id').selectAll('*').remove();

    const value = (<HTMLInputElement>document.getElementById('search-bar')).value;
    if(value.includes(':')){
        if(value.includes('ncbi-geneid')){
            dm.CONVERT(value);
        }else{
            dm.LINK([value]);
        }
    }else{
        let url = 'http://mygene.info/v3/query?q='+ value;
        let proxy = 'https://cors-anywhere.herokuapp.com/';
     
        let data = xhr({
                url: proxy + url,
                method: 'GET',
                encoding: undefined,
                headers: {
                    "Content-Type": "application/json"
                
                }
            }, 
            function done(err, resp, body){
                
                if(err){ 
                    console.error(err); 
                    return;
                }
         
                let json = JSON.parse(resp.rawRequest.responseText);
                dm.CONVERT('ncbi-geneid:'+json.hits[0]._id);
            });
    }
        

  
}
