#!/usr/bin/env node

const {ArgumentParser} = require("argparse");
const path = require('path');
const FeatureExtractor = require('./src/features/FeatureExtractor');
const Feature = require('./src/data/models/feature');

function main(){
    args = parseArguments();

    const extractor = new FeatureExtractor();
    let path = args.infile.replace(/(\s+)/g, '\\$1');
    let limit = args.limit ? args.limit : 10;
    let genre = args.genre ? args.genre : '';
    extractor.extractFromAudio(path, (err, vectors) => {
        if(err) {
            console.error(err);
            process.exit(1);
        }
        Feature.findNearest(vectors, limit, genre, (err, results) => {
            if(err){
                console.error(err);
                process.exit(1);
            }
            results.forEach((row) => {
                console.log(`(${row.similarity.toFixed(3)})  ${row.name} - ${row.title} (${row.genre}):: ${row.filename}`);
            });
            process.exit(0);
        });
    });
}

function parseArguments() {
    let parser = new ArgumentParser({
        version: '0.0.1',
        addHelp:true,
        description: 'Analyze a song and return a list of similar music'
    });
    parser.addArgument(
        [ '-i', '--infile' ],
        {
            required: true,
            help: 'The audio file to query'
        }
    );
    parser.addArgument(
        ['-r', '--limit'],
        {
            default: 10,
            required: false,
            help: 'The number of results to return',
            type:'int'
        }
    );
    parser.addArgument(
        ['-g', '--genre'],
        {
            default: '',
            required: false,
            help: 'The genre to match with'
        }
    );
    return parser.parseArgs();
}

main();