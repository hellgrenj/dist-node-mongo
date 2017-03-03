require('shelljs/global');
const replicaSet = require('./mongo-shard-init/replica-set');
const configurationServer = require('./mongo-shard-init/configuration-server');
const mongos = require('./mongo-shard-init/mongos');

echo('\u001B[2J\u001B[0;0f');
echo('\nSPINNING UP NEW MONGODB SHARD CLUSTER\n');
if (!which('mongo')) {
  echo('make sure you have mongo 3.2 installed and in your PATH');
  exit(1);
}
if (!which('docker')) {
  echo('make sure you have docker 17.03.0-ce or greater installed and in your PATH');
  exit(1);
}
if (!which('docker-compose')) {
  echo('make sure you have docker-compose 1.11.2 or greater installed and in your PATH');
  exit(1);
}

echo('cleaning up any old state from previous runs..');
configurationServer.cleanUpSync();
mongos.cleanUpSync();
replicaSet.cleanUpSync('rs1_srv');
replicaSet.cleanUpSync('rs2_srv');
const basePathMountedDataFolder = `${__dirname}/data/`;
rm('-rf', basePathMountedDataFolder);

replicaSet.start({
  basePathMountedDataFolder,
  name: 'rs1',
  nodePrefix: 'rs1_srv',
  initPort: '2',
  cb: (rs1_container_ips) => {

    replicaSet.start({
      basePathMountedDataFolder,
      name: 'rs2',
      nodePrefix: 'rs2_srv',
      initPort: '3',
      cb: (rs2_container_ips) => {

        configurationServer.startMultiple(basePathMountedDataFolder, (cfg_container_ips) => {

          mongos.startAndInit(rs1_container_ips, rs2_container_ips, cfg_container_ips, () => {
            echo('enabling sharding for mydb');
            exec('mongo --port 3344 --eval "sh.enableSharding(\'mydb\');"');
            echo('sharding mycollection with shardkey { someRandomNumber: 1 }');
            exec('mongo --port 3344 --eval "sh.shardCollection(\'mydb.mycollection\', { someRandomNumber: 1 } ); "');
            echo('mongodb shard cluster up and running');

          });
        });
      }
    });
  }
});
