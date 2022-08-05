module.exports.setFlash=(req,res,next)=>{       //middleware to set flash messages
    res.locals.flash={
        'success':req.flash('success'),     //flash message key
        'error':req.flash('error')  //another flash message key
    };
    next();
}