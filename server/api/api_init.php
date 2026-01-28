<?php
// Global Headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-API-KEY");
header("Content-Type: application/json");

// Handle pre-flight (OPTIONS) requests automatically
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Include the database here too so you don't have to keep requiring it
require_once '../config/db.php';

define('ADMIN_API_KEY', 'Pastorlikeme01');