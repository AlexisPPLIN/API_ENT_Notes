const fs = require('fs');
const convert = require('html-to-json-data');
const {group, text, number, href, src, uniq} = require('html-to-json-data/definitions');

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

const Matiere = require('./js_classes/Matiere');
const Note = require('./js_classes/Note');
const Semestre = require('./js_classes/Semestre');
const UE = require('./js_classes/UE');
const {Builder, By, Key, until} = require('selenium-webdriver');


async function getNotes(username, password, onglet) {
    let driver = await new Builder().forBrowser('chrome').usingServer('http://selenium:4444/wd/hub').build();
    try {
        //Se rendre sur la page de connection de l'ent
        await driver.get('https://cas.univ-lemans.fr/cas/login?service=http://ent.univ-lemans.fr/Login');
        //Remplir le formulaire de connection
        await driver.findElement(webdriver.By.css("input#username")).sendKeys(username);
        await driver.findElement(webdriver.By.css("input#password")).sendKeys(password);
        await driver.findElement(webdriver.By.css("button.btn")).click();

        //Cliquer sur l'onglet "Scolarité"
        await driver.findElement(webdriver.By.xpath("//*[text()[contains(., 'Scolarité')]]")).click();

        //Cliquer sur "Notes et résultat"
        await driver.findElement(webdriver.By.xpath("//*[text()[contains(., 'Notes et résultats')]]")).click();

        //Cliquer sur "DUT1 INFORMATIQUE"
        await driver.findElement(webdriver.By.xpath("//*[text()[contains(., '" + onglet + "')]]")).click();

        var str = await driver.findElement(webdriver.By.xpath("/html/body/table[4]/tbody/tr/td/table[1]/tbody/tr[2]/td/table/tbody/tr[1]/td[2]/table/tbody/tr/td/table[5]/tbody")).getAttribute('innerHTML');

        return await generateJson(str);

    }
    catch(error){
        return null;
    }
    finally {
        await driver.quit();
    }
}


//Parse html into json
function generateJson(html) {
    //var json = html2json(html);

    const html2 = '<table>' + html + '</table>';

    const json = convert(html2, {
        tableau: group('tr', {
            ligne: text('td'),
        }),
    });

    //Reformatage du json brut en un json facile à traiter
    var newJson = reformatJson(json);
    return newJson;
}

function reformatJson(json) {
    //Construct first line with year info
    json = json['tableau'];

    var info_section = {
        Annee: '',
        Code: '',
        Libelle: '',
        Session1: '',
        ResultatSes1: '',
        Session2: '',
        ResultatSes: ''
    };

    var index = 0;
    Object.keys(info_section).forEach(function (key) {
        var value = json[1]['ligne'][index];
        info_section[key] = value;
        index++;
    });

    //Récupérations des notes
    var note_matiere = {
        Code: '',
        Description: '',
        Note: '',
        Resultat: ''
    };

    var notes = new Array();
    Object.keys(json).forEach(function (key) {
        var index = 0;
        var modele = JSON.parse(JSON.stringify(note_matiere));
        var ligne = json[key]['ligne'];

        if (key !== "0" && key !== "1") {
            Object.keys(ligne).forEach(function (key2) {
                var val = ligne[key2];
                if (val !== "") {
                    var key_index = Object.keys(modele)[index];
                    modele[key_index] = val;
                    index++;
                }
            });
            notes.push(modele);
        }
    });


    var array = new Array();
    var pres_sem = null;
    var pres_ue = null;
    var pres_matiere = null;
    var pres_note = null;
    notes.forEach(function (element) {
        //console.log(element);
        var regex_semestre = RegExp('...SEM..');
        var regex_ue = RegExp('...UE...');
        var regex_matiere = RegExp('...MD...');
        var regex_note = RegExp('...EN.....');

        if (regex_semestre.test(element.Code)) {
            var semestre = new Semestre(element.Code, element.Description);
            array.push(semestre);
            pres_sem = semestre;
        }
        if (regex_ue.test(element.Code)) {
            var ue = new UE(element.Code, element.Description);
            if (pres_sem != null) {
                pres_sem.content.push(ue);
            }

            pres_ue = ue;
        }
        if (regex_matiere.test(element.Code)) {
            var matiere = new Matiere(element.Code, element.Description, element.Note);
            if (pres_ue != null) {
                pres_ue.matieres.push(matiere);
            }

            pres_matiere = matiere;
        }
        if (regex_note.test(element.Code)) {
            var type = element.Code.charAt(8);
            console.log(type);
            if(type !== "P" || type !== "T"){
                type = "unknown";
            }
            var note = new Note(element.Code,type, element.Description, element.Note);
            if (pres_matiere != null) {
                pres_matiere.notes.push(note);
            }

            pres_note = note;
        }
    });

    //Retourne le json traité
    return JSON.parse(JSON.stringify(array));
}

exports.getNotes = getNotes;
