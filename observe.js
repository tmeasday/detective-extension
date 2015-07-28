// XXX: do I need this?
// inject = function (script, cb) {
//   chrome.devtools.inspectedWindow.eval(script, function (res, exc) {
//     if (exc && exc.isError) {
//       cb(exc.description, null);
//     } else if (exc && exc.isException) {
//       cb(exc.value, null);
//     } else
//       cb(null, res);
//   });
// }


// observe the ddp stream of the underlying page
// NOTES:
//  - is there a way to do this without polling?
//  - should I be using the background thing for this?
var initScript = "window._detectiveBuffer = [];"
 + "Meteor.connection._stream.on('message', function(d) {"
 // +   "console.log('received', d);"
 +   "window._detectiveBuffer.push(EJSON.parse(d));"
 + "});"
 + "var oldSend = Meteor.connection._send;"
 + "Meteor.connection._send = function(data) {"
 // +   "console.log('sent', data);"
 +   "window._detectiveBuffer.push(data);"
 +   "return oldSend.call(this, data);"
 + "};";

var pollScript = "var b = window._detectiveBuffer; window._detectiveBuffer = []; b;";

observe = function(cb) {
  chrome.devtools.inspectedWindow.eval(initScript);
  setInterval(function() {
    chrome.devtools.inspectedWindow.eval(pollScript, function(res, err) {
      if (!err) {
        res.forEach(function(doc) {
          cb(doc);
        });
      }
    });
  }, 100);
}