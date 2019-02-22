const fs = require('fs');
const html2json = require('html2json').html2json;
const convert = require('html-to-json-data');
const { group, text, number, href, src, uniq } = require('html-to-json-data/definitions');

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

var username = 'i172897';
var password = 'yzu67df'

const { Builder, By, Key, until } = require('selenium-webdriver');

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
    await fs.writeFile("test.txt", str, function (err) {
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
function generateJson(html){
  //var json = html2json(html);

  const json = convert(html, {
    repos: group('tr', text(':self')),
  });


  fs.writeFile("test.json", JSON.stringify(json), function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
}

function cleanJson(){
  
}
