const express = require('express');
const router = express.Router();
const { listAction, removeAction, editAction, saveAction, viewAction } = require('./movie.controller.js');
const { ensureLoggedIn } = require('connect-ensure-login');


router.get('/', listAction);
router.get('/view/:id', viewAction);
router.get('/remove/:id', ensureLoggedIn('/login'), removeAction);
router.get('/edit/:id?', ensureLoggedIn('/login'), editAction);
router.post('/save', ensureLoggedIn('/login'), saveAction);
module.exports = router;
