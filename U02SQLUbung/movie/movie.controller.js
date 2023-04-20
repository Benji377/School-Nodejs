const movieModel = require('./movie.model.js');
const movieView = require('./movie.view.js');

function listAction(request, response) {
    movieModel.getAll()
        .then(result => response.send(movieView.renderList(result, request)))
        .catch(_ => response.send(movieView.errorDisplay()));
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

module.exports = { listAction, removeAction, editAction, saveAction, viewAction, importAction };