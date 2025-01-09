<?php

include_once './db.Dialog.php';
include_once './functions.php';

class Users {

    public function checkInfoCon($lgn, $pwd) {
        if (!$lgn || !$pwd) throw new Exception('Veuillez remplir tous les champs');
        
        $user = Dialog::getUserByLgn($lgn);

        if (!$user || !password_verify($pwd, $user->pwd)) {
            throw new Exception('Mot de passe incorrect');
        }
        
        return $user;
    }

    public function getUser($token) {
        $ide = getIdeFromToken($token);
        $user = Dialog::getUserByIde($ide);

        return $user;
    }

    public function showUsers() {
        $users = Dialog::getUsers();

        if (!$users) throw new Exception('Aucun utilisateur !');


        return $users;
    }

    public function setHashPwd() {
        $users = Dialog::getUsers();
        foreach ($users as $user) {
            Dialog::setHashPwd($user->ideusr, password_hash($user->tempclearpwd, PASSWORD_DEFAULT));
        }
        return;
    }
}

class Resource {

    //Root folder
    private $root;

    public function __construct($root){
        $this->root = $root;
    }

    public function updateFileStructure($dirPath = null, $parentId = null) {
        if (!$dirPath) $dirPath = $this->root;

        $items = scandir($dirPath);
        if (!$items) {
            throw new Exception('Aucun élément existant');
        }

        foreach ($items as $item) {
            if ($item === '.' || $item === '..') continue;
    
            $itemPath = $dirPath . DIRECTORY_SEPARATOR . $item;
            $itemType = is_dir($itemPath) ? 'folder' : 'file';
            $lastModified = date('Y-m-d H:i:s', filemtime($itemPath));
            // Ici pas de formatSize(); car cela retournerais "0 o" par ex, or pour la db c'est INT et non VARCAHR
            $size = $itemType == 'folder' ? getFolderSize($itemPath) : filesize($itemPath);
    
            // Vérifier si l'élément existe déjà dans la base de données
            $result = Dialog::checkIfResourceExists($item, $parentId);
            
            if ($result) {
                // L'élément existe déjà, on le met à jour
                $id = Dialog::updateResource($result, $size, $lastModified);
            } else {
                // L'élément n'existe pas, on l'ajoute
                $id = Dialog::insertResource($parentId, $item, $itemType, $size, $lastModified);
            }
    
            // Si c'est un dossier, on appelle récursivement pour ses sous-dossiers et fichiers
            if ($itemType === 'folder') {
                $this->updateFileStructure($itemPath, $id);
            }
        }
    
        // Supprimer les éléments qui n'existent plus sur le disque
        $this->deleteRemovedItems($dirPath, $parentId);
    }

    private function deleteRemovedItems($dirPath, $parentId) {
        $items = scandir($dirPath);
        $itemNames = array_diff($items, ['.', '..']);
    
        // Récupérer tous les éléments existants dans la base pour ce dossier
        $result = Dialog::getExistingResource($parentId);

    
        $existingItems = [];
        foreach ($result as $row) {
            $existingItems[$row['idersc']] = $row['nmersc'];  
        }
    
        // Trouver les éléments supprimés
        $deletedItems = array_diff($existingItems, $itemNames);
    
        // Supprimer les éléments qui n'existent plus
        foreach ($deletedItems as $id => $name) {
            Dialog::deleteResource($id);
        }
    }

    public function getFolderContent($idersc) {
        if (empty($idersc) || $idersc === 'null') return Dialog::getRootContent();
        else return Dialog::getFolderContent($idersc);
    }

    public function getResource($idersc) {
        return Dialog::getResource($idersc);
    }

    public function getFileContent($idersc) {
        $path = $this->getPath($idersc);
        if (!file_exists($path)) throw new Exception("Le fichier n'existe pas");
        return file_get_contents($path);
    }

    private function getPath($idersc) {
        $resource = Dialog::getResource($idersc);
        $path = "";

        while ($resource) {
            $path = "\\$resource->nmersc" . $path;
            $resource = Dialog::getResource($resource->ideprt);
        }

        return $this->root.$path;
    }

}

// $idersc = 5;
// $resource = new Resource('C:\\Users\\PotiPoton\\Documents\\Informatique\\Arbo de test');
// $test = $resource->getFile($idersc);
// echo $test;

?>