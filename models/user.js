var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')

var userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    photosRef : [{
        type:String
    }],
    isActive : {
        type: Boolean
    },
    lastActive : {
        type:String
    },
    pets:[{
       petType: {
           type : String,
         enum : ['Own','Liked','Disliked']},
        petRef : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pet',
        }
    }],
    friends : [{

        friendRef : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',},

    lastMsg : {
        message:{
            type: String,
            required: true
        },
        senderID:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "User",
            index : true,
            required: true,
        },
        receiverID : {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User",
            index : true,
            required: true
        },
        dateOfSend : {
            type : String,
        },
        hasSeen : {
            type : Boolean
        }
    }
}]

})
userSchema.index({name : 'text'})
userSchema.index({"pets.petRef": 1, "pets.petType": 1});

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next()
            })
        })
    }
    else {
        return next()
    }
})

userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if(err) { 
            return cb(err)
        }
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', userSchema)