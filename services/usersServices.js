const User = require('../models/userSchema');
// Находит юзера в базе по id
const findUserById = async id => {
  const user = await User.findById(id);
  return user;
};

// Находит юзера в базе по email
const findUserByEmail = async email => {
  const user = await User.findOne({ email });
  return user;
};

// Обновляет токен юзера
const updateToken = async (id, token) => {
  await User.updateOne({ _id: id }, { token });
};

module.exports = {
  findUserById,
  findUserByEmail,
  updateToken,
 
};