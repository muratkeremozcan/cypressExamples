#!/bin/sh
uname="/* @echo target.db.username */"
pword="/* @echo target.db.password */"
if test -n "$uname"; then
    uname="-u $uname"
fi
if test -n "$pword"; then
    pword="-p $pword"
fi
/* @echo target.db.binsDir *//mongo $uname $pword localhost:/* @echo target.db.port *///* @echo target.db.name */ /* @echo target.webServer.directory *//build/server/mgmt/mongo/cleanup.js
