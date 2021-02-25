const mongoose = require('mongoose');

const catNameSchema = mongoose.Schema({
    name : {
        type : String,
        required: true,
    },
    photo : {
        type : String,
        required: true,
    },
})

module.exports = mongoose.model("CatName",catNameSchema)