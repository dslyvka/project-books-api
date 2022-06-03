const { findUserByEmail, updateToken } = require('./usersServices');
const jwt = require('jsonwebtoken'); // библиотека для создания токенов
const { SECRET_KEY } = process.env; // секрет для подписи токена
// Вход юзера
const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  const isValidPassword = await user.comparePassword(password);

  // Если юзера нет или пароль не валидный - null вместо токена
  if (!user || !isValidPassword) {
    return null;
  }

  // Иначе - создаем, подписываем и возвращаем токен с временем жизни
  const id = user.id;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '3h' });

  await updateToken(id, token);
  return token;
};
// Выход юзера
const logout = async id => {
  const data = await updateToken(id, null);
  return data;
};
module.exports = {
  login,
  logout,
};
