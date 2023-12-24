const router = require('express').Router()
const {
  checkController,
  registerController,
  loginController,
} = require("../Controller/userController");

router.get("/check", checkController);
router.post('/register', registerController)
router.post('/login', loginController)

module.exports =  router 