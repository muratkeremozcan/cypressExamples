#!/bin/sh
mkdir -p /* @echo target.webServer.directory *//run
pid=$(/sbin/pidof /* @echo target.webServer.directory *//bin/node)
if echo "$pid" | grep -q " "; then
  pid=""
fi
if [ -n "$pid" ]; then
  user=$(ps -p $pid -o user | tail -n 1)
  if [ $user = "/* @echo target.deploy.username */" ]; then
    kill "$pid"
    rm -f /* @echo target.webServer.directory *//run/node.pid
  fi
fi
