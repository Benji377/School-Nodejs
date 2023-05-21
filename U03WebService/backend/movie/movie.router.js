const express = require('express');
const router = express.Router();
const { listAction, removeAction, editAction, saveAction, viewAction, importAction, insertAction, updateAction } = require('./movie.controller.js');


router.get('/', listAction);
router.post('/', insertAction);
router.put('/:id', updateAction);
router.get('/view/:id', viewAction);
router.get('/remove/:id', removeAction);
router.get('/edit/:id?', editAction);
router.post('/save', saveAction);
router.post('/import', importAction);

module.exports = router;