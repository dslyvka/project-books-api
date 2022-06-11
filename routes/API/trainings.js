const { Router } = require('express');
const router = Router();
const auth = require('../../middlewares/auth');
const tryCatchMiddleware = require('../../middlewares/tryCatch');
const validation = require('../../middlewares/validation');


const {
  trainingJoiSchema,
  addReadedPagesJoiSchema,
} = require('../../models/trainingSchema');
const { addTrainings, addReadedPages,getAllTrainings } = require('../../controllers/training');


router.post(
  '/',
  auth,
  validation(trainingJoiSchema),
  tryCatchMiddleware(addTrainings),
);


// Роут для получения всех тренировок

router.get('/', auth, tryCatchMiddleware(getAllTrainings));


router.patch(
  '/:trainingId',
  auth,
  validation(addReadedPagesJoiSchema),
  tryCatchMiddleware(addReadedPages),
);


module.exports = router;
