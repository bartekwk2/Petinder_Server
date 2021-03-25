const admin = require('firebase-admin')
const serviceAccount = require('./adoptionSDK.json')


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://adoptionapp-20c5d-default-rtdb.firebaseio.com",
  });


  // Send notification to topic
async function sendNotification(body){

    try{
        var payload = {notification : {title : 'abcd',body : body,},data : {click_action : 'FLUTTER_NOTIFICATION_CLICK'}}
        await admin.messaging().sendToTopic('Event',payload)
    }catch(error){
        console.log(error)
    }
}


module.exports = sendNotification