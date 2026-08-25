const mongoose = require("mongoose");
const duaSchema = new mongoose.Schema({
    userId:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
    title:{
        type : String,
        required : true
    },
    arabicText:{
        type : String,
        required : true
    },
    translation:{
        type : String,
        required : true
    },
    category:{
        type : String,
        required : true
    }
});
const Dua = mongoose.model("Dua",duaSchema);
module.exports = Dua;