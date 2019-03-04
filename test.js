const fs = require('fs');
const convert = require('html-to-json-data');
const {group, text, number, href, src, uniq} = require('html-to-json-data/definitions');

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

var Matiere = require('./js_classes/Matiere.js');
var Note = require('./js_classes/Note.js');
var Semestre = require('./js_classes/Semestre.js');
var UE = require('./js_classes/UE.js');

var username = 'i172897';
var password = 'yzu67df'

const {Builder, By, Key, until} = require('selenium-webdriver');


(async function example() {
    let driver = await new Builder().forBrowser('chrome').usingServer('http://localhost:4444/wd/hub').build();
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
        await driver.findElement(webdriver.By.xpath("//*[text()[contains(., 'DUT1 INFORMATIQUE')]]")).click();

        var str = await driver.findElement(webdriver.By.xpath("/html/body/table[4]/tbody/tr/td/table[1]/tbody/tr[2]/td/table/tbody/tr[1]/td[2]/table/tbody/tr/td/table[5]/tbody")).getAttribute('innerHTML');

        //write test to file
        await fs.writeFile("test.html", str, function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });

        await generateJson(str);

    } finally {
        await driver.quit();
    }
})();

//Parse html into json
function generateJson(html) {
    //var json = html2json(html);

    const html2 = '<table>' + html + '</table>';

    const json = convert(html2, {
        tableau: group('tr', {
            ligne: text('td'),
        }),
    });

    //console.log(json);
    reformatJson(json);


    fs.writeFile("test.json", JSON.stringify(json), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
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
    Object.keys(info_section).forEach(function(key){
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
    Object.keys(json).forEach(function(key) {
        var index = 0;
        var modele = JSON.parse(JSON.stringify(note_matiere));
        var ligne = json[key]['ligne'];

        if(key !== "0" && key !== "1"){
            Object.keys(ligne).forEach(function(key2){
                var val = ligne[key2];
                if(val !== ""){
                    var key_index = Object.keys(modele)[index];
                    modele[key_index] = val;
                    index++;
                }
            });
            notes.push(modele);
        }
    });

    //console.log(notes);

    var array = new Array();
    notes.forEach(function(element){
        //console.log(element);
        var regex_semestre = RegExp('...SEM..');
        var regex_ue = RegExp('...UE...');
        var regex_matiere = RegExp('...MD...');
        var regex_note = RegExp('...EN.....');

        if(regex_semestre.test(element.Code)){
            var semestre = new Semestre(element.Code, element.Description);
            array.push(semestre);
        }
        if(regex_ue.test(element.Code)){

        }
        if(regex_matiere.test(element.Code)){

        }
        if(regex_note.test(element.Code)) {

        }
    });


    //Sauvegarde du nouveau fichier
    fs.writeFile("test2.json", JSON.stringify(info_section), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}
