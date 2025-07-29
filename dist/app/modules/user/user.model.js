"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, { versionKey: false, _id: false });
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(user_interface_1.Role), default: user_interface_1.Role.RIDER },
    auths: [authProviderSchema],
    password: { type: String },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date },
    phone: { type: String },
    image: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
    },
    onlineStatus: { type: String, enum: Object.values(user_interface_1.IOnlineStatus) },
    rides: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Ride" }],
}, {
    versionKey: false,
    timestamps: true,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
