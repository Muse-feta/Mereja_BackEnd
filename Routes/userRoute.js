const router = require('express').Router()

const {
  checkController,
  registerController,
  loginController,
  forgotController,
} = require("../Controller/userController");
const authMiddleWare = require("../Middleware/authMiddleWare");

router.get("/check", authMiddleWare, checkController);
router.post('/register', registerController)
router.post('/login', loginController)
router.post('/forgot-password', forgotController)

module.exports =  router 