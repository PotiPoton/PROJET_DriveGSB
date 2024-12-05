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

configuration d'apache :

site en HTTPS !!!

httpd-vhosts.conf:
<VirtualHost *:80>
    ServerName www.drivegsb.local
    Redirect permanent / https://www.drivegsb.local/
</VirtualHost>
<VirtualHost *:80>
    ServerName api.drivegsb.local
    Redirect permanent / https://api.drivegsb.local/
</VirtualHost>

httpd-ssl.conf:
<VirtualHost _default_:443>
    #   General setup for the virtual host
    DocumentRoot "C:\Users\PotiPoton\Documents\Informatique\GSB\driveGSB\API"
    ServerName api.drivegsb.local:443
    ErrorLog "${SRVROOT}/logs/error.log"
    TransferLog "${SRVROOT}/logs/access.log"

    SSLEngine on
    SSLCertificateFile "${SRVROOT}/conf/ssl/wildcard.crt"
    SSLCertificateKeyFile "${SRVROOT}/conf/ssl/wildcard.key"

    # CORS headers
    Header always set Access-Control-Allow-Origin "https://www.drivegsb.local"
    Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header always set Access-Control-Allow-Credentials "true"

    <FilesMatch "\.(cgi|shtml|phtml|php)$">
        SSLOptions +StdEnvVars
    </FilesMatch>
    <Directory "${SRVROOT}/cgi-bin">
        SSLOptions +StdEnvVars
        Options -Indexes
        AllowOverride None
        Require all granted
    </Directory>

    BrowserMatch "MSIE [2-5]" \
            nokeepalive ssl-unclean-shutdown \
            downgrade-1.0 force-response-1.0

    CustomLog "${SRVROOT}/logs/ssl_request.log" \
            "%t %h %{SSL_PROTOCOL}x %{SSL_CIPHER}x \"%r\" %b"
</VirtualHost>
<VirtualHost _default_:443>
    #   General setup for the virtual host
    DocumentRoot "C:\Users\PotiPoton\Documents\Informatique\GSB\driveGSB\client"
    ServerName www.drivegsb.local:443
    ErrorLog "${SRVROOT}/logs/error.log"
    TransferLog "${SRVROOT}/logs/access.log"

    SSLEngine on
    SSLCertificateFile "${SRVROOT}/conf/ssl/wildcard.crt"
    SSLCertificateKeyFile "${SRVROOT}/conf/ssl/wildcard.key"

    # CORS headers
    Header always set Access-Control-Allow-Origin "https://www.drivegsb.local"
    Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header always set Access-Control-Allow-Credentials "true"

    <FilesMatch "\.(cgi|shtml|phtml|php)$">
        SSLOptions +StdEnvVars
    </FilesMatch>
    <Directory "${SRVROOT}/cgi-bin">
        SSLOptions +StdEnvVars
        Options -Indexes
        AllowOverride None
        Require all granted
    </Directory>

    BrowserMatch "MSIE [2-5]" \
            nokeepalive ssl-unclean-shutdown \
            downgrade-1.0 force-response-1.0

    CustomLog "${SRVROOT}/logs/ssl_request.log" \
            "%t %h %{SSL_PROTOCOL}x %{SSL_CIPHER}x \"%r\" %b"
</VirtualHost>       