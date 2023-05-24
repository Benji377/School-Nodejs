const movieModel = require('./movie.model.js');

const jsonXml = require('jsontoxml');

function listAction(request, response) {
    const sort = request.query.sort ? request.query.sort : '';
    movieModel.getAll(sort, 'sepp')
    .then(movies => response.format({
        'application/xml': () => {
            movies = movies.map(movie => ({ movie, }));
            response.send(`<movies>${jsonXml(movies)}</movies>`)
        },
        'application/json': () => response.json(movies),
        'default': () => response.json(movies)
    }))
    .catch(error => response.format({
        'application/xml': () =>
            response.status(error==='Database error'? 500 : 400).send(error),
        'application/json': () =>
            response.status(error === 'Database error' ? 500 : 400).json(error),
        'default': () => response.status(error === 'Database error' ? 500 : 400).json(error)
    }));
}

function insertAction(request, response) {
    const movie = {
        id: parseInt(request.body.id, 10),
        title: request.body.title,
        year: parseInt(request.body.year, 10),
        published: request.body.published === "true" ? true : false,
        owner: parseInt(request.body.owner, 10)
    };
    movieModel.insert(movie, 'sepp')
        .then(movie => response.format({ 
            'application/xml': () => {
                response.send(`<movie>${jsonXml(movie)}</movie>`)
            },
            'application/json': () => response.json(movie),
            'default': () => response.json(movie)
         }))
        .catch(error => response.format({ 
            'application/xml': () =>
                response.status(error === 'Database error'? 500 : 400).send(error),
            'application/json': () =>
                response.status(error === 'Database error' ? 500 : 400).json(error),
            'default': () => response.status(error === 'Database error' ? 500 : 400).json(error)
         }));
    }

function updateAction(request, response) {
    const id = parseInt(request.params.id, 10);
    const movie = {
        id: id,
        title: request.body.title,
        year: parseInt(request.body.year, 10),
        published: request.body.published === "true" ? true : false,
        owner: parseInt(request.body.owner, 10)
    };
    movieModel.update(id, movie, 'sepp')
        .then(movie => response.format({ 
            'application/xml': () => {
                response.send(`<movie>${jsonXml(movie)}</movie>`)
            },
            'application/json': () => response.json(movie),
            'default': () => response.json(movie)
         }))
        .catch(error => response.format({ 
            'application/xml': () =>
                response.status(error === 'Database error'? 500 : 400).send(error),
            'application/json': () =>
                response.status(error === 'Database error' ? 500 : 400).json(error),
            'default': () => response.status(error === 'Database error' ? 500 : 400).json(error)
         }));
    }

function viewAction(request, response) {
    const id = parseInt(request.params.id, 10);
    movieModel.get(id, 'sepp')
        .then(movie => response.format({ 
            'application/xml': () => {
                response.send(`<movie>${jsonXml(movie)}</movie>`)
            },
            'application/json': () => response.json(movie),
            'default': () => response.json(movie)
         }))
        .catch(error => response.format({ 
            'application/xml': () =>
                response.status(error === 'Database error'? 500 : 400).send(error),
            'application/json': () =>
                response.status(error === 'Database error' ? 500 : 400).json(error),
            'default': () => response.status(error === 'Database error' ? 500 : 400).json(error)
         }));
}

function removeAction(request, response) {
    const id = parseInt(request.params.id, 10);
    movieModel.remove(id, 'sepp')
        .then(result => response.format({ 
            'application/xml': () => {
                response.send(`<result>${jsonXml(result)}</result>`)
            },
            'application/json': () => response.json(result),
            'default': () => response.json(result)
         }))
        .catch(error => response.format({ 
            'application/xml': () =>
                response.status(error === 'Database error'? 500 : 400).send(error),
            'application/json': () =>
                response.status(error === 'Database error' ? 500 : 400).json(error),
            'default': () => response.status(error === 'Database error' ? 500 : 400).json(error)
         }));
}


function clearAction(request, response) {
    movieModel.clear('sepp')
        .then(result => response.format({ 
            'application/xml': () => {
                response.send(`<result>${jsonXml(result)}</result>`)
            },
            'application/json': () => response.json(result),
            'default': () => response.json(result)
         }))
        .catch(error => response.format({ 
            'application/xml': () =>
                response.status(error === 'Database error'? 500 : 400).send(error),
            'application/json': () =>
                response.status(error === 'Database error' ? 500 : 400).json(error),
            'default': () => response.status(error === 'Database error' ? 500 : 400).json(error)
         }));
}

module.exports = { listAction, removeAction, clearAction, viewAction, insertAction, updateAction };