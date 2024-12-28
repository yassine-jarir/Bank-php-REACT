<?php
require_once 'controllers/AccountController.php';

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$accountController = new AccountController();

// post an account 
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $accountController->createAccount();
}
// get each account 
if (isset($_GET['action']) && $_GET['action'] === 'getAccounts') {
    $accountController->getAccountsByType();  // Call the controller method
}
// DELETE
if ($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($_GET['action']) && $_GET['action'] === 'deleteAccount') {
    $accountController->deleteAccount();  // Call the controller's delete method
}
// update 
if ($_SERVER['REQUEST_METHOD'] == 'PUT' && isset($_GET['action']) && $_GET['action'] === 'updateAccount') {
    $accountController->updateAccount(); // Call the controller's update method
}
?>