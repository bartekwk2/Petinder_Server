const Pet = require('../models/pet')
const express = require('express')
const router = express.Router()

// Pet Registration
router.post("/registerPet",
    async (req, res) => {
      try {
        const { name, shelterId,typeOfPet,typeOfPetOwner,dateOfAdd,age,
          vaccinates,character,imageRefs,location,desc,vaccinateFirstCheck,vaccinateSecondCheck,
          vaccinateThirdCheck} = req.body;
          let pet = new Pet({
            name : name,
            shelter :shelterId,
            typeOfPet : typeOfPet,
            typeOfPetOwner : typeOfPetOwner,
            dateOfAdd : dateOfAdd,
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
          await pet.save();
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
    const { longitude, latitude, distance,type } = req.body;
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
      res.status(200).json({
        success: true,
        pet: pet,
      })

      /*
      .populate('shelter',['name','adress'])
      .exec(function (err, pet) {
        if (err){
          console.log(err)
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          })
        }else{
        console.log('The shelter is %s', pet.shelter)
        res.status(200).json({
          success: true,
          pet: pet,
        })
      }
      })
      */


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
      active,smart,loud,likesEating,familyFriendly,peaceful,inteligence,wellBehaved,knowTricks,fearfull } = req.body;
    try {
      let pet = await Pet
      .find({
        location: {
          $near: {
            $maxDistance: distance/111.12,
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          },
        },
         //Suwak automatycznie będzie miał cały zakres a tam wyżej checkboxy do zaznaczania
        typeOfPet : typeOfPet?typeOfPet: { $in: ['Dog', 'Cat', 'Rabbit'] },
        typeOfPetOwner : typeOfPetOwner?typeOfPetOwner : {$in: ['Shelter','Individual','Breeding']},
        age: { $gt: ageStart-1, $lt: ageStop-1 },
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
  
  function checkCharacter(trait) {
    if(trait == null){
      return {$gt:-1}
    }else{
      switch(trait){
        case 'small' : 
          return {$gte: 1, $lte: 2}
        case 'medium' :
          return {$gte: 2.5, $lte: 3.5}
        case 'large' :
          return {$gte: 4, $lte: 5}
      }
    }
  }



  //---------------------------------------------

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

      const count = await Pet.countDocuments();

      res.status(200).json({
        success: true,
        pet: pet,
        totalPages: Math.ceil(count / limit),
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
  



  

  module.exports = router