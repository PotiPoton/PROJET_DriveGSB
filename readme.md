Client side :

index.html charge les fonctions générales ainsi que la navbar par défaut

navbar.js fait en premier lieux un check du token, et, si celui-ci n'existe pas ou est invalide, revoie vers login.js. Sinon il fait son job de navbar !

login.js génère un formulaire de connexion.

Server side :

.env met en place un environnement sécurisé pour divers données (des constantes finalement ?).
.envAccess permet d'accèder à ces fameuses données.

db.Connect.php permet de se connecter à la base de donnée MariaDB.
db.Dialog.php comprend toutes les intéraction directes avec la base de donnée.

WebService.php Permet de travailler sur les données récupérés grâce à db.Dialog.php et de renvoie un resultat pour un eventuel affichage.

index.php fait le moins de travail possible sur les données. Son rôle est d'assurer la sécurité du serveur, et d'envoyées des données au client