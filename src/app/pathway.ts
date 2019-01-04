import { Dictionary } from "lodash";
import * as d3 from 'D3';

class PathwayObject {

    id: string;
    title: string;
    paths: any;
    positions: Dictionary<any>; 
    node_map: Dictionary<any>; 
    nodes: Array<Node>;
    links: Array<any>;
    selectedId: string;
    
    constructor() {
        this.positions = {};
        this.node_map = {};
        this.nodes = new Array();
        this.links = new Array();
        this.selectedId;
    }
}

class Node{

    shape: string; 
    bkg_color: string;
    text_valign: string;
    border_width: any;
    width:any;
    height: any;
    type: any;
    id: string;
    keggId: Array<string>;
    name: any;
    names: any;
    link: any;
    
    constructor() {
        this.shape = 'rectangle';
        this.bkg_color = '#ccf2cc';
        this.text_valign = 'center';
        this.border_width = 0;
        this.width;
        this.height;
        this.type;
        this.id;
        this.keggId;
        this.name;
        this.names;
        this.link;
    }
}

export class Query {
    keggID: string;
    NCBIgeneID: string;
    linkedPaths: Array<string>;

    constructor(){
        this.keggID;
        this.NCBIgeneID;
        this.linkedPaths;
    }
}

export class Pathway {

    pathwayObjectArray: Array<object>;
    pathRender: any;
    pathProcess: any;
 
    constructor() {
        this.pathwayObjectArray = new Array();
        this.pathProcess = pathProcess;
        this.pathRender = pathRender;
    }

    function dataToNode(entry: any){

        let node = new Node();
        
        let graphics = entry.getElementsByTagName('graphics')[0];
        let type = entry.getAttribute('type');
        let names = (graphics.getAttribute('name') !== null) ? graphics.getAttribute('name').split(',') : [];
            
        node.width = graphics.getAttribute('width');
        node.height = graphics.getAttribute('height');
        node.type = type;
        node.id = entry.getAttribute('id');
        node.keggId = entry.getAttribute('name').split(' ');
        node.name = names[0] || '';
        node.names = names;
        node.link = entry.getAttribute('link');
        
       return node;
    };

    function processRelation(rel){
        var type = rel.getAttribute('type'), subtypes = [];
        
        var subs = rel.getElementsByTagName('subtype');
        for(var i=0; i<subs.length; i++){
            var sub = subs[i];
            
            var edge = {
                source: rel.getAttribute('entry1'),
                target: rel.getAttribute('entry2'),
                name: sub.getAttribute('name'),
                reaction: type,
                line_style: 'solid',
                target_arrow_shape: 'none',
                text: ''
            };
            
            if(edge.name == 'maplink'){
                edge.target_arrow_shape = 'diamond';
            }else if(edge.name == 'indirect effect'){
                edge.line_style = 'dotted';
                edge.target_arrow_shape = 'diamond'
            }else if(edge.name == 'state change'){
                edge.line_style = 'dotted';
            }else if(edge.name == 'missing interaction'){
                edge.line_style = 'dotted';
                edge.target_arrow_shape = 'triangle';
            }else if(edge.name == 'phosphorylation'){
                edge.target_arrow_shape = 'triangle';
                edge.text = 'p+';
            }else if(edge.name == 'dephosphorylation'){
                edge.target_arrow_shape = 'triangle';
                edge.text = 'p-';
            }else if(edge.name == 'glycosylation'){
                //edge.line_style = 'dashed';
                edge.text = 'g+';
                edge.target_arrow_shape = 'circle';
            }else if(edge.name == 'ubiquitination'){
                edge.text = 'u+';
               // edge.line_style = 'dashed';
                edge.target_arrow_shape = 'circle';
            }else if(edge.name == 'methylation'){
                edge.text = 'm+';
               // edge.line_style = 'dashed';
                edge.target_arrow_shape = 'circle';
            }else if(edge.name == 'activation'){
                edge.target_arrow_shape = 'triangle';
            }else if(edge.name == 'inhibition'){
                edge.target_arrow_shape = 'tee';
            }else if(edge.name == 'expression'){
                edge.target_arrow_shape = 'triangle';
            }else if(edge.name == 'repression'){
                edge.target_arrow_shape = 'tee';
            }
            
            return edge;
            
        };
    };

    async function pathProcess(xmlData: any, selectedId: string){
        let pathway = new PathwayObject();

        pathway.selectedId = selectedId;
        console.log(selectedId);
        let pathwayInfo = xmlData.getElementsByTagName('pathway');
        console.log(xmlData);
        let pathName = pathwayInfo[0].attributes[0].nodeValue;
        let pathTitle = pathwayInfo[0].attributes[3].nodeValue;
        pathway.id = pathName;
        pathway.title = pathTitle;

        var entries = xmlData.getElementsByTagName('entry');

        for(let i = 0; i < entries.length; i++){
            let node = await dataToNode(entries[i]);
            if(node.type === 'ortholog' || node.type === 'gene'){
                node.border_width = 1;
            }else if(node.type === 'compound'){
                node.shape = 'ellipse';
                node.bkg_color = '#aaaaee';
                node.text_valign = 'bottom';
            }else if(node.type === 'map'){
                node.shape = 'roundrectangle';
                node.bkg_color = '#00bfff';
            }else if(node.type === 'group'){
                let components = entries[i].getElementsByTagName('component');
                for(let j = 0; j < components.length; j++) {
                   // pathway.node_map[components[j].getAttribute('id')].data.parent = node.id;
                    pathway.node_map[components[j].getAttribute('id')].parent = node.id;
                };    
            }
           // pathway.node_map[node.id] = {data: node};
            pathway.node_map[node.id] = node;
            pathway.nodes.push(pathway.node_map[node.id]);
            let graphics = entries[i].getElementsByTagName('graphics')[0];
            pathway.positions[node.id] = {
                x : +graphics.getAttribute('x'),
                y : +graphics.getAttribute('y')
            };
        }

        var rels = xmlData.getElementsByTagName('relation');
        for(var i = 0; i < rels.length; i++){
            let edge = await processRelation(rels[i]);
            
           // pathway.links.push({
           //     data:edge
           // });
            pathway.links.push(edge);
        }
     
        return pathway;
    }

    async function pathRender(path){
       
        let wrap = d3.select(document.getElementById('pathway-render'));
        wrap.selectAll('*').remove();

        let div = wrap.append('div').attr('id', path.id).classed('pathway', true);
        let header = div.append('h3').text(path.id + ': ');
        header.append('span').append('text').text(path.title);
       // let svg = div.append('svg');
        //let rects = svg.selectAll('rect');
     
        let geneList = path.nodes.filter((d)=> d.type == 'gene');
        console.log(geneList);

        div.append('h4').text('Associated Genes: ');
        let geneDivs = div.selectAll('.geneNames').data(geneList);
        let geneEnter = geneDivs.enter().append('div').classed('geneNames', true);
        geneDivs.exit().remove();
        geneDivs = geneEnter.merge(geneDivs);
        geneDivs.append('text').text((d)=> d.name);
        let selectedGene = geneDivs.filter((g)=> g.keggId.includes(path.selectedId));
        selectedGene.classed('selected', true);

        let chosen = path.nodes.filter((g)=> g.keggId.includes(path.selectedId));
        console.log(chosen);
    }
}
