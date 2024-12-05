<?php

include_once("./.envAccess.php");

class Connect{

    public static function DbConnect(){
        try { loadEnv('./.env'); } catch(Expection $e) { throw $e; }
        try {
            $dsn = 'mysql:host='.getenv('DB_HOST').';dbname='.getenv('DB_NAME');
            $db = new PDO($dsn, getenv('DB_USER'), getenv('DB_PWD'));
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $db->exec("SET CHARACTER SET utf8");
        return $db;
        }
        catch(PDOException $e){
            throw new Exception("Error 'db.Connect.php/DbConnect()' - ".$e->getMessage());
        }
    }

    // public static function DbDisconnect(){

    // }

}



?>