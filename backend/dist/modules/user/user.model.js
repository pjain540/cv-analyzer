import { Schema } from "mongoose";
import { model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });
//hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return;
    this.password = await bcrypt.hash(this.password, 10);
});
//method to compare password
userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};
//method to generate access token
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};
export const User = model("User", userSchema);
//# sourceMappingURL=user.model.js.map