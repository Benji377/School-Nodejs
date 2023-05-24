const express = require('express');
const router = express.Router();
const { listAction, 
    removeAction,
    clearAction, 
    viewAction, 
    insertAction, 
    updateAction 
} = require('./movie.controller.js');

/*
    GET /movie /movie?sort=asc /movie?sort=desc
    200 liefert Liste der Filme
    400 No movies found
    500 Database error
 */
router.get('/', listAction);

/*
    GET /movie/:id 
    200 liefert gefundenen Film
    400 User not set, Movie not found
    500 Database error
 */
router.get('/:id', viewAction);

/*
    POST /movie 
    200 liefert eingetragenen Film mit neuer id und fullname
    400 User not set, User not found, Title exists
    500 Database error
*/
router.post('/', insertAction);

/*
    PUT /movie/:id 
    200 liefert geänderten Film
    400 User not set, User not found, Title exists, Movie exists, Movie not found
    500 Database error
*/
router.put('/:id', updateAction);

/*
    DELETE /movie/clear 
    200 Leerer Body bei Erfolg
    400 User not set, Movies not found
    500 Database error
*/
router.delete('/clear', clearAction);

/*
    DELETE /movie/:id 
    200 Leerer Body bei Erfolg
    400 User not set, Movie not found
    500 Database error
*/
router.delete('/:id', removeAction);

module.exports = router;