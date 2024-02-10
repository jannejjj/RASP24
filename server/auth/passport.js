//Used to authenticate JWT
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Member = require("../models/member");
require('dotenv').config();

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

const strategy = new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        const member = await Member.findOne({email: jwt_payload.email});
        if (member) {
            return done(null, member);
        } else {
            return done(null, false);
        }
    } catch(err) {
        return done(err, false);
    }
});

module.exports = (passport) => {
    passport.use(strategy);
}
