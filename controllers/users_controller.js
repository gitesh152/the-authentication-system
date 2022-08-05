const User=require('../models/user');
const crypto = require('crypto');       //using cryoto lib to encrypt and decrypt password
let algorithm = 'aes256'; //Using AES encryption
let key = 'password';

module.exports.signUp=(req,res)=>{
    return res.render('user_sign_up');          //rendering user sign-up
}

module.exports.signIn=(req,res)=>{
    return res.render('user_sign_in');          //rendering user sign-in
}

module.exports.create=async (req,res)=>{
    console.log(req.body);
    try{
        if(req.body.password!=req.body.confirm_password){       //if password does not match      
            req.flash('error','Password does not match.');      //rendering flash msg
            console.log('Password does not match');
            return res.redirect('back');
        }
        let user=await User.findOne({email:req.body.email});    //if email already exist
        if(user){
            req.flash('error','User already exist.');
            console.log('User already exist');
            return res.redirect('back');
        }
        var cipher = crypto.createCipher(algorithm, key);       //creating cipher
        var encrypted = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');  //creating encrypted password
        let newUser=await User.create({name:req.body.name,email:req.body.email,password:encrypted});    //string name, email, password
        if(newUser){
            console.log('New Uer created',newUser);
            req.flash('success','New User Created Successfully.'); 
            return res.redirect('/users/sign-in');
        }
        console.log('Could not signup.');
        req.flash('error','Could not signup.');
        return res.redirect('back');
    }
    catch(e){
        console.log('Error',e);
        req.flash('error','Error.');
        return res.redirect('back');
    }
}

module.exports.createSession=async (req,res)=>{
    req.flash('success','Logged In Successfully.');                 //logged in router
    return res.redirect('/');
}

module.exports.destroySession=(req,res)=>{                          //logged out router
    req.flash('success','Logged Out Successfully.');
    console.log(req.flash());
    req.logout(function(err) {                      //fn provided by passport
        if(err){ 
            req.flash('error','Error.');
            return next(err); 
        }
        res.redirect('/');
    });
}

module.exports.reset=async (req,res)=>{                 //password reset router
    try{
        var cipher = crypto.createCipher(algorithm, key);  
        var encrypted = cipher.update(req.body.newPassword, 'utf8', 'hex') + cipher.final('hex');
        console.log(req.body.newPassword,encrypted);
        let updatedUser=await User.findByIdAndUpdate(req.body.ID,{password:encrypted})
        req.flash('success','Password changed Successfully.');
    }
    catch(e){
        console.log('Error',e);
        return res.redirect('back');
    }
    console.log('Resetting');
    res.redirect('/');
}