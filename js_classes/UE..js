var Matiere = require('./Matiere.js');
module.exports = class UE{
    constructor(code,intitule){
        this.code = code;
        this.intitule = intitule;
        this.matieres = new Array();
    }

    addMatiere(matiere){
        if(matiere instanceof Matiere){
            this.matieres.push(matiere);
        }
    }

    set code(code){
        var regex = RegExp('...UE...');
        if(regex.test(code)){
            this.code = code;
        }
    }
}