const movieModel = require('./movie.model.js');
const movieView = require('./movie.view.js');

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

function removeAction(request, response) {
    movieModel.get(request.params.id)
    .then(res => {movieModel.remove(res[0].id); response.redirect(request.baseUrl);})
    .catch(_ => response.send(movieView.errorDisplay()));
}

function viewAction(request, response) {
    movieModel.get(request.params.id)
        .then(res => response.send(movieView.renderMovie(res[0], request)))
        .catch(_ => response.send(movieView.errorDisplay()));
}

function editAction(request, response) {
    let movie = { id: '-1', title: '', year: '', published: 0, owner: '' };
    if (request.params.id) {
        movieModel.get(request.params.id)
            .then(res => response.send(movieView.editMovie(res[0], request)))
            .catch(_ => response.send(movieView.errorDisplay()));
        return;
    }
    response.send(movieView.editMovie(movie, request));
}

function saveAction(request, response) {
    const movie = {
        id: request.body.id,
        title: request.body.title,
        year: request.body.year,
        published: request.body.published,
        owner: request.body.owner
    };
    movieModel.save(movie)
        .then(_ => response.redirect(request.baseUrl))
        .catch(_ => response.send(movieView.errorDisplay()));
}

function importAction(request, response) {
    try {
        const movies = JSON.parse(request.files.importfile.data.toString('ascii'));
        console.log("Imported: ", movies);
        movieModel.importMovies(movies, request.user.username)
            .then(_ => response.send(movieView.errorCatcher('Filme erfolgreich importiert')))
            .catch(err => response.send(movieView.errorCatcher(err)))
    } catch (error) {
        response.send(movieView.errorCatcher('Falsches JSON-Format'))
    }
}

module.exports = { listAction, removeAction, editAction, saveAction, viewAction, importAction, insertAction, updateAction };