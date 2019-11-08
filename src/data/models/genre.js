const Model = require('./model');

module.exports = class Genre extends Model {

    constructor(dbRow) {
        super(dbRow);
        if(dbRow) {
            this.name = dbRow.name;
        } else {
            this.name = '';
        }
    }

    static fromName(name, callback) {
        const query = `select * from ${Genre.getTable()} where name like $1 limit 1`;
        require('../database').query(query, [name], (err, results) => {
            if(err) {
                callback(err);
            } else {
                if(results.rows.length === 0) {
                    callback(`Could not find ${name}`);
                } else {
                    callback(null, new Genre(results.rows[0]))
                }
            }
        });
    }

    static getTable() {
        return "genres";
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            created: this.created
        };
    }
};