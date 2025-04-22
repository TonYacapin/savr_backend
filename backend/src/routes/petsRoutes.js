const express = require('express');
const router = express.Router();
const { createRandomPet, getUserPets, getAllUsersPets, giftPet, petVsEnvironment, petVsPet } = require('../controllers/petsControllers');
const authMiddleware = require('../middleware/authMiddleware');

// /pets/create - Create a random pet for the authenticated user
router.post('/create', authMiddleware, createRandomPet);

// /pets - Get all pets of the authenticated user
router.get('/', authMiddleware, getUserPets);

router.post('/gift/:petId/:toUserId', authMiddleware, giftPet);

// /pets/all - Get pets of all users
router.get('/all', getAllUsersPets);

router.post('/pve/:petId', authMiddleware, petVsEnvironment);
router.post('/pvp/:petId1/:petId2', authMiddleware,  petVsPet);


module.exports = router;