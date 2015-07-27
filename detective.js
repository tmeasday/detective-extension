var LocalCollection = Package.minimongo.LocalCollection;
var Events = new LocalCollection(null);

// observe the underlying page, log events
observe(function(doc) {
  Events.insert(doc);
});

Template.log.helpers({
  events: function() {
    return Events.find();
  }
});