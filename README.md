# music-search
Semantic search engine for music recommendation

This Node application uses Tensorflow.js and an autoencoder trained on MFCC features from the Free Music Archive Dataset to extract a feature vector from 5 second clips of audio. The cosine similarity of this feature vector is computed against the clips of the Free Music Archive to return a ranked list of music with strong simlarities in timbre, tempo, and style.

This project includes a PostgreSQL schema which includes functions for computing the cosine similarity, as well as a bootstrap script that will populate the Postgres database with feature vectors from the Free Music Archive. 

Music similarity can be inferred in the command line using the `search.js` script.
