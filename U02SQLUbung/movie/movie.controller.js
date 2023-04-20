const movieModel = require('./movie.model.js');
const movieView = require('./movie.view.js');

function listAction(request, response) {
    response.send(movieView.renderList(movieModel.getAll(), request));
}

function removeAction(request, response) {
    movieModel.remove(request.params.id);
    response.redirect(request.baseUrl);
}

function viewAction(request, response) {
    response.send(movieView.renderMovie(movieModel.get(request.params.id), request));
}

function editAction(request, response) {
    let movie = { id: '-1', title: '', year: '', public: false, owner: '' };
    if (request.params.id) {
        movie = movieModel.get(request.params.id);
    }
    response.send(movieView.editMovie(movie, request));
}

function saveAction(request, response) {
    const movie = {
        id: request.body.id,
        title: request.body.title,
        year: request.body.year,
        public: request.body.public,
        owner: request.body.owner
    };
    movieModel.save(movie);
    response.redirect(request.baseUrl);
}
module.exports = { listAction, removeAction, editAction, saveAction, viewAction };