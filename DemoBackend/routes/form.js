const express = require('express');
const router = express.Router();
const { createSubmission, getAllSubmissions, getSubmissionById, updateSubmission, deleteSubmission } = require('../controller/formController');
const { requireJwt } = require('../middleware/authjwt');

router.use(requireJwt);

router.post('/', createSubmission);
router.get('/', getAllSubmissions);
router.get('/:id', getSubmissionById);
router.put('/:id', updateSubmission);
router.delete('/:id', deleteSubmission);

module.exports = router;