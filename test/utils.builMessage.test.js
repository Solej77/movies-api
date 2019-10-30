// es la que nos permite verificar si el test es correcto o no
const assert = require('assert');
const buildMessage = require('../utils/buildMessage');

// Con el only solamente corremos esta suite de test
describe.only('utils - BuildMessage', function() {
    describe('when receives one entity and an action', function() {
        it('should return the respective message', function() {
            const result = buildMessage('movie', 'create');
            const expect = "movie created";
            // comparamos
            assert.strictEqual(result, expect);
        });
    });

    describe('when receives an entity and an action and is a list', function() {
        it('should return the respective message with the entity in plural', function() {
            const result = buildMessage('movie', 'list');
            const expected = 'movies listed';
            assert.strictEqual(result, expected);
        });
    });
});