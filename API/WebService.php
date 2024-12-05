<?php

include_once './db.Dialog.php';

class Users {

    public function checkInfoCon($lgn, $pwd) {
        if (!$lgn || !$pwd) throw new Exception('Veuillez remplir tous les champs');
        
        $user = Dialog::getUserByLgn($lgn);

        if (!$user || !password_verify($pwd, $user->pwd)) {
            throw new Exception('Mot de passe incorrect');
        }
        
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

?>