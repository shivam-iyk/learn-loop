import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import ApiError from "../utils/ApiError";
import { query } from "../db";

try {
  passport.serializeUser((user, next) => {
    next(null, user.id);
  });

  passport.deserializeUser(async (id, next) => {
    try {
      const { rows: user } = await query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      if (user) next(null, user[0]);
      else next(new ApiError(404, "User not found"), null);
    } catch (error) {
      next(
        new ApiError(
          500,
          "Something went wrong while deserializing the user. Error: " + error,
        ),
        null,
      );
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      },
      async (_, __, profile, next) => {
        const email = profile.emails ? profile.emails[0]?.value : null;
        const name = profile.displayName;
        if (!email || !name) {
          return next(null, false, {
            message: "Email is required",
          });
        }
        const { rows: user } = await query(
          "SELECT * FROM users WHERE email = $1",
          [email],
        );
        if (user[0]) {
          if (user[0].login_type !== "google") {
            next(null, false, {
              message: "Please login using your username & password",
            });
          } else next(null, user[0]);
        } else {
          const { rows: createdUser } = await query(
            "INSERT INTO users (email, name, login_type, is_verified) VALUES  ($1, $2, $3, $4)",
            [email, name, "google", true],
          );
          if (createdUser) next(null, createdUser[0]);
          else {
            next(null, false, { message: "Error while registering the user" });
          }
        }
      },
    ),
  );
} catch (error) {
  console.log("Passport error", error);
}
