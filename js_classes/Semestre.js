var UE = require('./UE.js');
module.exports = class Semestre{
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

    set code(code){
        var regex = RegExp('...SEM..');
        if(regex.test(code)){
            this.code = code;
        }
    }
}