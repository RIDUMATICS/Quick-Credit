import passport from 'passport';
import GooglePlusTokenStrategy from 'passport-google-plus-token';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models';


passport.use('jwt', new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.secretOrPrivateKey,
}, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.sub);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: process.env.googleClientID,
  clientSecret: process.env.googleClientSecret,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findByPk(profile.emails[0].value.toLowerCase());
    if (existingUser) {
      console.log('existing user');
      return done(null, existingUser);
    }
    const newUser = await User.create({
      email: profile.emails[0].value.toLowerCase(),
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      signMethod: 'google',
      status: 'unverified',
      isAdmin: false,
    });
    console.log('new user');
    return done(null, newUser);
  } catch (error) {
    return done(error, false, error.message);
  }
}));
