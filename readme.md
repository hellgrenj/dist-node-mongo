# dist-node-mongo

An environment for learning and experimenting with:

- sharding in MongoDB
- load balancing with HAProxy and Node.js

.... all within Docker containers.

## prerequisites

Installed on your computer (docker host):

- node.js 6.9.x (or greater)
- docker 1.12.5 (or greater)
- docker-compose 1.9.0 (or greater)
- mongo 3.4 (specific version important)

## install

1) clone this repo (somewhere where docker is allowed to map data volumes)<br>
2) run `npm install` (in the root folder)

## run

1) run `(sudo) node start.js` preferably while listening to https://open.spotify.com/track/2H4zwjbv0D0ggDhf0E8j8j <br>
(this script will spin up a mongodb shard cluster and then start a small load balanced node.js system)<br>
**yeah.. and this will take a minute (especially the first time around when docker pulls down some images) <br/> so don't worry if the first node in the first replica set takes some time to start...**

## verify

when all is up and running (when you see docker-compose running two **appsrv** instances and a **proxy** instance):<br>
<br>
1) connect to the mongos router mapped to your local port 3344 `mongo --port 3344`<br>
2) run `use admin` and then `db.runCommand( { listShards : 1 } )` (you should now see a list of shards, two replica sets)<br>
3) browse to localhost/write (you should receive "write succeeded")<br>
4) browse to localhost/read (you should receive a dummy document)<br>
5) connect again to the mongos router mapped to your local port 3344 `mongo --port 3344`<br>
6) run `use config` and then `db.databases.find()`, you should now see a "mydb" in a list of databases.<br>
you should also see partitioned=false.<br>
7) run `sh.enableSharding("mydb")` and repeat step 6 (partitioned=true now)<br>
8) look at the code, laugh at my mistakes, use this environment to learn something new and share it with me! =)
TODO
add steps for
sh.shardCollection("mydb.mycollection", { någotRangeVärde: 1 } ) //läs på om vad som är bra shard nycklar.. range och hashed? är de de typerna som finns?
also try with hashed?
how to verify sharding.. did only see data ending up in rs1 (primary and secondary so replication works)
hulken scripts that hammers the front end (HAProxy) =)

öka wait time innan rs initiate...

### License

Released under the MIT license. Copyright (c) 2016 Johan Hellgren.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
