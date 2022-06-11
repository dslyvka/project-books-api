

const {
  addTraining,
  updateReadedPages,
  findTrainingByOwnerAndStatus,
  getTraining
    
} = require('../services/trainingServices');

const addTrainings = async (req, res) => {
  const body = req.body;
  const userId = req.user._id;
  const activTraining = await findTrainingByOwnerAndStatus(userId, 'active');
  if (activTraining) {
    return res.status(409).json({ message: 'Training in use' });
  } else if (!body.startDate && !body.endDate && !body.totalPages) {
    return res.status(400).json({ message: 'missing required name field' });
  }
  // if (!body.startDate && !body.endDate && !body.totalPages) {
  //   return res.status(400).json({ message: 'missing required name field' });
  // }
  const training = await addTraining(userId, body);
  res.status(201).json({ training, status: 'success' });
};


const getAllTrainings = async (req, res) => {
  const userId = req.user._id;
  const training = await getTraining(userId);
  res.status(200).json({ training, status: 'success' });
};



const addReadedPages = async (req, res) => {
  const userId = req.user._id;
  const { readedPages } = req.body;
  const { trainingId } = req.params;

  const result = await updateReadedPages(userId, trainingId, readedPages);
  res.status(201).json({ result, status: 'success' });
};

module.exports = { addTrainings, addReadedPages,getAllTrainings };

