const passport=require('passport');
const User=require('../models/user');
const LocalStrategy=require('passport-local').Strategy; //requiring strategy
const crypto = require('crypto');       //using crypto to encrypt and descrypt password
let algorithm = 'aes256'; //Using AES encryption
let key = 'password';

passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField: 'password',
    passReqToCallback: true
    },
    function(req,email,password,done){                      //done callback is called based on condition with arguments 
        //find a user and establish the identity.
        User.findOne({email:email},(error,user)=>{	//here 1st email is collection field and 2nd is fn argument
            if(error)
            {
                req.flash('error','Error in finding user --> Passport');
                console.log('Error in finding user --> Passport');	
                return done(error);                            //done take two arguments , but not here
            }
            let decrypted='';
            console.log(user);
            if(user){
                var decipher = crypto.createDecipher(algorithm, key);
                decrypted = decipher.update(user.password, 'hex', 'utf8') + decipher.final('utf8');
            }
            
            console.log('decrypted',decrypted);
            if(!user || decrypted!=password)
	            {
                req.flash('error','Invalid username/password.');
                console.log('Invalid username/password');
                return done(null,false);                        //null for no error , false for not authenticated
            }

            return done(null,user);                            //null for no error, returning user
        })     
    }
));

//lets use serialize and deserialize user fn

//serializing the user to decide which key to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);		//keeping id in the cookie
});

//deserializing the user from the key in the cookies

//Note- When user first authenticates itself, its user object is serialized and stored in the session.
//On each following request, the middleware deserialize the user and populates req.user object.

passport.deserializeUser(function(id,done){
    User.findById(id,(error,user)=>{
        if(error)
            {
                console.log('Error in finding user --> deserialize Passport');
                return done(error);                            
            }
        return done(null,user)
    })
});

//fn to check if user is authenticated, we will use this fn as middleware
passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){  //isAuthenticated() is provided by passport
        return next();
    }
    //if user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contain the current user from session cookie
        res.locals.user=req.user
    }
    next();
}

module.exports=passport;