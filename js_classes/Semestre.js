const UE = require('./UE.js');
class Semestre{
    constructor(code, intitule){
        this.intitule = intitule;
        this.code = code;
        this.content = new Array();
    }

    addElement(elem){

    }

    addUE(ue){
        if(ue instanceof  UE){
            this.content.push(ue);
        }
    }
}
module.exports = Semestre;