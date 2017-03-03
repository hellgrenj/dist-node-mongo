const timer = require('setcountdown');
exports = module.exports = {
    cleanUpSync: () => {
      exec('docker stop mongos', {
          silent: true
      });
      exec('docker rm -fv mongos', {
          silent: true
      });
    },
    startAndInit: (rs1_container_ips, rs2_container_ips, cfg_container_ips, cb) => {
        echo(`starting mongos router with `);
        echo('configuration servers: ');
        cfg_container_ips.map((ip) => {
            echo(ip);
        });
        exec(`docker run -p 3344:27017 --name mongos -d lgatica/mongos --port 27017 --configdb ${cfg_container_ips[0]}:27019,${cfg_container_ips[1]}:27019,${cfg_container_ips[2]}:27019`, {
            silent: true
        });

        timer.setCountdown(() => {
            echo('initializing shard with');
            echo('replica set 1, nodes: ');
            rs1_container_ips.map((ip) => {
                echo(ip);
            });
            echo('replica set 2, nodes: ');
            rs2_container_ips.map((ip) => {
                echo(ip);
            });
            exec(`mongo --port 3344 --eval "sh.addShard('rs1/${rs1_container_ips[0]}:27017'); sh.addShard('rs2/${rs2_container_ips[0]}:27017'); sh.status();"`);
            return cb();
        }, 5000, '///');
    }
};
