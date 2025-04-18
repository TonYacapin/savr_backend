const mongoose = require('mongoose');

const savingPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goalAmount: { 
        type: Number, 
        required: true, 
        min: [1000, 'Goal amount must be at least 1000'] // Minimum goal amount is 1000
    },
    duration: { type: Number, required: true }, // Duration in months
    currentlySaved: { type: Number, default: 0 }, // Default to 0
    isCompleted: { type: Boolean, default: false }, // Default to false
    petReward: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pet', 
        required: true 
    }, // Reference to the Pet model
}, { timestamps: true });

module.exports = mongoose.model('SavingPlan', savingPlanSchema);