"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistance = void 0;
function degToRed(deg) {
    return (deg * Math.PI) / 180;
}
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const degLat = degToRed(lat2 - lat1);
    const degLon = degToRed(lon2 - lon1);
    const a = Math.sin(degLat / 2) * Math.sin(degLat / 2) +
        Math.cos(degToRed(lat1)) *
            Math.cos(degToRed(lat2)) *
            Math.sin(degLon / 2) *
            Math.sin(degLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = Number((R * c).toFixed(2));
    return distance;
};
exports.getDistance = getDistance;
