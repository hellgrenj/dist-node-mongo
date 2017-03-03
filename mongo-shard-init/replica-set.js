const timer = require('setcountdown');
exports = module.exports = {
    cleanUpSync: (nodePrefix) => {
      for (let i = 0; i < 3; i++) {
          exec(`docker stop ${nodePrefix}${i}`, {
              silent: true
          });
          exec(`docker rm -fv ${nodePrefix}${i}`, {
              silent: true
          });
      }
    },
    start: ({basePathMountedDataFolder,name,nodePrefix,initPort,cb} = {}) => {
        for (let i = 0; i < 3; i++) {
            echo(`starting mongod node ${nodePrefix}${i} in replica set ${name}`);
            exec(`docker run  -d -v ${basePathMountedDataFolder}${nodePrefix}${i}/db:/data/db -p ${initPort}${i}017:27017 --name ${nodePrefix}${i} gustavocms/mongodb --replSet ${name} `, {
                silent: true
            });
        }
        timer.setCountdown(() => {
            echo(`inspecting container ips`);
            let container_ips = [];
            for (let i = 0; i < 3; i++) {
                const res = JSON.parse(exec(`docker inspect ${nodePrefix}${i}`, {
                    silent: true
                }).stdout);
                const ip = res[0].NetworkSettings.IPAddress;
                container_ips.push(ip);
            }
            console.log(container_ips);
            echo(`initiating replica set ${name}`);
            exec(`mongo --port ${initPort}0017 --eval "rs.initiate();" `, { silent: true });
            echo(`adding ${container_ips[1]} to replica set ${name}`);
            exec(`mongo --port ${initPort}0017 --eval "rs.add('${container_ips[1]}:27017'); " `, { silent: true });
            echo(`adding ${container_ips[2]} to replica set ${name}`);
            exec(`mongo --port ${initPort}0017 --eval "rs.add('${container_ips[2]}:27017');" `, { silent: true });
            echo(`reconfiguring replica set (setting host to ${container_ips[0]})`);
            exec(`mongo --port ${initPort}0017 --eval "cfg = rs.conf({"heartbeatIntervalMillis" : 7000, "heartbeatTimeoutSecs" : 20,
            "electionTimeoutMillis" : 20000,}); cfg.members[0].host = '${container_ips[0]}:27017'; rs.reconfig(cfg); rs.status();"`, {
                silent: true
            });
            return cb(container_ips);
        }, 5000, '///');
    }
};
