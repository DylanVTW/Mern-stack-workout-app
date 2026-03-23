import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: false,
        maxlength: 100
    },
    reps: {
        type:Number,
        required: true,
        min: 1
    },
    load: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {timestamps: true
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
