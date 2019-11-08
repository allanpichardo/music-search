const Model = require('./model');

module.exports = class Artist extends Model{

    constructor(dbRow) {
        super(dbRow);

        if(dbRow) {
            this.name = dbRow.name;
            this.website = dbRow.website;
        } else {
            this.name = "";
            this.website = "";
        }
    }

    static fromName(name, callback) {
        const query = `select * from ${Artist.getTable()} where name like $1 limit 1`;
        require('../database').query(query, [name], (err, results) => {
            if(err) {
                callback(err);
            } else {
                if(results.rows.length === 0) {
                    callback(`Could not find ${name}`);
                } else {
                    callback(null, new Artist(results.rows[0]))
                }
            }
        });
    }

    static getTable() {
        return "artists";
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            website: this.website,
            created: this.created
        }
    }

};