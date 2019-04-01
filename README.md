# API_ENT_Notes
API de récupération de notes de l'ENT de Laval

### Crédits
Ce projet a été réalisé dans le cadre d'un projet tuteuré de semestre 4 en DUT Informatique à l'IUT de Laval par :
* Alexis POUPELIN (développeur de l'API)
* Quentin PINEAU (développeur de l'application Android/IOS utilisant l'API)

### Pré-requis
* Serveur linux avec Docker installé (https://www.docker.com/)
* Un nom de domaine (obligatoire pour le transfers des mots de passes en HTTPS)

### Installation
#### Etape 1 - Création des fichiers importants

* Clonez le repository sur votre serveur : `git clone https://github.com/codevirtuel/API_ENT_Notes.git`
* Créez un nouvel utilisateur (n'utilisez par le compte root)  
`sudo useradd nom_du_compte`  
`sudo passwd nom_du_compte` pour donner un mot de passe
* Allez dans le dossier personnel de l'utilisateur  
`cd ~`  
* Executez le code suivant pour créer l'arboresence :    
`mkdir node_project && cd node_project && mkdir dhparam && mkdir views`
* Déplacez vous dans le nouveau dossier dhparam  
`cd node_project/dhparam`
* Générez le ficher suivant avec la commande :  
`sudo openssl dhparam -dsaparam -out dhparam-2048.pem 2048`

#### Etape 2 - Edition des configs

* Retournez dans le dossier du repository 'API_ENT_NOTES'
* Editez le fichier `nginx-conf/nginx.conf` et modifiez les lignes suivantes :  
`l4 : server_name [votre nom de domaine]`  
`l19 : server_name [votre nom de domaine] [votre nom de domaine]`  
`l19 : server_name [votre nom de domaine] [votre nom de domaine]`  
`l23 : ssl_certificate /etc/letsencrypt/live/[votre nom de domaine]/fullchain.pem;`  
`l24 : ssl_certificate_key /etc/letsencrypt/live/[votre nom de domaine]/privkey.pem`  
`l25 : ssl_trusted_certificate /etc/letsencrypt/live/[votre nom de domaine]/fullchain.pem`  
* Editez le fichier `docker-compose.yml` et modifiez les lignes suivantes :  
`l39 : command: ... --email email@[votre nom de domaine] ... -d [votre nom de domaine] -d [votre nom de domaine](avec www.)`  
`l47 : device: /home/[Nom du compte précédement crée]/node_project/views/`  
`l53 : device: /home/[Nom du compte précédement crée]/node_project/dhparam/`  

#### Etape 3 - Génération du conteneur Docker

* Allez à la racine du dossier API_ENT_NOTES
* Lancez la commande suivante pour générer le conteneur Docker :  
`docker build -t codevirtuel/api_ent_notes .`  

#### Etape 4 - Lancement du serveur

* Lancez la commande suivante pour lancer votre serveur :  
`docker-compose up`  
* Si vous voulez stopper votre serveur, utilisez :  
`docker-compose down`  


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
