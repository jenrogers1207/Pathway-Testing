const xhr = require('nets');
import * as Pathway from './pathway';

export class DataManager {
    
    GET: any;
    LINK: any;
    CONVERT: any;
    private type;
    pathway : string;
    private expression;
    private cy;
    private conditions;
    private interval;
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
        this.type = 'path:';
        //this.pathway = 'mmu03440';
        this.pathway = 'hsa04910';
        this.expression = null;
        this.cy = null;
        this.conditions = null;
        this.interval = null;
        this.keggID = '';
    }

    var _finder = function(cmp, arr){
        var y = arr[0] || null;
        for(var i = 1; i < arr.length; i++){
            y = cmp(y, arr[i]);
        }
        return y;
    };

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
                
                return resp.rawRequest.responseXML;
            });
    }

    //Formater for CONVERT. Passed as param to query
    let conv_format = async function(id:string){
        //NEED TO MAKE THIS SO IT CAN USE OTHER IDS
        let stringArray = new Array();
        let type = 'genes/ncbi-geneid:'
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
                console.log(resp.rawRequest.responseText);
                return resp;
                }
                
                );
                 // v this throws cannot reads responseText of undefined what v 
                console.log(data);
               
                return data;
    }

    let grabber = function(list:any){
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
                return stringArray[1];
    }

    //Formater for LINK. Passed as param to query
    let link_format = function(id:string){
        let url = 'http://rest.kegg.jp/link/pathway/' + id;
        return url;
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
