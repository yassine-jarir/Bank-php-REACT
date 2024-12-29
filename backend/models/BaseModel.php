<?php

class BaseModel
{
    protected $conn;

        public function __construct($db)
    {
        $this->conn = $db;
    }

     
    protected function bindParams($stmt, $params)
    {
        foreach ($params as $key => $value) {
            
            $stmt->bindValue($key, $value, PDO::PARAM_STR);
        }
    }
}

?>