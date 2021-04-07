const Pet = require('../models/pet')
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')

// Pet Registration
router.post("/registerPet",
    async (req, res) => {
      try {
        const { id,name,typeOfPet,typeOfPetOwner,dateOfAdd,age,
          vaccinates,character,imageRefs,location,desc,vaccinateFirstCheck,vaccinateSecondCheck,
          vaccinateThirdCheck,gender,city} = req.body;
          let pet = new Pet({
            name : name,
            city : city,
            userID :id,
            typeOfPet : typeOfPet,
            typeOfPetOwner : typeOfPetOwner,
            dateOfAdd : dateOfAdd,
            gender : gender,
            age : age,
            desc : desc,
            vaccinates : vaccinates,
            vaccinateFirstCheck:vaccinateFirstCheck,
            vaccinateSecondCheck : vaccinateSecondCheck,
            vaccinateThirdCheck : vaccinateThirdCheck,
            character : character,
            imageRefs : imageRefs,
            numberOfViews : 0,
            location: location
        });

        let userPet ={
          'petType' : "Own",
          'petRef' : mongoose.Types.ObjectId(pet.id)
        }
          await pet.save();
          await User.findOneAndUpdate(
        {_id:id},
        {$push : {pets:userPet}}
      )
          res.status(200).json({
            success: true,
            pet: pet.id,
          });
        
      } catch (err) {
        console.log(req.body)
        console.log(err.message);
        res.status(500).json({
          success: false,
          error: "Internal Server Error",
        })
      }
    }
  )

  // Getting one pet
  router.get("/findOnePet/:id", async (req, res) => {
    try {
     await Pet
     .findById(req.params.id)
     .populate('shelter')
     .exec(function (err, pet) {
      if (err) return handleError(err)
      console.log('The shelter is %s', pet.shelter)
      res.status(200).json({
        success: true,
        pet: pet,
      })
    })
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      })
    }
  })


// Getting all nearest pets
  router.post("/petsNearby", async (req, res) => {
    const { longitude, latitude, distance,typeOfPetOwner } = req.body;
    try {
      let pet = await Pet
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
        typeOfPetOwner : {$in: typeOfPetOwner},
      })
      res.status(200).json({
        success: true,
        pet: pet,
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  // Getting all nearest pets with queries 
  router.post("/petsNearbyQueries", async (req, res) => {
    const { longitude, latitude, distance,typeOfPet,typeOfPetOwner,ageStart,ageStop,
      active,smart,loud,likesEating,familyFriendly,peaceful,inteligence,wellBehaved,knowTricks,fearfull,gender,petBreed} = req.body;

    const {page = 1,limit = 10} = req.query
    try {
      let pet = await Pet
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
        typeOfPet : typeof typeOfPet != 'undefined' ?typeOfPet: { $in: [0,1,2,3,4,5,6,7] },
        typeOfPetOwner : typeof typeOfPetOwner  != 'undefined'?typeOfPetOwner : {$in: [0,1,2]},
        age: { $gt: ageStart-1, $lt: ageStop-1 },
        gender : typeof gender  != 'undefined' ? gender : {$in:[0,1]},
        petBreed : typeof petBreed  != 'undefined'? petBreed : {$ne : 'notGiven'},
        'character.active' : checkCharacter(active),
        'character.smart': checkCharacter(smart),
        'character.loud': checkCharacter(loud),
        'character.likesEating': checkCharacter(likesEating),
        'character.familyFriendly': checkCharacter(familyFriendly),
        'character.peaceful': checkCharacter(peaceful),
        'character.inteligence': checkCharacter(inteligence),
        'character.wellBehaved': checkCharacter(wellBehaved),
        'character.knowTricks': checkCharacter(knowTricks),
        'character.fearfull': checkCharacter(fearfull) 
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)

      res.status(200).json({
        success: true,
        pet: pet,
        currentPage: page
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })
  
  function checkCharacter(trait) {
    if(trait == null){
      return {$gt:-1}
    }else{
      switch(trait){
        case 0 : 
          return {$gte: 1, $lte: 2}
        case 1 :
          return {$gte: 2.5, $lte: 3.5}
        case 2 :
          return {$gte: 4, $lte: 5}
      }
    }
  }



  // Getting all nearest pets with pagination
  router.get("/petsNearby2", async (req, res) => {
    const { longitude, latitude, distance,page = 1,limit = 10 } = req.query;
    try {
      let pet = await Pet
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
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)

      res.status(200).json({
        success: true,
        pet: pet,
        currentPage: page
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  
  router.put("/updatePetViews",async(req,res)=>{
    const {id} = req.query;
    try{
      await Pet.findOneAndUpdate({_id: id},
        {$inc : {'numberOfViews':1}})
        return res.status(200).json({
          success: true,
        })
    }catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  router.get("/laterDelete",async (req,res)=>{
    try{
      let pet = await Pet.findById("604783c4ccc2944444f22d4d")
      res.status(200).json({
        success: true,
        pet: pet,
      })
    }catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })
  

  module.exports = router