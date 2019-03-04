var Note = require('./Note.js');
module.exports = class Matiere{
    constructor(code, intitule){
        this.code = code;
        this.intitule = intitule;
        this.notes = new Array();
    }

    addNote(note){
        if(note instanceof Note){
            this.notes.push(note);
        }
    }

    set code(code){
        var regex = RegExp('...MD...');
        if(regex.test(code)){
            this.code = code;
        }
    }
}