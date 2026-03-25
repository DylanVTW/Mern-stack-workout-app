import mongoose from "mongoose";

const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    serviceName: {
      type: String,
      required: true,
      unique: false,
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