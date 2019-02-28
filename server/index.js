/* eslint-disable no-console */
const http = require('http');
const url = require('url');
const { MongoClient } = require('mongodb');
const { server, setDb } = require('./server');

const mongoURL = 'mongodb://heroku_qhqzvjnd:jphaosu5vumap0reuq8o5qblno@ds229552.mlab.com:29552/heroku_qhqzvjnd'

MongoClient.connect(mongoURL, (err, database) => {
  if (err) {
    console.error(err);
  } else {
    // Don't start server unless we have successfully connect to the database
    const db = database.db(url.parse(mongoURL).pathname.slice(1)); // Extract database name
    setDb(db);

    // We create the server explicitly (instead of using app.listen()) to
    // provide an example of how we would create a https server
    const boxScoreServer = http.createServer(server).listen(process.env.PORT || 3001);
    console.log('Listening on port %d', boxScoreServer.address().port);
  }
});
