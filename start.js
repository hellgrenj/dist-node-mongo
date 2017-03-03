require('shelljs/global');
const timer = require('setcountdown');

const shardedClusterUpAndRunning = (exec('node ./setup-shard-cluster.js').code === 0);
if (shardedClusterUpAndRunning) {
    echo('STARTING UP LOAD BALANCED NODE.JS SYSTEM');
    timer.setCountdown(() => {
        exec('docker-compose up --build --force-recreate');
    }, 10000, '///');
} else {
    console.log('failed to setup mongodb sharded cluster');
}
