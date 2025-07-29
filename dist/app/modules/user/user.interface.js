"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGender = exports.IOnlineStatus = exports.Role = exports.IsActive = void 0;
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["RIDER"] = "RIDER";
    Role["DRIVER"] = "DRIVER";
})(Role || (exports.Role = Role = {}));
var IOnlineStatus;
(function (IOnlineStatus) {
    IOnlineStatus["ONLINE"] = "ONLINE";
    IOnlineStatus["OFFLINE"] = "OFFLINE";
})(IOnlineStatus || (exports.IOnlineStatus = IOnlineStatus = {}));
var IGender;
(function (IGender) {
    IGender["MALE"] = "MALE";
    IGender["FEMALE"] = "FEMALE";
    IGender["OTHERS"] = "OTHERS";
})(IGender || (exports.IGender = IGender = {}));
