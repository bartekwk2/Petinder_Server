const express = require('express')
const actions = require('../methods/actions')
const router = express.Router()
var User = require('../models/user')
var Pet = require('../models/pet')
const mongoose = require('mongoose');
router.get('/', (req, res) => {
    res.send('Hello there you')
})

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})

router.post('/adduser', actions.addNew)

router.post('/authenticate', actions.authenticate)

router.post('/googleAuth',async (req, res)=> {

      var checkUser = await User.findOne({name:req.body.name})
      if(!checkUser){
          var newUser = User({
              name: req.body.name,
              password: req.body.password
          });
          newUser.save(function (err, newUser) {
              if (err) {
                res.status(500).json({success:  false})
              }
              else {
                res.status(200).json({success: true, id: newUser.id})
              }
          })
      }else{
        res.status(200).json({success: true, id: checkUser.id})
      }
})

router.get('/getinfo', actions.getinfo)

router.get('/getUserData', async (req, res) => {
    const { id } = req.query;
    try {
      let user = await User
      .findById(id)
      res.status(200).json({
        success: true,
        user: user,
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  router.get('/getUserShortData', async (req, res) => {
    const { id } = req.query;
    try {
      let user = await User
      .findById(id).select('name photosRef')
      res.status(200).json({
        success: true,
        user: user,
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  router.get('/myPetsType',async(req,res)=>{
    const {id,typePet} = req.query
    try{
      await User.aggregate([
        {$match: { "_id" : mongoose.Types.ObjectId(id) } },
        {$project : {'pets':1,"_id":0}},
        {$unwind : {path:'$pets',
        preserveNullAndEmptyArrays: true}},
        {$match : {'pets.petType' : typePet}},
        {$project : {'pets.petRef':1}},
        {$lookup: {from: 'pets', localField: 'pets.petRef', foreignField:'_id', as: 'petOut'}},
        {$group : {'_id':'$_id','petOut': {'$push': '$petOut'}}},
      ]).exec(async (err, pets) => {
        if (err){
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          })
        }else{
          console.log(pets)
          res.status(200).json({
            success: true,
            pets: pets[0],
          })
        }
    })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  router.post('/addPetToUser',async (req, res) => {
    const { id,pet } = req.body;
    try {
      let user = await User
      .findOneAndUpdate(
        {_id:id},
        {$push : {pets:pet}}
      )
      res.status(200).json({
        success: true,
        user: user,
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  router.get('/getNearestPetsSwipeScreen',async (req,res)=>{
    const { id,longitude, latitude, distance,page = 1,limit = 10 } = req.query;
    try {
      await Pet
      .find({
        location: {
          $near: {
            $maxDistance: distance,
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          },
        },
        "_id": { "$nin": await getmyPetIDs(id) }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec(function(err, pets) {
        if(!err){
        res.status(200).json({
          success: true,
          pet: pets,
          currentPage: page
        })
      }else{
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
        })
      }
   });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  async function getmyPetIDs(id) {
    try{
      let user = await User.findOne({_id : id}).select('pets.petRef')
      let userPets = user.pets.map(pet=>mongoose.Types.ObjectId(pet.petRef))
      return userPets
    }
    catch{
      return []
    }
  }

  router.put('/changeStatus',async(req,res)=>{

    try{
      const {id,lastActive,isActive} = req.body
      const filter = { _id : id };
      const update = { 
        isActive: isActive,
        lastActive : lastActive
       };

      let user = await User.findOneAndUpdate(filter,update)

      res.status(200).json({
        success: true,
        user : user
      })

    }catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  router.put("/addFriend", async (req, res) => {
    const session = await User.startSession()
    session.startTransaction()
    try {
     const {myId,friendID} = req.body
     await  User.findOneAndUpdate(
      { _id: myId }, 
      { $push: { 'friends': {'friendRef':friendID}  } }).session(session)

     await  User.findOneAndUpdate(
        { _id: friendID }, 
        { $push: { 'friends':{ 'friendRef' : myId } } }).session(session)

    await session.commitTransaction()
    session.endSession()
    res.status(200).json({
      success: true,
    })
    } catch (err) {
      await session.abortTransaction();
      session.endSession()
      console.error(err.message);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      })
    }
  })

  router.put('/updateLatestMessages',async (req, res) => {
    const { id,friendID,message } = req.body;
    try {
      let user = await User
      .findOneAndUpdate(
        {_id:id,
        'friends.friendRef' : friendID},
        {$set : {'friends.$.lastMsg' : message}}
      )
      res.status(200).json({
        success: true,
        user: user,
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  router.put('/makeLastMessageSeen',async(req,res)=>{
    const {id,friendID} = req.body;
    try{
      let user = await User
      .findOneAndUpdate(
        {_id:id,
        'friends.friendRef' : friendID},
        {$set : {'friends.$.lastMsg.hasSeen' : true}}
      )
      res.status(200).json({
        success: true,
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  router.get('/getLatestMessages',async (req,res)=> {
    const {myId} = req.query
    try{
      await User
      .findById(myId)
      .select('friends')
      .populate('friends.friendRef','name photosRef isActive lastActive')
      .exec(function (err,results){
        if(err){
          console.log(err)
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          })

        }else{
          return res.status(200).json({
            success: true,
            results: results,
          })
        }
      }) 
    }catch(err){
      console.log(err)
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  router.get("/friendsMainScreen",async (req,res)=>{
    try{
      const {myId} = req.query

      friends = await User
      .findById(myId)
      .select('name photosRef isActive lastActive')

      return res.status(200).json({
        success: true,
        friends: friends,
      })
      
    }catch(err){
      console.log(err)
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })


  router.get("/friendsQuery",async (req,res)=>{
    try{
      const {myId,searchString} = req.query
      let ids = await User.findById(myId).select("friends.friendRef")

      let friends = ids.friends
      let friendIds = friends.map(friend=>{
        return friend.friendRef
      })

      let names = await 
      User.find({
        "name": {
        "$regex": ".*"+searchString+".*",
        '$options' : 'i',},
        "_id": {
          $nin : friendIds}
      },    
        ).select('name photosRef isActive lastActive')

      res.status(200).json({
        success: true,
        pet : names
      })
    }catch(err){
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })


module.exports = router