const axios = require('axios');
// const URL = require('url');
const queryString = require('query-string');
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

  // const result = await User.create({
  //   name,
  //   email,
  //   password,
  // });
  // return result;
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

//гугл авторизация
const googleAuth = async (req, res) => {
  console.log('test');
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
  );
};

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);

  const code = urlParams.code;
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
      grant_type: 'authorization_code',
      code,
    },
  });
  const userData = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });
  // userData.data.email
  // accessToken
  // ...
  // ...
  // return res.redirect(`${process.env.FRONTEND_URL}?accessToken=${accessToken}`);
  return res.redirect(
    `${process.env.FRONTEND_URL}?email=${userData.data.email}`,
  );
};

module.exports = {
  register,
  loginUser,
  logoutUser,
  currentUser,
  googleAuth,
  googleRedirect,
};
