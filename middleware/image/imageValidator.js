// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

const imageValidator = [
  check("category").notEmpty().withMessage("Category is required"),
  check("imageName").notEmpty().withMessage("Image name is required"),
  check("imageUrl")
    .notEmpty()
    .withMessage("Image Url is required")
    .isURL()
    .withMessage("Image Url must be a valid URL"),
];

const imageValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  imageValidator,
  imageValidationHandler,
};
