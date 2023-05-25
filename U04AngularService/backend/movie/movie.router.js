const express = require('express');
const expressJwt = require('express-jwt');
const router = express.Router();
const { listAction, 
    listActionPublic,
    removeAction,
    clearAction, 
    viewAction, 
    insertAction, 
    updateAction,
    loginAction
} = require('./movie.controller.js');

const PASSWORD = 'secret';
const ALGORITHM = 'HS256';

router.get('/published', listActionPublic);

/*
    GET /movie /movie?sort=asc /movie?sort=desc
    200 liefert Liste der Filme
    400 No movies found
    500 Database error
 */
    router.get('/', expressJwt({ secret: PASSWORD, algorithms: [ ALGORITHM ] }), listAction);

/*
    GET /movie/:id 
    200 liefert gefundenen Film
    400 User not set, Movie not found
    500 Database error
 */
router.get('/:id', expressJwt({ secret: PASSWORD, algorithms: [ ALGORITHM ] }), viewAction);

/*
    200 liefert JWT mit Benutzername ur, und Benutzer-Id id
    in Payload, 
    401 Unauthorized
*/
router.post('/login', loginAction);

/*
    POST /movie 
    200 liefert eingetragenen Film mit neuer id und fullname
    400 User not set, User not found, Title exists
    500 Database error
*/
router.post('/', expressJwt({ secret: PASSWORD, algorithms: [ ALGORITHM ] }), insertAction);

/*
    PUT /movie/:id 
    200 liefert geänderten Film
    400 User not set, User not found, Title exists, Movie exists, Movie not found
    500 Database error
*/
router.put('/:id', expressJwt({ secret: PASSWORD, algorithms: [ ALGORITHM ] }), updateAction);

/*
    DELETE /movie/clear 
    200 Leerer Body bei Erfolg
    400 User not set, Movies not found
    500 Database error
*/
router.delete('/clear', expressJwt({ secret: PASSWORD, algorithms: [ ALGORITHM ] }), clearAction);

/*
    DELETE /movie/:id 
    200 Leerer Body bei Erfolg
    400 User not set, Movie not found
    500 Database error
*/
router.delete('/:id', expressJwt({ secret: PASSWORD, algorithms: [ ALGORITHM ] }), removeAction);

module.exports = router;