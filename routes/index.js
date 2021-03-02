const express = require('express')
const actions = require('../methods/actions')
const router = express.Router()
var User = require('../models/user')

router.get('/', (req, res) => {
    res.send('Hello there you')
})

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})

router.post('/adduser', actions.addNew)

router.post('/authenticate', actions.authenticate)

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

module.exports = router