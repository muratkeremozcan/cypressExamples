MGMT_DIR=/* @echo target.webServer.directory *//build/server/mgmt

8,18,28,38,48 * * * * sh $MGMT_DIR/express/start.sh > $HOME/cron_recent.log 2>&1
7,17,27,37,47 * * * * sh $MGMT_DIR/mongo/start.sh > $HOME/cron_recent.log 2>&1
* 20 * * * sh $MGMT_DIR/mongo/backup.sh >> $HOME/cron_retain.log 2>&1
* 21 * * * sh $MGMT_DIR/mongo/cleanup.sh >> $HOME/cron_retain.log 2>&1
