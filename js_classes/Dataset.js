//Récupère les chaines de caractères correspondant à l'intitulé des années des départements
function getDepString(dep){
    switch(dep){
        case "INFO":
            return ["DUT1 INFORMATIQUE","DUT2 INFORMATIQUE"];
        default :
            return null;
    }
}

exports.getDepString = getDepString;