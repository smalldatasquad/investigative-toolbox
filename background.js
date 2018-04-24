chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
  console.log(request);
  if('url' in request) {
    console.log("Value(s) submitted");

    var thingToStore = {};
    thingToStore[request.url] = request;
    console.log(thingToStore);

    chrome.storage.local.set(thingToStore, function() {
      // Notify that we saved.
      console.log("Saved");
    });
  }
});
