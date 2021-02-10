
const auth = require("../middleware/auth")
const express = require('express')
const router = express.Router()
const User = require('../models/user')



router.put("/update",auth, async(req,res) => {

    const {location} = req.body

    try{
        let user = await User.findById(req.user.id)
        user.location = location
        await user.save()

        res.status(200).json({
            success: true,
            message: "user location updated successfully",
          })

    }catch (err) {
        res.status(500).json({
          success: false,
          error: "Internal Server Error",
        })
      }
})



module.exports = router