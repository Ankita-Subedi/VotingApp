const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

//check request header has authorizatin or not
const authorization = req.headers.authorization
if(!authorization) return res.status(401).json({error: "Token not found"})

    //Extract  token from request header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({error: 'Unauthorized'})

        //If token found
        try{
            //verify token
            //if verify sucess, it will retrn payload that u used while creating this token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decoded)

            //sending decoded payload to server
            //attach user info to request object, cause genearlly tokens contain user info itself
            //can also write req.whatever eg: req.userPayload
            req.user = decoded;
            next();
        }catch(err){
            console.error(err);
            res.status(401).json({err: 'Invalid Token'})
        }
}

//Function to generate JWT token
const generateToken = (userData) => {
    //Generate new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn:30000});
}

module.exports = {jwtAuthMiddleware, generateToken}