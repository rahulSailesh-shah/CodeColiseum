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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const router = (0, express_1.Router)();
const CLIENT_URL = (_a = process.env.AUTH_REDIRECT_URL) !== null && _a !== void 0 ? _a : "http://localhost:5173/";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
router.get("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        const user = req.user;
        // Token is issued so it can be shared b/w HTTP and ws server
        const userDb = yield db_1.db.user.findFirst({
            where: {
                id: user.id,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        res.json({
            token,
            name: userDb === null || userDb === void 0 ? void 0 : userDb.name,
            image: userDb === null || userDb === void 0 ? void 0 : userDb.image,
        });
    }
    else {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}));
router.get("/login/failed", (req, res) => {
    res.status(401).json({ success: false, message: "failure" });
});
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error logging out:", err);
            res.status(500).json({ error: "Failed to log out" });
        }
        else {
            res.clearCookie("jwt");
            res.redirect("http://localhost:5173/");
        }
    });
});
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
}));
router.get("/github", passport_1.default.authenticate("github", { scope: ["profile", "email"] }));
router.get("/github/callback", passport_1.default.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
}));
exports.default = router;
