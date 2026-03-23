import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import workoutRoutes from './src/routes/workoutRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json());

app.use('/api/workouts', workoutRoutes);
app.use('/api/auth', authRoutes);


mongoose.connect(process.env.MONGO_URI)
 .then(() => {
    console.log('Verbonden met MongoDB');


app.listen(PORT, () =>{
    console.log(`Server draait op http://localhost:${PORT}`);
});
 })

.catch((error) =>{
    console.error('Fout bij verbinding', error.message);
}); 

