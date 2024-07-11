const User = require("../model/user.model");
const ForgotPassword = require("../model/forget-password.model");

const generateHelper = require("../../../helper/generate.helper");
const sendMailHelper = require("../../../helper/sendMail.helper");
const md5 = require('md5');

// [POST] /api/v1/user/register
module.exports.register = async (req, res) => {
  try {
    req.body.password = md5(req.body.password);

    const data = req.body;
    delete data.confirmPassword;
    const user = new User(data);
    await user.save();

    res.json({
      code: "200",
      message: "Đăng ký thành công"
    })
  } catch (error) {
    res.json({
      code: "400",
      message: "Lỗi!"
    })
  }
}

// [POST] /api/v1/user/login
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({
      email: email,
    });

    const token = user.token;
    res.cookie("token", token);

    res.json({
      code: "200",
      message: "Đăng nhập thành công",
      token: token
    });
  } catch (error) {
    res.json({
      code: "400",
      message: "Đăng nhập thất bại, vui lòng xem lại thông tin đăng nhập"
    });
  }
}

// [POST] /api/v1/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({
      email: email,
      deleted: false
    });

    if (!user) {
      res.json({
        code: "400",
        message: "Email không tồn tại!"
      });
      return;
    }

    const timeExpire = 5;
    const otp = generateHelper.generateRandomNumber(6);

    const data = {
      email: email,
      otp: otp,
      expireAt: Date.now() + timeExpire * 60,
    }

    const forgot = new ForgotPassword(data);
    await forgot.save();

    const subject = "Mã OTP xác nhận tài khoản";
    const html = `<p>
    Mã OTP của bạn là : <strong>${otp}</strong>.
    Đừng chia sẻ cho bất kì ai tránh kẻ gian đánh cắp tài khoản
    </p>`;

    sendMailHelper.sendMailNodemailer(email, subject, html);

    res.json({
      code: "200",
      message: "Đã gửi mã OTP tới email!",
      email: email
    })
  } catch (error) {
    res.json({
      code: "400",
      message: "Lỗi"
    });
  }
}

// [POST] /api/v1/user/password/otp
module.exports.otpPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const otpExist = await ForgotPassword.findOne({
      email: email,
      otp: otp
    });

    if (!otpExist) {
      res.json({
        code: "400",
        message: "Mã Otp không chính xác!"
      });
      return;
    }

    const user = await User.findOne({
      email: email
    })

    const token = user.token;
    res.cookie("token", token);

    res.json({
      code: "200",
      message: "Xác thự thành công!",
      token: token
    });
  } catch (error) {
    res.json({
      code: "400",
      message: "Error"
    })
  }
}

//[POST] /api/v1/user/password/reset
module.exports.resetPassword = async (req, res) => {
  try {
    const password = md5(req.body.password);
    const token = req.cookies.token;

    await User.updateOne({
      token: token
    }, {
      password: password
    });

    res.json({
      code: "200",
      message: "Thay đổi mật khẩu thành công"
    });
  } catch (error) {
    res.json({
      code: "400",
      message: "Error"
    });
  }
}