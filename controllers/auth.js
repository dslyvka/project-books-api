const { User } = require('../models/userSchema');
const {
  createUser,
  findUserById,
  findUserByEmail,
} = require('../services/usersServices');
const { login, logout } = require('../services/authServices');

const register = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      Status: '409 Conflict',
      ResponseBody: {
        message: 'Email in use',
      },
    });
  }

  const result = await createUser(req.body);
  return result;
};

//  Вход юзера
const loginUser = async (req, res) => {
  const token = await login(req.body);

  if (token) {
    const { name, email } = await findUserByEmail(req.body.email);
    return res.status(200).json({ token, user: { name, email } });
  }

  res.status(401).json({ message: 'Email or password is wrong' });
};
// Текущий юзер
const currentUser = async (req, res) => {
  const currentUser = await findUserById(req.user.id);

  if (currentUser) {
    const { name, email } = currentUser;
    res.status(200).json({ name, email });
  }
  res.status(401).json({ message: 'Not authorized' });
};

// Выход юзера
const logoutUser = async (req, res) => {
  const { id } = req.user;
  await logout(id);
  res.status(204).json({ message: 'No Content' });
};

module.exports = {
  register,
  loginUser,
  logoutUser,
  currentUser,
};
