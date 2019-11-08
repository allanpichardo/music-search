const Model = require('./model');

module.exports = class Venue extends Model {

    constructor(dbRow) {
        super(dbRow);
        if(dbRow) {
            this.id = dbRow.id;
            this.name = dbRow.name;
            this.coordinates = Venue.parseCoordinates(dbRow.coordinates);
            this.metroId = dbRow.metro_id;
            this.created = dbRow.created;
        } else {
            this.name = "";
            this.coordinates = [0.0, 0.0];
            this.metroId = 0;
            this.created = new Date();
        }
    }

    static getTable() {
        return 'venues';
    }

    static fromName(name, metroId, callback) {
        const query = `select * from ${Venue.getTable()} where name like $1 and metro_id = $2 limit 1`;
        require('../database').query(query, [name, metroId], (err, results) => {
            if(err) {
                callback(err);
            } else {
                if(results.rows.length === 0) {
                    callback(`Could not find ${name}`);
                } else {
                    callback(null, new Venue(results.rows[0]));
                }
            }
        });
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            coordinates: Venue.coordsToString(this.coordinates),
            metro_id: this.metroId,
            created: this.created
        }
    }

};