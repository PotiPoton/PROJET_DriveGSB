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

}



?>