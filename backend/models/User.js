import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: {
      type: String,
      required: function () {
        return this.role === "provider";
      },
    },
    role: {
      type: String,
      enum: ["consumer", "provider", "admin"],
      required: true,
    },
    pincode: { type: String, required: true },
    address: {
      type: String,
      required: function () {
        return this.role === "provider";
      },
    },
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role !== "provider";
      },
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
