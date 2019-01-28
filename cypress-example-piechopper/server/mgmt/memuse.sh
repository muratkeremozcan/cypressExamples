#!/bin/sh
ps -u /* @echo target.deploy.username */ -o pid,rss,command | awk '{print $0}{sum+=$2} END {print "Total", sum/1024, "MB"}'
