const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true,trim: true },
  lastName: { type: String,trim: true },
  address: { type: String,trim: true },
  email: { type: String, required: true,trim: true, unique: true,lowercase:true },
  password: { type: String, required: true,trim: true },
  avatar:{ type:String},
  logo:{type:String},
  customer: [{ type: mongoose.Schema.Types.ObjectId, ref: "customer" }],
  createdAt: { type: Date, default: Date.now },
  is_verified: { type: Boolean, default: false },
  roles: { type: [String], enum: ["user", "admin"], default: ["user"] },
});

const userModel = mongoose.model("user", UserSchema);

module.exports = userModel;
