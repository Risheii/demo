const express = require('express');
const { CreateManager, UpdateManager, DeleteManager, GetAllManager, getAllSubmissions } = require('../controller/AdminController');
const { requireJwt } = require('../middleware/authjwt');
const isAdmin = require('../middleware/isAdmin');
const AdminRouter = express.Router();

AdminRouter.post('/create-manager', requireJwt, isAdmin, CreateManager);
AdminRouter.put('/update-manager', requireJwt, isAdmin, UpdateManager);
AdminRouter.delete('/delete-manager/:id', requireJwt, isAdmin, DeleteManager);
AdminRouter.get('/get-all-manager', requireJwt, isAdmin, GetAllManager);
AdminRouter.get('/get-all-submissions', requireJwt, isAdmin, getAllSubmissions);

module.exports = AdminRouter;