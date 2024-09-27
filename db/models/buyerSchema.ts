import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
    buyername: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    timeslot: {
        type: String,
        required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
}, {
    timestamps: true,
})

export const Buyer = mongoose.models?.Buyer || mongoose.model("Buyer", buyerSchema)