const express = require("express");
const router = express.Router();

const userValidate = require("../validate/user.validate");

const controller = require("../controller/user.controller");

router.post("/register", userValidate.register, controller.register);

router.post("/login", userValidate.login, controller.login);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", userValidate.resetPassword, controller.resetPassword);

router.get("/detail", controller.detail);


module.exports = router;