//jshint esversion:6
require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const path = require('path')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()
app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser: true, useUnifiedTopology: true})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]})
const User = mongoose.model('User',userSchema)


const user = new User({
    email: 'kv3delacruz@getMaxListeners.com',
    password: 'holi'
})

/*
user.save(function(err){
    if(!err){
        console.log('user created!')
    } else {
        console.log(err)
    }
})
*/
app.get('/',function(req,res){ 
    res.render("home")
})

app.get('/login',function(req,res){
    res.render("login")
})

app.get('/register',function(req,res){
    res.render("register")
})

app.post('/register',function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function(err){
        if(!err){
            console.log('user created')
            res.render('secrets')
        } else {
            console.log(err)
        }
    })
})

app.post('/login',function(req,res){
    const username = req.body.username
    const password = req.body.password
    User.findOne({email: username},function(err,foundUser){
        if(!err){
            if(foundUser){
                if(foundUser.password === password){
                    res.render('secrets')
                    console.log('logedin')
                } else{
                    console.log('password error')
                    res.redirect('login')
                }
            } else {
                console.log('usuario no encontrado')
                res.redirect('register')
            }
        } else {
            console.log(err)
        }
    })
    
})

let port = process.env.PORT
if(port == null || port == ""){
    port = 3000
}

app.listen(port,function(){
    console.log("Server running on port " + port)
})