import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { UserDataServiceProvider } from '../services/database/user'
const userDataServiceProvider = new UserDataServiceProvider()

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',

}, async (email, password, done) => {
    try {
        let user = await userDataServiceProvider.login(email, password)

        if (user) {

            return done(null, user);

        } else {

            return done(null, false);

        }
    } catch (error) {

        done(error);
    }

}));



export default passport