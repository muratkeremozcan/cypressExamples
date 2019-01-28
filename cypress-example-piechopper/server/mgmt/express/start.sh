#!/bin/sh
pushd /* @echo target.webServer.directory */
mkdir -p /* @echo target.webServer.directory *//run
pid=$(/sbin/pidof /* @echo target.webServer.directory *//bin/node)
if echo "$pid" | grep -q " "; then
  pid=""
fi
if [ -n "$pid" ]; then
  user=$(ps -p $pid -o user | tail -n 1)
  if [ $user = "/* @echo target.deploy.username */" ]; then
    exit 0
  fi
fi
nohup /* @echo target.webServer.directory *//bin/node /* @echo target.webServer.directory *//build/server/src/server.js > /dev/null 2>&1 &
/sbin/pidof /* @echo target.webServer.directory *//bin/node > /* @echo target.webServer.directory *//run/node.pid
popd
