const { Router } = require('express');
const router = Router();
const auth = require('../../middlewares/auth');
const tryCatchMiddleware = require('../../middlewares/tryCatch');
const validation = require('../../middlewares/validation');
const {
  trainingJoiSchema,
  addReadedPagesJoiSchema,
} = require('../../models/trainingSchema');
const { addTrainings, addReadedPages } = require('../../controllers/training');

router.post(
  '/',
  auth,
  validation(trainingJoiSchema),
  tryCatchMiddleware(addTrainings),
);

router.patch(
  '/:trainingId',
  auth,
  validation(addReadedPagesJoiSchema),
  tryCatchMiddleware(addReadedPages),
);

module.exports = router;
