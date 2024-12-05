<?php

/*----------------------------------------------------------------------------- /
/                                                                               /
/                                   Login                                       /
/                                                                               /
/------------------------------------------------------------------------------*/

include_once '.envAccess.php';

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function getToken($user) {
    try { loadEnv('./.env'); } catch (Exception $e) { throw $e; }

    $secretKey = getenv('SECRET_KEY');

    $header = base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload= base64UrlEncode(json_encode([
        'ideusr' => $user->ideusr,
        'exp' => time() + 900 // 15 minutes
    ]));

    $signature = hash_hmac('sha256', "$header.$payload", $secretKey);
    return "$header.$payload.$signature";
}

function checkToken($jwt) {
    if (!$jwt) throw new Exception('no token');

    try {
        loadEnv('./.env');
    } catch (Exception $e) {
        throw $e;
    }

    $secretKey = getenv('SECRET_KEY');

    [$header, $payload, $signature] = explode('.', $jwt);

    if (!$header || !$payload || !$signature) {
        throw new Exception('invalid token structure');
    }

    $expectedSignature = hash_hmac('sha256', "$header.$payload", $secretKey);
    if ($signature !== $expectedSignature) throw new Exception('invalid token');

    $payload = json_decode(base64UrlDecode($payload), true);
    if (isset($payload['exp']) && time() > $payload['exp']) throw new Exception('expired token');

    return 'valid token';
}

function checkTokenBool($jwt) {
    if (!$jwt) return false;

    try {
        loadEnv('./.env');
    } catch (Exception $e) {
        throw $e;
    }

    $secretKey = getenv('SECRET_KEY');

    [$header, $payload, $signature] = explode('.', $jwt);

    if (!$header || !$payload || !$signature) {
        return false;
    }

    $expectedSignature = hash_hmac('sha256', "$header.$payload", $secretKey);
    if ($signature !== $expectedSignature) return false;

    $payload = json_decode(base64UrlDecode($payload), true);
    if (isset($payload['exp']) && time() > $payload['exp']) return false;

    return true;
}

/*----------------------------------------------------------------------------- /
/                                                                               /
/                                    Data                                       /
/                                                                               /
/------------------------------------------------------------------------------*/

function getFolderStructure($dirPath) {
    $structure = [];
    $items = scandir($dirPath); // Récupère tous les éléments du dossier

    if (!$items) throw new Exception('Aucun éléments existant');

    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;

        $itemPath = $dirPath . DIRECTORY_SEPARATOR . $item;
        $info = [
            'name' => $item,
            // 'path' =>realpath($itemPath),
            'size' => formatSize(filesize($itemPath)),
            'lastModified' => date('Y-m-d H:i:s', filemtime($itemPath))
        ];

        if (is_dir($itemPath)) {
            $info['type'] = 'folder';
            // $info['children'] = getFolderStructure($itemPath);
            $info['size'] = formatSize(getFolderSize($itemPath));
        } else {
            $info['type'] = 'file';
        }

        $structure[] = $info;
    }

    return $structure;
}

function formatSize($size) {

    // if (!$size) throw new Exception('API/functions.php/formatSize() => size is null');

    $units = ['o', 'Ko', 'Mo', 'Go', 'To'];
    $unitIndex = 0;

    while ($size >= 1024 && $unitIndex < count($units) - 1) {
        $size /= 1024;
        $unitIndex++;
    }

    return round($size, 2) . ' ' . $units[$unitIndex];
}

function getFolderSize($dirPath) {
    $totalSize = 0;
    $items = scandir($dirPath);

    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;

        $itemPath = $dirPath . DIRECTORY_SEPARATOR . $item;

        if (is_dir($itemPath)) {
            // Récursion pour calculer la taille des sous-dossiers
            $totalSize += getFolderSize($itemPath);
        } else {
            // Ajouter la taille du fichier
            $totalSize += filesize($itemPath);
        }
    }

    return $totalSize;
}


?>