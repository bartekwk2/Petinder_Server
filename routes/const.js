const express = require('express')
const router = express.Router()
const catNames = require('../models/const/catNames')
const dogNames = require('../models/const/dogNames')


router.get("/catNames", async (req, res) => {
    try {
      let names = await catNames
      .find({})
      res.status(200).json({
        success: true,
        pet: names,
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })
  router.post("/catNamesAdd", async (req, res) => {
    const { name,photo } = req.body;
    try {
      let catName = new catNames({name:name,photo:photo})
      await catName.save()
      res.status(200).json({
        success: true,
        pet: catName.id,
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  router.get("/dogNames", async (req, res) => {
    try {
      let names = await dogNames
      .find({})
      res.status(200).json({
        success: true,
        pet: names,
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })
  router.post("/dogNamesAdd", async (req, res) => {
    const { name,photo } = req.body;
    try {
      let dogName = new dogNames({name:name,photo:photo})
      await dogName.save()
      res.status(200).json({
        success: true,
        pet: dogName.id,
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      })
    }
  })

  router.get("/dogNamesQuery/:searchString", async (req, res) => {
    try {
      let names = await 
      dogNames.find({"name": {
        "$regex": ".*"+req.params.searchString+".*",
        '$options' : 'i',
      }})
      res.status(200).json({
        success: true,
        pet: names,
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