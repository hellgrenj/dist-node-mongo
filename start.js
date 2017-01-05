require('shelljs/global');
const timer = require('setcountdown');
const step1ExitCode = exec('node ./setup-shard-cluster.js').code;
if (step1ExitCode === 0) {
    echo('STARTING UP HAPROXY NODE.JS SYSTEM');
    timer.setCountdown(() => {
        exec('docker-compose up --build --force-recreate');
    }, 10000, '///');
} else {
    console.log('failed to setup mongodb shard cluster');
}
