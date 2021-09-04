const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        min: 6,
        max:255
    },
    email:{
        type:String,
        required: true,
        min:6,
        max:255
    },
    password:{
        type:String,
        required: true,
        max: 1024,
        min: 6
    },
    profile_pic_url:{
        type:String
    },
    friends: Array
    //Array de obiecte de forma:
    //name: ceva
    //chat: [{from: __, content:__}]
})

module.exports = mongoose.model('User',userSchema);