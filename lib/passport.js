const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

const { findUser, verifyUser } = require("./user");
const User = require("../models/User");

const serializeUser = (user, done) => done(null, user._id);
const deserializeUser = async (id, done) => {
    try {
        const user = await User.findById(id);
        if (verifyUser(user))
            return done(null, user);
        return done(null, false);
    } catch (err) {
        return done(err, null);
    }
};

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

const loginStrategy = new LocalStrategy({
    usernameField: "login",
    passwordField: "password"
}, async (login, password, done) => {
    try {
        const user = await findUser(login, password);
        if (verifyUser(user))
            return done(null, user);
        return done(null, false);
    } catch (err) {
        return done(err, false);
    }
});

const jwtAuthStrategy = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.KEY
},
    async (payload, done) => await deserializeUser(payload.id, done)
);

passport.use(loginStrategy);
passport.use(jwtAuthStrategy);

const createToken = id => jwt.sign({ id }, process.env.KEY);

const authenticate = async (ctx, next) => new Promise((resolve, reject) => {
    passport.authenticate("local", { session: false }, (err, user) => {
        if (err || !verifyUser(user))
            reject(err);
        else 
            resolve(user);
    })(ctx, next);
});

module.exports = { createToken, authenticate };