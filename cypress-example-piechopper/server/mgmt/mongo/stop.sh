#!/bin/sh
mkdir -p /* @echo target.db.binsDir *//run
pid=$(/sbin/pidof /* @echo target.db.binsDir *//mongod)
if echo "$pid" | grep -q " "; then
  pid=""
fi
if [ -n "$pid" ]; then
  user=$(ps -p $pid -o user | tail -n 1)
  if [ $user = "/* @echo target.deploy.username */" ]; then
    kill "$pid"
    rm -f /* @echo target.db.binsDir *//run/mongod.pid
  fi
fi
