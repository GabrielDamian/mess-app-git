const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    user_1: String,  
    user_2:String,
    arr: Array
})

module.exports = mongoose.model('message',messageSchema)