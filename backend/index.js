const express = require('express');
const app = express();
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');

require('dotenv').config();
const PORT = process.env.PORT;
connectDB();

app.use(express.json());
app.use('/api', eventRoutes);
app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
});