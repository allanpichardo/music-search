const Model = require('./model');

module.exports = class Metro extends Model {

    constructor(dbRow) {
        super(dbRow);
        if(dbRow) {
            this.id = dbRow.id;
            this.name = dbRow.name;
            this.coordinates = Metro.parseCoordinates(dbRow.coordinates);
            this.created = dbRow.created;
        } else {
            this.name = "";
            this.coordinates = [0.0, 0.0];
            this.created = new Date();
        }
    }

    static getTable() {
        return "metros";
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            coordinates: Metro.coordsToString(this.coordinates),
            created: this.created
        }
    }
};