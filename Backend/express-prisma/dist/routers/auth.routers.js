"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
class AuthRouter {
    constructor() {
        this.authController = new auth_controllers_1.AuthController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/", this.authController.registerUser);
        this.router.post("/login", this.authController.loginUser);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRouter = AuthRouter;
