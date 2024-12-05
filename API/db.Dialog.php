<?php

include_once 'db.Connect.php';

class Dialog {

    public static function getUsers() {
        $con = Connect::DbConnect();
        $query = "SELECT ideusr, lgn, lnm, fnm FROM user";
        $sth = $con->prepare($query);
        $sth->execute();
        $result = $sth->fetchAll(PDO::FETCH_CLASS);

        if (empty($result)) throw new Exception("Aucun objet n'existe pour ces paramètres");
        
        return $result;
    }

    public static function getUserByLgn($lgn) {
        $con = Connect::DbConnect();
        $query = "SELECT * FROM user WHERE lgn=:lgn";
        $sth = $con->prepare($query);
        $sth->bindParam(':lgn', $lgn);
        $sth->execute();
        $result = $sth->fetch(PDO::FETCH_OBJ);

        if (!$result) throw new Exception("Identifiant incorrect");

        return $result;
    }

    public static function setHashPwd($id, $newPwd){
        try {
            $con = Connect::DbConnect();
            $query = "UPDATE user SET pwd=:newPwd WHERE ideusr=:id";
            $sth = $con->prepare($query);
            $sth->bindParam(':newPwd', $newPwd);
            $sth->bindParam(':id', $id);
            $sth->execute();
            return;
        } catch (PDOException $e) {
            throw new Exception("Error 'db.Dialog.php/setHashPwd()' - ".$e->getMessage());
        }
    }

    public static function checkIfResourceExists($item, $parentId) {
        $con = Connect::DbConnect();
        $query = "SELECT * FROM resource WHERE nmersc=:item AND ideprt=:parentId";
        $stmt = $con->prepare($query);
        $stmt->bindParam(':item', $item);
        $stmt->bindParam(':parentId', $parentId);
        // $stmt->bind_param('si', $item, $parentId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_OBJ);
        
        return $result;
    }

    public static function updateResource($result, $size, $lastModified) {
        try {
            $con = Connect::DbConnect();
            $row = $result->fetch_assoc();
            $id = $row['id'];

            if (!$id) throw new Exception("Error 'db.Dialog.php/updateResource()' - id is null");

            $query = "UPDATE resource SET sze=:sze, lstmod=:lstmod WHERE idersc=:idersc";
            $stmt = $con->prepare($query);
            $stmt->bindParam(':sze', $size);
            $stmt->bindParam(':lstmod', $lastModified);
            $stmt->bindParam(':idersc', $id);
            // $stmt->bind_param('ssi', $size, $lastModified, $id);
            $stmt->execute();

            return $id;
        } catch (PDOException $e) {
            throw new Exception("Error 'db.Dialog.php/updateResource()' - ".$e->getMessage());
        }
    }

    public static function insertResource($parentId, $item, $itemType, $size, $lastModified) {
        try {
            $con = Connect::DbConnect();
            $query = "INSERT INTO resource (ideprt, nmersc, tpe, sze, lstmod) VALUES (:ideprt, :nmersc, :tpe, :sze, :lstmod)";
            $stmt = $con->prepare($query);
            $stmt->bindParam(':ideprt', $parentId);
            $stmt->bindParam(':nmersc', $item);
            $stmt->bindParam(':tpe', $itemType);
            $stmt->bindParam(':sze', $size);
            $stmt->bindParam(':lstmod', $lastModified);
            // $stmt->bind_param('issss', $parentId, $item, $itemType, $size, $lastModified);
            $stmt->execute();
            $id = $stmt->insert_id;  // Récupérer l'ID du dossier ajouté

            if (!$id) throw new Exception("Error 'db.Dialog.php/insertResource()' - id is null");

            return $id;
        } catch(PDOException $e) {
            throw new Exception("Error 'db.Dialog.php/insertResource()' - ".$e->getMessage());
        }
    }

    public static function getExistingResource($parentId) {
        $con = Connect::DbConnect();
        $query = "SELECT idersc, nmersc FROM resource WHERE ideprt=:ideprt";
        $stmt = $con->prepare($query);
        $stmt->bindParam(':ideprt', $parentId);
        // $stmt->bind_param('i', $parentId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_OBJ);

        if (!$result) throw new Exception("Error 'db.Dialog.php/getExistingResource()' - result is null");

        return $result;
    }

    public static function deleteResource($id) {
        try {
            $con = Connect::DbConnect();
            $query = "DELETE FROM resource WHERE idersc=:idersc";
            $stmt = $con->prepare($query);
            $stmt->bindParam(':idersc', $id);
            // $stmt->bind_param('i', $id);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error 'db.Dialog.php/deleteResource()' - ".$e->getMessage());
        }
    }

}



?>