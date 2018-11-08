# dist-node-mongo

An environment for learning and experimenting with:

- sharding and replication in MongoDB
- load balancing with HAProxy and Node.js

.... all within Docker containers.

## blog post
[An environment for experimenting with sharding and replication in MongoDB](http://hellgrenj.tumblr.com/post/158015640353/an-environment-for-experimenting-with-sharding-and)

## prerequisites

Installed on your computer (docker host):

- node.js 6.9.x
- docker 1.13.1 (or greater)
- docker-compose 1.11.1 (or greater)
- mongo 3.2 (recommended, seems to work with 3.4 but with version mismatch warning) (and yeah.. i know.. locally on the host machine. If i ever get back to working on this i will put the mongo client in a container as well..)

(i have only worked with this environment on a mac and linux, tweaks may be required to get it working on windows..)  

## install

1) clone this repo (somewhere where docker is allowed to map data volumes)  
2) run `npm install` (in the root folder)  
3) run `docker pull gustavocms/mongodb`  
4) run `docker pull lgatica/mongos:1.0.0`  

## start

1) run `(sudo) node start.js` preferably while listening to https://open.spotify.com/track/2H4zwjbv0D0ggDhf0E8j8j     

### this script will:  
* Spin up a mongodb sharded cluster consisting of 1 mongos, 3 config servers, 2 replica set with 1 primary and two secondary nodes in each.
* Then enable sharding on 'mydb' and shard 'mycollection'.  
* Then it will start a small node.js demo system (2 services and 1 HAProxy load balancing between them)

(if you only want to spin up the sharded cluster and not the demo system run `node setup-shard-cluster.js`)

## play around

when all is up and running (when you see docker-compose running two **appsrv** instances and a **proxy** instance):
* Navigate to dist-node-mongo (root) folder in a new terminal window/tab and   
run `node smash.js` (this will smash the poor node.js demo system with 1000 requests to *localhost/write*)
* In a new terminal window/tab connect to the mongos router: `mongo --port 3344`
* switch to mydb `use mydb`
* inspect the shard distribution on mycollection with `db.mycollection.getShardDistribution()`
* in a new terminal window/tab inspect the data in one replica set, first the primary and then a secondary:
  - run `mongo --port 20017` to connect to replica set 1's PRIMARY
  - run `mongo --port 21017` to connect to replica set 1's first SECONDARY (the second one is at port 22017 and Replica set 2 is at 30017, 31017 and 32017)
  - on secondary nodes you will need to run `rs.slaveOk()` before you can read mycollection from the command line. (`use mydb` then `db.mycollection.find().pretty()` or `db.mycollection.count()` to just get the count)

## caveats
I have only tested this configuration of the env on a MBP (15-inch, 2016) 2,7 GHz i7, 16 GB RAM and a MBP (Retina, 13-inch, Early 2015) 3,1 GHz, 16 GB RAM.  
If you are running this on a less beefy machine and things are breaking I would try:
* adjusting the computing resources dedicated to Docker
* tweaking the pace hulken sends write requests
* tweaking the waitTimes in the shard-cluster-automation (see timer.setCountdown in mongo-shard-init/replica-set.js for example)


### License

Released under the MIT license. Copyright (c) 2016 Johan Hellgren.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
