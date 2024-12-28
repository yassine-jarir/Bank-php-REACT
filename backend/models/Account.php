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
        // Insert the common account data into the main accounts table
        $query = "INSERT INTO " . $this->table_name . " SET account_number=:account_number, holder_name=:holder_name, balance=:balance, account_type=:account_type";
        $stmt = $this->conn->prepare($query);

        // Bind the values
        $this->bindParams($stmt, [
            ":account_number" => $this->account_number,
            ":holder_name" => $this->holder_name,
            ":balance" => $this->balance,
            ":account_type" => $this->account_type
        ]);

        // Execute the query
        if ($stmt->execute()) {
            $account_id = $this->conn->lastInsertId();

            // Insert type-specific data into separate tables
            if ($this->account_type == 'savings') {
                return $this->insertSavingsAccount($account_id);
            } elseif ($this->account_type == 'current') {
                return $this->insertCurrentAccount($account_id);
            } elseif ($this->account_type == 'business') {
                return $this->insertBusinessAccount($account_id);
            }

            return true;  // Successfully inserted the common account data
        }

        return false;  // If account creation failed
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
    // Fetch all accounts with their type-specific details
    public function getAccountsByType($account_type)
    {
        // Define the query with an INNER JOIN based on account type
        $query = "SELECT a.id, a.account_number, a.holder_name, a.balance, a.account_type,
                        sa.interest_rate, ca.overdraft_limit, ba.transaction_fee
                FROM " . $this->table_name . " a
                LEFT JOIN savings_accounts sa ON a.id = sa.account_id AND a.account_type = 'savings'
                LEFT JOIN current_accounts ca ON a.id = ca.account_id AND a.account_type = 'current'
                LEFT JOIN business_accounts ba ON a.id = ba.account_id AND a.account_type = 'business'
                WHERE a.account_type = :account_type";

        // Prepare the query
        $stmt = $this->conn->prepare($query);

        // Bind the account type parameter
        $stmt->bindParam(':account_type', $account_type, PDO::PARAM_STR);

        // Execute the query
        $stmt->execute();

        // Check if any records are returned
        if ($stmt->rowCount() > 0) {
            // Fetch the results as an associative array
            $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $accounts;
        } else {
            return null;  // No accounts found for the specified account type
        }
    }


    // Method to delete an account by ID
    public function deleteAccount($account_id)
    {
        // Delete type-specific data from corresponding tables
        $this->deleteAccountTypeData($account_id);

        // Delete the main account from the accounts table
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :account_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':account_id', $account_id, PDO::PARAM_INT);

        // Execute the query and return the result
        return $stmt->execute();
    }

    // Delete data from type-specific tables (savings, current, business)
    private function deleteAccountTypeData($account_id)
    {
        // For savings accounts
        $query = "DELETE FROM savings_accounts WHERE account_id = :account_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':account_id', $account_id, PDO::PARAM_INT);
        $stmt->execute();

        // For current accounts
        $query = "DELETE FROM current_accounts WHERE account_id = :account_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':account_id', $account_id, PDO::PARAM_INT);
        $stmt->execute();

        // For business accounts
        $query = "DELETE FROM business_accounts WHERE account_id = :account_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':account_id', $account_id, PDO::PARAM_INT);
        $stmt->execute();
    }

    // update 
    public function updateAccount($data) {
        // Update general account fields
        $query = "UPDATE " . $this->table_name . " 
                  SET 
                      account_number = :account_number, 
                      holder_name = :holder_name, 
                      balance = :balance, 
                      account_type = :account_type 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':account_number', $data['account_number']);
        $stmt->bindParam(':holder_name', $data['holder_name']);
        $stmt->bindParam(':balance', $data['balance']);
        $stmt->bindParam(':account_type', $data['account_type']);
        $stmt->bindParam(':id', $data['id']);

        if (!$stmt->execute()) {
            return false; // Stop if the base account update fails
        }

        // Update type-specific account details
        switch ($data['account_type']) {
            case 'Savings':
                return $this->updateSavingsAccount($data);
            case 'Current':
                return $this->updateCurrentAccount($data);
            case 'Business':
                return $this->updateBusinessAccount($data);
            default:
                return false;
        }}
        // Update savings account
    private function updateSavingsAccount($data) {
        $query = "UPDATE savings_accounts 
                  SET interest_rate = :interest_rate 
                  WHERE account_id = :account_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':interest_rate', $data['interest_rate']);
        $stmt->bindParam(':account_id', $data['id']);

        return $stmt->execute();
    }

    // Update current account
    private function updateCurrentAccount($data) {
        $query = "UPDATE current_accounts 
                  SET overdraft_limit = :overdraft_limit 
                  WHERE account_id = :account_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':overdraft_limit', $data['overdraft_limit']);
        $stmt->bindParam(':account_id', $data['id']);

        return $stmt->execute();
    }

    // Update business account
    private function updateBusinessAccount($data) {
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