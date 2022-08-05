const mongoose=require('mongoose');     //using mongoose
mongoose.connect('mongodb://localhost/authentication_system_db');       //connecting to db
const db=mongoose.connection;               //storing conncetion
db.on('error',console.error.bind(console,'Error connecting db'));   //when error occurs
db.once('open',()=>console.log(`Connected to db ${db.name}`));      //when connection is open
module.exports=db;