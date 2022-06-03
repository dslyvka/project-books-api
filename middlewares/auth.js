const { User } = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  try {
    if (bearer !== 'Bearer') {
      return res.status(401).json({
        Status: '401 Unauthorized',
        ResponseBody: {
          message: 'Not authorized',
        },
      });
    }

    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id).exec();
    if (!user || !user.token) {
      return res.status(401).json({
        Status: '401 Unauthorized',
        ResponseBody: {
          message: 'Not authorized',
        },
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      Status: '401 Unauthorized',
      ResponseBody: {
        message: 'Not authorized',
      },
    });
  }
};

module.exports = auth;
