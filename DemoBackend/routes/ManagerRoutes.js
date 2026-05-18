const express = require('express');
const { GetUsers } = require('../controller/ManagerController');
const isManager = require('../middleware/isManager');
const { requireJwt } = require('../middleware/authjwt');

const ManagerRouter = express.Router();


ManagerRouter.get('/getusers', requireJwt, isManager, GetUsers);

module.exports = ManagerRouter;