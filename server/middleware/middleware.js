export function requestLogger(req, res, next) {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
}

export function errorHandler(req, res, next, error) {
  console.error(error);
  res.status(500).json({ message: "internal server error" });
}
