// import { StatusCodes } from "http-status-codes";
// import AppError from "../errorHelpers/AppError";
// import { Role } from "../modules/user/user.interface";

// export const validateUpdateFields = (role: Role, updateFields: string[]) => {
//   const allowed = rideFieldUpdatePolicy[role];

//   if (allowed === "*") return true;

//   for (const field of updateFields) {
//     if (!allowed.includes(field)) {
//       throw new AppError(
//         StatusCodes.FORBIDDEN,
//         `You are not permitted to update the field '${field}'`
//       );
//     }
//   }
// };
