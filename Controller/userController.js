const { connection } = require('../Config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const checkController = (req, res) => {
    const {email} = req.user
    res.status(200).json({status: true, message: 'user succesfully checked', email})
}
const registerController = async(req, res) => {
    const { firstName, lastName, email, password } = req.body

    if(!firstName || !lastName || !email || !password) {
        return res.status(500).json({status: false, message: 'please provide all required fields'})
    }

    const hashPassword = await bcrypt.hash(password, 10)

    try {
        const existingUser = await connection.query(`SELECT * FROM user WHERE email='${email}'`)
        console.log(existingUser)

        if(existingUser[0].length !== 0){
            return res.status(500).json({
                status: false,
                message: 'this user already registered !!'
            })
        }
        await connection.query(`INSERT INTO user (firstName, lastName, email, password) VALUE (?,?,?,?)`,[firstName, lastName, email, hashPassword])
        const token = jwt.sign(
          { email: email },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );


        res.status(201).json({status: true, message: " User Registered Succesfully", token})
    } catch (error) {
        res.status(500).json({error})
    }
}

const loginController = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(500).json({status: false, message: 'Please provide all required fields'})
    }

    try {
        const foundUser = await connection.query(`SELECT * FROM user WHERE email='${email}'`)
        const user = foundUser[0][0]
        // console.log(user.email)
        
        if(!user){ 
            return res.status(403).json({status: false, message: 'invalid Email'})
        }
                const hashPassword = await bcrypt.compare(
                  password,
                  user.password
                );  
        if(!hashPassword){
            return res.status(403).json({status: false, message: 'invalid password'})
        }

        const token = jwt.sign(
          { email: user.email, userid: user.id },
          process.env.SECRET_KEY, {expiresIn: '1d'}
        );

        res.status(200).json({status: true, message: 'user succesfully login', token})
    } catch (error) {
        res.status(500).json({error})
    }

}

module.exports = {checkController, registerController, loginController}