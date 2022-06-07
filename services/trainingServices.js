const { Training } = require('../models/trainingSchema');

const addTraining = async (userId, body) => {
  const newTrainig = await Training.create({ ...body, owner: userId });

  return newTrainig;
};

module.exports = { addTraining };
