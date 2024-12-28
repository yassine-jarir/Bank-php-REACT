<?php
require_once 'config/Database.php';
require_once 'models/Account.php';

class AccountController
{

    private $db;
    private $account;

    public function __construct()
    {
        $this->db = (new Database())->getConnection();
        $this->account = new Account($this->db);
    }

    public function createAccount()
    {
        // Get the JSON data sent via POST
        $data = json_decode(file_get_contents("php://input"));

        // Validate the required fields
        if (
            !isset($data->account_number) ||
            !isset($data->holder_name) ||
            !isset($data->balance) ||
            !isset($data->account_type)
        ) {
            echo json_encode(["message" => "Missing required fields"]);
            return;
        }


        $this->account->account_number = $data->account_number;
        $this->account->holder_name = $data->holder_name;
        $this->account->balance = $data->balance;
        $this->account->account_type = $data->account_type;

        // Set account-specific fields based on account type
        if ($data->account_type == 'savings') {
            if (isset($data->interest_rate)) {
                $this->account->interest_rate = $data->interest_rate;
            } else {
                echo json_encode(["message" => "Interest rate is required for savings accounts"]);
                return;
            }
        } elseif ($data->account_type == 'current') {
            if (isset($data->overdraft_limit)) {
                $this->account->overdraft_limit = $data->overdraft_limit;
            } else {
                echo json_encode(["message" => "Overdraft limit is required for current accounts"]);
                return;
            }
        } elseif ($data->account_type == 'business') {
            if (isset($data->transaction_fee)) {
                $this->account->transaction_fee = $data->transaction_fee;
            } else {
                echo json_encode(["message" => "Transaction fee is required for business accounts"]);
                return;
            }
        }

        // Create the account in the database
        if ($this->account->create()) {
            echo json_encode(["message" => "Account created successfully"]);
        } else {
            echo json_encode(["message" => "Failed to create account"]);
        }
    }
    public function getAccountsByType()
    {
        // Get the account type from the query parameters (e.g., ?account_type=savings)
        $account_type = isset($_GET['account_type']) ? $_GET['account_type'] : null;

        if ($account_type) {
            // Fetch the accounts based on the type
            $accounts = $this->account->getAccountsByType($account_type);

            if ($accounts) {
                echo json_encode($accounts);  // Return the accounts as JSON
            } else {
                echo json_encode(["message" => "No accounts found for this type"]);
            }
        } else {
            echo json_encode(["message" => "Account type is required"]);
        }
    }
    public function deleteAccount()
    {
        // Get the account_id from the URL
        $account_id = isset($_GET['account_id']) ? $_GET['account_id'] : null;

        // Check if account_id is provided
        if ($account_id) {
            // Call the Account model's delete method
            if ($this->account->deleteAccount($account_id)) {
                echo json_encode(["success" => true, "message" => "Account deleted successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to delete account"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Account ID is required"]);
        }
    }

    // update 
 
    public function updateAccount()
    {
        // Get raw input data
        $data = json_decode(file_get_contents("php://input"), true);

        // Validate required fields
        if (!isset($data['id'], $data['account_number'], $data['holder_name'], $data['balance'], $data['account_type'])) {
            echo json_encode(["success" => false, "message" => "Invalid input data"]);
            return;
        }

        // Call the model's update method
        if ($this->account->updateAccount($data)) {
            echo json_encode(["success" => true, "message" => "Account updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update account"]);
        }
    }
}
?>