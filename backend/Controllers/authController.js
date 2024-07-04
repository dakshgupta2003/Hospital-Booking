import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;

  try {
    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email }); 
    }

    // check if user exists
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashpassword,
        photo,
        gender,
        role,
      });
    }

    if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashpassword,
        photo,
        gender,
        role,
      });
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "user succesfully created" });
  } catch (error) { 
    res
      .status(500)
      .json({ success: false, message: "internal server error, try again" });
  }
};

export const login = async (req, res) => {
  const { email } = req.body;
  try {
    let user = null;

    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) {
      user = patient;
    }

    if (doctor) {
      user = doctor; 
    }

    // if no user found

    // check if user exists ot not
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    //compare password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(404)
        .json({ status: false, message: "invalid credentials" });
    }

    // generate token
    const token = generateToken(user);
    const { password, role, appointments, ...rest } = user._doc;

    return res.status(200).json({
      status: true,
      message: "succesfully logged in",
      token,
      data: { ...rest },
      role,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "falied to login",
    });
  }
};
