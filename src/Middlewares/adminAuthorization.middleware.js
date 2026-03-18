import { ApiError } from "../utils/ApiError.js";

const authorizeAdmin = (req, res, next) => {

  if (!req.admin) {
    throw new ApiError(401, "Admin not authenticated");
  }

  if (req.admin.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  next();
};
export{authorizeAdmin}