<?php
// include_

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

//!OLD
// function login($lgn, $pwd) {
//     $url = 'http://localhost/GSB/loginGSB/API/';

//     $ch = curl_init($url);

//     curl_setopt($ch, CURLOPT_POST, true); // Méthode POST
//     curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['lgn' => $lgn, 'pwd' => $pwd])); // Corps de la requête
//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Retourner la réponse sous forme de chaîne
//     curl_setopt($ch, CURLOPT_HTTPHEADER, [
//         'Content-Type: application/x-www-form-urlencoded' // Définir les en-têtes
//     ]);

//     $response = curl_exec($ch);

//     if (curl_errno($ch)) {
//         throw new Exception('Erreur cURL : '.curl_error($ch));
//     }

//     curl_close($ch);

//     $data = json_decode($response);

//     if ($data->status === 'error') throw new Exception($data->message());
// }



?>