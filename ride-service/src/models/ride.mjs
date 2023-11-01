import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { RideStatus } from "../enum/ride-status.enum.js";

const { Schema } = mongoose;

const rideSchema = new Schema({
  _id: {
    type: String,
    default: () => uuidv4().replace(/-/g, ""),
  },
  start: {
    longitude: {
      type: String,
    },
    latitude: {
      type: String,
    },
  },
  end: {
    longitude: {
      type: String,
    },
    latitude: {
      type: String,
    },
  },
  rideEstimateTime: {
    type: String,
  },
  fare: {
    type: String,
  },
  distance: {
    type: String,
  },
  status: {
    type: RideStatus,
    default: RideStatus.PENDING,
  },
  rideStartTime: {
    type: Date,
  },
  rideEndTime: {
    type: Date,
  },
  driverId: {
    type: String,
    required: true,
  },
  driverLocation: {
    longitude: {
      type: String,
    },
    latitude: {
      type: String,
    },
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

rideSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Ride = mongoose.model("rides", rideSchema);

export default Ride;
