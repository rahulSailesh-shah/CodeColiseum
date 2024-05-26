"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const morgan_1 = __importDefault(require("morgan"));
require("dotenv").config();
const app = (0, express_1.default)();
const cookie_session_1 = __importDefault(require("cookie-session"));
require("./passport");
app.use((0, cookie_session_1.default)({
    name: "google-auth-session",
    keys: ["key1", "key2"],
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, morgan_1.default)("dev"));
app.get("/", (req, res) => {
    res.send("<button><a href='/auth'>Login With Google</a></button>");
});
// Auth
app.get("/auth", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
// Auth Callback
app.get("/auth/callback", passport_1.default.authenticate("google", {
    successRedirect: "/auth/callback/success",
    failureRedirect: "/auth/callback/failure",
}));
// success
app.get("/auth/callback/success", (req, res) => {
    if (!req.user)
        res.redirect("/auth/callback/failure");
    console.log(req.user);
    res.send("Welcome " + (req === null || req === void 0 ? void 0 : req.user));
});
// failure
app.get("/auth/callback/failure", (req, res) => {
    res.send("Error");
});
app.listen(8000, () => {
    console.log("Server running on PORT 8000");
});
