const xhr = require('nets');
import * as Pathway from './pathway';
import * as d3 from 'D3';
import { select, selectAll } from 'D3';

const pathways = new Pathway.Pathway()

export class DataManager {
    
    GET: any;
    LINK: any;
    CONVERT: any;
    SEARCH: any;
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

        this.SEARCH = searchById;

        //this.query = query;
    }

    let searchById = function() {
        
        d3.select('#linked-pathways').selectAll('*').remove();
        d3.select('#pathway-render').selectAll('*').remove();
        d3.select('#assoc-genes').selectAll('*').remove();
        d3.select('#gene-id').selectAll('*').remove();

        d3.select('#thinking').classed('hidden', false);
    
        const value = (<HTMLInputElement>document.getElementById('search-bar')).value;
        if(value.includes(':')){
            if(value.includes('ncbi-geneid')){
                conv_format(value);
            }else{
                this.LINK([value]);
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
                function done(err: any, resp: any, body: any){
                    
                    if(err){ 
                        console.error(err); 
                        return;
                    }
                    d3.select('#thinking').classed('hidden', true);
                    let geneID = d3.select('#gene-id');
                    let header = geneID.append('h2').text('Did you mean :');
                    let json = JSON.parse(resp.rawRequest.responseText);
                   /*
                    let matchArray = json.hits;
                    json.hits.forEach((hit, i) => {
                        let name = hit.name;
                        let finds = matchArray.map(d=> d.name);
                        if(finds.indexOf(name) ==  -1){ matchArray.push(hit)}
                    });
                   */
                  let matchArray = new Array(json.hits[0]);
                  
                 
                    if(json.hits.length > 1){
                        matchArray.push(json.hits[1]);
                    }
                  
                
                    let options = geneID.selectAll('.gene_link').data(matchArray);
                    let optionsEnter = options.enter().append('div').classed('gene_link', true);
                    options = optionsEnter.merge(options);
                    let link = options.append('h5').text(d=> d.symbol);
                    let description = options.append('text').text(d=> ' ' + d.name);

                    link.on('click', (d)=> {
                        conv_format('ncbi-geneid:'+d._id);
                    });
                  
                });
        }
    }
    
    //Formater for GET. Passed as param to query
   async function get_format(id:string, geneId:string){
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
                d3.select('#thinking').classed('hidden', true);
                pathways.pathProcess(resp.rawRequest.responseXML, geneId).then(p=> {
                    console.log(p);
                    loadImage(id).then(image=> {

                        pathways.pathRender(p)});
                    });
                    
                    
            });
    }

    /*jslint devel: true, browser: true, es5: true */
/*global Promise */

function imgLoad(url: string) {
    'use strict';
    // Create new promise with the Promise() constructor;
    // This has as its argument a function with two parameters, resolve and reject
    return new Promise(function (resolve, reject) {
        // Standard XHR to load an image
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'blob';
        
        // When the request loads, check whether it was successful
        request.onload = function () {
            if (request.status === 200) {
                // If successful, resolve the promise by passing back the request response
                resolve(request.response);
            } else {
                // If it fails, reject the promise with a error message
                reject(new Error('Image didn\'t load successfully; error code:' + request.statusText));
            }
        };
      
        request.onerror = function () {
            // Also deal with the case when the entire request fails to begin with
            // This is probably a network error, so reject the promise with an appropriate message
            reject(new Error('There was a network error.'));
        };
      
        // Send the request
        request.send();
    });
}

async function loadImage(id) {
    'use strict';
    // Get a reference to the body element, and create a new image object
    var body = document.querySelector('body'),
        myImage = new Image();
        d3.select('#thinking').classed('hidden', true);
    myImage.crossOrigin = ""; // or "anonymous"

    let url = 'http://rest.kegg.jp/get/'+ id + '/image';
    let proxy = 'https://cors-anywhere.herokuapp.com/';
 
    
    // Call the function with the URL we want to load, but then chain the
    // promise then() method on to the end of it. This contains two callbacks
    imgLoad(proxy + url).then(function (response) {
        d3.select('#thinking').classed('hidden', true);
        // The first runs when the promise resolves, with the request.reponse specified within the resolve() method.
        var imageURL = window.URL.createObjectURL(response);
        myImage.src = imageURL;
        document.getElementById('pathway-render').appendChild(myImage);
        // The second runs when the promise is rejected, and logs the Error specified with the reject() method.
    }, function (Error) {
        console.log(Error);
    });
}

    //Formater for CONVERT. Passed as param to query
   async function conv_format(id:string){
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
                d3.select('#thinking').classed('hidden', true);
                // v this consoles what I want v 
                grabId(resp.rawRequest.responseText).then(ids=> link_format(ids));
               
                return resp;
                }
                
                );
                 // v this throws cannot reads responseText of undefined what v 
                console.log(data);
               
                return data;
    }

    let grabId = async function(list:any){
        let stringArray = new Array();
       
        list = list.split(/(\s+)/);
  
        for(var i =0; i < list.length; i++){
            if(list[i].length > 1){
                stringArray.push(list[i]);
                }
            };
            
            return stringArray;
    }

    let renderText = async function(idArray: Array<string>, response: string){
        
        let splits = await grabId(response);
        let id_link = splits[0];
        splits = splits.filter(d=> d != id_link);

        let divID = d3.select(document.getElementById('gene-id'));
        divID.selectAll('*').remove();

        let divLink = d3.select(document.getElementById('linked-pathways'));
        divLink.selectAll('*').remove();

        divLink.append('div').append('h3').text('Associated Pathways: ');
        if(idArray.length > 1){
            divID.append('span').append('text').text('Search ID:')
            divID.append('text').text(idArray[0] + '   ');
            
        }
        divID.append('span').append('text').text('Kegg ID:')
        divID.append('text').text(id_link);

        let div = divLink.selectAll('div').data(splits);
        div.exit().remove();
        let divEnter = div.enter().append('div').classed('path-link', true);
        div = divEnter.merge(div);

        let text = divEnter.append('text').text(d=> d);
        text.on('click', (id,i,g)=> {
         
            let toUnclass = d3.selectAll('.selected_link');
            toUnclass.classed('selected_link', false);
            d3.select(g[i]).classed('selected_link', true);
            get_format(id, id_link)});
        
    }

    //Formater for LINK. Passed as param to query
    function link_format(idArray: Array<string>){
     
        let keggId = null;

        keggId = (idArray.length > 1) ?  idArray[1] : idArray[0];
        
        let url = 'http://rest.kegg.jp/link/pathway/' + keggId;
        let proxy = 'https://cors-anywhere.herokuapp.com/';
     
        let data = xhr({
                url: proxy + url,
                method: 'GET',
                encoding: undefined,
                headers: {
                    "Content-Type": "text/plain"
                }
            }, 
            function done(err, resp, body){
                if(err){ 
                    console.error(err); 
                    return;
                }
                d3.select('#thinking').classed('hidden', true);
                // v this consoles what I want v 
                renderText(idArray, resp.rawRequest.responseText);

                return resp;
                }
                
                );

                 // v this throws cannot reads responseText of undefined what v 
                console.log(data);
               
                return data;
        
    }     
}

  
