const mysql = require('mysql');
const crypto = require('crypto');

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

async function getAll(sort = null, username = null) {
    const sql = `
    SELECT m.id, title, year, published, CONCAT(u.firstname, ' ',
    u.secondname) as fullname, owner
    FROM movies m, users u
    WHERE m.owner = u.id
    ${username ? 'AND (u.username = ? OR published = true)' : 'AND published = true'}
    ORDER BY title ${!sort || sort === 'asc' ? 'ASC' : 'DESC'};
    `;
    const database = new Database(connectionProperties);
    try {
        const result = await database.queryClose(sql, [username]);
        return result.length === 0 ?
            Promise.reject('No movies found') : Promise.resolve(result);
    } catch (error) {
        console.error(error);
        return Promise.reject('Database error');
    }
}

async function get(id, username) {
    if (!username) {
        return Promise.reject('User not set');
    } else {
        try {
            const database = new Database(connectionProperties);
            const sql = `SELECT m.id, title, year, published, CONCAT(u.firstname, ' ',
                u.secondname) as fullname, owner
                FROM movies m, users u
                WHERE m.owner = u.id
                AND (u.username = ? OR published = true)
                AND m.id = ?
                ORDER BY title;`;
            const result = await database.queryClose(sql, [username, id]);
            if (result.length === 0) {
                return Promise.reject('Movie not found');
            } else {
                return Promise.resolve(result[0]);
            }
        } catch (error) {
            console.error(error);
            return Promise.reject("Database error");
        }
    }
}

async function insert(movie, username) {
    if (!username) {
        return Promise.reject('User not set');
    } else {
        try {
            const database = new Database(connectionProperties);
            const sql1 = `SELECT id FROM users WHERE username = ?`;
            const user_id = await database.query(sql1, [username]);
            if (user_id.length === 0) {
                return Promise.reject('User not found');
            }
            const sql2 = `INSERT INTO movies (title, year, published, owner) VALUES (?, ?, ?, ?)`;
            const result = await database.query(sql2, [movie.title, movie.year, movie.published, user_id[0].id]);
            if (result.length === 0) {
                return Promise.reject('Title exists');
            } else {
                const sql3 = `SELECT m.id, title, year, published, CONCAT(u.firstname, ' ',
                u.secondname) as fullname, owner
                FROM movies m, users u
                WHERE m.owner = u.id
                AND (u.username = ? OR published = true)
                AND m.id = ?
                ORDER BY title;`
                const movie = await database.queryClose(sql3, [username, result.insertId])
                return Promise.resolve(movie[0]);
            }
        } catch (error) {
            console.error(error);
            return Promise.reject("Database error");
        }
    }
}

async function update(movieId, movie, username) {
    if (!username) {
        return Promise.reject('User not set');
    } else {
        try {
            const database = new Database(connectionProperties);

            // Check if the user exists
            const checkUserQuery = `SELECT id FROM users WHERE username = ?`;
            const user = await database.query(checkUserQuery, [username]);
            if (user.length === 0) {
                return Promise.reject('User not found');
            }

            // Check if the movie exists
            const checkMovieQuery = `SELECT id FROM movies WHERE id = ?`;
            const existingMovie = await database.query(checkMovieQuery, [movieId]);
            if (existingMovie.length === 0) {
                return Promise.reject('Movie not found');
            }

            // Check if the provided movie title already exists
            const checkTitleQuery = `SELECT id FROM movies WHERE title = ?`;
            const movieWithTitle = await database.query(checkTitleQuery, [movie.title]);
            if (movieWithTitle.length > 0 && movieWithTitle[0].id !== movieId) {
                return Promise.reject('Title already exists');
            }

            // Update the movie in the database
            const updateMovieQuery = `UPDATE movies SET title = ?, year = ?, published = ?, owner = ? WHERE id = ?`;
            const result = await database.queryClose(updateMovieQuery, [movie.title, movie.year, movie.published, user[0].id, movieId]);

            if (result.affectedRows === 0) {
                return Promise.reject('Movie update failed');
            } else {
                return Promise.resolve(result);
            }
        } catch (error) {
            console.error(error);
            return Promise.reject('Database error');
        }
    }
}

async function clear(username) {
    if (!username) {
        return Promise.reject('User not set');
    } else {
        try {
            const database = new Database(connectionProperties);

            // Start a transaction
            await database.query('START TRANSACTION');

            // Check if the user exists
            const checkUserQuery = 'SELECT id FROM users WHERE username = ?';
            const user = await database.query(checkUserQuery, [username]);
            if (user.length === 0) {
                await database.query('ROLLBACK');
                return Promise.reject('User not found');
            }

            // Delete movies associated with the user
            const deleteMoviesQuery = 'DELETE FROM movies WHERE owner = ?';
            const result = await database.query(deleteMoviesQuery, [user[0].id]);

            // Commit the transaction if successful
            await database.query('COMMIT');

            if (result.affectedRows === 0) {
                return Promise.reject('No movies found');
            } else {
                return Promise.resolve(result);
            }
        } catch (error) {
            // Rollback the transaction on error
            console.error(error);
            const database = new Database(connectionProperties);
            await database.query('ROLLBACK');
            return Promise.reject('Database error');
        }
    }
}

async function remove(movieId, username) {
    if (!username) {
        return Promise.reject('User not set');
    } else {
        try {
            const database = new Database(connectionProperties);

            // Check if the user exists
            const checkUserQuery = `SELECT id FROM users WHERE username = ?`;
            const user = await database.query(checkUserQuery, [username]);
            if (user.length === 0) {
                return Promise.reject('User not found');
            }

            // Check if the movie exists
            const checkMovieQuery = `SELECT id FROM movies WHERE id = ? AND owner = ?`;
            const movie = await database.query(checkMovieQuery, [movieId, user[0].id]);
            if (movie.length === 0) {
                return Promise.reject('Movie not found');
            }

            // Delete the movie
            const deleteMovieQuery = `DELETE FROM movies WHERE id = ?`;
            const result = await database.query(deleteMovieQuery, [movieId]);

            if (result.affectedRows === 0) {
                return Promise.reject('Movie deletion failed');
            } else {
                return Promise.resolve(result);
            }
        } catch (error) {
            console.error(error);
            return Promise.reject('Database error');
        }
    }
}

async function getUser(username, password) {
    if (!username || !password) {
        return Promise.reject('User not set');
    } else {
        try {
            const database = new Database(connectionProperties);
            const sql = ` SELECT id, username, firstname, secondname
                FROM users WHERE username = ? AND passwordhash = ?;`;
            const passwordHash = crypto.createHash('sha256')
                .update(password)
                .digest('hex');
            const result = await database.queryClose(sql, [username, passwordHash]);
            return !result || result.length === 0 ?
                Promise.reject('User not found') : Promise.resolve(result[0]);
        } catch (error) {
            return Promise.reject('Database error');
        }
    }
}


module.exports = { getAll, remove, get, clear, update, insert, getUser }; 