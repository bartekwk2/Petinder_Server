
const Shelter = require('../models/shelter')
const Pet = require('../models/pet')
const express = require('express')
const router = express.Router()


//Shelter registration
router.post("/registerShelter",
    async (req, res) => {
      try {
        const { name, location, address, desc, photosRef } = req.body;
        let shelter = await Shelter.findOne({ address })
        if (shelter) {
          res.status(409).json({
            success: false,
            error: `Shelter with ${address} already exists`,
          });
        } else {
          shelter = new Shelter({
            name : name,
            location : location,
            adress : address,
            desc : desc,
            photosRef : photosRef,
          });
          await shelter.save();
          res.status(200).json({
            success: true,
            shelter: shelter.id,
          });
        }
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


// Getting all nearest shelters

  router.post("/sheltersNearby", async (req, res) => {
    
    const { longitude, latitude, distance } = req.body;
    try {
      nearByUsers = await Shelter.find({
        location: {
          $near: {
            $maxDistance: distance,
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          },
        },
      }).find((error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            success: false,
            message: "Error",
          })
        }
        nearByUsers = results;
      })
      return res.status(200).json({
        success: true,
        results: nearByUsers,
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })



    // Putting one pet into shelter
    router.put("/putPetToShelter", async (req, res) => {
      try {
       let petId =  req.body.idPet
       Shelter.findOneAndUpdate(
          { _id: req.body.idShelter }, 
          { $push: { pets: petId  } },
         function (error, success) {
               if (error) {
                   console.log(error);
                   res.status(500).json({
                    success: false,
                    error: "Internal Server Error",
                  })
               } else {
                   console.log(success);
                   res.status(200).json({
                    success: true,
                  })
               }
           });
      } catch (err) {
        console.error(err.message);
        res.status(500).json({
          success: false,
          error: "Internal Server Error",
        })
      }
    })



    // Getting all pets from the shelter
    router.get("/findAllPetsFromShelter/:id", async (req, res) => {
      try {
       await Shelter
       .findById(req.params.id)
       .populate('pets')
       .exec(function (err, shelter) {
        if (err) return handleError(err)
        console.log('Pets are %s', shelter.pets)
        res.status(200).json({
          success: true,
          shelter: shelter,
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



  module.exports = router