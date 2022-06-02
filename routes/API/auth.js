const express = require('express');
const router = express.Router();
const { joiSchema } = require('../../models/auth');
const register = require('../../controllers/auth/register');

router.post('/signup', async (req, res) => {
  const validationResult = joiSchema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({
      status: '400 Bad Request',
      responseBody: `${validationResult.error}`,
    });
  }
  const newUser = await register(req, res);
  res.status(201).json({
    Status: '201 Created',
    ResponseBody: {
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    },
  });
});

module.exports = router;
