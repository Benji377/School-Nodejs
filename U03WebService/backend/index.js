const express = require('express');
const app = express();
const movieRouter = require('./movie/movie.router');

const xmlparser = require('express-xml-bodyparser');
app.use(xmlparser({ explicitRoot: false }));

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/movie', movieRouter);
app.get('/', (request, response) => response.redirect('/movie'));
app.use(express.static(__dirname));
app.listen(8080, () => console.log('Server listen on port 8080'));
