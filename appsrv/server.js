const express = require('express');
const mongo = require('./modules/mongo');
const app = express();

app.get('/', (req, res) => { //HAProxy health check
    res.send('im ok');
});

app.get('/hello', (req, res) => {
    console.log('responding to request');
    res.send('hello world');
});

app.get('/read', (req, res) => {
    mongo.dbConnection.collection('mycollection').find().toArray(function(err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            res.send(results);
        }
    });
});
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
app.get('/write', (req, res) => {
    mongo.dbConnection.collection('mycollection').insertOne({
        myobjectprop: 'myobjectpropvalue',
        someRandomNumber: getRandomInt(0, 10)
    }, function(insertError, records) {
        if (insertError) {
            console.log(insertError);
        } else {
            const msg = "write succeeded";
            console.log(msg);
            res.send(msg);
        }
    });
});

const port = process.env.APPSRV_PORT;
mongo.init()
    .then(() => {
        app.listen(port, () => {
            console.log(`appsrv listening on port ${port}!`);
        });
    }).catch((err) => {
        console.log(err);
        process.exit(1);
    });
