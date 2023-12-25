const router = require('express').Router()

const {
  checkController,
  registerController,
  loginController,
} = require("../Controller/userController");
const authMiddleWare = require("../Middleware/authMiddleWare");

router.get("/check", authMiddleWare, checkController);
router.post('/register', registerController)
router.post('/login', loginController)

module.exports =  router 