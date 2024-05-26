"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = require("./passport");
const auth_1 = __importDefault(require("./router/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const passport_2 = __importDefault(require("passport"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, express_session_1.default)({
    secret: process.env.COOKIE_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
}));
(0, passport_1.initPassport)();
app.use(passport_2.default.initialize());
app.use(passport_2.default.authenticate("session"));
const allowedHosts = process.env.ALLOWED_HOSTS
    ? process.env.ALLOWED_HOSTS.split(",")
    : [];
app.use((0, cors_1.default)({
    origin: allowedHosts,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
app.use("/auth", auth_1.default);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
