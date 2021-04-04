const admin = require('firebase-admin')
const serviceAccount = require('./adoptionSDK.json')
const User = require('../models/user')


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://adoptionapp-20c5d-default-rtdb.firebaseio.com",
  });


  // Send notification to topic
async function sendNotification(message,receiverID){
    try{
        let userNameAll = await User.findOne({_id:receiverID}).select('name')
        let userName = userNameAll["name"]

        if(userName.includes("@")){
            userName = userName.split("@")[0]
        }
        var payload = {notification : {title : userName,body :message},
        data : {click_action : 'FLUTTER_NOTIFICATION_CLICK'}}
        await admin.messaging().sendToTopic(receiverID,payload)
    }catch(error){
        console.log(error)
    }
}


module.exports = sendNotification