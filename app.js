const express=require('express');
const app=express();                    //iniating app using express
const path=require('path');
const db=require('./config/mongoose');  //requiring mongoose configuration
const session=require('express-session');       //using express session
const passport=require('passport');             //using passport 
const passportLocal=require('./config/passport-local-strategy');    //using passport config
const cookieParser=require('cookie-parser');                        //using cookie parser
const MongoStore=require('connect-mongo');                          //using connect-mongo to store session
const passportGoogle=require('./Config/passport-google-oauth2-strategy');   //using passport google Oauth
const flash=require('connect-flash');                               //using connect-flash for notification
const customMiddleware=require('./config/middleware');              //using custom middleware for noty

app.set('view engine','ejs');                                       //settingup view engine
app.set('views',path.join(__dirname,'./views'));                    //setting views directory
app.use(express.static(path.join(__dirname,'./assets')));           //setting assets directory
app.use(express.urlencoded({extended:true}));                       

app.use(session({                                                   //setting express session for app use
    name:'auth',
    secret:'blahblahblah',
    saveUninitialized:false,    //stop storing info as session is not created
    resave:false,               //dont resave when there is no change in user data like id
    cookie:{
        maxAge:(1000*60*100)
    },
    store:MongoStore.create({
        mongoUrl:'mongodb://localhost/practice_local_auth',
        autoRemove:'disabled'
    },(error)=>console.log(error || 'Connect mongodb for mongostore'))
}));

app.use(passport.initialize());     //telling the app to use passport,
app.use(passport.session());        //let passport use session to use session user id to deserilize user. 
app.use(passport.setAuthenticatedUser); //whenever app start, setAuthenticatedUser is called and which set user if session cookie is initialized(req.isAuthenticated) 
//initialized(req.isAuthenticated);
app.use(flash());                           //using flash in app
app.use(customMiddleware.setFlash);         //using custom middleware in app

app.use('/',require('./routes/index'));     //using express router in app


app.listen(8000,(error)=>{                  //started listening on port 8000
    if(error)
    console.log(error);
    console.log(`Server started listening on Port 8000`);
});