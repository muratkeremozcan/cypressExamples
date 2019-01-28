var curSecs = Math.floor((new Date()).getTime() / 1000);
var secs31daysAgo = curSecs - (60 * 60 * 24 * 31);
var hex = secs31daysAgo.toString(16);
var oid = ObjectId(hex + "0000000000000000");
var cursor = db.getCollection('proposals').find({_id: {$lt: oid}});
//while (cursor.hasNext()) { printjsononeline(cursor.next()); }
db.getCollection('proposals').remove({_id: {$lt: oid}});
