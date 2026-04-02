import { body, validationResult } from "express-validator";

// Middleware om validatiefouten af te handelen
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((error) => {
      if (error.path) {
        errorMessages[error.path] = error.msg;
      }
    });
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};

// Registratie validators
export const validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Naam is verplicht")
    .isLength({ min: 2 })
    .withMessage("Naam moet minstens 2 karakters lang zijn"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-mail is verplicht")
    .isEmail()
    .withMessage("Voer een geldig e-mailadres in"),
  body("password")
    .notEmpty()
    .withMessage("Wachtwoord is verplicht")
    .isLength({ min: 8 })
    .withMessage("Wachtwoord moet minstens 8 karakters lang zijn"),
];

// Login validators
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-mail is verplicht")
    .isEmail()
    .withMessage("Voer een geldig e-mailadres in"),
  body("password")
    .notEmpty()
    .withMessage("Wachtwoord is verplicht"),
];

// Service validators
export const validateCreateService = [
  body("Name")
    .trim()
    .notEmpty()
    .withMessage("Service is verplicht")
    .isIn(["knip", "fade", "baard"])
    .withMessage("Service moet één van deze zijn: knip, fade of baard"),
  body("Date")
    .notEmpty()
    .withMessage("Datum is verplicht")
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        throw new Error("Datum mag niet in het verleden liggen");
      }
      return true;
    }),
  body("Time")
    .notEmpty()
    .withMessage("Tijd is verplicht"),
];

export const validateUpdateService = [
  body("Name")
    .optional()
    .trim()
    .isIn(["knip", "fade", "baard"])
    .withMessage("Service moet één van deze zijn: knip, fade of baard"),
  body("Date")
    .optional()
    .custom((value) => {
      if (value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          throw new Error("Datum mag niet in het verleden liggen");
        }
      }
      return true;
    }),
  body("Status")
    .optional()
    .isIn(["Gepland", "Geannuleerd"])
    .withMessage("Status moet Gepland of Geannuleerd zijn"),
  body("Time")
    .optional()
    .trim(),
];
