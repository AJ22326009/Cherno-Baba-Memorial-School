const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const app = express();

// Load environment variables
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});