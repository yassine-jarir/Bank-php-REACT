<?php
// Include necessary files
require_once 'controllers/AccountController.php';

// Create an instance of the AccountController
$accountController = new AccountController();

// Handle the request method
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $accountController->createAccount();
}
if (isset($_GET['action']) && $_GET['action'] === 'getAccounts') {
    $accountController->getAccountsByType();  // Call the controller method
} else {
    echo json_encode(["message" => "Invalid action"]);
}
// DELETE
if ($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($_GET['action']) && $_GET['action'] === 'deleteAccount') {
    $accountController->deleteAccount();  // Call the controller's delete method
} else {
    echo json_encode(["message" => "Invalid request"]);
}
// update 
if ($_SERVER['REQUEST_METHOD'] == 'PUT' && isset($_GET['action']) && $_GET['action'] === 'updateAccount') {
    $accountController->updateAccount(); // Call the controller's update method
} else {
    echo json_encode(["message" => "Invalid request"]);
}
?>