const { addTraining } = require('../services/trainingServices');

const addTrainings = async (req, res) => {
  const body = req.body;
  const userId = req.user._id;
  if (
    !body.startDate &&
    !body.endDate &&
    !body.readedPages &&
    !body.totalPages
  ) {
    return res.status(400).json({ message: 'missing required name field' });
  }
  const training = await addTraining(userId, body);
  res.status(201).json({ training, status: 'success' });
};

module.exports = { addTrainings };
