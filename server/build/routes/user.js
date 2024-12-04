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
exports.userRouter = exports.verifyToken = void 0;
const express_1 = require("express");
const user_1 = require("../models/user");
const errors_1 = require("../errors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
exports.userRouter = router;
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_1.UserModel.findOne({ username });
        if (user) {
            res.status(400).json({ type: errors_1.UserErrors.USERNAME_ALREADY_EXISTS });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_1.UserModel({ username, password: hashedPassword });
        yield newUser.save();
        res.json({ message: "User registered" });
        return;
    }
    catch (err) {
        res.status(500).json({ type: err });
        return;
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_1.UserModel.findOne({ username });
        if (!user) {
            res.status(400).json({ type: errors_1.UserErrors.NO_USER_FOUND });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ type: errors_1.UserErrors.WRONG_CREDENTIALS });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, "a56787s8aof");
        res.json({ token, userID: user._id });
    }
    catch (err) {
        res.status(500).json({ type: err });
        return;
    }
}));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extract the token part
        jsonwebtoken_1.default.verify(token, "a56787s8aof", (err) => {
            if (err) {
                res.sendStatus(403); // Forbidden if token verification fails
                return;
            }
            next(); // Proceed to the next middleware only if token is valid
        });
    }
    else {
        res.sendStatus(401); // Unauthorized if no auth header
    }
};
exports.verifyToken = verifyToken;
router.get("/available-money/:userID", exports.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.params;
    try {
        const user = yield user_1.UserModel.findById(userID);
        if (!user) {
            res.status(400).json({ type: errors_1.UserErrors.NO_USER_FOUND });
        }
        res.json({ availableMoney: user.availableMoney });
    }
    catch (err) {
        res.status(500).json({ err });
    }
}));
