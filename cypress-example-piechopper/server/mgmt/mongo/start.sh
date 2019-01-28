#!/bin/sh
mkdir -p /* @echo target.db.binsDir *//run
pid=$(/sbin/pidof /* @echo target.db.binsDir *//mongod)
if echo "$pid" | grep -q " "; then
  pid=""
fi
if [ -n "$pid" ]; then
  user=$(ps -p $pid -o user | tail -n 1)
  if [ $user = "/* @echo target.deploy.username */" ]; then
    exit 0
  fi
fi
nohup /* @echo target.db.binsDir *//mongod --auth --dbpath /* @echo target.db.dataDir */ --port /* @echo target.db.port */ > /dev/null 2>&1 &
/sbin/pidof /* @echo target.db.binsDir *//mongod > /* @echo target.db.binsDir *//run/mongod.pid
