const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require("./config");
const contactCollection = require("./contactConfig");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//use ejs
app.set('view engine', 'ejs');
//static file
app.use(express.static("public"));
app.get("/", (req, res)=>{
    res.render("login");
})
app.get("/signup", (req, res)=>{
    res.render("signup");
})

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    const existingUser = await collection.findOne({name:data.name});
    if(existingUser){
        res.send("Username not available. Please choose a different username.");
    }
    else{
        //hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        res.render("login");
    }
});

//login user
app.post("/login",async (req, res)=>{
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check){
            res.send("username not found");
        }

        //compare the hash password with the one in the database
        const passMatch = await bcrypt.compare(req.body.password, check.password);
        if(passMatch){
            res.render("home");
        }
        else{
            req.send("invalid password");
        }
    }
    catch{
        res.send("wrong details");
    }
})

app.get("/contact", (req, res)=>{
    res.render("contact");
})

app.post("/contact",async (req, res)=>{
    const contactInfo = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
    };

    const userinfo = await contactCollection.insertMany(contactInfo);
    res.render("home");
})

const port = 3000;
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})