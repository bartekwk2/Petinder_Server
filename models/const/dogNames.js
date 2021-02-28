const mongoose = require('mongoose');

const dogNameSchema = mongoose.Schema({
    name : {
        type : String,
        required: true,
        index : true,
    },
    photo : {
        type : String,
        required: true,
    },
})

dogNameSchema.index({name : 'text'})

module.exports = mongoose.model("DogName",dogNameSchema)