var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var userSchema = new Schema({

    name: {
        type: String,
        require: true
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
    sex: {
        type: String,
        require: true
    },
    age : {
        type: String,
        require: true
    },
    mail : {
        type: String,
        require: true
    },
    phone : {
        type:Number
    },
    ownPets : [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Pet" 
    }],
    likedPets : [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Pet" 
    }],
    seenPets : [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Pet" 
    }],
    photosRef : [{
        type:String
    }],
    lastActive : {
        type: Date
    }
})




module.exports = mongoose.model('PetUser', userSchema)