var User = require('../models/user')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')

var functions = {
    addNew: async (req, res)=> {
        if ((!req.body.name) || (!req.body.password)) {
            res.json({success: false, msg: 'Uzupełnij wszystkie pola'})
        }
        else {
            var checkUser = await User.findOne({name:req.body.name})
            if(!checkUser){
                var newUser = User({
                    name: req.body.name,
                    password: req.body.password
                });
                newUser.save(function (err, newUser) {
                    if (err) {
                        res.json({success:  false, id: newUser.id})
                    }
                    else {
                        res.json({success: true, id: newUser.id})
                    }
                })
            }else{
                res.json({success: false, id:"-1"})
            }
        }
    },
    authenticate: function (req, res) {
        User.findOne({
            name: req.body.name
        }, function (err, user) {
                if (err) throw err
                if (!user) {
                    res.status(403).send({success: false, msg: 'Logowanie nieudane, mail nie znaleziony',id:""})
                }
                else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            var token = jwt.encode(user, config.secret)
                            res.json({success: true, token: token,id:user.id})
                        }
                        else {
                            return res.status(403).json({success: false, msg: 'Logowanie nieudane, hasło nie znalezione',id:""})
                        }
                    })
                }
        }
        )
    },
    getinfo: function (req, res) {

        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            return res.json({success: true, msg: 'Hello ' + decodedtoken.password})
        }
        else {
            return res.json({success: false, msg: 'No Headers'})
        }
    },
}

module.exports = functions