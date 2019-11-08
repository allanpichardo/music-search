class Model {

    constructor(dbRow) {
        if(dbRow) {
            this.id = dbRow.id;
            this.created = dbRow.created;
        } else {
            this.id = 0;
            this.created = new Date();
        }

        this.db = require('../database');
    }

    static getClassName() {
        return this.prototype.constructor.name;
    }

    static getTable() {
        throw new Error(`Did not override getTable for model ${this.getClassName()}.`)
    }

    static fromId(id, callback, dryRun = false) {
        const db = require('../database');

        const query = `select * from ${this.getTable()} where id = $1`;
        const params = [id];

        if(!dryRun) db.query(query, params, (err, res) => {
            if(err) {
                callback(err,null);
            } else {
                let model = new this(res.rows[0]);
                callback(null, model);
            }
        });

        return query;
    }

    delete(callback) {
        const query = `delete from ${this.constructor.getTable()} where id = $1`;
        this.db.query(query, [this.id], (err, results) => {
            if(err) {
                callback(err);
            } else {
                callback(null, true);
            }
        });
    }

    static parseCoordinates(coords) {
        return [coords.x, coords.y];
    }

    static coordsToString(coords) {
        return `(${coords[0]},${coords[1]})`;
    }

    save(callback, update = false, druRun = false) {
        const json = this.toJson();
        delete json.created;
        delete json.id;

        let keys = [];
        let params = [];
        Object.keys(json).forEach(function(key,index) {
            keys.push(key);
            if(!(json[key] instanceof Array)) {
                params.push(json[key]);
            }
        });
        if(update) {
            params.push(this.id);
        }

        let columns = "";
        let values = "";
        let up = "";
        let lastKey = 1;
        keys.forEach((key, index) => {
            columns += `${key}, `;
            if(json[key] instanceof Array) {
                values += `cube(array[${json[key].join(', ')}]), `;
                up += `${key} = cube(array[${json[key].join(', ')}]), `;
            } else {
                values += `$${index+1}, `;
                up += `${key} = $${index+1}, `;
                lastKey++;
            }
        });
        columns = columns.substr(0, columns.length - 2);
        values = values.substr(0, values.length - 2);
        up = up.substr(0, up.length - 2);

        const query = update ? `update ${this.constructor.getTable()} set ${up} where id = $${lastKey}` : `insert into ${this.constructor.getTable()} (${columns}) values (${values}) on conflict do nothing returning id`;

        if(!druRun) this.db.query(query, params, (err, results) => {
            if(err) {
                callback(err);
            } else {
                callback(null, results.rows);
            }
        });

        return query;
    }

    toJson() {
        throw new Error(`Did not override toJson in model ${this.constructor.getClassName()}`);
    }
}
module.exports = Model;