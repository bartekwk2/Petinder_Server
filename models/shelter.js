const mongoose = require('mongoose');

const ShelterSchema = mongoose.Schema({
    name : {
        type : String,
        required: false,
    },
    location : {
        type: {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
    address : {
        type: String,
        required:false
    },
    pets : [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Pet" 
    }],
    desc : {
        type : String,
        required : true
    },
    photosRef : [{
        type:String
    }],
})

ShelterSchema.index({location : "2dsphere"})


module.exports = mongoose.model("Shelter",ShelterSchema)