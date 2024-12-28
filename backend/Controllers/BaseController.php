<?php
abstract class BaseController
{
    protected $db;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    abstract public function index();
}