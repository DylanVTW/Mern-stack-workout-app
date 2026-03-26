import mongoose from "mongoose";

const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      unique: false,
      enum: ['knip', 'fade', 'baard'],
      maxLength: 50,
    },
    Date: {
      type: Date,
      required: true,
    },
    Time: {
      type: String,
      required: true,
    },
    Price: {
        type: Number,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Status: {
        type: String,
        enum: ['Gepland', 'Geannuleerd'],
        default: 'Gepland',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;