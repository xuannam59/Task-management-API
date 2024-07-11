const md5 = require("md5");
const User = require("../model/user.model");

const validateEmail = (email) => {
  const regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const result = email.match(regexEmail);
  if (!result) {
    res.json({
      code: "400",
      message: "Email không hợp lệ"
    })
    return;
  }
}

module.exports.register = async (req, res, next) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  validateEmail(req.body.email);

  if (existEmail) {
    res.json({
      code: "400",
      message: "Email đã tồn tại"
    })
    return;
  }

  if (req.body.password != req.body.confirmPassword) {
    res.json({
      code: "400",
      message: "Không khớp với mật khẩu!"
    });
    return;
  }

  next();
}

module.exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    res.json({
      code: "400",
      message: "Email không tồn tại",
    });
    return;
  }

  if (md5(password) != user.password) {
    res.json({
      code: "400",
      message: "Mật khẩu sai",
    });
    return;
  }

  next();
}

module.exports.resetPassword = async (req, res, next) => {
  const token = req.cookies.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const user = await User.findOne({
    token: token
  });

  if (password != confirmPassword) {
    res.json({
      code: "400",
      message: "Mật khẩu không khớp",
    });
    return;
  }

  if (md5(password) === user.password) {
    res.json({
      code: "400",
      message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ",
    });
    return;
  }

  next();
}

