const { Router } = require('express');
const router = Router();
const auth = require('../../middlewares/auth');
const tryCatchMiddleware = require('../../middlewares/tryCatch');
const validation = require('../../middlewares/validation');
const { trainingJoiSchema } = require('../../models/trainingSchema');
const { addTrainings, getAllTrainings } = require('../../controllers/training');

router.post(
  '/',
  auth,
  validation(trainingJoiSchema),
  tryCatchMiddleware(addTrainings),
);

// Роут для получения всех тренировок

router.get('/', auth, tryCatchMiddleware(getAllTrainings));

module.exports = router;
