const express = require('express');
const router = express.Router();
const { createRandomPet, getUserPets, getAllUsersPets } = require('../controllers/petsControllers');
const authMiddleware = require('../middleware/authMiddleware');

// /pets/create - Create a random pet for the authenticated user
router.post('/create', authMiddleware, createRandomPet);

// /pets - Get all pets of the authenticated user
router.get('/', authMiddleware, getUserPets);

// /pets/all - Get pets of all users
router.get('/all', authMiddleware, getAllUsersPets);

module.exports = router;