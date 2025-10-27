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

          // 1) tìm theo googleId
          let user = await User.findOne({ googleId: profile.id });
          if (user) return done(null, user);

          // 2) nếu không có googleId, tìm theo email (link account nếu tồn tại)
          if (email) {
            const userByEmail = await User.findOne({ email: email });
            if (userByEmail) {
              // link googleId vào account hiện có
              userByEmail.googleId = profile.id;
              if (!userByEmail.displayName) userByEmail.displayName = profile.displayName;
              if (!userByEmail.photo && photo) userByEmail.photo = photo;
              await userByEmail.save();
              return done(null, userByEmail);
            }
          }

          // 3) không tìm thấy -> tạo mới
          const newUser = await new User({
            googleId: profile.id,
            email: email || undefined,
            displayName: profile.displayName || undefined,
            photo: photo || undefined,
            
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