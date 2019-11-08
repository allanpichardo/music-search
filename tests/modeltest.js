const assert = require('assert');
const Model = require('../src/data/models/model');

describe('Model', () => {
    describe('getClassName()', () => {
        it('should return class name of Model class', function () {
            assert.strictEqual(Model.getClassName(), 'Model');
        });
    });
    describe('getTable()', () => {
        it('should throw error that table is undefined', function () {
            assert.throws(Model.getTable);
        });
    });
    describe('toJson()', () => {
        it('should throw error that function is not implemented', function () {
            let model = new Model();
            assert.throws(model.toJson);
        });
    });
    describe('fromId()', () => {
        it('should throw error because model has no table implemented', function () {
            assert.throws(Model.fromId)
        });
    });
    describe('save()', () => {
        it('should throw error because model has no json function implemented', function () {
            let model = new Model();
            assert.throws(model.save);
        });
    })
});