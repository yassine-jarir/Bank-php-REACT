<?php
require_once 'BaseModel.php';

class Account extends BaseModel
{
    public $id;
    public $account_number;
    public $holder_name;
    public $balance;
    public $account_type;
    public $interest_rate;
    public $overdraft_limit;
    public $transaction_fee;

    // Set the table name for the Account model
    protected $table_name = "accounts";

    public function __construct($db)
    {
        parent::__construct($db);
    }

    public function create()
    {

        $query = "INSERT INTO " . $this->table_name . " SET account_number=:account_number, holder_name=:holder_name, balance=:balance, account_type=:account_type";
        $stmt = $this->conn->prepare($query);


        $this->bindParams($stmt, [
            ":account_number" => $this->account_number,
            ":holder_name" => $this->holder_name,
            ":balance" => $this->balance,
            ":account_type" => $this->account_type
        ]);


        if ($stmt->execute()) {
            $account_id = $this->conn->lastInsertId();


            if ($this->account_type == 'savings') {
                return $this->insertSavingsAccount($account_id);
            } elseif ($this->account_type == 'current') {
                return $this->insertCurrentAccount($account_id);
            } elseif ($this->account_type == 'business') {
                return $this->insertBusinessAccount($account_id);
            }

            return true;
        }

        return false;
    }

    // Insert data into savings accounts table
    private function insertSavingsAccount($account_id)
    {
        $query = "INSERT INTO savings_accounts SET account_id=:account_id, interest_rate=:interest_rate";
        $stmt = $this->conn->prepare($query);
        $this->bindParams($stmt, [
            ":account_id" => $account_id,
            ":interest_rate" => $this->interest_rate
        ]);
        return $stmt->execute();
    }

    private function insertCurrentAccount($account_id)
    {
        $query = "INSERT INTO current_accounts SET account_id=:account_id, overdraft_limit=:overdraft_limit";
        $stmt = $this->conn->prepare($query);
        $this->bindParams($stmt, [
            ":account_id" => $account_id,
            ":overdraft_limit" => $this->overdraft_limit
        ]);
        return $stmt->execute();
    }

    private function insertBusinessAccount($account_id)
    {
        $query = "INSERT INTO business_accounts SET account_id=:account_id, transaction_fee=:transaction_fee";
        $stmt = $this->conn->prepare($query);
        $this->bindParams($stmt, [
            ":account_id" => $account_id,
            ":transaction_fee" => $this->transaction_fee
        ]);
        return $stmt->execute();
    }
    public function getAccountsByType($account_type)
    {
        $query = "SELECT a.id, a.account_number, a.holder_name, a.balance, a.account_type,
                        sa.interest_rate, ca.overdraft_limit, ba.transaction_fee
                FROM " . $this->table_name . " a
                LEFT JOIN savings_accounts sa ON a.id = sa.account_id AND a.account_type = 'savings'
                LEFT JOIN current_accounts ca ON a.id = ca.account_id AND a.account_type = 'current'
                LEFT JOIN business_accounts ba ON a.id = ba.account_id AND a.account_type = 'business'
                WHERE a.account_type = :account_type";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':account_type', $account_type, PDO::PARAM_STR);

        $stmt->execute();

         if ($stmt->rowCount() > 0) {
             $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $accounts;
        } else {
            return null;   
        }
    }


    public function deleteAccount($account_id)
    {
        $this->deleteAccountTypeData($account_id);

        $query = "DELETE FROM " . $this->table_name . " WHERE id = :account_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':account_id', $account_id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    private function deleteAccountTypeData($account_id)
    {
        $query = "DELETE FROM savings_accounts WHERE account_id = :account_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':account_id', $account_id, PDO::PARAM_INT);
        $stmt->execute();

        $query = "DELETE FROM current_accounts WHERE account_id = :account_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':account_id', $account_id, PDO::PARAM_INT);
        $stmt->execute();

        $query = "DELETE FROM business_accounts WHERE account_id = :account_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':account_id', $account_id, PDO::PARAM_INT);
        $stmt->execute();
    }

    // update
    private function deleteOldAccountTypeData($account_id, $current_type)
    {
        $table_name = $this->getTypeSpecificTable($current_type);
        if ($table_name) {
            $query = "DELETE FROM $table_name WHERE account_id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $account_id);
            $stmt->execute();
        }
    }

    private function insertNewAccountTypeData($account_id, $new_type, $data)
    {
        $table_name = $this->getTypeSpecificTable($new_type);
        if ($table_name) {
            $query = "INSERT INTO $table_name (account_id, additional_data) VALUES (:id, :additional_data)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $account_id);
            $stmt->bindParam(':additional_data', $data['additional_data']);  
            $stmt->execute();
        }
    }

    private function getTypeSpecificTable($account_type)
    {
        switch ($account_type) {
            case 'savings':
                return 'savings_accounts';
            case 'current':
                return 'current_accounts';
            case 'business':
                return 'business_accounts';
            default:
                return null;
        }
    }
    public function updateAccount($data)
    {
        try {
            $this->conn->beginTransaction();

            $query = "UPDATE " . $this->table_name . " 
                  SET account_number = :account_number, 
                      holder_name = :holder_name, 
                      balance = :balance 
                  WHERE id = :id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':account_number', $data['account_number']);
            $stmt->bindParam(':holder_name', $data['holder_name']);
            $stmt->bindParam(':balance', $data['balance']);
            $stmt->bindParam(':id', $data['id']);
            $stmt->execute();

            switch ($data['account_type']) {
                case 'savings':
                    $this->updateSavingsAccount($data);
                    break;
                case 'current':
                    $this->updateCurrentAccount($data);
                    break;
                case 'business':
                    $this->updateBusinessAccount($data);
                    break;
            }

            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            return false;
        }
    }


    public function getAccountType($account_id)
    {
        $query = "SELECT account_type FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $account_id);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result ? $result['account_type'] : null;
    }

    private function updateSavingsAccount($data)
    {
        $query = "UPDATE savings_accounts 
              SET interest_rate = :interest_rate 
              WHERE account_id = :account_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':interest_rate', $data['interest_rate']);
        $stmt->bindParam(':account_id', $data['id']);
        return $stmt->execute();
    }

    private function updateCurrentAccount($data)
    {
        $query = "UPDATE current_accounts 
              SET overdraft_limit = :overdraft_limit 
              WHERE account_id = :account_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':overdraft_limit', $data['overdraft_limit']);
        $stmt->bindParam(':account_id', $data['id']);
        return $stmt->execute();
    }

    private function updateBusinessAccount($data)
    {
        $query = "UPDATE business_accounts 
              SET transaction_fee = :transaction_fee 
              WHERE account_id = :account_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':transaction_fee', $data['transaction_fee']);
        $stmt->bindParam(':account_id', $data['id']);
        return $stmt->execute();
    }
}
?>