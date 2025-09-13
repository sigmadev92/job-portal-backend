import CustomError from "./errorHandler";

const authMiddleware = (req, res, next) => {
  const { token } = req.headers.authorization;
  if (!token) return next;
};

//role should be an array
const validateByRole = (role) => {
  return (req, res, next) => {
    if (role.includes(req.user.role)) return next();
    next(new CustomError(403, "You are Not allowed to access this route"));
  };
};
export { validateByRole };
export default authMiddleware;
