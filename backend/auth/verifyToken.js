import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {
  // get token from headers (means from the authorization part)
  const authToken = req.headers.authorization;

  // check if token exists
  if (!authToken || !authToken.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ success: false, message: "no token, authorization denied" });
  }

  try {
    // console.log(authToken);
    const token = authToken.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userID = decoded.id;
    req.role = decoded.role;

    next(); // will pass the control to next middleware
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // we have set token expiry to 15 days in authController
      return res.status(401).json({ message: "token is expired" });
    }

    return res.status(401).json({ success: false, message: "invalid token" });
  }
};

export const restrict = (roles) => async (req, res, next) => {
    const userId = req.userID; // don't use doctorId use "D" in it
    let user;
  
    try {
      const patient = await User.findById(userId);
      const doctor = await Doctor.findById(userId);
  
      if (patient) {
        user = patient;
      } else if (doctor) {
        user = doctor;
      }
  
      // Check if user is found
      if (!user) {
        return res.status(404).json({ success: false, message: "user not found" });
      }
  
      // Check if user role is allowed
      if (!roles.includes(user.role)) {
        return res.status(401).json({ success: false, message: "you are not authorized" });
      }
  
      next();
    } catch (error) {
    //   console.error("Restrict middleware error:", error); --> log error for debugging
      return res.status(500).json({
        success: false,
        message: "internal server error, try again",
      });
    }
  };