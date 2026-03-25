import mongoose from 'mongoose';

const Schema = new mongoose.Schema;

const ServiceSchema = new Schema({
    serviceName: {
        type: String,
        required: true,
        unique: false,
        maxLength: 50
    },
    Date: {
        type: Date,
        required: true
    },
    Time: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {timestamps: true
});