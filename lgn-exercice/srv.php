<?php 

class user {
    public $id;
    public $name;
    public $login;

    function __contructor($id, $name, $login) {
        $this->id = $id;
        $this->name = $name;
        $this->login = $login;
    }
}

function checkLgn($lgn, $pwd) {
    if ($lgn == 'dandre' && $pwd == 'oppg5') {
        $usr = new user('a117', 'david', 'dandre');
        return $usr;
    }
    else {
        return null;
    }
}

if (isset($_GET['lgn']) && isset($_GET['pwd'])) { 
    echo checkLgn($_GET['lgn'], $_GET['pwd']);
}

?>