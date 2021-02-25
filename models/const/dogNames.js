const mongoose = require('mongoose');

const dogNameSchema = mongoose.Schema({
    name : {
        type : String,
        required: true,
    },
    photo : {
        type : String,
        required: true,
    },
})

module.exports = mongoose.model("DogName",dogNameSchema)