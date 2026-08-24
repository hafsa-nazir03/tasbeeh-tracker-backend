const mongoose = require("mongoose");

const tasbeehSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    category:{
        type : String,
        required : true
    },
    target:{
        type : Number,
        required : true,
        min : 1
    },
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    isDefault:{
        type : Boolean,
        default : false
    }
});

const tasbeeh = mongoose.model("Tasbeeh", tasbeehSchema);
module.exports = tasbeeh;