import User from "../models/User.js";
import jwt from "jsonwebtoken";

const createToken = (id, role) => {
  return jwt.sign({ id, role}, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ errors: { email: "Email already in use" } });
    }

    const user = await User.create({ username, email, password, role });

    const token = createToken(user._id, user.role);

    res.status(201).json({ username: user.username, email: user.email, token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const {  email, password } = req.body;

  try {
    if ( !email || !password) {
      return res.status(400).json({ error: "All fields must be filled" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: { email: "Couldn't find Email" } });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ errors: { password: "Incorrect password" } });
    }
    const token = createToken(user._id, user.role);
    res.status(200).json({ email: user.email, token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
