const mongoose= require('mongoose');

const imageSchema= mongoose.Schema(
    {
        filename:{
            type: String,
            required: true
        },
        userID:{
            type: String,
            required: true
        },
    }
);


module.exports=mongoose.model("Image",imageSchema)