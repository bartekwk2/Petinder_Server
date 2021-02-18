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
    websiteRef : {
        type: String,
        required : false
    },
    animals : [{
        type : String,
        enum : ['Dog','Cat','Rabbit']
    }],
    breed : [{
        type : String
    }]
})

ShelterSchema.index({location : "2dsphere"})


module.exports = mongoose.model("Breeding",ShelterSchema)