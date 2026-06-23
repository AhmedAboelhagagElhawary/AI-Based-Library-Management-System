const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');

app.use('/api/v1/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Maktabti Backend API is running successfully!');
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is successfully running on port ${PORT}`);
});