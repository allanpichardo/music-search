const Model = require('./model');

module.exports = class Track extends Model {

    constructor(dbRow) {
        super(dbRow);

        if(dbRow) {
            this.artistId = dbRow.artist_id;
            this.title = dbRow.title;
            this.url = dbRow.url;
        } else {
            this.artistId = 0;
            this.title = "";
            this.url = "";
        }
    }

    static getTable() {
        return "tracks";
    }

    toJson() {
        return {
            id: this.id,
            artist_id: this.artistId,
            title: this.title,
            url: this.url,
            created: this.created,
        }
    }
};