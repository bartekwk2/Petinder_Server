const express = require('express')
const actions = require('../methods/actions')
const router = express.Router()


router.get('/', (req, res) => {
    res.send('AsdasdaS')
})

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})

router.post('/adduser', actions.addNew)

router.post('/authenticate', actions.authenticate)

router.get('/getinfo', actions.getinfo)

router.get('/dupa', (req, res) => {
    res.send('AsdasdaS')
})





module.exports = router