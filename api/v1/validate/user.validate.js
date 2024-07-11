const User = require("../model/user.model");

const validateEmail = (email) => {
  const regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return email.match(regexEmail);
}

module.exports.register = async (req, res, next) => {
  const exsitEmail = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if (!validateEmail(req.body.email)) {
    res.json({
      code: "400",
      message: "Email không hợp lệ"
    })
    return;
  }

  if (exsitEmail) {
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
