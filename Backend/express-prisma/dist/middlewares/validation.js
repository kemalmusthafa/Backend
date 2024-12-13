"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegister = [
    (0, express_validator_1.body)("username").notEmpty().withMessage("username is required!"),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("email is required!")
        .isEmail()
        .withMessage("invalid format email!"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("password is required!")
        // .isStrongPassword({minLength:3,minUppercase:1})
        .isLength({ min: 3 })
        .withMessage("password must be 3 characters at minumum!"),
    (0, express_validator_1.body)("confirmPassword")
        .notEmpty()
        .withMessage("confirmPassword is required!")
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password not match!");
        }
        return true;
    }),
    (req, res, next) => {
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(400).send({ errors: error.array() });
        }
        next();
    },
];
