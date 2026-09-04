const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for an authenticated user.
 * Token expires in 24 hours per AUTH-CONTRACT.md.
 *
 * @param {Object} user - User document or user object
 * @returns {string} - Signed JWT
 */
const generateToken = (user) => {
  const userId = user._id ? user._id.toString() : user.id;

  const payload = {
    userId,
    sub: userId,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h"
  });
};

module.exports = generateToken;
