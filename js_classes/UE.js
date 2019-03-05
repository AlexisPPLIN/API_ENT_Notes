const Matiere = require('./Matiere.js');
class UE{
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
}
module.exports = UE;