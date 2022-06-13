const { Router } = require('express');
const router = Router();
const auth = require('../../middlewares/auth');
const tryCatchMiddleware = require('../../middlewares/tryCatch');
const validation = require('../../middlewares/validation');

const {
  trainingJoiSchema,
  addReadedPagesJoiSchema,
  updateStatisticTrainingJoiSchema,
} = require('../../models/trainingSchema');
const {
  addTrainings,
  addReadedPages,
  getAllTrainings,
  updateTrainingStatistic,
} = require('../../controllers/training');

// Роут для добавления тренировки
router.post(
  '/',
  auth,
  validation(trainingJoiSchema),
  tryCatchMiddleware(addTrainings),
);

// Роут для получения всех тренировок
router.get('/', auth, tryCatchMiddleware(getAllTrainings));

// Роут для обновления прочитанных страниц
router.patch(
  '/:trainingId',
  auth,
  validation(addReadedPagesJoiSchema),
  tryCatchMiddleware(addReadedPages),
);

// Роут для обновления статистики тренеровки
router.patch(
  '/',
  auth,
  validation(updateStatisticTrainingJoiSchema),
  tryCatchMiddleware(updateTrainingStatistic),
);

module.exports = router;
