console.log('Home Script');
function check(){
    //noty if password does not match
    if(document.getElementById('newPassword').value != document.getElementById('newConfirmPassword').value) {
        new Noty({
        layout:'topRight',
        theme:'metroui',
        type:'error',
        text: "Password does not match.",  
        timeout:1500       
        }).show();
        return false;
    }       
}
