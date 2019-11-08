const assert = require('assert');
const FeatureExtractor = require('../src/features/FeatureExtractor');
const Feature = require('../src/data/models/feature');
const path = require('path');

const testAudioPath = path.normalize(path.join(__dirname, './rock.mp3'));
const testImagePath = path.normalize(path.join(__dirname, './rock.jpg'));

describe('Feature', () => {
    describe('getDistanceBetween(a,b)', (done) => {
        it('should query the postgres cube extension to return a euclidean distance', function (done) {
            Feature.getDistanceBetween(new Float32Array([
                -0.05447663366794586,
                -0.21431514620780945,
                -0.02572070062160492,
                0.27649033069610596,
                -0.26481565833091736,
                -0.2561533451080322,
                -0.28156375885009766,
                -0.07713232934474945,
                -0.13613900542259216,
                -0.3347838222980499,
                -0.377473384141922,
                -0.07686761766672134
            ]), new Float32Array([
                0.1371251791715622,
                0.14147669076919556,
                0.23494723439216614,
                0.4389433264732361,
                -0.18845532834529877,
                0.06803691387176514,
                0.28463003039360046,
                0.3163932263851166,
                0.3744494318962097,
                -0.041224438697099686,
                -0.29406991600990295,
                -0.2700607478618622
            ]), (err, distance) => {
                if(err) {
                    done(err);
                }
                assert(Math.abs(distance - 1.11137897055981) < 0.00001);
                done();
            });
        });
    });
});