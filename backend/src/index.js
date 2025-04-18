const express = require('express');
require('dotenv').config();
const connectDB = require('./db/connection');




const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Basic route
app.get('/', (req, res) => {
    res.send('Express server is running!');
});


app.use('/login', require('./routes/loginRoutes'));
app.use('/users', require('./routes/userRoutes'));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});