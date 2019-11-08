const assert = require('assert');
const Artist = require('../src/data/models/artist');

describe('Artist', function() {
    describe('#getTable()', function() {
        it('should return artists', function() {
            assert.strictEqual(Artist.getTable(), 'artists');
        });
    });
    describe('toJson()', function() {
        it('should return well-formed json', function () {
            let artist = new Artist();
            let json = artist.toJson();
            assert(json.hasOwnProperty('id'));
            assert(json.hasOwnProperty('name'));
            assert(json.hasOwnProperty('website'));
            assert(json.hasOwnProperty('created'));
        });
    });
    describe('getClassName()', function () {
        it('should return class name of Artist class', function () {
            assert.strictEqual(Artist.getClassName(), 'Artist');
        });
    });
    describe('fromId()', function () {
        it('should return query to select from artist table by id', function () {
            const expected = "select * from artists where id = $1";
            assert.strictEqual(Artist.fromId(33, null, true), expected);
        });
    });
    describe('save()', function () {
        it('should return query to save each property the artist table', function () {
            let artist = new Artist();
            artist.name = "My Love MHz";
            artist.website = "https://www.allanpichardo.com";

            const expected = "insert into artists (name, website) values ($1, $2) on conflict do nothing returning id";
            assert.strictEqual(artist.save(null,false,true), expected);
        });
        it('should return query to update each property the artist table', function () {
            let artist = new Artist();
            artist.id = 33;
            artist.name = "My Love MHz";
            artist.website = "https://www.allanpichardo.com";

            const expected = "update artists set name = $1, website = $2 where id = $3";
            assert.strictEqual(artist.save(null, true, true), expected);
        });
    });
});