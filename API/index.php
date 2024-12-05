<?php
//! Ca marche pas, ca serait pas mal de capter pourquoi un jour
// error_reporting(E_ALL);                         // Enregistre toutes les erreurs
// ini_set('display_errors', 0);                   // Ne pas afficher les erreurs dans le navigateur
// ini_set('log_errors', 1);                       // Activer l'enregistrement des erreurs
// ini_set('error_log', '/logs/php_errors.log');   // Définir le chemin du fichier log

// Générer un erreur explicite pour voir si tout va bien
// echo $undefined_variable;

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    include_once("./functions.php");
    include_once("./WebService.php");
    
    $users = new Users();
    $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    /*----------------------------------------------------------------------------- /
    /                                                                               /
    /                                  Login                                        /
    /                                                                               /
    /------------------------------------------------------------------------------*/
    
    // Login
    if($requestUri === '/index.php/login') {
        $token = $_COOKIE['auth_token'] ?? null;

        $login = $_POST['lgn'] ?? null;
        $password = $_POST['pwd'] ?? null;
    
        try {
            if(!$token || !checkTokenBool($token)) {
                $user = $users->checkInfoCon($login, $password);
                $token = getToken($user);
                //* le 5ème paramètre correspond à l'attribut de sécurité (pour site HTTPS)
                //* le 6ème paramètre correspond à l'attribut de httpOnly (ne pas voir dans les cookies du navigateur);
                //! Que ce soit 'SameSite=None' ou 'SameSite=Lax', cela provoque une erreur qui fait tout planter... c'est inférnal 
                setcookie('auth_token', urlencode($token), time() + 900, '/', '.drivegsb.local', true, true/*, 'SameSite=None'*/);
            }

            echo json_encode(['status' => 'success', 'goTo' => 'home']);
        } catch(Exception $e) {
            http_response_code(401); // Code d'erreur
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }

    } 
    //! useless ???? => vérification dans chaque donnée renvoyé plutot ?
    // else if ($requestUri === '/index.php/check-token') {
    //     $token = $_COOKIE['auth_token'] ?? null;
    
    //     try {
    //         checkToken($token);
    //         echo json_encode(['status' => 'success']);
    //     } catch (Exception $e) {
    //         http_response_code(401);
    //         echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    //     }
    //     exit;
    // }
    
    /*----------------------------------------------------------------------------- /
    /                                                                               /
    /                                   Data                                        /
    /                                                                               /
    /------------------------------------------------------------------------------*/
    // Users list without pwd 
    else if ($requestUri === '/index.php/users') {
        $token = $_COOKIE['auth_token'] ?? null;
        
        try {
            checkToken($token);
            $allUsers = $users->showUsers();
            echo json_encode(['status' => 'success', 'users' => $allUsers]);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
       
}

else {
    http_response_code(405); // Méthode non autorisée
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
}

// if (isset($_POST['lgn']) && isset($_POST['pwd'])) {
//     try {
//         $user = $users->checkInfoCon($_POST['lgn'], $_POST['pwd']);
//         $token = getToken($user);
//         echo json_encode(['status' => 'success', 'user' => $user]);
//     } catch(Exception $e) {
//         // http_response_code(401); //! Ça fait planter lors de la récupération des données côté client --> A checker enfaite
//         echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
//     }
// }

?>