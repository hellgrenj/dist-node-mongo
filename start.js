require('shelljs/global');
const timer = require('setcountdown');

const mongoDbShardUpAndRunning = (exec('node ./setup-shard-cluster.js').code === 0);
if (mongoDbShardUpAndRunning) {
    echo('STARTING UP HAPROXY NODE.JS SYSTEM');
    timer.setCountdown(() => {
        exec('docker-compose up --build --force-recreate');
    }, 10000, '///');
} else {
    console.log('failed to setup mongodb shard cluster');
}
