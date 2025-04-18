const express = require('express');
const router = express.Router();
const { createSavingPlan, getUserSavingPlans, updateSavingPlan } = require('../controllers/savingplanControllers');
const authMiddleware = require('../middleware/authMiddleware');



// /savingplans/create
router.post('/create', authMiddleware, createSavingPlan);
// /savingplans
router.get('/', authMiddleware, getUserSavingPlans);

router.put('/update', authMiddleware, updateSavingPlan);

module.exports = router;