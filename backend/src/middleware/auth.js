import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { Guide } from "../models/guide.models.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET, {
      algorithms: ["HS256"],
    });

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (decoded.role === "user") {
      const user = await User.findOne({ userEmail: decoded.email });
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
    } else if (decoded.role === "guide") {
      const guide = await Guide.findOne({ guideEmail: decoded.email });
      if (!guide) {
        return res.status(401).json({ error: "Guide not found" });
      }
    }

    req.user = {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    return res.status(500).json({ error: "Authentication failed" });
  }
};
