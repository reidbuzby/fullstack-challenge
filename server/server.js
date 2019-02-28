const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ObjectID, MongoError } = require('mongodb'); // eslint-disable-line no-unused-vars
const fetch = require('node-fetch');

const server = express();

// These would obviously be passed in as parameters not be hardcoded for a real project
const mlbFeedUrl = 'https://chumley.barstoolsports.com/dev/data/games/eed38457-db28-4658-ae4f-4d4d38e9e212.json';
const nbaFeedUrl = 'https://chumley.barstoolsports.com/dev/data/games/6c974274-4bfc-4af8-a9c4-8b926637ba74.json';

const corsOptions = {
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  origin: '*',
  allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With', 'Origin'],
};

server.use(cors(corsOptions));
server.use(bodyParser.json());

function consumeFreshFeed() {
  fetch(nbaFeedUrl)
    .then(res => res.json())
    .then(json => console.log(json));
}

// either nothing is in server, need to consume feed and post fresh cache
// or cache is in server and has been updated in last 15 sec, simply get the cache
// or cache is in the server and is outdated, consume feed and post fresh cache

server.get('/consumeNbaFeed', (request, response, next) => {
  db.collection('caches').findOne({ feedType: 'nba' }).then((result) => {
    // if there is already an existing cache in the database
    if (result) {
      // Calculate the time difference between now and the last time the cache
      // was updated
      const now = new Date();
      const timestamp = result.timestamp;
      const timeDiff = Math.abs(now.getTime() - timestamp.getTime());

      // If the time difference is less that 15000 milliseconds return the cache
      if (timeDiff < 15000) {
        response.send(result);
      }
      // Else consume a fresh feed, update the server with the new feed and return it
      else {
        fetch(nbaFeedUrl).then(res => res.json()).then(freshFeed => {
          db.collection('caches').findOneAndUpdate(
            { feedType: 'nba' },
            { $set: { data: freshFeed, timestamp: new Date() }},
            { returnOriginal: false },
          )
          .then((result) => {
            response.send(result.value);
          }, next);
        });
      }

    }
    // there is no cache in the database so consume a fresh feed, add it to the
    // database and send back the feed in the response
    else {
      fetch(nbaFeedUrl).then(res => res.json()).then(freshFeed => {
        const instance = { feedType: 'nba', timestamp: new Date() };
        instance.data = freshFeed
        db.collection('caches').insertOne(Object.assign(instance)).then((result) => {
          response.send(result.ops[0]);
        });
      });
    }
  });
});

server.get('/consumeMlbFeed', (request, response, next) => {
  db.collection('caches').findOne({ feedType: 'mlb' }).then((result) => {
    // if there is already an existing cache in the database
    if (result) {
      // Calculate the time difference between now and the last time the cache
      // was updated
      const now = new Date();
      const timestamp = result.timestamp;
      const timeDiff = Math.abs(now.getTime() - timestamp.getTime());

      // If the time difference is less that 15000 milliseconds return the cache
      if (timeDiff < 15000) {
        response.send(result);
      }
      // Else consume a fresh feed, update the server with the new feed and return it
      else {
        fetch(mlbFeedUrl).then(res => res.json()).then(freshFeed => {
          db.collection('caches').findOneAndUpdate(
            { feedType: 'mlb' },
            { $set: { data: freshFeed, timestamp: new Date() }},
            { returnOriginal: false },
          )
          .then((result) => {
            response.send(result.value);
          }, next);
        });
      }

    }
    // there is no cache in the database so consume a fresh feed, add it to the
    // database and send back the feed in the response
    else {
      fetch(mlbFeedUrl).then(res => res.json()).then(freshFeed => {
        const instance = { feedType: 'mlb', timestamp: new Date() };
        instance.data = freshFeed
        db.collection('caches').insertOne(Object.assign(instance)).then((result) => {
          response.send(result.ops[0]);
        });
      });
    }
  });
});

// express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  // Resolve client build directory as absolute path to avoid errors in express
  const path = require('path'); // eslint-disable-line global-require
  const buildPath = path.resolve(__dirname, '../client/build');

  app.use(express.static(buildPath));

  // Serve the HTML file included in the CRA client on the root path
  app.get('/', (request, response) => {
    response.sendFile(path.join(buildPath, 'index.html'));
  });
}




module.exports = {
  server,
  setDb: (newDb) => { db = newDb; }
};
