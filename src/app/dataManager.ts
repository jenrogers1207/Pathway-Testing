const xhr = require('nets');
import * as Pathway from './pathway';
import * as d3 from 'D3';

const pathways = new Pathway.Pathway()

export class DataManager {
    
    GET: any;
    LINK: any;
    CONVERT: any;
    pathway : string;
    query: any;
    keggID: string;
  
    constructor() {

        //retrieve database entries
        this.GET = get_format;
        //Convert between KEGG and GENE ID's
        this.CONVERT = conv_format;
        //KEGG pathways linked from a human gene
        this.LINK = link_format;

        this.query = query;
        this.keggID = '';
    }

    //Formater for GET. Passed as param to query
    let get_format = async function(id:string){
        let url = 'http://rest.kegg.jp/get/'+ id + '/kgml';
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
                pathways.pathProcess(resp.rawRequest.responseXML).then(p=> pathways.pathRender(p));
                //return resp.rawRequest.responseXML;
            });
    }

    //Formater for CONVERT. Passed as param to query
    let conv_format = async function(id:string){
        //NEED TO MAKE THIS SO IT CAN USE OTHER IDS
        let stringArray = new Array();
        let type = 'genes/'
        let url = 'http://rest.kegg.jp/conv/' + type + id;
 
        let proxy = 'https://cors-anywhere.herokuapp.com/';
     
        let data = await xhr({
                url: proxy + url,
                method: 'GET',
                encoding: undefined,
                headers: {
                    "Content-Type": "text/plain"
                }
            }, 
            await function done(err, resp, body){
                if(err){ 
                    console.error(err); 
                    return;
                }
            
                // v this consoles what I want v 
                let idArray = await grabId(resp.rawRequest.responseText);
                link_format(idArray);
                return resp;
                }
                
                );
                 // v this throws cannot reads responseText of undefined what v 
                console.log(data);
               
                return data;
    }

    let grabId = function(list:any){
        let stringArray = new Array();
        console.log(list);
        list = list.split(/(\s+)/);
                
                for(var i =0; i < list.length; i++){
                    if(list[i].length > 1){
                        stringArray.push(list[i]);
                    }
                };
                
                this.keggID = stringArray[1];
                console.log(this.keggID);
                return stringArray;
    }

    let renderText = function(idArray: Array<string>){
        let div = d3.select(document.getElementById('linked-pathways'));
        for(let id in idArray){
            div.append('text').text(id);
        }
        
    }

    //Formater for LINK. Passed as param to query
    let link_format = function(idArray: Array<string>){
        let keggId = null;
       
        if(idArray.length > 1){
            keggId = idArray[1];
        }else{
            keggId = idArray[0];
        }

        let url = 'http://rest.kegg.jp/link/pathway/' + keggId;
        let proxy = 'https://cors-anywhere.herokuapp.com/';
     
        let data = await xhr({
                url: proxy + url,
                method: 'GET',
                encoding: undefined,
                headers: {
                    "Content-Type": "text/plain"
                }
            }, 
            await function done(err, resp, body){
                if(err){ 
                    console.error(err); 
                    return;
                }
            
                // v this consoles what I want v 
                console.log(resp.rawRequest.responseText);
                renderText(idArray);

                return resp;
                }
                
                );
                 // v this throws cannot reads responseText of undefined what v 
                console.log(data);
               
                return data;
        
    }     

    async function query(url:string){
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
                
                return resp.rawRequest.responseXML;
            });
            console.log(data);
            return data;
    }
}

/**
* Used to query by id for xml data
* @param command: any
* @param id : string
* @returns {Object}
**/
export async function queryAPI(command:any, id:string){

    let proxy = 'https://cors-anywhere.herokuapp.com/';
    let url = proxy + command(id);

    xhr({
        url: url,
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
        
        console.log(resp.rawRequest.responseXML);
        console.log(resp);
        return resp.rawRequest.responseXML;
    });
   
}
