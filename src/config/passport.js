// ...existing code...
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] && profile.emails[0].value;
          const photo = profile.photos && profile.photos[0] && profile.photos[0].value;

          let existingUser = await User.findOne({ googleId: profile.id });

          if (existingUser) {
            // nếu muốn cập nhật token/profile: uncomment & lưu vào user
            // existingUser.accessToken = accessToken;
            // existingUser.refreshToken = refreshToken;
            // await existingUser.save();

            return done(null, existingUser);
          }

          const newUser = await new User({
            googleId: profile.id,
            email: email || undefined,
            displayName: profile.displayName || undefined,
            photo: photo || undefined,
            // accessToken,
            // refreshToken,
          }).save();

          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
// ...existing code...