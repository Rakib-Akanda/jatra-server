"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validRequest = void 0;
const validRequest = (zodSchema) => async (req, res, next) => {
    try {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        req.body = await zodSchema.parseAsync(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validRequest = validRequest;
