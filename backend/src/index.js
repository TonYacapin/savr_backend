const express = require('express');
require('dotenv').config();
const connectDB = require('./db/connection');
const cors = require('cors'); // <-- Add this line




const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // <-- Add this line
// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Basic route
app.get('/', (req, res) => {
    res.send('Express server is running!');
});

app.use('/pets', require('./routes/petsRoutes'));
app.use('/login', require('./routes/loginRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/savingplans', require('./routes/savingplanRoutes'));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});