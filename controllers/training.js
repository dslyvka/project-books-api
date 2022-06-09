const {
  addTraining,
  updateReadedPages,
  // findTrainingByOwnerAndStatus,
} = require('../services/trainingServices');

const addTrainings = async (req, res) => {
  const body = req.body;
  const userId = req.user._id;

  if (!body.startDate && !body.endDate && !body.totalPages) {
    return res.status(400).json({ message: 'missing required name field' });
  }
  const training = await addTraining(userId, body);
  res.status(201).json({ training, status: 'success' });
};

const addReadedPages = async (req, res) => {
  const userId = req.user._id;
  const { readedPages } = req.body;
  const { trainingId } = req.params;

  const result = await updateReadedPages(userId, trainingId, readedPages);
  res.status(201).json({ result, status: 'success' });
};

module.exports = { addTrainings, addReadedPages };
