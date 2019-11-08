const Model = require('./model');

module.exports = class Show extends Model {

    constructor(dbRow) {
        super(dbRow);
        if(dbRow) {
            this.id = dbRow.id;
            this.artistId = dbRow.artist_id;
            this.venueId = dbRow.venue_id;
            this.date = dbRow.date;
            this.created = dbRow.created;
        } else {
            this.artistId = 0;
            this.venueId = 0;
            this.date = new Date();
            this.created = new Date();
        }
    }

    static getTable() {
        return 'shows';
    }

    toJson() {
        return {
            id: this.id,
            artist_id: this.artistId,
            venue_id: this.venueId,
            date: this.date,
            created: this.created
        }
    }
};