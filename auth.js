const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./models/User")

function Auth(passport){
    function verifyCallback(req,username, password, done) {
        User.findOne({ username: username }, async (err, foundUser) => {
            if(err)
                return done(err);

            if(!foundUser)
                return done(null,false,req.flash("message","Invalid Username"));   
            else{
                try{
                    if(await bcrypt.compare(password,foundUser.password)){
                        return done(null,foundUser);
                    }else{
                        return done(null,false,req.flash("message","Invalid Password"));
                    }
                }catch(err){
                    return done(err);
                }
            }
        })
    }
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    const strategy = new LocalStrategy({passReqToCallback: true},verifyCallback);    
    passport.use(strategy);
}

module.exports = Auth;