const movieModel = require('./movie.model.js');
const movieView = require('./movie.view.js');

function listAction(request, response) {
    movieModel.getAll()
        .then(result => response.send(movieView.renderList(result, request)))
        .catch(err => response.send(movieView.errorDisplay(err)));
}

function removeAction(request, response) {
    movieModel.get(request.params.id)
    .then(res => {movieModel.remove(res[0].id); response.redirect(request.baseUrl);})
    .catch(err => response.send(movieView.errorDisplay(err)));
}

function viewAction(request, response) {
    movieModel.get(request.params.id)
        .then(res => response.send(movieView.renderMovie(res[0], request)))
        .catch(err => response.send(movieView.errorDisplay(err)));
}

function editAction(request, response) {
    let movie = { id: '-1', title: '', year: '', published: 0, owner: '' };
    if (request.params.id) {
        movieModel.get(request.params.id)
            .then(res => response.send(movieView.editMovie(res[0], request)))
            .catch(err => response.send(movieView.errorDisplay(err)));
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
        .catch(err => response.send(movieView.errorDisplay(err)));
}
module.exports = { listAction, removeAction, editAction, saveAction, viewAction };