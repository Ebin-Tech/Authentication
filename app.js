//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true, useUnifiedTopology: true },(err)=>{console.log("connected to database");})
const userSchema = new mongoose.Schema({
  user:String,
  password:String
})
// var secret = "Thisisalittlesecrete"
userSchema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields: ["password"] });
 const User = new mongoose.model('User', userSchema);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.get('/',(req,res)=>{
    res.render("home")
})
app.route('/register')
.get((req,res)=>{
  res.render("register")
})
.post((req,res)=>{
  const newUser = new User({
    user: req.body.username,
    password: req.body.password
  })
  newUser.save((err)=>{
    if(err){
      console.log(err);
    }else{
      res.render("secrets")
    }
  });
})
app.route('/login')
.get((req,res)=>{
  res.render("login")
})
.post((req,res)=>{
  const userName = req.body.username
  const Password= req.body.password
User.findOne({user:userName},(err,foundUser)=>{
  if(foundUser.password===Password){
    res.render("secrets");
  }
  else{
      console.log(err);
    
}
})
})
app.get("/logout",(req,res)=>{
  res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});