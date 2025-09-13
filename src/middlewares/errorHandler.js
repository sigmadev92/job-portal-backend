class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err instanceof CustomError) {
    return res.status(err.code).send({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: "Internal Server Error" });
};

export { errorHandler };

export default CustomError;
