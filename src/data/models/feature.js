const Model = require('./model');
const Track = require("./track");
const Artist = require("./artist");
const Genre = require('./genre');

module.exports = class Feature extends Model{

    static get WIDTH(){
        return 1;
    }

    static get HEIGHT(){
        return 6;
    }

    static get LENGTH(){
        return this.WIDTH * this.HEIGHT;
    }

    constructor(dbRow) {
        super(dbRow);
        if(dbRow) {
            this.trackId = dbRow.track_id;
            this.features = dbRow.features;
        } else {
            this.trackId = 0;
            this.features = new Array(Feature.LENGTH).fill(0);
        }
    }

    static findNearest(vectors, limit, genre = '', callback) {
        const query = `select a.name, t.title, t.filename, g.name as genre,  
            (cube(array[cosine_similarity(cube(array[${vectors[0].join(', ')}]), f.feature1),cosine_similarity(cube(array[${vectors[1].join(', ')}]), f.feature2),cosine_similarity(cube(array[${vectors[2].join(', ')}]), f.feature3)]) <-> cube(array[1,1,1])) as similarity from ${Feature.getTable()} f 
            left join ${Track.getTable()} t on t.id = f.track_id 
            left join ${Artist.getTable()} a on a.id = t.artist_id 
            left join ${Genre.getTable()} g on g.id = t.genre_id 
            order by similarity asc limit ${limit}`;
        require('../database').query(query, [], (err, results) => {
            if(err) {
                callback(err);
            } else {
                callback(null, results.rows);
            }
        });

        return query;
    }

    static getDistanceBetween(vector1, vector2, callback) {
        const query = `select cube_distance(cube(array[${vector1.join(', ')}]), cube(array[${vector2.join(', ')}])) as distance`;
        require('../database').query(query, [], (err, results) => {
            if(err) {
                callback(err);
            } else {
                callback(null, results.rows[0].distance);
            }
        });
    }

    static getTable() {
        return "features";
    }

    toJson() {
        return {
            id: this.id,
            track_id: this.trackId,
            features: this.features,
            created: this.created
        }
    }
};