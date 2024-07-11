const User = require("../model/user.model");

const generateHelper = require("../../../helper/generate.helper");
const md5 = require('md5');

// [POST] /user/register
module.exports.register = async (req, res) => {
  try {
    const email = req.body.email;
    const fullName = req.body.fullName;
    const password = md5(req.body.password);

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