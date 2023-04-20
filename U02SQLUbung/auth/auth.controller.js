const passport = require('passport');
const expressSession = require('express-session');
const LocalStrategy = require('passport-local');
const authView = require('./auth.view');
const authModel = require('./auth.model');
const crypto = require('crypto');
module.exports = function (app) {
    app.use(
        expressSession({
            secret: 'top secret',
            resave: false,
            saveUninitialized: false
        })
    );
    passport.serializeUser((user, done) => done(null, user.username));
    passport.deserializeUser((id, done) => {
        authModel.get(id)
            .then(user => {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            })
            .catch(err => console.error(err))
    });
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(
        new LocalStrategy((username, password, done) => {
            authModel.get(username)
                .then(user => {
                    const hash = crypto.createHash('sha256').update(password).digest('hex');
                    if (user && user.passwordhash === hash) {
                        user.passwordhash = '';
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                })
                .catch(err => console.error(err))
        })
    );
    app.get(
        '/login',
        (request, response) => response.send(authView.login(request.query.error))
    );
    app.post(
        '/login',
        passport.authenticate('local', { failureRedirect: '/login?error=Notallowed' }),
        (request, response) => response.redirect(
            request.session.returnTo ? request.session.returnTo : '/'
        )
    );
    app.get(
        '/logout',
        (request, response) => {
            request.session.returnTo = undefined;
            request.logout(() => { });
            response.redirect('/');
        }
    );
};