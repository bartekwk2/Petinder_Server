const mongoose = require('mongoose');

const PetSchema = mongoose.Schema({

    name : {
        type : String,
        required: true,
    },
    shelter : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shelter',
        required : false,
    },
    typeOfPetOwner : {
        type : Number,
    },
    typeOfPet : {
        type : Number
    },
    petBreed : {
        type : String
    },
    dateOfAdd : {
        type : Date,
    },
    numberOfViews :{
        type : Number,
    },
    desc :{
        type:String
    },
    city :{
        type:String
    },
    age : {
        type : Number,
    },
    gender : {
        type:Number,
    },
    vaccinates : {
        type : String
    },
    vaccinateFirstCheck : {
        type : Boolean
    },
    vaccinateSecondCheck : {
        type : Boolean
    },
    vaccinateThirdCheck : {
        type : Boolean
    },
    character : {
        health : {
            type : mongoose.Decimal128,
        },
        active : {
            type : mongoose.Decimal128,
        },
        smart : {
            type : mongoose.Decimal128,
        },
        loud : {
            type : mongoose.Decimal128,
        },
        likesEating : {
            type : mongoose.Decimal128,
        },
        familyFriendly : {
            type: mongoose.Decimal128
        },
        peaceful : {
            type : mongoose.Decimal128
        },
        inteligence : {
            type : mongoose.Decimal128
        },
        wellBehaved : {
            type : mongoose.Decimal128
        },
        knowTricks : {
            type: mongoose.Decimal128
        },
        fearfull : {
            type: mongoose.Decimal128
        }
    },
    imageRefs : {
        type : [String]
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
        },
        required : false
    },
    price : {
        type : String
    }
})

PetSchema.index({location : "2dsphere"})

module.exports = mongoose.model("Pet",PetSchema)
