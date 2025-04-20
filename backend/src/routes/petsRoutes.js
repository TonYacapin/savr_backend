const express = require('express');
const router = express.Router();
const { createRandomPet, getUserPets, getAllUsersPets, giftPet } = require('../controllers/petsControllers');
const authMiddleware = require('../middleware/authMiddleware');

// /pets/create - Create a random pet for the authenticated user
router.post('/create', authMiddleware, createRandomPet);

// /pets - Get all pets of the authenticated user
router.get('/', authMiddleware, getUserPets);

router.post('/gift/:petId/:toUserId', authMiddleware, giftPet);

// /pets/all - Get pets of all users
router.get('/all', getAllUsersPets);

module.exports = router;