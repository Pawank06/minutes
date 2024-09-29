// import  { model, models, Schema } from "mongoose";

// const createTimeSlotSchema = new Schema(
//   {
//     timeId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//     creatorId: {
//       type: Schema.Types.ObjectId,
//       ref: "User", // Link to the User (creator)
//       required: true,
//     },
//     creatorPublicKey: {
//       type: String,
//       required: true,
//     },
//     organizationName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },
//     image: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     amount: {
//       type: Number,
//       min: 0,
//     },
//     earnings: {
//       type: Number,
//       default: 0,
//       required: true,
//     },
//     date: {
//       type: String,
//     },
//     time1: {
//       type: String,
//       required: true,
//     },
//     time2: {
//       type: String,
//       required: true,
//     },
//     time3: {
//       type: String,
//       required: true,
//     },
//     meetlink: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Slot =
//   models.Slot || model("Slot", createTimeSlotSchema);
