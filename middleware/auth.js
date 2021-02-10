var jwt = require('jwt-simple')

module.exports = function(req,res,next){

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            
        var token = req.headers.authorization.split(' ')[1]
        try{
        var decodedtoken = jwt.decode(token, config.secret)
        req.user = decodedtoken
        next()
        }
        catch(err){
            res.json({success:false,msg:'Token is not valid'})
        }
    }
    else {
        return res.json({success: false, msg: 'No Headers'})
    }
}