const mongoose= require('mongoose');

const messageSchema= mongoose.Schema(
    {
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
    }
)

module.exports=mongoose.model("Message",messageSchema)