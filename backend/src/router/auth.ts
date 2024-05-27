import { Request, Response, Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { db } from "../db";
const router = Router();

const CLIENT_URL = process.env.AUTH_REDIRECT_URL ?? "http://localhost:5173/";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

interface User {
  id: string;
}

router.get("/refresh", async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as User;

    // Token is issued so it can be shared b/w HTTP and ws server
    const userDb = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({
      token,
      name: userDb?.name,
      image: userDb?.image,
    });
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

router.get("/login/failed", (req: Request, res: Response) => {
  res.status(401).json({ success: false, message: "failure" });
});

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("connect.sid");
  res.status(200).json({ success: true, message: "Logged out" });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["profile", "email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

export default router;
