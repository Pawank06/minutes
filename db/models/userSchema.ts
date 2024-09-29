// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       select: false,
//     },
//     image: {
//       type: String,
//     },
//     authProviderId: {
//       type: String,
//     },
//     slots: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Slot",
//         default: [],
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// export const User = mongoose.models?.User || mongoose.model("User", userSchema);
