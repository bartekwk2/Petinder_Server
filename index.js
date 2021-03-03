
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')

const connectDB = require('./config/db')
const bodyParser = require('body-parser')

const routesAuth = require('./routes/index')
const routesLocation = require('./routes/location')
const routesShelter = require('./routes/shelter')
const routesPet = require('./routes/pets')
const routesChat = require('./routes/chat')
const routesConst = require('./routes/const')
const mongoose = require('mongoose')

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/uploads', express.static(__dirname +'/uploads'))
app.use(routesAuth)
app.use(routesLocation)
app.use(routesShelter)
app.use(routesPet)
app.use(routesChat)
app.use(routesConst)


app.use(passport.initialize())

//require('./config/passport')(passport)

//Multer and save locally

const path = require('path');
const multer = require('multer');

const port = 3000;

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });


const Photos = require('./models/photo')


//Upload route
app.post('/upload', upload.single('image'),async (req, res, next) => {

    console.log(req)

    console.log("Received file" + req.file.path);
    try {
        const imagepost= new Photos({
            image: req.file.path
          })
          const savedimage= await imagepost.save()
        return res.status(201).json({
            message: 'File uploded successfully'
        });
    } catch (error) {
        console.error(error);
    } 
});



//Multer and save to mongoose

const conn = mongoose.connection
const GridFsStorage = require('multer-gridfs-storage')
const dbConfig = require('./config/dbconfig')
const util = require("util");

    var storage3 = new GridFsStorage({
        url: dbConfig.database,
        options: { useNewUrlParser: true, useUnifiedTopology: true },
        file: (req, file) => {
          const match = ["image/png", "image/jpeg"];
      
          if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-bezkoder-${file.originalname}`;
            return filename;
          }
      
          return {
            bucketName: "photos",
            filename: `${Date.now()}-bezkoder-${file.originalname}`
          };
        }
      });
      


      // Upload single file
      var uploadFile3 = multer({ storage: storage3 }).single("image");
      var uploadFilesMiddleware = util.promisify(uploadFile3);
      var Image = require('./models/image')

      const uploadFile33 = async (req, res) => {
        try {
          await uploadFilesMiddleware(req, res);
      
          console.log(req.file.filename);
          if (req.file == undefined) {
            return res.send(`You must select a file.`);
          }else{
            var newImage = Image({
              filename : req.file.filename,
              userID : req.body.userID
            })
            newImage.save(function (err, newUser) {
              if (err) {
                  return res.json({success: false, msg: 'Failed to save'})
              }
              else {
                  return res.json({success: true, msg: 'Successfully saved'})
              }
          })}
        } catch (error) {
          console.log(error);
          return res.send(`Error when trying upload image: ${error}`);
        }
      }

      app.post("/upload3", uploadFile33);
      
    

    // Upload multiple files
    var uploadFiles = multer({ storage: storage3 }).array("photos", 10);
    var uploadFilesMiddleware2 = util.promisify(uploadFiles);


    const uploadFiles2 = async (req, res) => {
    try {
        await uploadFilesMiddleware2(req, res);
        console.log(req.files);

        if (req.files.length <= 0) {
        return res.send(`You must select at least 1 file.`);
        }else{

          console.log("siema")
          req.files.forEach(function(entry) {
        
            var newImage = Image({
              filename : entry.filename,
              userID : req.body.userID
            })
            newImage.save(function (err, newUser) {
              if (err) {
              }
              else {
                
              }
          })
        })
        return res.json({success: true, msg: 'Successfully saved'})
      }
    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
        }
        return res.send(`Error when trying upload many files: ${error}`);
    }
    }

    app.post("/upload4", uploadFiles2);





    //Get image

        let gfs
        conn.once('open', () => {
        gfs = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'photos',
        })
    })

      app.get('/image/:filename', (req, res) => {
        const file = gfs
          .find({
            filename: req.params.filename,
          })
          .toArray((err, files) => {
            if (!files || files.length === 0) {
              return res.status(404).json({
                err: 'no files exist',
              });
            }
            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
          });
      });


    //Get All users photoIds


    app.get('/myphotos/:myname',(req,res)=>{

      Image.find({userID : req.params.myname},function(err,photos){

        var photosMap = {};

        photos.forEach(function(onePhoto){
          photosMap[onePhoto._id] = onePhoto
        })

        res.send(photosMap)
      })
    })


    //Delete photo
    
    app.post('/files/del', (req, res) => {
      const obj_id = new mongoose.Types.ObjectId(req.body.id );
      gfs.delete( obj_id ,(err, gridStore) => {
               if (err) {
                   return res.status(404).json({ err });
               }
               else{
                return   res.status(200).json({ success: true,}) }
           });
   });


 // Sending notification

  const sendNotif = require('./messaging/firebaseNotifications')
  sendNotif()



const PORT = process.env.PORT || 3000
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))



// Socket stuff


const socketIO = require('socket.io')
const io = socketIO(server)
const Individaul = require('./models/chat/individualConversation')


io.on('connection', socket => {
  chatID = socket.handshake.query.chatID
  socket.join(chatID)

  socket.on('disconnect', () => {
      socket.leave(chatID)
  })

  socket.on('send_message',async (message) => {
      receiverChatID = message.receiverChatID
      senderChatID = message.senderChatID
      content = message.content
      dateOfSend = message.dateOfSend

      socket.in(receiverChatID).emit('receive_message', {
          'content': content,
          'senderChatID': senderChatID,
          'receiverChatID':receiverChatID,
          'dateOfSend':dateOfSend
      })

        await Individaul
        .findOneAndUpdate(
            { users : {$all : [senderChatID,receiverChatID]}},
            {$addToSet : {messages : message}})
  })
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);



