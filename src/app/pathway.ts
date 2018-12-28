
class PathwayObject {

    name: string;
    paths: any;
    
    constructor() {

    }
}


export class Pathway {

    pathwayObject: object;
 
    constructor() {
        this.pathwayObject = new PathwayObject();
      
    }

    async function pathRender(){
        return Pathway;
    }

    
   
}
