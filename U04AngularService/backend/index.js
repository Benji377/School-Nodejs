const express = require('express');
const app = express();
const xmlparser = require('express-xml-bodyparser');
app.use(xmlparser({ explicitRoot: false }));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const movieRouter = require('./movie/movie.router.js');
app.use('/movie', movieRouter);
app.get('/', (request, response) => response.redirect('/movie'));
// Standard Error-Handler
app.use((error, request, response, next) => {
    if (error.name === 'UnauthorizedError') {
        response.status(401).send(error);
    } else
        response.status(500).send(error);
});
app.listen(8080, () => console.log('Web-Service listen on port 8080'));
