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
 +   "window._detectiveBuffer.push(p);"
 + "});";

var pollScript = "return window._detectiveBuffer;";

observe = function(cb) {
  chrome.devtools.inspectedWindow.eval(initScript);
  setInterval(function() {
    chrome.devtools.inspectedWindow.eval(pollScript, function(res, err) {
      if (!err) {
        _.each(res, function(doc) {
          cb(doc);
        });
      }
    });
  }, 1000);
}