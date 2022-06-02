const bcrypt = require('bcryptjs');
const User = require('../../models/auth');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      Status: '409 Conflict',
      ResponseBody: {
        message: 'Email in use',
      },
    });
  }
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const result = await User.create({
    name,
    email,
    password: hashPassword,
  });
  return result;
};

module.exports = {
  register,
};
