const express=require('express');
const router=express.Router();
const userController=require('../controllers/users_controller')
const passport=require('passport');

router.get('/sign-up',userController.signUp);
router.get('/sign-in',userController.signIn);
router.post('/create',userController.create);

//using passport local auth strategy with failureRedirect - /users/sign-in
router.post('/create-session',passport.authenticate('local',{failureRedirect:'/users/sign-in'}), userController.createSession); 
router.get('/sign-out',userController.destroySession);              //logout controller
router.post('/reset',userController.reset);                         //reset controller

//one which will lead us to google sign in , fetch some data
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']})); //here scope is info which we wanna get from google
//second when google fetch some data, send that data to me.
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),userController.createSession);

module.exports=router;