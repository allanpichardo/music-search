const assert = require('assert');
const path = require('path');
const FeatureExtractor = require('../src/features/FeatureExtractor');

const testAudioPath = path.normalize(path.join(__dirname, './rock.mp3'));
const testImagePath = path.normalize(path.join(__dirname, './rock.jpg'));

describe('FeatureExtractor', function() {
    describe('extractFromSpectrogram', function () {
        it('should resize image and return a latent vector in feature space', function (done) {
            const expected = new Float32Array([
                0.013669697567820549,
                -0.18964026868343353,
                -0.003091435879468918,
                0.31314942240715027,
                -0.2936434745788574,
                -0.21156956255435944,
                -0.22227534651756287,
                -0.014393996447324753,
                -0.11057250201702118,
                -0.35587847232818604,
                -0.30280745029449463,
                0.08369962871074677
            ]);
            const extractor = new FeatureExtractor();
            extractor.extractFromSpectrogram(testImagePath, (err, vector) => {
                if(err){
                    done(err);
                }
                assert.deepStrictEqual(vector, expected);
                done();
            });
        });
    });
    describe('extractFromAudio', function() {
        it('should return a latent vector representing the audio in feature space', function (done) {
            const expected = [
                new Float32Array([
                    -1.2213363647460938,
                    -0.8648980855941772,
                    -0.0526738166809082
                ]), new Float32Array([
                    -1.2363619804382324,
                    0.07322721183300018,
                    0.7550488710403442
                ]), new Float32Array([
                    -1.039372205734253,
                    0.38602951169013977,
                    0.915431559085846
                ])
            ];

            const extractor = new FeatureExtractor();
            extractor.extractFromAudio(testAudioPath, (err, vector) => {
                if(err) {
                    done(err);
                }
                console.log(vector);
                assert.deepStrictEqual(vector, expected);
                done();
            });
        });
        it('Should handle a url', function(done) {
            const extractor = new FeatureExtractor();
            extractor.extractFromAudio('\"https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=167892166&ts=1563854459&t=4cc983d55a0b20e469a0f30957f2b6692e621e08\"', (err, vectors) => {
                if(err) {
                    done(err);
                }
                console.log(vectors);
            });
        });
    });
});