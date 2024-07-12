const express = require("express");
const router = express.Router();

//validate
const userValidate = require("../validate/user.validate");

// middleware
const authUserMiddleware = require("../middleware/authUser.middleware");

// controller
const controller = require("../controller/user.controller");

router.post("/register", userValidate.register, controller.register);

router.post("/login", userValidate.login, controller.login);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", userValidate.resetPassword, controller.resetPassword);

router.get("/detail", authUserMiddleware.requireAuth, controller.detail);


module.exports = router;