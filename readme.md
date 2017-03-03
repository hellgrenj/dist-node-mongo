# dist-node-mongo

An environment for learning and experimenting with:

- sharding in MongoDB
- load balancing with HAProxy and Node.js

.... all within Docker containers.

## prerequisites

Installed on your computer (docker host):

- node.js 6.9.x (or greater)
- docker 17.03.0-ce (or greater)
- docker-compose 1.11.2 (or greater)
- mongo 3.2 (specific version important)

## install

1) clone this repo (somewhere where docker is allowed to map data volumes)  
2) run `npm install` (in the root folder)  
3) run `docker pull gustavocms/mongodb`  
4) run `docker pull lgatica/mongos`  

## start

1) run `(sudo) node start.js` preferably while listening to https://open.spotify.com/track/2H4zwjbv0D0ggDhf0E8j8j     
<br/>
**this script will:**
* Spin up a mongodb shard cluster consisting of 1 mongos, 3 config servers, 2 replica set with 1 primary and two secondary in each.
* Then enable sharding on 'mydb' and shard 'mycollection'.  
* Then it will start a small node.js demo system (2 node services and 1 HA-Proxy load balancing between them)

## play around

when all is up and running (when you see docker-compose running two **appsrv** instances and a **proxy** instance):
* Navigate to dist-node-mongo (root) folder in a new terminal window/tab and   
run `node smash.js` (this will smash the poor node.js demo system with 1000 request to *localhost/write*)
* In a new terminal window/tab connect to the mongos router: `mongo --port 3344`
* switch to mydb `use mydb`
* inspect the shard distribution on mycollection with `db.mycollection.getShardDistribution()`
* in a new terminal window/tab inspect the data in one replica set, first the primary and then a secondary:
  - run `mongo --port 20017` to connect to replica set 1's PRIMARY
  - run `mongo --port 21017` to connect to replica set 1's first SECONDARY (the second one is at port 22017 and Replica set 2 is at 30017, 31017 and 32017)
  - on secondary's you will need to run `rs.slaveOk()` before you can read mycollection from the command line. (`use mydb` then `db.mycollection.find().pretty()`)


### License

Released under the MIT license. Copyright (c) 2016 Johan Hellgren.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
