#!/usr/bin/env node
'use strict';

const ArgumentParser = require('argparse').ArgumentParser;
const fs = require('fs');
const path = require('path');
const NodeID3 = require('node-id3');
const Artist = require('./src/data/models/artist');
const Track = require('./src/data/models/track');
const Features = require('./src/data/models/feature');
const FeatureExtractor = require('./src/features/FeatureExtractor');
const Genre = require('./src/data/models/genre');
const async = require('async');

let spectroMap = null;

function continueWithGenre(genre, artist, tags, file, callback) {
    let track = new Track();
    track.title = tags.title;
    track.filename = path.basename(file);
    track.artistId = artist.id;
    track.genreId = genre.id;
    track.save((err, result) => {
        if(err) {
            console.error(err);
            callback(err);
            return;
        }
        if(result[0]) {
            track.id = result[0].id;

            const spectroPath1 = spectroMap.get(`${path.basename(file, '.mp3')}-0`);
            const spectroPath2 = spectroMap.get(`${path.basename(file, '.mp3')}-1`);
            const spectroPath3 = spectroMap.get(`${path.basename(file, '.mp3')}-2`);
            let extractor = new FeatureExtractor();
            try {
                extractor.extractFromSpectrogram(spectroPath1, (err, vector1) => {
                    if (err) {
                        console.error(err);
                        callback(err);
                        return;
                    }
                    extractor.extractFromSpectrogram(spectroPath2, (err, vector2) => {
                        if (err) {
                            console.error(err);
                            callback(err);
                            return;
                        }
                        extractor.extractFromSpectrogram(spectroPath3, (err, vector3) => {
                            if (err) {
                                console.error(err);
                                callback(err);
                                return;
                            }

                            let features = new Features();
                            features.feature1 = vector1.slice();
                            features.feature2 = vector2.slice();
                            features.feature3 = vector3.slice();
                            features.trackId = track.id;
                            features.save((err, result) => {
                                if (err) {
                                    console.error(err);
                                    callback(err);
                                    return;
                                }
                                features.id = result[0].id;

                                console.log(`Inserted features for ${tags.artist} - ${tags.title}`);
                                callback();
                            });
                        });

                    });
                });
            }catch(e) {
                track.delete((err, result) => {
                    if(err) {
                        console.error(err);
                        callback(err);
                    } else {
                        console.log(`Had to delete track ${track.id}: ${track.title}`);
                        callback();
                    }
                })
            }
        } else {
            callback("Skipping duplicate");
            return;
        }
    });
}

function continueWithArtist(artist, tags, file, callback) {
    let genre = new Genre();
    const name = tags.genre ? tags.genre : 'Unknown';
    genre.name = name;
    genre.save((err, results) => {
        if(err) {
            console.error(err);
            callback(err);
            return;
        }
        if(results.length === 0) {
            Genre.fromName(name, (err, genre) => {
                if(err) {
                    console.error(err);
                    callback(err);
                    return;
                }
                continueWithGenre(genre, artist, tags, file, callback);
            });
        } else {
            genre.id = results[0].id;
            continueWithGenre(genre, artist, tags, file, callback);
        }
    });
}

let taskQueue = async.queue((file, callback) => {
    let tags = NodeID3.read(file);

    let artist = new Artist();
    artist.name = tags.artist;
    artist.save((err, result) => {
        if(err){
            console.error(err);
            callback(err);
            return;
        }
        if(result.length === 0) {
            Artist.fromName(tags.artist, (err, artist) => {
                continueWithArtist(artist, tags, file, callback);
            });
        } else {
            artist.id = result[0].id;
            continueWithArtist(artist, tags, file, callback);
        }

    });
}, 1);

function accumulateAllSpectrograms(directory) {
    const files = fs.readdirSync(directory, {withFileTypes: true});
    files.forEach((file, index) => {
        if(file.isDirectory()) {
            console.log(`Found subdirectory ${file.name}`);
            console.log('Entering subdir....');
            accumulateAllSpectrograms(path.join(directory, file.name));
        } else if(file.isFile() && path.extname(file.name) === '.png') {
            console.log(file.name);
            spectroMap.set(path.basename(file.name, '.png'), path.join(directory, file.name));
        }
    });
}

function main() {
    const args = parseArguments();
    spectroMap = new Map();
    accumulateAllSpectrograms(args.spectro_dir);
    console.log(`Starting music search in ${args.music_dir}...`);
    walkDirectory(args.music_dir);
}

function walkDirectory(directory) {
    const files = fs.readdirSync(directory, {withFileTypes: true});
    files.forEach((file, index) => {
        if(file.isDirectory()) {
            console.log(`Found subdirectory ${file.name}`);
            console.log('Entering subdir....');
            walkDirectory(path.join(directory, file.name));
        } else if(file.isFile() && path.extname(file.name) === '.mp3') {
            console.log(file.name);
            taskQueue.push(path.join(directory, file.name), (err)=>{
                if(err) {
                    console.error(err);
                    return;
                }
                console.log(`${file.name} done!`);
            });
        }
    });
}

function parseArguments() {
    let parser = new ArgumentParser({
        version: '0.0.1',
        addHelp:true,
        description: 'Seed the system with the initial data'
    });
    parser.addArgument(
        [ '-m', '--music_dir' ],
        {
            required: true,
            help: 'The directory with the music'
        }
    );
    parser.addArgument(
        [ '-s', '--spectro_dir' ],
        {
            required: true,
            help: 'The directory with the spectrograms'
        }
    );
    return parser.parseArgs();
}

main();