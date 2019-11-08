const assert = require('assert');
const Track = require('../src/data/models/track');

describe('Track', function() {
    describe('#getTable()', function() {
        it('should return tracks', function() {
            assert.strictEqual(Track.getTable(), 'tracks');
        });
    });
    describe('toJson()', function() {
        it('should return well-formed json', function () {
            let track = new Track();
            let json = track.toJson();
            assert(json.hasOwnProperty('id'));
            assert(json.hasOwnProperty('artist_id'));
            assert(json.hasOwnProperty('title'));
            assert(json.hasOwnProperty('filename'));
            assert(json.hasOwnProperty('created'));
        });
    });
    describe('getClassName()', function () {
        it('should return class name of Track class', function () {
            assert.strictEqual(Track.getClassName(), 'Track');
        });
    });
    describe('fromId()', function () {
        it('should return query to select from track table by id', function () {
            const expected = "select * from tracks where id = $1";
            assert.strictEqual(Track.fromId(33, null, true), expected);
        });
    });
    describe('save()', function () {
        it('should return query to save each property the tracks table', function () {
            let track = new Track();
            track.artistId = 33;
            track.filename = "file.mp3";
            track.title = "My Cool Song";

            const expected = "insert into tracks (artist_id, title, filename) values ($1, $2, $3) on conflict do nothing returning id";
            assert.strictEqual(track.save(null,false,true), expected);
        });
        it('should return query to update each property the tracks table', function () {
            let track = new Track();
            track.id = 15;
            track.artistId = 33;
            track.filename = "file.mp3";
            track.title = "My Cool Song";

            const expected = "update tracks set artist_id = $1, title = $2, filename = $3 where id = $4";
            assert.strictEqual(track.save(null, true, true), expected);
        });
    });
});