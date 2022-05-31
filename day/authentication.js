var jwt = require('jsonwebtoken');
const secret = '!@#%^$&&*()'
function checkJwtAuthentication(req, rest, next) {
    if (req.headers && req.headers.authorization){
        var token = req.headers.authorization.split(' ')
        jwt.verify(token[1], secret, function(err, decoded){
            if(err) {
                return rest.status(401).json({ success: false, error:true, data:Array(), msg: 'Failed to authenticate token'});
            }
            console.log(decoded, "decoded");
            return next();
        });
    }
    else {
        return rest.status(401).json({ success: false, error:true, data: Array(), msg: 'No token Provided.' });
    }
}
module.exports = checkJwtAuthentication;

