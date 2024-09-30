// src/config/passport.ts
import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
  VerifyCallback as GoogleVerifyCallback,
} from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import User, { IUser } from '../models/User';

export default (passport: passport.PassportStatic) => {
  // Configuración de la estrategia de Google
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: GoogleProfile,
        done: GoogleVerifyCallback
      ) => {
        try {
          // Busca si el usuario ya existe en la base de datos
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Si no existe, crea un nuevo usuario
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0]?.value,
              avatar: profile.photos?.[0]?.value,
            });
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error as any, undefined);
        }
      }
    )
  );

  // Configuración de la estrategia de GitHub
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: process.env.GITHUB_CALLBACK_URL!,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: GitHubProfile,
        done: (error: any, user?: any, info?: any) => void
      ) => {
        try {
          // Busca si el usuario ya existe en la base de datos
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
            // Si no existe, crea un nuevo usuario
            user = new User({
              githubId: profile.id,
              name: profile.displayName || profile.username,
              email: profile.emails?.[0]?.value,
              avatar: profile.photos?.[0]?.value,
            });
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error as any, undefined);
        }
      }
    )
  );

  // Serialización y deserialización de usuarios
  passport.serializeUser((user: any, done: (err: any, id?: string) => void) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done: (err: any, user?: IUser | false | null) => void) => {
    try {
      const user = await User.findById(id);
      done(null, user || false);
    } catch (error) {
      done(error as any, false);
    }
  });
};
