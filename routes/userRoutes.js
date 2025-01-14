const express = require('express');
const { createUser, login, forgetPassword } = require('../controller/userController');
const isAuthenticated = require('../middleware/IsAutheticated');

const  router = express.Router();


router.post("/signup",createUser);
router.post("/login",login);
router.post("/reset-password",isAuthenticated,forgetPassword)



module.exports=router 