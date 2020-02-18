const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req,res,next) {
    const token = req.header('auth-token');
    
    if(!token)
    {
        return res.json({errors : [
            {
                msg : 'Login expired'
            }
        ]})
    }
    //Verify token
    try {
     
        const decoded = jwt.verify(token, config.get('privateKey'));
        
        req.id = decoded.data.id;
        console.log(decoded);
        
        next();
    } catch (error) {
        res.status(401).json({msg : "Token not valid" });
    }
}