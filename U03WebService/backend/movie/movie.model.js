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

async function getAll(sort, user) {
    try {
        const database = new Database(connectionProperties);
        let userId = await getUserId(user);
        const sql = `SELECT movies.id, title, year, published,
        users.username AS owner, CONCAT(users.firstname, ' ',
        users.secondname) AS fullname
            FROM movies, users
            WHERE movies.owner = users.id AND users.id = ?
            ORDER BY title ${sort.toUpperCase()};`;
        const result = await database.queryClose(sql, userId[0].id);
        return Promise.resolve(result);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function getUserId(user) {
    try {
        const database = new Database(connectionProperties);
        const sql = `SELECT id
            FROM users
            WHERE users.username = ?`;
        const result = await database.queryClose(sql, user);
        return Promise.resolve(result);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function get(movie_id) {
    try {
        const database = new Database(connectionProperties);
        const sql = `SELECT movies.id, title, year, published,
        users.username AS owner, CONCAT(users.firstname, ' ',
        users.secondname) AS fullname
            FROM movies, users
            WHERE movies.owner = users.id
            AND movies.id = ?
            ORDER BY title;`;
        const result = await database.queryClose(sql, [movie_id]);
        return Promise.resolve(result);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function remove(id) {
    try {
        const database = new Database(connectionProperties);
        const sql = `DELETE from movies WHERE movies.id = ?`;
        const result = await database.queryClose(sql, [id]);
        return Promise.resolve(result);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function save(movie) {
    if (movie.id != "-1") {
        try {
            const database = new Database(connectionProperties);
            const sql = `UPDATE movies SET 
                title = ?, 
                year = ?, 
                published = ?
                WHERE movies.id = ?;`;
            const result = await database.queryClose(sql, [movie.title, movie.year, movie.published ? 1 : 0, movie.id]);
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    } else {
        try {
            const database = new Database(connectionProperties);
            const sql1 = `SELECT id FROM users WHERE username = ?`;
            const sql2 = `INSERT INTO movies 
            (title, year, published, owner) 
            VALUES (?, ?, ?, ?);`;
            const owner = await database.query(sql1, [movie.owner]);
            const result = await database.queryClose(sql2, [movie.title, movie.year, movie.published, owner[0].id]);
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

async function importMovies(movies, user) {
    const sql1 = `START TRANSACTION;`;
    const sql2 = `SELECT id FROM users WHERE username = ?;`;
    const sql3 = `SELECT COUNT(*) AS count FROM movies WHERE title = ?`;
    const sql4 = `INSERT INTO movies (title, year, published, owner) VALUES (?, ?, ?, ?);`;
    const sql5 = `COMMIT;`;
    const sql6 = `ROLLBACK;`;
    let database;
    try {
        database = new Database(connectionProperties);
        await database.query(sql1);
        const owner = await database.query(sql2, [user]);

        for (var i = 0; i < movies.length; i++) {
            let movie = movies[i];
            const moviecount = await database.query(sql3, [movie.title]);
            if (moviecount[0].count > 0) {
                return Promise.reject(`Film mit Titel ${movie.title} bereits vorhanden`);
            } else {
                await database.query(sql4, [movie.title, movie.year, 0, owner[0].id]);
            }
        }

        await database.queryClose(sql5);
        return Promise.resolve();
    } catch (err) {
        try {
            await database.queryClose(sql6);
        } catch (error) {
            return Promise.reject(error);
        }
        return Promise.reject(err);
    }
}

module.exports = { getAll, remove, get, save, importMovies }; 