/**
 * Role authorization middleware.
 * Restricts endpoint access to specific roles (PATIENT, THERAPIST).
 * Compliant with AUTH-CONTRACT.md Section 7, 12 and API-CONTRACT.md.
 *
 * @param  {...string|string[]} roles - Allowed role(s), e.g. "THERAPIST" or ["PATIENT", "THERAPIST"]
 */
const roleMiddleware = (...roles) => {
  const allowedRoles = roles.flat();

  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to access this resource.",
        error: "FORBIDDEN"
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
