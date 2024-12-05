<?php

function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        throw new Exception("Le fichier .env est introuvable : $filePath");
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {

        if (strpos(trim($line), '#') === 0) continue;

        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        $_ENV[$key] = $value;
        putenv("$key=$value");
    }

    checkEnv();
}

function checkEnv() {
    foreach(['SECRET_KEY', 'DB_NAME', 'DB_HOST', 'DB_USER', 'DB_PWD'] as $var) {
        if (!getenv($var)) {
            throw new Exception("$var is missing in .env");
        }
    }
}

?>