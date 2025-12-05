import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  resetToken: { type: String },   // ❌ removed unique:true
  resetTokenExpiry: { type: Number },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
