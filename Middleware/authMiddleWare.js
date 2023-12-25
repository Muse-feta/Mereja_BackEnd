const jwt = require('jsonwebtoken')
require('dotenv').config()

const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({ message: "unAuthorized user" });
    }
    try {
        const token = authHeader.split(' ')[1]
        const { email } = jwt.verify(token, process.env.SECRET_KEY);
        if(!token){
            return res.status(500).json({status: false, message: 'invalid token'})
        }
        req.user = { email };
        console.log(email)
        // res.status(200).json({message: 'verified'})
        next()
    } catch (error) {
        res.status(500).json({error})
    }
}

module.exports = authMiddleWare