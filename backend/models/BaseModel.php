<?php

class BaseModel
{
    protected $conn;

        public function __construct($db)
    {
        $this->conn = $db;
    }

    // Function to bind parameters to SQL statements
    protected function bindParams($stmt, $params)
    {
        foreach ($params as $key => $value) {
            // Bind each parameter to the statement
            $stmt->bindValue($key, $value, PDO::PARAM_STR);
        }
    }
}

?>