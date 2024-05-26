const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
  done(null, user);
});
passport.deserializeUser(function (
  user: any,
  done: (arg0: null, arg1: any) => void
) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Your Credentials here.
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Credentials here.
      callbackURL: "http://localhost:8000/auth/callback",
      passReqToCallback: true,
    },
    function (
      request: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: (arg0: null, arg1: any) => any
    ) {
      return done(null, profile);
    }
  )
);
