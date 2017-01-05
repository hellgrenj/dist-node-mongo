const timer = require('setcountdown');
exports = module.exports = {
    spinUpSomeConfigServers: (mounted_data_base_path, cb) => {
        // create Config servers
        for (let i = 0; i < 3; i++) {
            exec(`docker stop cfg${i}`, {
                silent: true
            });
            exec(`docker rm cfg${i}`, {
                silent: true
            });
            echo(`starting configuration server cfg${i}`);
            exec(`docker run -d -v ${mounted_data_base_path}cfg${i}/db:/data/db -P --name cfg${i} gustavocms/mongodb --configsvr --dbpath /data/db`, {
                silent: true
            });
        }
        let cfg_container_ips = [];
        for (let i = 0; i < 3; i++) {
            const response = JSON.parse(exec(`docker inspect cfg${i}`, {
                silent: true
            }).stdout);
            const container_ip = response[0].NetworkSettings.IPAddress;
            cfg_container_ips.push(container_ip);

        }
        timer.setCountdown(() => {
            cb(null, cfg_container_ips);
        }, 3000, '///');

    }
};
