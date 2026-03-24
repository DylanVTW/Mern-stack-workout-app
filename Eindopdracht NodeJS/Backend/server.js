import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
}));


app.use(express.json());


app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
.then (() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch ((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});