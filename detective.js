var LocalCollection = Package.minimongo.LocalCollection;
var Tracker = Package.tracker.Tracker;

var Subscriptions = new LocalCollection(null);

Subscriptions.sub = function(message) {
  var doc = {
    id: message.id,
    name: message.name,
    params: message.params,
    subAt: new Date(),
    state: 'sub'
  };
  Subscriptions.insert(doc);
};

Subscriptions.ready = function(message) {
  console.log(message);
  Subscriptions.update({id: {$in: message.subs}}, {$set: {
    readyAt: new Date(),
    state: 'ready'
  }});
};

Subscriptions.unsub = function(name) {
  console.log(message);
  Subscriptions.update({id: {$in: message.subs}}, {$set: {
    unsubAt: new Date(),
    state: 'unsub'
  }});
};

Subscriptions.nosub = function(name) {
  console.log(message);
  Subscriptions.update({id: {$in: message.subs}}, {$set: {
    nosubAt: new Date(),
    state: 'nosub'
  }});
};

// observe the underlying page, log events
observe(function(doc) {
  console.log(doc.msg);
  switch (doc.msg) {
  case 'sub': case 'ready': case 'unsub': case 'nosub':
    Subscriptions[doc.msg](doc);
    break;
  default:

  }
});

var STATE_STRS = {
  sub: 'Started',
  ready: 'Ready',
  unsub: 'Stopping',
  nosub: 'Stopped'
};


var timerDep = new Tracker.Dependency();
setInterval(function() {
  timerDep.changed();
}, 100);

Template.subscriptions.helpers({
  subscriptions: function() {
    return Subscriptions.find();
  },
  stateStr: function() {
    return STATE_STRS[this.state];
  },
  time: function() {
    var diff;
    if (this.state === 'sub') {
      timerDep.depend();
      diff = new Date - this.subAt;
    } else {
      diff = this[this.state + 'At'] - this.subAt;
    }

    return diff / 1000 + 's';
  }
});