import express, { Response, Request } from "express";
import passport from "passport";
import logger from "morgan";

require("dotenv").config();

const app = express();
import cookieSession from "cookie-session";
require("./passport");

app.use(
  cookieSession({
    name: "google-auth-session",
    keys: ["key1", "key2"],
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("<button><a href='/auth'>Login With Google</a></button>");
});

// Auth
app.get(
  "/auth",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Auth Callback
app.get(
  "/auth/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/callback/success",
    failureRedirect: "/auth/callback/failure",
  })
);

// success
app.get("/auth/callback/success", (req: Request, res: Response) => {
  if (!req.user) res.redirect("/auth/callback/failure");
  console.log(req.user);
  res.send("Welcome " + req?.user);
});

// failure
app.get("/auth/callback/failure", (req: any, res: express.Response) => {
  res.send("Error");
});

app.listen(8000, () => {
  console.log("Server running on PORT 8000");
});
