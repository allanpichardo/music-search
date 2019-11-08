const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const Feature = require('../data/models/feature');
const sharp = require('sharp');

module.exports = class FeatureExtractor {

    constructor() {
        const config = require('../../config');
        this.workingDir = config.working_dir;
    }

    extractFromSpectrogram(imagePath, callback, deleteSpectrogram = false) {
        sharp(imagePath)
            .resize(32, 24)
            .toBuffer()
            .then(buffer => {
                const tensor = tf.node.decodeImage(new Uint8Array(buffer), 3);
                const normalized = this.normalize(tensor);

                this.getEncoderModelAsync()
                    .then((model) => {
                        let encoding = model.predict(normalized.expandDims());
                        if(deleteSpectrogram) fs.unlinkSync(imagePath);
                        callback(null, encoding.dataSync());
                    })
                    .catch((e) => {
                        callback(e);
                    });
            })
            .catch(err => {
                callback(err);
            });
    }

    extractFromAudio(audioPath, callback, deleteSpectrogram=true) {
        let filename = `${Date.now()}`;
        let command = this.getExtractorCommand(audioPath, filename);
        exec(command, (err, stdout, stderr) => {
            if(err) {
                callback(err);
            } else {
                let file1 = `${filename}.png`;
                const mfccPath1 = path.join(this.workingDir, file1);

                this.extractFromSpectrogram(mfccPath1, (err, vector1) => {
                    if(err) {
                        callback(err);
                        return;
                    }
                    callback(null, this.vectorNormalize(vector1));
                }, deleteSpectrogram);
            }
        });
    }

    vectorMagnitude(vector) {
        let sum = 0.0;
        vector.forEach(c => {
            sum += (c * c);
        });
        return Math.sqrt(sum);
    }

    vectorNormalize(vector) {
        let magnitude = this.vectorMagnitude(vector);
        let normed = [];
        vector.forEach(c => {
            normed.push(c / magnitude);
        });
        return normed;
    }

    normalize(x, epsilon=1e-8) {
        const moments = tf.moments(x);
        return (x.sub(moments.mean)).div(tf.sqrt(moments.variance.add(epsilon)));
    }

    getEncoderModelAsync() {
        return tf.loadLayersModel(`file://${path.normalize(path.join(__dirname, '../../model/model.json'))}`);
    }

    getExtractorCommand(audioPath, outputFilename) {
        let outfilebase = path.basename(outputFilename);
        let outfileextension = 'png';

        let path1 = `${path.join(this.workingDir, outfilebase)}.${outfileextension}`;
        return `pipenv run python ${path.normalize(path.join(__dirname, '../../python/extractor.py'))} ${audioPath} ${path1}`;
    }

};