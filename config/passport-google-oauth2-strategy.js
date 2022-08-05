const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;       
const crypto=require('crypto');         //using crypto to encrypt password
const User=require('../models/user');

passport.use(new googleStrategy({
    clientID:"853198650205-mqiuovo51duhmtnikie44jplf2i3a44a.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/users/auth/google/callback"
    //clientID,clientSecret,callbackURL to for google strategy
},function(accessToken,refreshToken,profile,done){
    //accesstoken- it is same as we were generating and using it in JWT, sending it in header
    //refreshtoken- if accesstoken expires then use it to get new accesstoken
    User.findOne({email:profile.emails[0].value}).exec( //here profile has email selected by user, when clicked signin using google
        function(error,user){
            if(error)
            return  console.log('Error in google strategy passport',error);              
            console.log(accessToken,refreshToken);
            console.log(profile);
            if(user)
                //if found set user as req.user means signin the user
                return done(null,user)
            else{   //if user does not exist then signup
                User.create({
                    email:profile.emails[0].value,
                    name:profile.displayName,
                    password:crypto.randomBytes(20).toString('hex')
                },function(error,user){
                    if(error)
                        return  console.log('Error in google strategy passport',error);
                    return done(null,user)
                            });
            }
        }
    );
}

));

module.exports=passport;