const timer = require('setcountdown');
exports = module.exports = {
    standUpNewRS: (mounted_data_base_path, name, nodePrefix, initPort, cb) => {
        // spin up nodes
        for (let i = 0; i < 3; i++) {
            exec(`docker stop ${nodePrefix}${i}`, {
                silent: true
            });
            exec(`docker rm ${nodePrefix}${i}`, {
                silent: true
            });
            echo(`starting mongod node ${nodePrefix}${i} in replica set ${name}`);
            exec(`docker run  -d -v ${mounted_data_base_path}${nodePrefix}${i}/db:/data/db -p ${initPort}${i}017:27017 --name ${nodePrefix}${i} gustavocms/mongodb --replSet ${name} `, {
                silent: true
            });
        }
        timer.setCountdown(() => {
            echo(`inspecting container ips`);
            // wait 20 seconds then inspect ip:s
            let container_ips = [];
            for (let i = 0; i < 3; i++) {
                const res = JSON.parse(exec(`docker inspect ${nodePrefix}${i}`, {
                    silent: true
                }).stdout);
                const ip = res[0].NetworkSettings.IPAddress;
                container_ips.push(ip);
            }
            timer.setCountdown(() => {
                echo(`initiating replica set ${name}`);
                // wait 10 seconds then initiate replica set
                exec(`mongo --port ${initPort}0017 --eval "rs.initiate(); rs.add('${container_ips[1]}:27017'); rs.add('${container_ips[2]}:27017'); rs.status();"`, {
                    silent: true
                });
                exec(`mongo --port ${initPort}0017 --eval "cfg = rs.conf(); cfg.members[0].host = '${container_ips[0]}:27017'; rs.reconfig(cfg); rs.status();"`, {
                    silent: true
                });
                return cb(null, container_ips);
            }, 10000, '///');
        }, 20000, '///');
    }
};
