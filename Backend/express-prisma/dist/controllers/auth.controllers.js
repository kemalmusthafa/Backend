"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = require("bcrypt");
const user_services_1 = require("../services/user.services");
const jsonwebtoken_1 = require("jsonwebtoken");
const mailler_1 = require("../services/mailler");
class AuthController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, confirmPassword, username, email } = req.body;
                if (password != confirmPassword)
                    throw { message: "Password not match!" };
                const user = yield (0, user_services_1.findUser)(username, email);
                if (user)
                    throw { message: "Username or email has been used !" };
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashPassword = yield (0, bcrypt_1.hash)(password, salt);
                yield prisma_1.default.user.create({
                    data: { username, email, password: hashPassword },
                });
                yield mailler_1.transporter.sendMail({
                    from: "kemalmusthafa80@gmail.com",
                    to: email,
                    subject: "Welcome to Reddit Blog",
                    html: "<h1>Thank You!</h1>",
                });
                res.status(201).send({ message: "Reqister Successfully ✅" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, password } = req.body;
                const user = yield (0, user_services_1.findUser)(data, data);
                if (!user)
                    throw { message: "Account not found !" };
                const isValidPass = yield (0, bcrypt_1.compare)(password, user.password);
                if (!isValidPass)
                    throw { message: "Incorrect Password !" };
                const payload = { id: user.id, role: user.role };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_KEY, { expiresIn: "1d" });
                res
                    .status(200)
                    .cookie("token", token, {
                    httpOnly: true,
                    maxAge: 24 * 3600 * 1000,
                    path: "/",
                    secure: process.env.NODE_ENV === "production",
                })
                    .send({
                    message: "Login Successfully ✅",
                    user,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.AuthController = AuthController;
