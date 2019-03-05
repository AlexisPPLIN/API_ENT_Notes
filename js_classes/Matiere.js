const Note = require('./Note.js');
class Matiere{
    constructor(code, intitule, moyenne){
        this.code = code;
        this.intitule = intitule;
        this.moyenne = moyenne;
        this.notes = new Array();
    }

    addNote(note){
        if(note instanceof Note){
            this.notes.push(note);
        }
    }
}
module.exports = Matiere;