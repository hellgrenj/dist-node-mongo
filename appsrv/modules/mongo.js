const mongo = {};
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

mongo.init = function() {
    return new Promise(function(resolve, reject) {
        tryConnectToMongo((err, message) => {
            if (err) {
                console.log(err);
                return reject(new Error(err));
            }
            console.log(':', message);
            return resolve();
        });
    });
};

function tryConnectToMongo(finished, attempt) {
    attempt = attempt || 0;
    MongoClient.connect('mongodb://mongos:27017/mydb', function(err, db) {
        if (err) {
            if (attempt < 5) {
                setTimeout(() => {
                    attempt++;
                    return tryConnectToMongo(finished, attempt);
                }, 3000);
            } else {
                return finished(`failed to connect to mongos router, ${attempt} attempts, 3 seconds pacing: ${err}`);
            }
        } else {
            mongo.dbConnection = db;
            return finished(null, 'connected to the mongos router');
        }

    });
}


exports = module.exports = mongo;
