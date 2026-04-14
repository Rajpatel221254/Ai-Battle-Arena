import jwt from "jsonwebtoken";
import config from "../config/config.js";

/**
 * Generate a JWT token for a user.
 */
export const generateToken = (user: {
  id: string;
  email: string;
  name: string;
}): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );
};
