const { User } = require('../../models/userSchema');

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

  const result = await User.create({
    name,
    email,
    password,
  });
  return result;
};

module.exports = {
  register,
};
