const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    role: {type: String, required: true},
    password: {type: String, required: true},
    resetOtp: String,
    otpExpiry: Date,
});
const UserModel = mongoose.model("User",UserSchema);
module.exports = UserModel;