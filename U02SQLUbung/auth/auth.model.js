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

async function get(username) {
    try {
        const database = new Database(connectionProperties);
        const sql = `SELECT id, username, passwordhash, firstname, secondname, 
        CONCAT(users.firstname, ' ', users.secondname) AS fullname
            FROM  users
            WHERE users.username = ?;`;
        const result = await database.queryClose(sql, [username]);
        return result[0] ? Promise.resolve(Object.assign({}, result[0])) : Promise.reject('User not found');
    } catch (error) {
        return Promise.reject(error);
    }
}
module.exports = { get };
