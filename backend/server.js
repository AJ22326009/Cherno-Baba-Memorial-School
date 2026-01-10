const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Import Routes

const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.route');
const resultRoutes = require('./routes/result.route');
const userRoutes = require('./routes/user.route');

const authenticate = require('./middleware/authenticate.middleware');

const app = express();

// Load environment variables
dotenv.config();
connectDB();

app.use(cors());

//use json
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students',authenticate, studentRoutes);
app.use('/api/results', authenticate, resultRoutes);
app.use('/api/users', authenticate, userRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});