export function requestLogger(req, res, next) {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
}

export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
}
