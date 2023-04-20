const { v4: uuid } = require('uuid');
const mysql = require('mysql');

const connectionProperties = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'movie-db'
};

class Database {
    constructor(connectionProperties) {
        this.connection = mysql.createConnection(connectionProperties);
    }
    query(sql, params) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (error, result) => {
                if (error) { reject(error); }
                resolve(result);
            });
        });
    }
    queryClose(sql, params) {
        const ret = this.query(sql, params);
        this.close();
        return ret;
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(error => {
                if (error) { reject(error); }
                resolve();
            });
        });
    }
}

async function getAllDatabaseAsync() {
    try {
        const database = new Database(connectionProperties);
        const sql = `SELECT movies.id, title, year, published,
        users.username AS owner, CONCAT(users.firstname, ' ',
        users.secondname) AS fullname
            FROM movies, users
            WHERE movies.owner = users.id
            ORDER BY title;`;
        const result = await database.queryClose(sql);
        return Promise.resolve(result);
    } catch (error) {
        return Promise.reject(error);
    }
}


let data = [
    { id: uuid(), title: 'Iron Man', year: '2008', public: true, owner: 'sepp' },
    { id: uuid(), title: 'Thor', year: '2011', public: true, owner: 'resi' },
    { id: uuid(), title: 'Capitain America', year: '2001', public: false, owner: 'sepp' }
];
function getAll() {
    getAllDatabaseAsync()
        .then(value => console.log("Async: ", value))
        .catch(err => console.log("Error: ", err));
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