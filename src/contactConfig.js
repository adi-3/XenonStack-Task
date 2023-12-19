const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://127.0.0.1:27017/Task2XenonStack");

//check if database is connected
connect.then(()=>{
    console.log("Database connected Successfully");
})
.catch(()=>{
    console.log("Database could not be connected");
});

const contactSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true
    }

});

//collection part
const contactCollection = new mongoose.model("userInfo", contactSchema);
module.exports = contactCollection;