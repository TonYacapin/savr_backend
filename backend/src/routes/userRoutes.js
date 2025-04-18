const express = require('express');
const router = express.Router();
const { createUser, getUsers } = require('../controllers/userControllers');

// Create User
router.post('/', createUser);

// Get All Users
router.get('/', getUsers);

module.exports = router;