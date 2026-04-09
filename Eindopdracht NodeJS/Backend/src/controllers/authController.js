import User from "../models/User.js";
import jwt from "jsonwebtoken";

const createAccessToken = (id, role) => {
  return jwt.sign({ id, role}, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const createRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ errors: { email: "Email already in use" } });
    }

    const user = await User.create({ username, email, password, role });

    const accessToken = createAccessToken(user._id, user.role);
    const refreshToken = createRefreshToken(user._id, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.status(201).json({username: user.username, email: user.email, accessToken, token: accessToken, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
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
    const accessToken = createAccessToken(user._id, user.role);
    const refreshToken = createRefreshToken(user._id, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.status(201).json({
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      accessToken,
      token: accessToken,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const refresh = async (req, res) => {
  try {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Geen geldige refresh token" });
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select("_id role");

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  const newAccessToken = createAccessToken(user._id, user.role);
  res.status(200).json({ accessToken: newAccessToken });  
 } catch (error) {
  return res.status(401).json({ error: "Ongeldige refresh token" });
 }
};

export const logout = async (req, res) => {
  try {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Succesvol uitgelogd" });
} catch (error) {
  res.status(500).json({ message: "Server error" });
} 
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      console.error("No file received in request");
      return res.status(400).json({ error: "No file uploaded" });
    }
    const userId = req.user._id || req.user.id;
    
    console.log("File object received:", req.file);
    
    const profileImageUrl = req.file.secure_url || req.file.path || req.file.url;
    console.log("Uploading profile image for user:", userId, "File URL:", profileImageUrl);

    if (!profileImageUrl) {
      console.error("No URL found in file object");
      return res.status(400).json({ error: "Failed to get image URL" });
    }

    const user = await User.findByIdAndUpdate(
      userId, 
      { profileImage: profileImageUrl },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile image updated", user, profileImage: profileImageUrl });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
