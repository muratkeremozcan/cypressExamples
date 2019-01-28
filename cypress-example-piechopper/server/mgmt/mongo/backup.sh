#!/bin/sh
if test -n "/* @echo target.db.backupDir */"; then
    mkdir -p /* @echo target.db.backupDir */
    uname="/* @echo target.db.username */"
    pword="/* @echo target.db.password */"
    if test -n "$uname"; then
        uname="-u $uname"
    fi
    if test -n "$pword"; then
        pword="-p $pword"
    fi
    /* @echo target.db.binsDir *//mongodump --port /* @echo target.db.port */ $uname $pword --db /* @echo target.db.name */ --out /* @echo target.db.backupDir *//`date "+%Y-%m-%d--%H-%M-%S"`
fi
