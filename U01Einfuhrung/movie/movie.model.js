const { v4: uuid } = require('uuid');
let data = [
    { id: uuid(), title: 'Iron Man', year: '2008', public: true, owner: 'sepp'},
    { id: uuid(), title: 'Thor', year: '2011', public: true, owner: 'resi' },
    { id: uuid(), title: 'Capitain America', year: '2001', public: false, owner: 'sepp' }
];
function getAll() {
    return data;
}
function remove(id) {
    data = data.filter(movie => movie.id !== id);
}
function get(id) {
    return data.find(movie => movie.id === id);
}
function save(movie) {
    if (movie.id === '-1') {
        movie.id = uuid();
        data.push(movie);
    } else {
        data = data.map(item => item.id === movie.id ? movie : item);
    }
}
module.exports = { getAll, remove, get, save }; 