const mongoose = require('mongoose');

const savingPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goalAmount: { 
        type: Number, 
        required: true, 
        min: [1000, 'Goal amount must be at least 1000']
    },
    duration: { type: Number, required: true }, // Duration in days
    currentlySaved: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    dailyAmount: { type: Number }, // Amount to save daily
    startDate: { type: Date }, // When the plan starts
    endDate: { type: Date }, // When the plan ends
    lastSavedDate: { type: Date, default: null }, // Last date user saved
    completedAt: { type: Date, default: null }, // When the plan was completed
}, { timestamps: true });

module.exports = mongoose.model('SavingPlan', savingPlanSchema);