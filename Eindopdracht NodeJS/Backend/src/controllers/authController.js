import User from "../models/User.js";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ error: "Username already in use" });
    }
    if (!username || !email || !password) {
      return;
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const user = await User.create({ username, email, password });

    const token = createToken(user._id);

    res.status(201).json({ username: user.username, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields must be filled" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Incorrect email" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    const token = createToken(user._id);
    res.status(200).json({ username: user.username, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
