
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  // mensaje básico
  const message =
    err.message || "Error interno del servidor";

  // log en consola
  console.error(" Error:", err);

  res.status(status).json({
    error: true,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack
    })
  });
}
