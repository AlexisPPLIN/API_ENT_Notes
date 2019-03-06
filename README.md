# API_ENT_Notes
API de récupération de notes de l'ENT de Laval

### Pré-requis
* Docker (https://www.docker.com/)

### Installation
* Téléchargez le fichier [docker-compose.yml](docker-compose.yml) sur votre machine docker
* Executez la commande : `docker-compose up`
* Laissez le serveur s'installer
* L'installation est terminée

:warning: IMPORTANT ! :warning: : 
Vérifiez que votre serveur supporte le HTTPS car cette API requiert l'envoi d'indentifiants et de mots de passes via des requêtes HTTP. 
(vous pouvez utiliser le bot de Let's Encrypt : https://certbot.eff.org/)

### Utilisation de l'API

`GET /getAllNotes`  
Récupère toutes les notes d'un étudiant
* id : identifiant de l'étudiant (ex: i17.....)
* pass : mot de passe
* dep : Département de l'étudiant (INFO, GB, TC, MMI, ...)

`GET /getAnneeNotes`  
Récupère toutes les notes d'un étudiant pour une année (Année 1 = S1 et S2, ...)
* id : identifiant de l'étudiant (ex: i17.....)
* pass : mot de passe
* dep : Département de l'étudiant (INFO, GB, TC, MMI, ...)
* annee : Année référencée (1 ou 2)
