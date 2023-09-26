//jshint esversion:6
require('dotenv').config()
const express = require("express")
const bodyparser=require("body-parser")
const ejs = require("ejs")
const mongoose=require("mongoose")
const { connected } = require("process")
const encrypt =require("mongoose-encryption")

const app =express()

app.use(express.static("public"))
app.set('view engine', "ejs" )
app.use(bodyparser.urlencoded({extended:true}))

mongoose.connect('mongodb+srv://mahanthasimha37:rammahi21@mahanthasimha.0g62iuc.mongodb.net/user')
    .then(() => console.log('Connected!'));

const user =new mongoose.Schema({
    name:String,
    password:String
})


user.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password'] });//this will encrypt the password

const User =mongoose.model("User",user)

app.get('/',(req,res)=>{
    res.render("home")
})

app.get('/register',(req,res)=>{
    res.render("register")
})

app.get('/login',(req,res)=>{
    res.render("login")
})

app.post("/login",(req,res)=>{
    const username=req.body.username
    const password=req.body.password
    console.log(username);
    console.log(password);

  
    User.findOne({name:username})
    .then((docs)=>{
        if(docs.password===password){
            res.render("secrets");
        }
        else{
            res.send("incorrect password")
        }
        
    })
    .catch((err)=>{
        console.log(err);
    });
     

})

app.post("/register",(req,res)=>{

    console.log(req.body.username);
    console.log(req.body.password);
    const data1=new User({
        name:req.body.username,
        password:req.body.password
    });
    data1.save().then(()=>{
        res.render("secrets")
    });


});
app.listen(3000,function(){
    console.log("your server is stated on port 3000")
})


