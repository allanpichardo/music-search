#!/usr/bin/env node
'use strict';

const ArgumentParser = require('argparse').ArgumentParser;
const fs = require('fs');
const Artist = require('./src/data/models/artist');
const Track = require('./src/data/models/track');
const Features = require('./src/data/models/feature');
const FeatureExtractor = require('./src/features/FeatureExtractor');
const Venue = require('./src/data/models/venue');
const Show = require('./src/data/models/show');
const csv = require('csv-parser');
const async = require('async');
const moment = require('moment');

function continueWithShow(artist, track, venue, show, callback) {
    show.venueId = venue.id;
    show.save((err, results) => {
        if(err) {
            console.error(err);
            callback(err);
            return;
        }
        if(results[0]) {
            console.log(`Inserted show for ${artist.name} at ${venue.name} on ${show.date}`);
            callback();
        } else {
            console.log(`Show already exists for ${artist.name} at ${venue.name} on ${show.date}`);
            callback();
        }
    });
}

function continueWithVenue(artist, track, venue, show, callback) {
    show.artistId = artist.id;
    venue.save((err, result) => {
        if(err) {
            console.error(err);
            callback(err);
            return;
        }
        if(result[0]) {
            venue.id = result[0].id;
            continueWithShow(artist, track, venue, show, callback);
        } else {
            //venue already exists
            Venue.fromName(venue.name, venue.metroId, (err, venue) => {
                if(err) {
                    console.error(err);
                    callback(err);
                    return;
                }
                continueWithShow(artist, track, venue, show, callback);
            });
        }
    });
}

function continueWithTrack(artist, track, venue, show, callback){
    track.artistId = artist.id;
    track.save((err, result) => {
        if(err) {
            console.error(err);
            callback(err);
            return;
        }
        if(result[0]) {
            track.id = result[0].id;
            let extractor = new FeatureExtractor();
            try {
                console.log(`Extracting ${artist.name} - ${track.title}....`);
                extractor.extractFromAudio(`"${track.url}"`, (err, vector) => {
                    if(err) {
                        console.log(err);
                        callback(err);
                        return;
                    }
                    let features = new Features();
                    features.features = vector.slice();
                    features.trackId = track.id;
                    features.save((err, result) => {
                        if (err) {
                            console.error(err);
                            callback(err);
                            return;
                        }
                        features.id = result[0].id;
                        console.log(`Inserted features for ${artist.name} - ${track.title}`);
                        continueWithVenue(artist, track, venue, show, callback);
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
            continueWithVenue(artist, track, venue, show, callback);
        }
    });
}

let taskQueue = async.queue((row, callback) => {
    console.log(`${Date.now()}: queue size ${taskQueue.length()}`);
    if(row.track_streaming_url === '') {
        callback('Bad Streaming URL');
        return;
    }

    let artist = new Artist();
    artist.name = row.band_name;
    artist.website = row.bandcamp_url;

    let track = new Track();
    track.title = row.track_title;
    track.url = row.track_streaming_url;

    let venue = new Venue();
    venue.coordinates = [row.venue_lat, row.venue_lng];
    venue.name = row.venue_name;
    venue.metroId = row.metro_id === 27377 ? 1 : 2;

    let show = new Show();
    show.date = moment(row.poll_date, "YYYY-MM-DD").toDate();

    artist.save((err, result) => {
        if(err){
            console.error(err);
            callback(err);
            return;
        }
        if(result.length === 0) {
            Artist.fromName(artist.name, (err, artist) => {
                continueWithTrack(artist, track, venue, show, callback);
            });
        } else {
            artist.id = result[0].id;
            continueWithTrack(artist, track, venue, show, callback);
        }

    });
}, 4);

function main() {
    const args = parseArguments();
    console.log(`Reading CSV file: ${args.csv}...`);
    fs.createReadStream(args.csv)
        .pipe(csv())
        .on('data', (row) => {
            taskQueue.push(row, (err)=>{
                if(err) {
                    console.error(err);
                    return;
                }
                console.log(`${row.track_streaming_url} queued!`);
            });
        })
        .on('error', err => {
            console.error(err);
        })
        .on('end', () => {
            console.log('All tracks added to the queue');
        });
}


function parseArguments() {
    let parser = new ArgumentParser({
        version: '0.0.1',
        addHelp:true,
        description: 'Seed the system with the initial data'
    });
    parser.addArgument(
        [ '-c', '--csv' ],
        {
            required: true,
            help: 'The CSV file with the data'
        }
    );

    return parser.parseArgs();
}

main();