var jwt = require('jsonwebtoken');

// Check Authentication
function CheckJwtAuthentication(req, res, next){
    if(req.headers && req.headers.authorization){
        jwt.verify(req.headers.authorization, "my_secret", function (err, decoded){
            if(err){
                return res.status(401).json({
                    success: false,
                    error: true,
                    data: Array(),
                    msg: 'Failed to Authenticate Token.'
                });
            }

            console.log(decoded, "Decoded");
            return next();
        });
    }else{
        return res.status(401).json({
            success: false,
            error: true,
            data: Array(),
            msg: 'Token not provided.'
        });
    }
}

module.exports = CheckJwtAuthentication;