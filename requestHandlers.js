var querystring = require("querystring"),
    fs = require("fs"),
    url = require("url");

var note = require('./test.js');
var dataset = require('./js_classes/Dataset.js');

function start(response) {
  console.log("Le gestionnaire 'start' est appelé.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    "<h2>Bienvenue sur la page d\'accueil de l'API de récupération de notes </h2>"+
    "<span>Merci de vous referer à la documentation : </span>"+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

//Récupère toutes les notes disponibles pour un utilisateur donnée
//Arguments : id (i17....) , pass (mot de passe) , dep (département : INFO, GB, TC, MMI)
function getAllNotes(response, request) {
  //récupération des arguments
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;

  if(query.id != null && query.pass != null && query.dep != null){
    //Récupération des objets json
    (async function example() {
      var depString = dataset.getDepString(query.dep);
      var arrayJson = new Array();

      if(depString == null){
        response.writeHead(501, {'Content-Type': 'text/plain'});
        response.end('Departement '+query.dep+' non supporté par l\'API');
      }

      const start = async () => {
        await asyncForEach(depString, async (string) => {
          console.log(string);
          var json = await note.getNotes(query.id,query.pass,string);
          if(await json == null){
            await response.writeHead(501, {'Content-Type': 'text/plain'});
            await response.end('Login failed or wrong parameters');
          }
          await arrayJson.push(json);
        });
      }
      await start();

      //var json = await note.getNotes("i172897","yzu67df","DUT1 INFORMATIQUE");
      await response.writeHead(200, {'Content-Type': 'application/json'});
      await response.end(JSON.stringify(arrayJson));
    })();

  }else{
    //Il manque des arguments
    response.writeHead(400, {'Content-Type': 'text/plain'});
    response.end('Missing parameters');
  }
}

//Récupère toutes les notes d'un semestre en particulier
//Arguments : id (i17....) , pass (mot de passe) , dep (département : INFO, GB, TC, MMI), annee (Annee : 1 ou 2 ..)
function getAnneeNotes(response, request) {
  //récupération des arguments
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;

  if(query.id != null && query.pass != null && query.dep != null && query.annee != null){
    //Récupération des objets json
    (async function example() {
      var depString = dataset.getDepString(query.dep);

      if(depString == null){
        response.writeHead(501, {'Content-Type': 'text/plain'});
        response.end('Departement '+query.dep+' non supporté par l\'API');
      }

      var index = Math.abs(query.annee-1);
      var json = await note.getNotes(query.id,query.pass,depString[index]);
      if(await json == null){
        await response.writeHead(501, {'Content-Type': 'text/plain'});
        await response.end('Login failed or wrong parameters');
      }

      await response.writeHead(200, {'Content-Type': 'application/json'});
      await response.end(JSON.stringify(json));
    })();
  }else{
    //Il manque des arguments
    response.writeHead(400, {'Content-Type': 'text/plain'});
    response.end('Missing parameters');
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

exports.start = start;
exports.getAllNotes = getAllNotes;
exports.getAnneeNotes = getAnneeNotes;
