const { User } = require('../../models/userSchema');
const { findUserById } = require('../../services/usersServices');
const { logout } = require('../../services/authServices');

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

// Текущий юзер
const currentUser = async (req, res) => {
  const currentUser = await findUserById(req.user.id);

  if (currentUser) {
    const { name, email } = currentUser;
    res.status(200).json({ name, email });
  }
};

// Выход юзера
const logoutUser = async (req, res) => {
  const { id } = req.user;
  await logout(id);
  res.status(204).json({ message: 'No Content' });
};

module.exports = {
  register,
  logoutUser,
  currentUser,
};
