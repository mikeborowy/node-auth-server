const passport = require('passport');
const User = require('../model/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Create local strategy
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    //Verfiy this username/email and password, call done with the user
    //if it is correct username/email and password otherwise,
    //call done with false
    User.findOne({ email: email }, function(error, user) {
        if (error) {
             return done(error); 
        }

        if(!user) {
            return done(null, false)
        }
        //compare passwords
        user.comparePasswords(password, function(error, isMatch) {
            if(error) {
                return done(error);
            }
            if(!isMatch) {
                return done(null, false);
            }

            return done(null, user);
        })
    });
});

//Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};
//Create JWT startegy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    //See if the user id in payloda exists in our db if it does call 
    //'done' with user id, otherwise call 'done' without user object
    User.findById(payload.sub, function(error, user) {
        if (error) { 
            return done(error, false); 
        }
    
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
});
//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);