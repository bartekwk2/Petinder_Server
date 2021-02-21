const mongoose= require('mongoose');

const oneToOneConvSchema= mongoose.Schema(
    {
        messages:[{

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
                type : Date,
            },

        }],
        users : [{
            type: mongoose.Schema.Types.ObjectId,
            ref : "User",
            index : true,
        }]
    }
)

module.exports=mongoose.model("OneTwoOne",oneToOneConvSchema)