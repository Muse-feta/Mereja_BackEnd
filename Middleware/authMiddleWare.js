const jwt = require('jsonwebtoken')
require('dotenv').config()

const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({ message: "unAuthorized user" });
    }
    try {
        const { email } = jwt.verify(token, process.env.SECRET_KEY);
        const token = authHeader.split(' ')[1]
        if(!token){
            return res.status(500).json({status: false, message: 'invalid token'})
        }
        req.user = { email };
        console.log(email)
        res.status(200).json({message: 'verified'})
    } catch (error) {
        res.status(500).json({error})
    }
}

module.exports = authMiddleWare