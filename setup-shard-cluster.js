require('shelljs/global');
const rs = require('./mongo-shard-init/replica-set');
const cfg = require('./mongo-shard-init/configuration-server');
const mongos = require('./mongo-shard-init/mongos');

echo('\u001B[2J\u001B[0;0f');
echo('\nSPINNING UP NEW MONGODB SHARD CLUSTER\n');
if (!which('mongo')) {
    echo('make sure you have mongo 3.4 installed and in your PATH');
    exit(1);
}
if (!which('docker')) {
    echo('make sure you have docker 1.12.5 or greater installed and in your PATH');
    exit(1);
}
if (!which('docker-compose')) {
    echo('make sure you have docker-compose 1.9.0 or greater installed and in your PATH');
    exit(1);
}

const mounted_data_base_path = `${__dirname}/data/`;
rm('-rf', mounted_data_base_path);
rs.standUpNewRS(mounted_data_base_path, 'rs1', 'rs1_srv', '2', (err, rs1_container_ips) => {
    rs.standUpNewRS(mounted_data_base_path, 'rs2', 'rs2_srv', '3', (err, rs2_container_ips) => {
        cfg.spinUpSomeConfigServers(mounted_data_base_path, (err, cfg_container_ips) => {
            mongos.startRouter(rs1_container_ips, rs2_container_ips, cfg_container_ips, () => {
                echo('mongodb shard cluster up and running');
            });
        });
    });
});
